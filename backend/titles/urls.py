from django.urls import path
from . import views

urlpatterns = [
    path('films/', views.FilmList.as_view()),
    path('films/<int:pk>', views.FilmDetail.as_view()),
]
