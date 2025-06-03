from django.shortcuts import get_object_or_404
from django.contrib.contenttypes.models import ContentType
from rest_framework import generics
from rest_framework.exceptions import ValidationError

from .models import Credit, Person
from .serializers import CreditSerializer, CreditCreateSerializer, PersonSerializer
from titles.models import Film, Episode


class PersonList(generics.ListCreateAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer

class PersonDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer


# Nested views for Credits under a specific Film
class FilmCreditListCreate(generics.ListCreateAPIView):
    """
    GET  /api/films/{film_pk}/credits/       -> list of credits for film
    POST /api/films/{film_pk}/credits/       -> create a credit for film
    """
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreditCreateSerializer
        return CreditSerializer

    def get_queryset(self):
        film = get_object_or_404(Film, pk=self.kwargs['film_pk'])
        ct = ContentType.objects.get_for_model(Film)
        return Credit.objects.filter(content_type=ct, object_id=film.pk).order_by('billing_order')

    def perform_create(self, serializer):
        film = get_object_or_404(Film, pk=self.kwargs['film_pk'])
        ct = ContentType.objects.get_for_model(Film)
        serializer.save(content_type=ct, object_id=film.pk)

class FilmCreditDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/films/{film_pk}/credits/{pk}/
    PUT    /api/films/{film_pk}/credits/{pk}/
    DELETE /api/films/{film_pk}/credits/{pk}/
    """
    serializer_class = CreditSerializer

    def get_queryset(self):
        film = get_object_or_404(Film, pk=self.kwargs['film_pk'])
        ct = ContentType.objects.get_for_model(Film)
        return Credit.objects.filter(content_type=ct, object_id=film.pk)

# Nested views for Credits under a specific Episode
class EpisodeCreditListCreate(generics.ListCreateAPIView):
    """
    GET  /api/episodes/{episode_pk}/credits/    -> list of credits for episode
    POST /api/episodes/{episode_pk}/credits/    -> create a credit for episode
    """
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreditCreateSerializer
        return CreditSerializer

    def get_queryset(self):
        ep = get_object_or_404(Episode, pk=self.kwargs['episode_pk'])
        ct = ContentType.objects.get_for_model(Episode)
        return Credit.objects.filter(content_type=ct, object_id=ep.pk).order_by('billing_order')

    def perform_create(self, serializer):
        ep = get_object_or_404(Episode, pk=self.kwargs['episode_pk'])
        ct = ContentType.objects.get_for_model(Episode)
        serializer.save(content_type=ct, object_id=ep.pk)

class EpisodeCreditDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/episodes/{episode_pk}/credits/{pk}/
    PUT    /api/episodes/{episode_pk}/credits/{pk}/
    DELETE /api/episodes/{episode_pk}/credits/{pk}/
    """
    serializer_class = CreditSerializer

    def get_queryset(self):
        ep = get_object_or_404(Episode, pk=self.kwargs['episode_pk'])
        ct = ContentType.objects.get_for_model(Episode)
        return Credit.objects.filter(content_type=ct, object_id=ep.pk)
