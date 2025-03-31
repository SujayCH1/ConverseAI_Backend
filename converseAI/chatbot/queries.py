from django.http import JsonResponse
from supabaseClient import supabaseInst
from .langflow_api import run_flow  

FLOW_ID = "bba7db1e-fe4c-4165-8e9a-cbb648f66351"

def process_business_query(business_id, user_query):
    try:
        response = supabaseInst.table('business_documents').select('collection_name').eq('business_id', business_id).single()
        
        if not response:
            return JsonResponse({"error": "Collection name not found for business_id"}, status=400)

        collection_name = response['collection_name']
        tweaks = {"Chroma-9GLSk": {"collection_name": collection_name}}
        
        response = run_flow(message=user_query, endpoint=FLOW_ID, tweaks=tweaks)

        return JsonResponse(response, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
