from django.urls import path
from . import views

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.register_view, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/refresh/', views.refresh_token_view, name='refresh_token'),
    path('auth/check/', views.check_auth_view, name='check_auth'),
    
    # User management
    path('auth/profile/', views.profile_view, name='profile'),
    
    # Admin endpoints
    path('admin/users/', views.list_users, name='list_users'),
    path('admin/users/role/', views.update_user_role, name='update_user_role'),
]