from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'genres', views.GenreViewSet)
router.register(r'movies', views.MovieViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]