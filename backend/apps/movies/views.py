from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Movie, Genre, MovieRating, Watchlist
from .serializers import (
    MovieListSerializer, MovieDetailSerializer, GenreSerializer,
    MovieRatingSerializer, WatchlistSerializer
)

@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def home_page(request):
    """
    Home page endpoint that returns all data needed for the main page
    """
    try:
        # Get different categories of movies
        trending = Movie.objects.all().order_by('-popularity', '-vote_average')[:12]
        top_rated = Movie.objects.filter(vote_count__gte=10).order_by('-vote_average', '-popularity')[:12]
        popular = Movie.objects.all().order_by('-popularity')[:12]
        latest = Movie.objects.all().order_by('-release_date')[:12]

        # Serialize the data
        context = {'request': request}
        trending_data = MovieListSerializer(trending, many=True, context=context).data
        top_rated_data = MovieListSerializer(top_rated, many=True, context=context).data
        popular_data = MovieListSerializer(popular, many=True, context=context).data
        latest_data = MovieListSerializer(latest, many=True, context=context).data

        # Get genres
        genres = Genre.objects.all()
        genres_data = GenreSerializer(genres, many=True).data

        return Response({
            'trending': trending_data,
            'top_rated': top_rated_data,
            'popular': popular_data,
            'latest': latest_data,
            'genres': genres_data,
            'hero_movies': trending_data[:3]  # Top 3 trending for hero section
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MovieListView(generics.ListAPIView):
    queryset = Movie.objects.all().select_related('director').prefetch_related('genres', 'cast__person')
    serializer_class = MovieListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['genres', 'status', 'year']
    search_fields = ['title', 'overview', 'og_title']
    ordering_fields = ['vote_average', 'popularity', 'release_date', 'runtime']
    ordering = ['-popularity']

@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def search_movies(request):
    """
    Search movies by title, overview, or original title
    """
    try:
        query = request.GET.get('q', '').strip()
        if not query:
            return Response({'results': [], 'count': 0})

        # Search in title, overview, and original title
        movies = Movie.objects.filter(
            Q(title__icontains=query) |
            Q(overview__icontains=query) |
            Q(og_title__icontains=query)
        ).select_related('director').prefetch_related('genres', 'cast__person')[:20]

        context = {'request': request}
        movies_data = MovieListSerializer(movies, many=True, context=context).data

        return Response({
            'results': movies_data,
            'count': len(movies_data),
            'query': query
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MovieDetailView(generics.RetrieveAPIView):
    queryset = Movie.objects.all().select_related('director').prefetch_related('genres', 'writers', 'cast__person')
    serializer_class = MovieDetailSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

class GenreListView(generics.ListAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def trending_movies(request):
    """Get trending movies based on popularity and recent ratings"""
    movies = Movie.objects.all().order_by('-popularity', '-vote_average')[:12]
    serializer = MovieListSerializer(movies, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def top_rated_movies(request):
    """Get top rated movies"""
    movies = Movie.objects.filter(vote_count__gte=10).order_by('-vote_average', '-popularity')[:12]
    serializer = MovieListSerializer(movies, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def popular_movies(request):
    """Get popular movies"""
    movies = Movie.objects.all().order_by('-popularity')[:12]
    serializer = MovieListSerializer(movies, many=True)
    return Response(serializer.data)

@api_view(['POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def rate_movie(request, movie_slug):
    """Rate a movie"""
    movie = get_object_or_404(Movie, slug=movie_slug)

    if request.method == 'POST' or request.method == 'PUT':
        rating_value = request.data.get('rating')
        review_text = request.data.get('review', '')

        if not rating_value or not (1 <= int(rating_value) <= 10):
            return Response({'error': 'Rating must be between 1 and 10'},
                          status=status.HTTP_400_BAD_REQUEST)

        rating, created = MovieRating.objects.get_or_create(
            movie=movie,
            user=request.user,
            defaults={'rating': rating_value, 'review': review_text}
        )

        if not created and request.method == 'PUT':
            rating.rating = rating_value
            rating.review = review_text
            rating.save()

        serializer = MovieRatingSerializer(rating)
        return Response(serializer.data,
                       status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    elif request.method == 'DELETE':
        try:
            rating = MovieRating.objects.get(movie=movie, user=request.user)
            rating.delete()
            return Response({'message': 'Rating deleted'}, status=status.HTTP_204_NO_CONTENT)
        except MovieRating.DoesNotExist:
            return Response({'error': 'Rating not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def watchlist_toggle(request, movie_slug):
    """Add or remove movie from watchlist"""
    movie = get_object_or_404(Movie, slug=movie_slug)

    if request.method == 'POST':
        watchlist_item, created = Watchlist.objects.get_or_create(
            user=request.user,
            movie=movie
        )
        if created:
            return Response({'message': 'Added to watchlist', 'in_watchlist': True},
                          status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Already in watchlist', 'in_watchlist': True},
                          status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        try:
            watchlist_item = Watchlist.objects.get(user=request.user, movie=movie)
            watchlist_item.delete()
            return Response({'message': 'Removed from watchlist', 'in_watchlist': False},
                          status=status.HTTP_204_NO_CONTENT)
        except Watchlist.DoesNotExist:
            return Response({'error': 'Not in watchlist', 'in_watchlist': False},
                          status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_watchlist(request):
    """Get user's watchlist"""
    watchlist = Watchlist.objects.filter(user=request.user).select_related('movie')
    serializer = WatchlistSerializer(watchlist, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_watchlist_status(request, movie_slug):
    """Check if movie is in user's watchlist"""
    movie = get_object_or_404(Movie, slug=movie_slug)
    in_watchlist = Watchlist.objects.filter(user=request.user, movie=movie).exists()
    return Response({'in_watchlist': in_watchlist})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_rating(request, movie_slug):
    """Get user's rating for a movie"""
    movie = get_object_or_404(Movie, slug=movie_slug)
    try:
        rating = MovieRating.objects.get(movie=movie, user=request.user)
        serializer = MovieRatingSerializer(rating)
        return Response(serializer.data)
    except MovieRating.DoesNotExist:
        return Response({'rating': None}, status=status.HTTP_404_NOT_FOUND)