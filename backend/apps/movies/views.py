from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from users.permissions import IsUserOrAdmin, IsOwnerOrAdmin
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.db.models import Q
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from .models import Movie, Genre, MovieRating, Watchlist
from .serializers import (
    MovieListSerializer, MovieDetailSerializer, GenreSerializer,
    MovieRatingSerializer, WatchlistSerializer
)

@extend_schema(
    summary="Get home page data",
    description="Returns all data needed for the home page including trending, top rated, popular, and latest movies.",
    responses={
        200: OpenApiResponse(
            description="Home page data retrieved successfully",
            examples=[
                OpenApiExample(
                    'Success Response',
                    value={
                        'trending': [{'id': 1, 'title': 'Movie Title', 'slug': 'movie-title'}],
                        'top_rated': [{'id': 1, 'title': 'Movie Title', 'slug': 'movie-title'}],
                        'popular': [{'id': 1, 'title': 'Movie Title', 'slug': 'movie-title'}],
                        'latest': [{'id': 1, 'title': 'Movie Title', 'slug': 'movie-title'}],
                        'genres': [{'id': 1, 'name': 'Action', 'slug': 'action'}],
                        'hero_movies': [{'id': 1, 'title': 'Movie Title', 'slug': 'movie-title'}]
                    }
                )
            ]
        ),
        500: OpenApiResponse(description="Internal server error")
    },
    tags=['Movies']
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

@extend_schema(
    summary="List all movies",
    description="Retrieve a paginated list of all movies with filtering, searching, and ordering capabilities.",
    parameters=[
        OpenApiParameter('genres', OpenApiTypes.INT, description='Filter by genre ID'),
        OpenApiParameter('status', OpenApiTypes.STR, description='Filter by movie status (released, upcoming, ongoing)'),
        OpenApiParameter('search', OpenApiTypes.STR, description='Search in title, overview, or original title'),
        OpenApiParameter('ordering', OpenApiTypes.STR, description='Order by: vote_average, popularity, release_date, runtime'),
    ],
    responses={
        200: MovieListSerializer(many=True),
        400: OpenApiResponse(description="Bad request")
    },
    tags=['Movies']
)
class MovieListView(generics.ListAPIView):
    queryset = Movie.objects.all().select_related('director').prefetch_related('genres', 'cast__person')
    serializer_class = MovieListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['genres', 'status']
    search_fields = ['title', 'overview', 'og_title']
    ordering_fields = ['vote_average', 'popularity', 'release_date', 'runtime']
    ordering = ['-popularity']

@extend_schema(
    summary="Search movies",
    description="Search movies by title, overview, or original title with query parameter.",
    parameters=[
        OpenApiParameter('q', OpenApiTypes.STR, description='Search query string', required=False),
    ],
    responses={
        200: OpenApiResponse(
            description="Search results",
            examples=[
                OpenApiExample(
                    'Success Response',
                    value={
                        'results': [{'id': 1, 'title': 'Movie Title', 'slug': 'movie-title'}],
                        'count': 1,
                        'query': 'search term'
                    }
                )
            ]
        ),
        500: OpenApiResponse(description="Internal server error")
    },
    tags=['Movies']
)
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

@extend_schema(
    summary="Get movie details",
    description="Retrieve detailed information about a specific movie by its slug.",
    responses={
        200: MovieDetailSerializer,
        404: OpenApiResponse(description="Movie not found")
    },
    tags=['Movies']
)
class MovieDetailView(generics.RetrieveAPIView):
    queryset = Movie.objects.all().select_related('director').prefetch_related('genres', 'writers', 'cast__person')
    serializer_class = MovieDetailSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

@extend_schema(
    summary="List all genres",
    description="Retrieve a list of all available movie genres.",
    responses={
        200: GenreSerializer(many=True),
    },
    tags=['Genres']
)
class GenreListView(generics.ListAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

@extend_schema(
    summary="Get trending movies",
    description="Retrieve trending movies based on popularity and recent ratings.",
    responses={
        200: MovieListSerializer(many=True),
    },
    tags=['Movies']
)
@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def trending_movies(request):
    """Get trending movies based on popularity and recent ratings"""
    movies = Movie.objects.all().order_by('-popularity', '-vote_average')[:12]
    serializer = MovieListSerializer(movies, many=True)
    return Response(serializer.data)

@extend_schema(
    summary="Get top rated movies",
    description="Retrieve top rated movies with minimum vote count.",
    responses={
        200: MovieListSerializer(many=True),
    },
    tags=['Movies']
)
@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def top_rated_movies(request):
    """Get top rated movies"""
    movies = Movie.objects.filter(vote_count__gte=10).order_by('-vote_average', '-popularity')[:12]
    serializer = MovieListSerializer(movies, many=True)
    return Response(serializer.data)

@extend_schema(
    summary="Get popular movies",
    description="Retrieve most popular movies ordered by popularity score.",
    responses={
        200: MovieListSerializer(many=True),
    },
    tags=['Movies']
)
@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def popular_movies(request):
    """Get popular movies"""
    movies = Movie.objects.all().order_by('-popularity')[:12]
    serializer = MovieListSerializer(movies, many=True)
    return Response(serializer.data)

@extend_schema(
    summary="Rate a movie",
    description="Create, update, or delete a movie rating. Requires authentication.",
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'rating': {
                    'type': 'integer',
                    'minimum': 1,
                    'maximum': 10,
                    'description': 'Rating value between 1 and 10'
                },
                'review': {
                    'type': 'string',
                    'description': 'Optional review text'
                }
            },
            'required': ['rating']
        }
    },
    responses={
        201: OpenApiResponse(
            description="Rating created successfully",
            examples=[
                OpenApiExample(
                    'Rating Created',
                    value={'message': 'Rating created successfully', 'rating': 8}
                )
            ]
        ),
        200: OpenApiResponse(
            description="Rating updated successfully",
            examples=[
                OpenApiExample(
                    'Rating Updated',
                    value={'message': 'Rating updated successfully', 'rating': 9}
                )
            ]
        ),
        400: OpenApiResponse(description="Invalid rating value"),
        401: OpenApiResponse(description="Authentication required"),
        404: OpenApiResponse(description="Movie not found")
    },
    tags=['Ratings']
)
@api_view(['POST', 'PUT', 'DELETE'])
@permission_classes([IsUserOrAdmin])
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

@extend_schema(
    summary="Toggle movie in watchlist",
    description="Add or remove a movie from user's watchlist. POST to add, DELETE to remove.",
    responses={
        201: OpenApiResponse(
            description="Added to watchlist",
            examples=[
                OpenApiExample(
                    'Added to Watchlist',
                    value={'message': 'Added to watchlist', 'in_watchlist': True}
                )
            ]
        ),
        200: OpenApiResponse(
            description="Already in watchlist",
            examples=[
                OpenApiExample(
                    'Already in Watchlist',
                    value={'message': 'Already in watchlist', 'in_watchlist': True}
                )
            ]
        ),
        204: OpenApiResponse(description="Removed from watchlist"),
        401: OpenApiResponse(description="Authentication required"),
        404: OpenApiResponse(description="Movie not found or not in watchlist")
    },
    tags=['Watchlist']
)
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

@extend_schema(
    summary="Get user's watchlist",
    description="Retrieve all movies in the authenticated user's watchlist.",
    responses={
        200: WatchlistSerializer(many=True),
        401: OpenApiResponse(description="Authentication required")
    },
    tags=['Watchlist']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_watchlist(request):
    """Get user's watchlist"""
    watchlist = Watchlist.objects.filter(user=request.user).select_related('movie')
    serializer = WatchlistSerializer(watchlist, many=True)
    return Response(serializer.data)

@extend_schema(
    summary="Check watchlist status",
    description="Check if a specific movie is in the user's watchlist.",
    responses={
        200: OpenApiResponse(
            description="Watchlist status",
            examples=[
                OpenApiExample(
                    'In Watchlist',
                    value={'in_watchlist': True}
                ),
                OpenApiExample(
                    'Not in Watchlist',
                    value={'in_watchlist': False}
                )
            ]
        ),
        401: OpenApiResponse(description="Authentication required"),
        404: OpenApiResponse(description="Movie not found")
    },
    tags=['Watchlist']
)
@api_view(['GET'])
@permission_classes([IsUserOrAdmin])
def check_watchlist_status(request, movie_slug):
    """Check if movie is in user's watchlist"""
    movie = get_object_or_404(Movie, slug=movie_slug)
    in_watchlist = Watchlist.objects.filter(user=request.user, movie=movie).exists()
    return Response({'in_watchlist': in_watchlist})

@extend_schema(
    summary="Get user's rating for movie",
    description="Retrieve the authenticated user's rating for a specific movie.",
    responses={
        200: MovieRatingSerializer,
        401: OpenApiResponse(description="Authentication required"),
        404: OpenApiResponse(
            description="Movie not found or user hasn't rated this movie",
            examples=[
                OpenApiExample(
                    'No Rating',
                    value={'rating': None}
                )
            ]
        )
    },
    tags=['Ratings']
)
@api_view(['GET'])
@permission_classes([IsUserOrAdmin])
def get_user_rating(request, movie_slug):
    """Get user's rating for a movie"""
    movie = get_object_or_404(Movie, slug=movie_slug)
    try:
        rating = MovieRating.objects.get(movie=movie, user=request.user)
        serializer = MovieRatingSerializer(rating)
        return Response(serializer.data)
    except MovieRating.DoesNotExist:
        return Response({'rating': None}, status=status.HTTP_404_NOT_FOUND)