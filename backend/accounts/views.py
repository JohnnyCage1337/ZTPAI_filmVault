from django.shortcuts import render
from .models import User
from django.http import JsonResponse

def get_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        data = {
            "id" : str(user.id),
            "username" : user.username,
            "email" : user.email,
        }
        return JsonResponse(data)
    
    except User.DoesNotExist:
        return JsonResponse({"error" : "User not found"}, status=404)
    

