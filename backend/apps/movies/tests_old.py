from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import date
import json

from .models import Movie, Genre, Person, MovieRating, Watchlist, MovieCast


class MovieModelTestCase(TestCase):
    """Test cases for Movie model"""

    def setUp(self):
        self.genre = Genre.objects.create(name="Action", slug="action")
        self.director = Person.objects.create(name="Test Director")
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
        """Test movie creation"""
        self.assertEqual(self.movie.title, "Test Movie")
        self.assertEqual(self.movie.slug, "test-movie")
        self.assertEqual(str(self.movie), "Test Movie (2023)")

    def test_movie_year_property(self):
        """Test movie year property"""
        self.assertEqual(self.movie.year, 2023)

    def test_movie_slug_auto_generation(self):
        """Test slug auto generation"""
        movie = Movie.objects.create(title="Another Test Movie")
        self.assertEqual(movie.slug, "another-test-movie")

    def test_movie_average_rating_property(self):
        """Test average rating calculation"""
        user = User.objects.create_user(username="testuser", password="testpass")
        MovieRating.objects.create(movie=self.movie, user=user, rating=9)
        self.assertEqual(self.movie.average_rating, 9.0)


class GenreModelTestCase(TestCase):
    """Test cases for Genre model"""

    def test_genre_creation(self):
        """Test genre creation"""
        genre = Genre.objects.create(name="Comedy")
        self.assertEqual(genre.name, "Comedy")
        self.assertEqual(genre.slug, "comedy")
        self.assertEqual(str(genre), "Comedy")


class MovieRatingModelTestCase(TestCase):
    """Test cases for MovieRating model"""

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.movie = Movie.objects.create(title="Test Movie", slug="test-movie")

    def test_rating_creation(self):
        """Test rating creation"""
        rating = MovieRating.objects.create(
            movie=self.movie,
            user=self.user,
            rating=8,
            review="Great movie!"
        )
        self.assertEqual(rating.rating, 8)
        self.assertEqual(rating.review, "Great movie!")
        self.assertEqual(str(rating), "testuser rated Test Movie: 8/10")


class WatchlistModelTestCase(TestCase):
    """Test cases for Watchlist model"""

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.movie = Movie.objects.create(title="Test Movie", slug="test-movie")

    def test_watchlist_creation(self):
        """Test watchlist creation"""
        watchlist = Watchlist.objects.create(user=self.user, movie=self.movie)
        self.assertEqual(str(watchlist), "testuser - Test Movie")


class MovieAPITestCase(APITestCase):
    """Test cases for Movie API endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")

        # Create test data
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

    def get_jwt_token(self, user):
        """Helper to get JWT token for user"""
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    def authenticate_user(self, user):
        """Helper to authenticate user with JWT cookies"""
        token = self.get_jwt_token(user)
        self.client.cookies['access_token'] = token

    def test_movie_list_endpoint(self):
        """Test GET /api/v1/movies/"""
        url = '/api/v1/movies/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_movie_detail_endpoint(self):
        """Test GET /api/v1/movies/<slug>/"""
        url = f'/api/v1/movies/{self.movie.slug}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Movie')

    def test_movie_detail_not_found(self):
        """Test GET /api/v1/movies/<slug>/ with non-existent movie"""
        url = '/api/v1/movies/non-existent/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_search_movies_endpoint(self):
        """Test GET /api/v1/movies/search/"""
        url = '/api/v1/movies/search/'
        response = self.client.get(url, {'q': 'Test'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_search_movies_empty_query(self):
        """Test search with empty query"""
        url = '/api/v1/movies/search/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_trending_movies_endpoint(self):
        """Test GET /api/v1/movies/trending/"""
        url = '/api/v1/movies/trending/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_top_rated_movies_endpoint(self):
        """Test GET /api/v1/movies/top-rated/"""
        url = '/api/v1/movies/top-rated/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_popular_movies_endpoint(self):
        """Test GET /api/v1/movies/popular/"""
        url = '/api/v1/movies/popular/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_genre_list_endpoint(self):
        """Test GET /api/v1/genres/"""
        url = '/api/v1/genres/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class MovieRatingAPITestCase(APITestCase):
    """Test cases for Movie Rating API endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.movie = Movie.objects.create(
            title="Test Movie",
            slug="test-movie",
            overview="Test overview"
        )

    def get_jwt_token(self, user):
        """Helper to get JWT token for user"""
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    def authenticate_user(self, user):
        """Helper to authenticate user with JWT cookies"""
        token = self.get_jwt_token(user)
        self.client.cookies['access_token'] = token

    def test_rate_movie_authenticated(self):
        """Test POST /api/v1/movies/<slug>/ratings/ with authentication"""
        self.authenticate_user(self.user)
        url = f'/api/v1/movies/{self.movie.slug}/ratings/'
        data = {'rating': 8, 'review': 'Great movie!'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_rate_movie_unauthenticated(self):
        """Test POST /api/v1/movies/<slug>/ratings/ without authentication"""
        url = f'/api/v1/movies/{self.movie.slug}/ratings/'
        data = {'rating': 8}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_user_rating_authenticated(self):
        """Test GET /api/v1/movies/<slug>/ratings/me/ with authentication"""
        self.authenticate_user(self.user)
        # First create a rating
        MovieRating.objects.create(movie=self.movie, user=self.user, rating=9)

        url = f'/api/v1/movies/{self.movie.slug}/ratings/me/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['rating'], 9)

    def test_get_user_rating_no_rating(self):
        """Test GET rating when user hasn't rated the movie"""
        self.authenticate_user(self.user)
        url = f'/api/v1/movies/{self.movie.slug}/ratings/me/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class WatchlistAPITestCase(APITestCase):
    """Test cases for Watchlist API endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.movie = Movie.objects.create(
            title="Test Movie",
            slug="test-movie",
            overview="Test overview"
        )

    def get_jwt_token(self, user):
        """Helper to get JWT token for user"""
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    def authenticate_user(self, user):
        """Helper to authenticate user with JWT cookies"""
        token = self.get_jwt_token(user)
        self.client.cookies['access_token'] = token

    def test_watchlist_toggle_add(self):
        """Test POST /api/v1/movies/<slug>/watchlist/ to add movie"""
        self.authenticate_user(self.user)
        url = f'/api/v1/movies/{self.movie.slug}/watchlist/'
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Watchlist.objects.filter(user=self.user, movie=self.movie).exists())

    def test_watchlist_toggle_remove(self):
        """Test POST /api/v1/movies/<slug>/watchlist/ to remove movie"""
        self.authenticate_user(self.user)
        # First add to watchlist
        Watchlist.objects.create(user=self.user, movie=self.movie)

        url = f'/api/v1/movies/{self.movie.slug}/watchlist/'
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Watchlist.objects.filter(user=self.user, movie=self.movie).exists())

    def test_watchlist_toggle_unauthenticated(self):
        """Test watchlist toggle without authentication"""
        url = f'/api/v1/movies/{self.movie.slug}/watchlist/'
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_check_watchlist_status(self):
        """Test GET /api/v1/movies/<slug>/watchlist/status/"""
        self.authenticate_user(self.user)
        # Add to watchlist
        Watchlist.objects.create(user=self.user, movie=self.movie)

        url = f'/api/v1/movies/{self.movie.slug}/watchlist/status/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['in_watchlist'])

    def test_user_watchlist_endpoint(self):
        """Test GET /api/v1/users/watchlist/"""
        self.authenticate_user(self.user)
        # Add movie to watchlist
        Watchlist.objects.create(user=self.user, movie=self.movie)

        url = '/api/v1/users/watchlist/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


class HomePageTestCase(APITestCase):
    """Test cases for home page endpoint"""

    def setUp(self):
        self.client = APIClient()

    def test_home_page_endpoint(self):
        """Test GET /api/v1/ (home page)"""
        url = '/api/v1/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        # Check for expected data structure
        self.assertIn('trending', response.data)
        self.assertIn('top_rated', response.data)
        self.assertIn('popular', response.data)


class MovieFilteringTestCase(APITestCase):
    """Test cases for movie filtering and pagination"""

    def setUp(self):
        self.client = APIClient()
        self.genre1 = Genre.objects.create(name="Action", slug="action")
        self.genre2 = Genre.objects.create(name="Comedy", slug="comedy")
        
        # Create multiple movies for testing
        self.movie1 = Movie.objects.create(
            title="Action Movie",
            slug="action-movie",
            release_date=date(2023, 1, 1),
            vote_average=8.5,
            status="released"
        )
        self.movie1.genres.add(self.genre1)
        
        self.movie2 = Movie.objects.create(
            title="Comedy Movie",
            slug="comedy-movie",
            release_date=date(2022, 6, 15),
            vote_average=7.2,
            status="released"
        )
        self.movie2.genres.add(self.genre2)

    def test_movie_filter_by_genre(self):
        """Test filtering movies by genre"""
        url = '/api/v1/movies/'
        response = self.client.get(url, {'genres': 'action'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_movie_search_functionality(self):
        """Test movie search functionality"""
        url = '/api/v1/movies/'
        response = self.client.get(url, {'search': 'Action'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_movie_ordering_by_rating(self):
        """Test ordering movies by rating"""
        url = '/api/v1/movies/'
        response = self.client.get(url, {'ordering': '-vote_average'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_movie_pagination(self):
        """Test movie list pagination"""
        url = '/api/v1/movies/'
        response = self.client.get(url, {'page_size': 1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('count', response.data)
        self.assertIn('results', response.data)


class MoviePermissionsTestCase(APITestCase):
    """Test cases for movie endpoint permissions"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.movie = Movie.objects.create(
            title="Test Movie",
            slug="test-movie"
        )

    def test_movie_list_public_access(self):
        """Test that movie list is publicly accessible"""
        url = '/api/v1/movies/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_movie_detail_public_access(self):
        """Test that movie detail is publicly accessible"""
        url = f'/api/v1/movies/{self.movie.slug}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_rating_requires_authentication(self):
        """Test that rating requires authentication"""
        url = f'/api/v1/movies/{self.movie.slug}/ratings/'
        response = self.client.post(url, {'rating': 8})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_watchlist_requires_authentication(self):
        """Test that watchlist operations require authentication"""
        url = f'/api/v1/movies/{self.movie.slug}/watchlist/'
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ErrorHandlingTestCase(APITestCase):
    """Test cases for API error handling"""

    def setUp(self):
        self.client = APIClient()

    def test_404_error_format(self):
        """Test 404 error response format"""
        response = self.client.get('/api/v1/movies/non-existent-movie/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_invalid_json_error(self):
        """Test invalid JSON error handling"""
        url = '/api/v1/auth/register/'
        response = self.client.post(
            url,
            'invalid json',
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)