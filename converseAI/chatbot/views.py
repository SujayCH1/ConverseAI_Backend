from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .store import add_business
from .queries import process_business_query

@csrf_exempt
def home_view(request):
    """Home page view"""
    return HttpResponse("Welcome to ConverseAI Home Page")

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
            sender_id = data.get("sender_id")  

            if not business_id or not user_query or not sender_id:
                return JsonResponse({"error": "Business ID, query, and sender ID are required"}, status=400)

            return process_business_query(business_id, user_query, sender_id)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)