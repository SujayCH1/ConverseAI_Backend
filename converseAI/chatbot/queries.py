from django.http import JsonResponse
from supabaseClient import supabaseInst
from .langflow_api import run_flow  

FLOW_ID = "bba7db1e-fe4c-4165-8e9a-cbb648f66351"

def process_business_query(business_id, user_query):
    try:
        response = supabaseInst.table('business_documents').select('collection_name').eq('business_id', business_id).execute()
        
        if not response.data:
            return JsonResponse({"error": "Collection name not found for business_id"}, status=400)

        collection_name = response.data[0]['collection_name']
        tweaks = {"Chroma-9GLSk": {"collection_name": collection_name}}
        
        response = run_flow(message=user_query, endpoint=FLOW_ID, tweaks=tweaks)
        
        try:
            text_response = response['outputs'][0]['outputs'][0]['results']['message']['text']
            return JsonResponse({"response": text_response}, safe=False)
        except (KeyError, IndexError) as e:
            return JsonResponse({"error": "Failed to parse response from Langflow", "details": str(e)}, status=500)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)