from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from rest_framework import status
import json


class UserModelTestCase(TestCase):
    """Test cases for User model operations"""

    def test_user_creation(self):
        """Test user creation"""
        user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )
        self.assertEqual(user.username, "testuser")
        self.assertEqual(user.email, "test@example.com")
        self.assertTrue(user.check_password("testpass123"))

    def test_user_string_representation(self):
        """Test user string representation"""
        user = User.objects.create_user(username="testuser")
        self.assertEqual(str(user), "testuser")


class AuthenticationAPITestCase(APITestCase):
    """Test cases for Authentication API endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.logout_url = reverse('logout')
        self.profile_url = reverse('profile')
        self.check_auth_url = reverse('check_auth')

        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User'
        }

    def test_user_registration_success(self):
        """Test POST /api/auth/register/ with valid data"""
        response = self.client.post(
            self.register_url,
            self.user_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user', response.data)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['username'], 'testuser')

    def test_user_registration_duplicate_username(self):
        """Test registration with duplicate username"""
        # Create first user
        User.objects.create_user(username='testuser', password='pass123')

        response = self.client.post(
            self.register_url,
            self.user_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_registration_invalid_email(self):
        """Test registration with invalid email"""
        invalid_data = self.user_data.copy()
        invalid_data['email'] = 'invalid-email'

        response = self.client.post(
            self.register_url,
            invalid_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_registration_missing_fields(self):
        """Test registration with missing required fields"""
        incomplete_data = {'username': 'testuser'}

        response = self.client.post(
            self.register_url,
            incomplete_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login_success(self):
        """Test POST /api/auth/login/ with valid credentials"""
        # Create user first
        user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )

        login_data = {
            'username': 'testuser',
            'password': 'testpass123'
        }

        response = self.client.post(
            self.login_url,
            login_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('user', response.data)
        self.assertIn('token', response.data)

    def test_user_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        # Create user first
        User.objects.create_user(
            username='testuser',
            password='testpass123'
        )

        login_data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }

        response = self.client.post(
            self.login_url,
            login_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login_nonexistent_user(self):
        """Test login with non-existent user"""
        login_data = {
            'username': 'nonexistent',
            'password': 'password123'
        }

        response = self.client.post(
            self.login_url,
            login_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_logout_authenticated(self):
        """Test POST /api/auth/logout/ with authentication"""
        user = User.objects.create_user(username='testuser', password='pass123')
        token = Token.objects.create(user=user)

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.post(self.logout_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Token should be deleted
        self.assertFalse(Token.objects.filter(key=token.key).exists())

    def test_user_logout_unauthenticated(self):
        """Test logout without authentication"""
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_profile_authenticated(self):
        """Test GET /api/auth/profile/ with authentication"""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            first_name='Test',
            last_name='User'
        )
        token = Token.objects.create(user=user)

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.get(self.profile_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')
        self.assertEqual(response.data['email'], 'test@example.com')

    def test_user_profile_unauthenticated(self):
        """Test profile access without authentication"""
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_check_auth_authenticated(self):
        """Test GET /api/auth/check/ with authentication"""
        user = User.objects.create_user(username='testuser')
        token = Token.objects.create(user=user)

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        response = self.client.get(self.check_auth_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['authenticated'])
        self.assertEqual(response.data['user']['username'], 'testuser')

    def test_check_auth_unauthenticated(self):
        """Test auth check without authentication"""
        response = self.client.get(self.check_auth_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['authenticated'])

    def test_profile_update_authenticated(self):
        """Test PUT /api/auth/profile/ to update profile"""
        user = User.objects.create_user(
            username='testuser',
            email='old@example.com'
        )
        token = Token.objects.create(user=user)

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        update_data = {
            'email': 'new@example.com',
            'first_name': 'Updated',
            'last_name': 'Name'
        }

        response = self.client.put(
            self.profile_url,
            update_data,
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertEqual(user.email, 'new@example.com')
        self.assertEqual(user.first_name, 'Updated')


class TokenAuthenticationTestCase(TestCase):
    """Test cases for Token Authentication"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )

    def test_token_creation_on_user_creation(self):
        """Test that token is created when user is created"""
        # Token should be created automatically via signal
        token_exists = Token.objects.filter(user=self.user).exists()
        self.assertTrue(token_exists)

    def test_token_authentication_header(self):
        """Test authentication with token in header"""
        token = Token.objects.get(user=self.user)
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        # Test with an authenticated endpoint
        url = reverse('profile')
        response = client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_token_authentication(self):
        """Test authentication with invalid token"""
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token invalid-token-key')

        url = reverse('profile')
        response = client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AuthEndpointPermissionsTestCase(APITestCase):
    """Test cases for endpoint permissions"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.token = Token.objects.create(user=self.user)

    def test_public_endpoints_no_auth_required(self):
        """Test that public endpoints don't require authentication"""
        public_urls = [
            reverse('register'),
            reverse('login'),
            reverse('check_auth'),
        ]

        for url in public_urls:
            with self.subTest(url=url):
                # GET should work (except for register/login which are POST only)
                if 'register' not in url and 'login' not in url:
                    response = self.client.get(url)
                    self.assertNotEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_protected_endpoints_require_auth(self):
        """Test that protected endpoints require authentication"""
        protected_urls = [
            reverse('profile'),
            reverse('logout'),
        ]

        for url in protected_urls:
            with self.subTest(url=url):
                response = self.client.get(url)
                self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
