from django.urls import path
from . import views

urlpatterns = [
    # Authentication endpoints
    path('api/auth/register/', views.register_view, name='register'),
    path('api/auth/login/', views.login_view, name='login'),
    path('api/auth/logout/', views.logout_view, name='logout'),
    path('api/auth/refresh/', views.refresh_token_view, name='refresh_token'),
    path('api/auth/check/', views.check_auth_view, name='check_auth'),
    
    # User management
    path('api/auth/profile/', views.profile_view, name='profile'),
    
    # Admin endpoints
    path('api/admin/users/', views.list_users, name='list_users'),
    path('api/admin/users/role/', views.update_user_role, name='update_user_role'),
]