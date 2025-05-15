from rest_framework import generics
from .models import Film, TVSeries, Season, Episode
from .serializers import FilmSerializer, TVSeriesSerializer, SeasonSerializer, EpisodeSerializer

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


class SeasonList(generics.ListCreateAPIView):
    queryset = Season.objects.all()
    serializer_class = SeasonSerializer

class SeasonDetail(generics.RetrieveDestroyAPIView):
    queryset = Season.objects.all()
    serializer_class = SeasonSerializer

class EpisodeList(generics.ListCreateAPIView):
    queryset = Episode.objects.all()
    serializer_class = EpisodeSerializer

class EpisodeDetail(generics.RetrieveDestroyAPIView):
    queryset = Episode.objects.all()
    serializer_class = EpisodeSerializer