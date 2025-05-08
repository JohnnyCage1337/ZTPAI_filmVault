# titles/urls.py
from django.urls import path
from .views import film_list, film_detail

urlpatterns = [
    path("films/", film_list, name="film_list"),             # /films/ - lista wszystkich filmów
    path("films/<int:film_id>/", film_detail, name="film_detail"),  # /films/1/ - szczegóły filmu o ID=1
]
