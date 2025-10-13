from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from rest_framework import status
from decimal import Decimal
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
            release_date="2023-01-01",
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
        self.token = Token.objects.create(user=self.user)

        # Create test data
        self.genre = Genre.objects.create(name="Action", slug="action")
        self.movie = Movie.objects.create(
            title="Test Movie",
            slug="test-movie",
            overview="Test overview",
            release_date="2023-01-01",
            runtime=120,
            vote_average=8.5,
            vote_count=100
        )
        self.movie.genres.add(self.genre)

    def test_movie_list_endpoint(self):
        """Test GET /movies/"""
        url = reverse('movie-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, "Test Movie")

    def test_movie_detail_endpoint(self):
        """Test GET /movies/<slug>/"""
        url = reverse('movie-detail', kwargs={'slug': self.movie.slug})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Movie')

    def test_movie_detail_not_found(self):
        """Test GET /movies/<slug>/ with non-existent movie"""
        url = reverse('movie-detail', kwargs={'slug': 'non-existent'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_search_movies_endpoint(self):
        """Test GET /search/"""
        url = reverse('search-movies')
        response = self.client.get(url, {'q': 'Test'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, "Test Movie")

    def test_search_movies_empty_query(self):
        """Test search with empty query"""
        url = reverse('search-movies')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_trending_movies_endpoint(self):
        """Test GET /movies/trending/"""
        url = reverse('trending-movies')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_top_rated_movies_endpoint(self):
        """Test GET /movies/top-rated/"""
        url = reverse('top-rated-movies')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_popular_movies_endpoint(self):
        """Test GET /movies/popular/"""
        url = reverse('popular-movies')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_genre_list_endpoint(self):
        """Test GET /genres/"""
        url = reverse('genre-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, "Action")


class MovieRatingAPITestCase(APITestCase):
    """Test cases for Movie Rating API endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.token = Token.objects.create(user=self.user)

        self.movie = Movie.objects.create(
            title="Test Movie",
            slug="test-movie",
            overview="Test overview"
        )

    def authenticate(self):
        """Helper method to authenticate user"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_rate_movie_authenticated(self):
        """Test POST /movies/<slug>/rate/ with authentication"""
        self.authenticate()
        url = reverse('rate-movie', kwargs={'movie_slug': self.movie.slug})
        data = {'rating': 8, 'review': 'Great movie!'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_rate_movie_unauthenticated(self):
        """Test POST /movies/<slug>/rate/ without authentication"""
        url = reverse('rate-movie', kwargs={'movie_slug': self.movie.slug})
        data = {'rating': 8}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_rate_movie_invalid_rating(self):
        """Test rating with invalid value"""
        self.authenticate()
        url = reverse('rate-movie', kwargs={'movie_slug': self.movie.slug})
        data = {'rating': 15}  # Invalid rating > 10
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_user_rating_authenticated(self):
        """Test GET /movies/<slug>/rating/ with authentication"""
        self.authenticate()
        # First create a rating
        MovieRating.objects.create(movie=self.movie, user=self.user, rating=9)

        url = reverse('get-user-rating', kwargs={'movie_slug': self.movie.slug})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['rating'], 9)

    def test_get_user_rating_no_rating(self):
        """Test GET rating when user hasn't rated the movie"""
        self.authenticate()
        url = reverse('get-user-rating', kwargs={'movie_slug': self.movie.slug})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class WatchlistAPITestCase(APITestCase):
    """Test cases for Watchlist API endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.token = Token.objects.create(user=self.user)

        self.movie = Movie.objects.create(
            title="Test Movie",
            slug="test-movie",
            overview="Test overview"
        )

    def authenticate(self):
        """Helper method to authenticate user"""
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_watchlist_toggle_add(self):
        """Test POST /movies/<slug>/watchlist/ to add movie"""
        self.authenticate()
        url = reverse('watchlist-toggle', kwargs={'movie_slug': self.movie.slug})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Watchlist.objects.filter(user=self.user, movie=self.movie).exists())

    def test_watchlist_toggle_remove(self):
        """Test POST /movies/<slug>/watchlist/ to remove movie"""
        self.authenticate()
        # First add to watchlist
        Watchlist.objects.create(user=self.user, movie=self.movie)

        url = reverse('watchlist-toggle', kwargs={'movie_slug': self.movie.slug})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Watchlist.objects.filter(user=self.user, movie=self.movie).exists())

    def test_watchlist_toggle_unauthenticated(self):
        """Test watchlist toggle without authentication"""
        url = reverse('watchlist-toggle', kwargs={'movie_slug': self.movie.slug})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_check_watchlist_status(self):
        """Test GET /movies/<slug>/watchlist-status/"""
        self.authenticate()
        # Add to watchlist
        Watchlist.objects.create(user=self.user, movie=self.movie)

        url = reverse('check-watchlist-status', kwargs={'movie_slug': self.movie.slug})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['in_watchlist'])

    def test_user_watchlist_endpoint(self):
        """Test GET /watchlist/"""
        self.authenticate()
        # Add movie to watchlist
        Watchlist.objects.create(user=self.user, movie=self.movie)

        url = reverse('user-watchlist')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Test Movie')


class HomePageTestCase(TestCase):
    """Test cases for home page endpoint"""

    def test_home_page_endpoint(self):
        """Test GET / (home page)"""
        url = reverse('home')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'trending_movies')
        self.assertContains(response, 'top_rated_movies')
        self.assertContains(response, 'popular_movies')
