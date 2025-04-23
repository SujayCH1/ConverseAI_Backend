import uuid
from datetime import datetime
import chromadb
import numpy as np
import os
from supabaseClient import supabaseInst
from langchain_community.embeddings import OllamaEmbeddings  

CHROMA_DB_PATH = "D:/LLM/Langchain_proj/chroma_db"
os.makedirs(CHROMA_DB_PATH, exist_ok=True)
client = chromadb.PersistentClient(path=CHROMA_DB_PATH)

embedding_model = OllamaEmbeddings(model="nomic-embed-text")

def create_chroma_collection(collection_name: str):
    if collection_name in [col.name for col in client.list_collections()]:
        return client.get_collection(collection_name)
    return client.create_collection(collection_name)

def embed_document(document_text: str) -> list[np.ndarray]:
    return embedding_model.embed_query(document_text)

def chunk_document(document_text: str, chunk_size: int = 600, overlap: int = 100):
    return [document_text[i:i + chunk_size] for i in range(0, len(document_text), chunk_size - overlap)]

def store_document_in_chroma(collection_name: str, document_text: str):
    chunks = chunk_document(document_text)
    collection = create_chroma_collection(collection_name)
    for i, chunk in enumerate(chunks):
        embedding = embed_document(chunk)
        collection.add(
            documents=[chunk],
            metadatas=[{"chunk": i}],
            embeddings=[embedding],
            ids=[f"{collection_name}_chunk_{i}"]
        )
    return len(chunks)

def add_business(business_name, business_info):
    try:
        business_id = str(uuid.uuid4())
        created_at = datetime.now().isoformat()  
        
        supabaseInst.table('businesses').insert({
            'id': business_id,
            'name': business_name,
            'created_at': created_at
        }).execute()

        collection_name = f"collection_{business_id}"
        supabaseInst.table('business_documents').insert({
            'business_id': business_id,
            'document_text': business_info,
            'collection_name': collection_name,
            'created_at': created_at 
        }).execute()

        chunks_stored = store_document_in_chroma(collection_name, business_info)

        return {
            'status': 'success',
            'business_id': business_id,
            'collection_name': collection_name,
            'message': f'Business added, {chunks_stored} chunks stored in ChromaDB'
        }

    except Exception as e:
        return {'status': 'error', 'message': str(e)}
