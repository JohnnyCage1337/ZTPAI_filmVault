from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import date

from .models import Movie, Genre, Person, MovieRating, Watchlist


class MovieModelTestCase(TestCase):
    """Test cases for Movie model functionality"""

    def setUp(self):
        self.genre = Genre.objects.create(name="Action", slug="action")
        self.movie = Movie.objects.create(
            title="Test Movie",
            slug="test-movie",
            overview="Test overview",
            release_date=date(2023, 1, 1),
            runtime=120,
            vote_average=8.5,
            vote_count=100
        )
        self.movie.genres.add(self.genre)

    def test_movie_creation(self):
        """Test movie model creation and properties"""
        self.assertEqual(self.movie.title, "Test Movie")
        self.assertEqual(self.movie.slug, "test-movie")
        self.assertEqual(str(self.movie), "Test Movie (2023)")
        self.assertEqual(self.movie.year, 2023)

    def test_movie_slug_auto_generation(self):
        """Test automatic slug generation"""
        movie = Movie.objects.create(title="Another Test Movie")
        self.assertEqual(movie.slug, "another-test-movie")

    def test_movie_average_rating_calculation(self):
        """Test average rating calculation"""
        user = User.objects.create_user(username="testuser", password="testpass")
        MovieRating.objects.create(movie=self.movie, user=user, rating=9)
        self.assertEqual(self.movie.average_rating, 9.0)


class GenreModelTestCase(TestCase):
    """Test cases for Genre model"""

    def test_genre_creation(self):
        """Test genre model creation and string representation"""
        genre = Genre.objects.create(name="Comedy")
        self.assertEqual(genre.name, "Comedy")
        self.assertEqual(genre.slug, "comedy")
        self.assertEqual(str(genre), "Comedy")


class MovieRatingModelTestCase(TestCase):
    """Test cases for MovieRating model"""

    def test_rating_creation(self):
        """Test rating model creation and string representation"""
        user = User.objects.create_user(username="testuser", password="testpass")
        movie = Movie.objects.create(title="Test Movie", slug="test-movie")
        
        rating = MovieRating.objects.create(
            movie=movie,
            user=user,
            rating=8,
            review="Great movie!"
        )
        self.assertEqual(rating.rating, 8)
        self.assertEqual(rating.review, "Great movie!")
        self.assertEqual(str(rating), "testuser rated Test Movie: 8/10")


class WatchlistModelTestCase(TestCase):
    """Test cases for Watchlist model"""

    def test_watchlist_creation(self):
        """Test watchlist model creation and string representation"""
        user = User.objects.create_user(username="testuser", password="testpass")
        movie = Movie.objects.create(title="Test Movie", slug="test-movie")
        
        watchlist = Watchlist.objects.create(user=user, movie=movie)
        self.assertEqual(str(watchlist), "testuser - Test Movie")


class MoviePublicAPITestCase(APITestCase):
    """Test cases for public Movie API endpoints (no authentication required)"""

    def setUp(self):
        self.client = APIClient()
        self.genre = Genre.objects.create(name="Action", slug="action")
        self.movie = Movie.objects.create(
            title="Test Movie",
            slug="test-movie",
            overview="Test overview",
            release_date=date(2023, 1, 1),
            runtime=120,
            vote_average=8.5,
            vote_count=100
        )
        self.movie.genres.add(self.genre)

    def test_movie_list_endpoint(self):
        """Test GET /api/v1/movies/ - List all movies"""
        url = '/api/v1/movies/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_movie_detail_endpoint(self):
        """Test GET /api/v1/movies/<slug>/ - Get movie details"""
        url = f'/api/v1/movies/{self.movie.slug}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Movie')

    def test_movie_detail_not_found(self):
        """Test GET /api/v1/movies/<slug>/ - Movie not found"""
        url = '/api/v1/movies/non-existent/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_search_movies_endpoint(self):
        """Test GET /api/v1/movies/search/ - Search movies"""
        url = '/api/v1/movies/search/'
        response = self.client.get(url, {'q': 'Test'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_trending_movies_endpoint(self):
        """Test GET /api/v1/movies/trending/ - Get trending movies"""
        url = '/api/v1/movies/trending/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_top_rated_movies_endpoint(self):
        """Test GET /api/v1/movies/top-rated/ - Get top rated movies"""
        url = '/api/v1/movies/top-rated/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_popular_movies_endpoint(self):
        """Test GET /api/v1/movies/popular/ - Get popular movies"""
        url = '/api/v1/movies/popular/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_genre_list_endpoint(self):
        """Test GET /api/v1/genres/ - List all genres"""
        url = '/api/v1/genres/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class MovieAuthenticatedAPITestCase(APITestCase):
    """Test cases for authenticated Movie API endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.movie = Movie.objects.create(
            title="Test Movie",
            slug="test-movie",
            overview="Test overview",
            release_date=date(2023, 1, 1)
        )

    def get_jwt_token(self, user):
        """Helper to get JWT token for user"""
        refresh = RefreshToken.for_user(user)
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }

    def authenticate_user(self, user=None):
        """Helper to authenticate user with JWT cookies"""
        if user is None:
            user = self.user
        tokens = self.get_jwt_token(user)
        self.client.cookies['access_token'] = tokens['access']
        self.client.cookies['refresh_token'] = tokens['refresh']

    def test_rate_movie_authenticated(self):
        """Test POST /api/v1/movies/<slug>/ratings/ - Rate movie with authentication"""
        self.authenticate_user()
        url = f'/api/v1/movies/{self.movie.slug}/ratings/'
        data = {'rating': 9, 'review': 'Great movie!'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_rate_movie_unauthenticated(self):
        """Test POST /api/v1/movies/<slug>/ratings/ - Rate movie without authentication"""
        url = f'/api/v1/movies/{self.movie.slug}/ratings/'
        data = {'rating': 9, 'review': 'Great movie!'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_movie_rating(self):
        """Test PUT /api/v1/movies/<slug>/ratings/ - Update movie rating"""
        self.authenticate_user()
        # First create a rating
        MovieRating.objects.create(movie=self.movie, user=self.user, rating=7)
        
        url = f'/api/v1/movies/{self.movie.slug}/ratings/'
        data = {'rating': 9, 'review': 'Updated review'}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_movie_rating(self):
        """Test DELETE /api/v1/movies/<slug>/ratings/ - Delete movie rating"""
        self.authenticate_user()
        # First create a rating
        MovieRating.objects.create(movie=self.movie, user=self.user, rating=7)
        
        url = f'/api/v1/movies/{self.movie.slug}/ratings/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_get_user_rating(self):
        """Test GET /api/v1/movies/<slug>/ratings/me/ - Get user's rating"""
        self.authenticate_user()
        url = f'/api/v1/movies/{self.movie.slug}/ratings/me/'
        response = self.client.get(url)
        # Should return 404 if no rating exists
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_add_to_watchlist(self):
        """Test POST /api/v1/movies/<slug>/watchlist/ - Add movie to watchlist"""
        self.authenticate_user()
        url = f'/api/v1/movies/{self.movie.slug}/watchlist/'
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_remove_from_watchlist(self):
        """Test DELETE /api/v1/movies/<slug>/watchlist/ - Remove movie from watchlist"""
        self.authenticate_user()
        Watchlist.objects.create(user=self.user, movie=self.movie)
        url = f'/api/v1/movies/{self.movie.slug}/watchlist/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_watchlist_status(self):
        """Test GET /api/v1/movies/<slug>/watchlist/status/ - Check watchlist status"""
        self.authenticate_user()
        url = f'/api/v1/movies/{self.movie.slug}/watchlist/status/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_user_watchlist(self):
        """Test GET /api/v1/users/watchlist/ - Get user's watchlist"""
        self.authenticate_user()
        url = '/api/v1/users/watchlist/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_watchlist_requires_authentication(self):
        """Test that watchlist operations require authentication"""
        url = f'/api/v1/movies/{self.movie.slug}/watchlist/'
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class MovieFilteringAndPaginationTestCase(APITestCase):
    """Test cases for movie filtering, search and pagination"""

    def setUp(self):
        self.client = APIClient()
        
        # Create genres
        self.action_genre = Genre.objects.create(name="Action", slug="action")
        self.comedy_genre = Genre.objects.create(name="Comedy", slug="comedy")
        
        # Create movies
        self.action_movie = Movie.objects.create(
            title="Action Movie",
            slug="action-movie",
            overview="Action packed movie",
            release_date=date(2023, 1, 1),
            vote_average=8.0
        )
        self.action_movie.genres.add(self.action_genre)
        
        # Create multiple movies for pagination
        for i in range(10):
            Movie.objects.create(
                title=f"Movie {i}",
                slug=f"movie-{i}",
                overview=f"Overview {i}",
                release_date=date(2023, 1, 1)
            )

    def test_filter_by_genre(self):
        """Test filtering movies by genre"""
        url = '/api/v1/movies/'
        response = self.client.get(url, {'genre': 'action'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_filter_by_year(self):
        """Test filtering movies by release year"""
        url = '/api/v1/movies/'
        response = self.client.get(url, {'year': '2023'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_filter_by_rating(self):
        """Test filtering movies by minimum rating"""
        url = '/api/v1/movies/'
        response = self.client.get(url, {'min_rating': '7.0'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_ordering_by_rating(self):
        """Test ordering movies by rating"""
        url = '/api/v1/movies/'
        response = self.client.get(url, {'ordering': '-vote_average'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_pagination(self):
        """Test movie list pagination"""
        url = '/api/v1/movies/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertIn('count', response.data)