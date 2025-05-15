from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import mixins, generics
from django.http import Http404
from .models import Film, TVSeries
from .serializers import FilmSerializer, TVSeriesSerializer

class FilmList(generics.ListCreateAPIView):
    queryset = Film.objects.all()
    serializer_class = FilmSerializer    

class FilmDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Film.objects.all()
    serializer_class = FilmSerializer

class TVSeriesList(generics.ListCreateAPIView):
    queryset = TVSeries.objects.all()
    serializer_class = TVSeriesSerializer

class TVSeriesDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = TVSeries.objects.all()
    serializer_class = TVSeriesSerializer