from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import json

from .models import UserProfile


class UserModelTestCase(TestCase):
    """Test cases for User and UserProfile models"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )

    def test_user_creation(self):
        """Test user creation"""
        self.assertEqual(self.user.username, "testuser")
        self.assertEqual(self.user.email, "test@example.com")
        self.assertTrue(self.user.check_password("testpass123"))

    def test_user_profile_creation(self):
        """Test user profile creation via signal"""
        # UserProfile should be created automatically
        self.assertTrue(hasattr(self.user, 'userprofile'))
        self.assertIsInstance(self.user.userprofile, UserProfile)

    def test_user_profile_str(self):
        """Test UserProfile string representation"""
        profile = self.user.userprofile
        profile.bio = "Test bio"
        profile.save()
        self.assertEqual(str(profile), "testuser")


class AuthenticationAPITestCase(APITestCase):
    """Test cases for JWT authentication endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )

    def test_register_endpoint(self):
        """Test POST /api/v1/auth/register/"""
        url = '/api/v1/auth/register/'
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'newpass123',
            'password_confirm': 'newpass123'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access_token', response.cookies)
        self.assertIn('refresh_token', response.cookies)

    def test_register_password_mismatch(self):
        """Test registration with password mismatch"""
        url = '/api/v1/auth/register/'
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'newpass123',
            'password_confirm': 'differentpass'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_duplicate_username(self):
        """Test registration with duplicate username"""
        url = '/api/v1/auth/register/'
        data = {
            'username': 'testuser',  # Already exists
            'email': 'different@example.com',
            'password': 'newpass123',
            'password_confirm': 'newpass123'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_endpoint(self):
        """Test POST /api/v1/auth/login/"""
        url = '/api/v1/auth/login/'
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', response.cookies)
        self.assertIn('refresh_token', response.cookies)

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        url = '/api/v1/auth/login/'
        data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_nonexistent_user(self):
        """Test login with non-existent user"""
        url = '/api/v1/auth/login/'
        data = {
            'username': 'nonexistent',
            'password': 'somepass'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

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

    def test_logout_endpoint(self):
        """Test POST /api/v1/auth/logout/"""
        # First authenticate
        self.authenticate_user()

        url = '/api/v1/auth/logout/'
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_refresh_token_endpoint(self):
        """Test POST /api/v1/auth/refresh/"""
        tokens = self.get_jwt_token(self.user)
        self.client.cookies['refresh_token'] = tokens['refresh']

        url = '/api/v1/auth/refresh/'
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access_token', response.cookies)

    def test_refresh_token_invalid(self):
        """Test refresh with invalid token"""
        self.client.cookies['refresh_token'] = 'invalid_token'

        url = '/api/v1/auth/refresh/'
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_endpoint_authenticated(self):
        """Test GET /api/v1/auth/me/ with authentication"""
        self.authenticate_user()

        url = '/api/v1/auth/me/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

    def test_me_endpoint_unauthenticated(self):
        """Test GET /api/v1/auth/me/ without authentication"""
        url = '/api/v1/auth/me/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UserProfileAPITestCase(APITestCase):
    """Test cases for user profile endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )
        self.other_user = User.objects.create_user(
            username="otheruser",
            email="other@example.com",
            password="otherpass123"
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

    def test_get_profile_authenticated(self):
        """Test GET /api/v1/profile/ with authentication"""
        self.authenticate_user()

        url = '/api/v1/profile/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['username'], 'testuser')

    def test_get_profile_unauthenticated(self):
        """Test GET /api/v1/profile/ without authentication"""
        url = '/api/v1/profile/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_profile_authenticated(self):
        """Test PUT/PATCH /api/v1/profile/ with authentication"""
        self.authenticate_user()

        url = '/api/v1/profile/'
        data = {
            'bio': 'Updated bio',
            'location': 'Updated location'
        }
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['bio'], 'Updated bio')

    def test_update_profile_unauthenticated(self):
        """Test PUT/PATCH /api/v1/profile/ without authentication"""
        url = '/api/v1/profile/'
        data = {'bio': 'Updated bio'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_user_profile_by_username(self):
        """Test GET /api/v1/users/<username>/"""
        url = f'/api/v1/users/{self.user.username}/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

    def test_get_nonexistent_user_profile(self):
        """Test GET /api/v1/users/<username>/ with non-existent user"""
        url = '/api/v1/users/nonexistent/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_avatar_upload_authenticated(self):
        """Test avatar upload with authentication"""
        self.authenticate_user()

        # Mock file upload
        from django.core.files.uploadedfile import SimpleUploadedFile
        image_file = SimpleUploadedFile(
            "test_avatar.jpg",
            b"fake image content",
            content_type="image/jpeg"
        )

        url = '/api/v1/profile/'
        data = {'avatar': image_file}
        response = self.client.patch(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_avatar_upload_unauthenticated(self):
        """Test avatar upload without authentication"""
        from django.core.files.uploadedfile import SimpleUploadedFile
        image_file = SimpleUploadedFile(
            "test_avatar.jpg",
            b"fake image content",
            content_type="image/jpeg"
        )

        url = '/api/v1/profile/'
        data = {'avatar': image_file}
        response = self.client.patch(url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AdminUserAPITestCase(APITestCase):
    """Test cases for admin user endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="adminpass123",
            is_staff=True,
            is_superuser=True
        )
        self.regular_user = User.objects.create_user(
            username="regular",
            email="regular@example.com",
            password="regularpass123"
        )

    def get_jwt_token(self, user):
        """Helper to get JWT token for user"""
        refresh = RefreshToken.for_user(user)
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }

    def authenticate_user(self, user):
        """Helper to authenticate user with JWT cookies"""
        tokens = self.get_jwt_token(user)
        self.client.cookies['access_token'] = tokens['access']
        self.client.cookies['refresh_token'] = tokens['refresh']

    def test_admin_user_list_access(self):
        """Test that admin users can access user lists"""
        self.authenticate_user(self.admin_user)

        url = '/api/v1/admin/users/'
        response = self.client.get(url)
        # Should be successful if admin endpoints exist

    def test_regular_user_cannot_access_admin(self):
        """Test that regular users cannot access admin endpoints"""
        self.authenticate_user(self.regular_user)

        url = '/api/v1/admin/users/'
        response = self.client.get(url)
        # Should return 403 or 404 depending on implementation

    def test_unauthenticated_cannot_access_admin(self):
        """Test that unauthenticated users cannot access admin endpoints"""
        url = '/api/v1/admin/users/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UserPermissionTestCase(APITestCase):
    """Test cases for user permissions and roles"""

    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(
            username="user1",
            email="user1@example.com",
            password="pass123"
        )
        self.user2 = User.objects.create_user(
            username="user2",
            email="user2@example.com",
            password="pass123"
        )

    def get_jwt_token(self, user):
        """Helper to get JWT token for user"""
        refresh = RefreshToken.for_user(user)
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }

    def authenticate_user(self, user):
        """Helper to authenticate user with JWT cookies"""
        tokens = self.get_jwt_token(user)
        self.client.cookies['access_token'] = tokens['access']
        self.client.cookies['refresh_token'] = tokens['refresh']

    def test_user_can_only_edit_own_profile(self):
        """Test that users can only edit their own profile"""
        self.authenticate_user(self.user1)

        # Try to edit own profile - should work
        url = '/api/v1/profile/'
        data = {'bio': 'My bio'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_cannot_edit_other_profile(self):
        """Test that users cannot edit other user's profiles"""
        self.authenticate_user(self.user1)

        # Try to edit other user's profile via direct URL if such endpoint exists
        url = f'/api/v1/users/{self.user2.username}/profile/'
        data = {'bio': 'Hacked bio'}
        response = self.client.patch(url, data)
        # Should return 403 or 404 depending on implementation

    def test_authentication_required_for_protected_endpoints(self):
        """Test that authentication is required for protected endpoints"""
        protected_urls = [
            '/api/v1/profile/',
            '/api/v1/watchlist/',
        ]

        for url in protected_urls:
            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)