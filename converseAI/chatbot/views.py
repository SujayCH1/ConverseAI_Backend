from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .store import add_business
from .queries import process_business_query

@csrf_exempt
def create_business(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            business_name = data.get("business_name")
            business_info = data.get("business_info")

            if not business_name or not business_info:
                return JsonResponse({"error": "Both business_name and business_info are required"}, status=400)

            result = add_business(business_name, business_info)

            if result['status'] == 'success':
                return JsonResponse(result)
            else:
                return JsonResponse({'error': result['message']}, status=500)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def business_query(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            business_id = data.get("business_id")
            user_query = data.get("query")

            if not business_id or not user_query:
                return JsonResponse({"error": "Business ID and query are required"}, status=400)

            return process_business_query(business_id, user_query)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)