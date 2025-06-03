from django.urls import path
from . import views

urlpatterns = [
    path('people/', views.PersonList.as_view()),
    path('people/<int:pk>/', views.PersonDetail.as_view()),
]
