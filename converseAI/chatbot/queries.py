from django.http import JsonResponse
from supabaseClient import supabaseInst
from .langflow_api import run_flow
from datetime import datetime
import json

FLOW_ID = "a7f94076-9083-4974-81eb-3ee4a0d3a1b3"

def process_business_query(business_id, user_query, sender_id):
    try:
        doc_response = supabaseInst.table('business_documents') \
            .select('collection_name') \
            .eq('business_id', business_id) \
            .execute()
        
        if not doc_response.data:
            return JsonResponse({"error": "Business documents not found"}, status=404)
        
        collection_name = doc_response.data[0]['collection_name']
        
        chat_response = supabaseInst.table('chat_memory') \
            .select('*') \
            .eq('business_id', business_id) \
            .eq('sender_id', sender_id) \
            .execute()
        

        chat_history = []
        chat_memory_id = None
        
        if chat_response.data:
            record = chat_response.data[0]
            chat_history = record.get('chat_history', [])
            chat_memory_id = record['id']
            
            if not isinstance(chat_history, list):
                chat_history = []
        else:
            new_chat = supabaseInst.table('chat_memory') \
                .insert({
                    'business_id': business_id,
                    'sender_id': sender_id,
                    'chat_history': []
                }) \
                .execute()
            chat_memory_id = new_chat.data[0]['id']
        
        user_message = {
            'role': 'user',
            'content': user_query,
            'timestamp': datetime.now().isoformat()
        }
        updated_history = chat_history + [user_message]
        
        supabaseInst.table('chat_memory') \
            .update({'chat_history': updated_history}) \
            .eq('id', chat_memory_id) \
            .execute()
        
        tweaks = {
            "Chroma-GRSws": {"collection_name": collection_name},
            "Prompt-099dQ": {
                "chat_history": [
                    f"{msg['role']}: {msg['content']}" 
                    for msg in chat_history  
                    if isinstance(msg, dict)
                ]
            }
        }
        
        flow_response = run_flow(
            message=user_query,
            endpoint=FLOW_ID,
            tweaks=tweaks
        )
        
        try:
            if isinstance(flow_response, str):
                try:
                    flow_response = json.loads(flow_response.replace("'", "\""))
                except json.JSONDecodeError:
                    pass  

            if isinstance(flow_response, dict):
                try:
                    bot_response = flow_response['outputs'][0]['outputs'][0]['results']['message']['text']
                except (KeyError, IndexError):
                    try:
                        bot_response = flow_response['outputs'][0]['outputs'][0]['message']
                    except (KeyError, IndexError):
                        try:
                            bot_response = flow_response['message']
                        except KeyError:
                            bot_response = str(flow_response)
            elif isinstance(flow_response, str):
                bot_response = flow_response
            else:
                bot_response = str(flow_response)

            if isinstance(bot_response, dict):
                try:
                    bot_response = bot_response.get('text', str(bot_response))
                except AttributeError:
                    bot_response = str(bot_response)

            if isinstance(bot_response, str):
                bot_response = bot_response.replace('\\"', '"')  
                bot_response = bot_response.replace('\n', ' ')   
                bot_response = bot_response.replace('\\n', ' ')  
                bot_response = ' '.join(bot_response.split())    
            
            if not isinstance(bot_response, str) or not bot_response.strip():
                bot_response = "I didn't get a valid response. Please try again."

            bot_message = {
                'role': 'assistant',
                'content': bot_response,
                'timestamp': datetime.now().isoformat()
            }
            final_history = updated_history + [bot_message]
            
            if len(final_history) > 20:
                final_history = final_history[-20:]
            
            supabaseInst.table('chat_memory') \
                .update({'chat_history': final_history}) \
                .eq('id', chat_memory_id) \
                .execute()
            
            return JsonResponse({"response": bot_response})
            
        except Exception as e:
            return JsonResponse({
                "error": "Response processing failed",
                "details": str(e),
                "debug": {
                    "raw_response": flow_response,
                    "history": chat_history
                }
            }, status=500)
            
    except Exception as e:
        return JsonResponse({
            "error": "Server error",
            "details": str(e)
        }, status=500)