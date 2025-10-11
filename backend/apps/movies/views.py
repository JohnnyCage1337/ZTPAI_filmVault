from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Genre, Movie
from .serializers import (
    GenreSerializer, MovieListSerializer,
    MovieDetailSerializer, MovieCreateSerializer
)

class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    lookup_field = 'slug'

    @action(detail=True, methods=['get'])
    def movies(self, request, slug=None):
        """GET /api/genres/action/movies/ - filmy danego gatunku"""
        genre = self.get_object()
        movies = genre.movie_set.all()
        serializer = MovieListSerializer(movies, many=True)
        return Response(serializer.data)

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all().select_related().prefetch_related('genres')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'adult', 'genres__slug']
    search_fields = ['title', 'original_title', 'overview']
    ordering_fields = ['release_date', 'vote_average', 'popularity', 'title']
    ordering = ['-popularity', '-vote_average']

    def get_serializer_class(self):
        """Różne serializers dla różnych akcji"""
        if self.action == 'list':
            return MovieListSerializer
        elif self.action == 'create':
            return MovieCreateSerializer
        return MovieDetailSerializer

    @action(detail=False, methods=['get'])
    def popular(self, request):
        """GET /api/movies/popular/ - najpopularniejsze filmy"""
        movies = self.queryset.order_by('-popularity')[:20]
        serializer = MovieListSerializer(movies, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def top_rated(self, request):
        """GET /api/movies/top_rated/ - najlepiej oceniane"""
        movies = self.queryset.filter(vote_count__gte=100).order_by('-vote_average')[:20]
        serializer = MovieListSerializer(movies, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """GET /api/movies/upcoming/ - nadchodzące filmy"""
        movies = self.queryset.filter(status='upcoming').order_by('release_date')
        serializer = MovieListSerializer(movies, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def update_stats(self, request, pk=None):
        """POST /api/movies/1/update_stats/ - przelicz statystyki"""
        movie = self.get_object()
        #movie.update_rating_stats()
        return Response({'message': 'Stats updated successfully'})