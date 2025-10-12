from django.urls import path
from . import views

urlpatterns = [
    path('api/auth/register/', views.register_view, name='register'),
    path('api/auth/login/', views.login_view, name='login'),
    path('api/auth/logout/', views.logout_view, name='logout'),
    path('api/auth/profile/', views.profile_view, name='profile'),
    path('api/auth/check/', views.check_auth_view, name='check_auth'),
]