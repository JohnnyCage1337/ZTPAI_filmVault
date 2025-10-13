from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import json
from .models import UserProfile


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


class UserProfileModelTestCase(TestCase):
    """Test cases for UserProfile model"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )

    def test_user_profile_creation(self):
        """Test that UserProfile is created automatically"""
        self.assertTrue(hasattr(self.user, 'userprofile'))
        self.assertEqual(self.user.userprofile.role, 'user')

    def test_user_profile_admin_role(self):
        """Test admin role functionality"""
        self.user.userprofile.role = 'admin'
        self.user.userprofile.save()
        self.assertTrue(self.user.userprofile.is_admin)
        self.assertFalse(self.user.userprofile.is_user)

    def test_user_profile_user_role(self):
        """Test user role functionality"""
        self.user.userprofile.role = 'user'
        self.user.userprofile.save()
        self.assertTrue(self.user.userprofile.is_user)
        self.assertFalse(self.user.userprofile.is_admin)

    def test_user_profile_string_representation(self):
        """Test UserProfile string representation"""
        expected = f"{self.user.username} - {self.user.userprofile.role}"
        self.assertEqual(str(self.user.userprofile), expected)


class JWTAuthenticationAPITestCase(APITestCase):
    """Test cases for JWT Authentication API endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/v1/auth/register/'
        self.login_url = '/api/v1/auth/login/'
        self.logout_url = '/api/v1/auth/logout/'
        self.profile_url = '/api/v1/auth/profile/'
        self.refresh_url = '/api/v1/auth/refresh/'
        self.check_auth_url = '/api/v1/auth/check/'

        self.user_data = {
            'username': 'jwtuser',
            'email': 'jwt@example.com',
            'password': 'jwtpass123',
            'first_name': 'JWT',
            'last_name': 'User'
        }

    def test_jwt_registration_success(self):
        """Test JWT registration endpoint"""
        response = self.client.post(
            self.register_url,
            self.user_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user', response.data)
        # Check if cookies are set (they should be in headers)
        self.assertIn('Set-Cookie', response.headers)

    def test_jwt_login_success(self):
        """Test JWT login endpoint with cookies"""
        # Create user first
        User.objects.create_user(
            username='jwtuser',
            password='jwtpass123'
        )

        login_data = {
            'username': 'jwtuser',
            'password': 'jwtpass123'
        }

        response = self.client.post(
            self.login_url,
            login_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('user', response.data)
        self.assertIn('Set-Cookie', response.headers)

    def test_jwt_login_invalid_credentials(self):
        """Test JWT login with invalid credentials"""
        User.objects.create_user(username='jwtuser', password='jwtpass123')

        login_data = {
            'username': 'jwtuser',
            'password': 'wrongpassword'
        }

        response = self.client.post(
            self.login_url,
            login_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_jwt_logout_success(self):
        """Test JWT logout endpoint"""
        user = User.objects.create_user(username='jwtuser', password='pass123')
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Set cookies manually for testing
        self.client.cookies['access_token'] = access_token
        self.client.cookies['refresh_token'] = str(refresh)

        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_jwt_refresh_token(self):
        """Test JWT refresh token endpoint"""
        user = User.objects.create_user(username='jwtuser', password='pass123')
        refresh = RefreshToken.for_user(user)

        self.client.cookies['refresh_token'] = str(refresh)

        response = self.client.post(self.refresh_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_jwt_check_auth_authenticated(self):
        """Test JWT check auth with valid token"""
        user = User.objects.create_user(username='jwtuser', password='pass123')
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        self.client.cookies['access_token'] = access_token

        response = self.client.get(self.check_auth_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_jwt_check_auth_unauthenticated(self):
        """Test JWT check auth without token"""
        response = self.client.get(self.check_auth_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_jwt_profile_access_authenticated(self):
        """Test JWT profile access with valid token"""
        user = User.objects.create_user(
            username='jwtuser',
            email='jwt@example.com',
            first_name='JWT',
            last_name='User'
        )
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        self.client.cookies['access_token'] = access_token

        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'jwtuser')

    def test_jwt_profile_update(self):
        """Test JWT profile update"""
        user = User.objects.create_user(username='jwtuser', email='old@example.com')
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        self.client.cookies['access_token'] = access_token

        update_data = {
            'email': 'new@example.com',
            'first_name': 'Updated'
        }

        response = self.client.put(
            self.profile_url,
            update_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class AdminEndpointsTestCase(APITestCase):
    """Test cases for Admin endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_user(
            username='adminuser',
            password='adminpass123'
        )
        self.admin_user.userprofile.role = 'admin'
        self.admin_user.userprofile.save()

        self.regular_user = User.objects.create_user(
            username='regularuser',
            password='userpass123'
        )

        # Admin endpoints
        self.list_users_url = '/api/v1/admin/users/'
        self.update_role_url = '/api/v1/admin/users/role/'

    def get_admin_token(self):
        """Helper to get admin JWT token"""
        refresh = RefreshToken.for_user(self.admin_user)
        return str(refresh.access_token)

    def get_user_token(self):
        """Helper to get regular user JWT token"""
        refresh = RefreshToken.for_user(self.regular_user)
        return str(refresh.access_token)

    def test_admin_list_users_success(self):
        """Test admin can list users"""
        self.client.cookies['access_token'] = self.get_admin_token()
        
        response = self.client.get(self.list_users_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 2)  # At least admin and regular user

    def test_admin_list_users_forbidden_for_regular_user(self):
        """Test regular user cannot list users"""
        self.client.cookies['access_token'] = self.get_user_token()
        
        response = self.client.get(self.list_users_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_update_user_role_success(self):
        """Test admin can update user role"""
        self.client.cookies['access_token'] = self.get_admin_token()
        
        data = {
            'user_id': self.regular_user.id,
            'role': 'admin'
        }
        
        response = self.client.post(self.update_role_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify role was updated
        self.regular_user.refresh_from_db()
        self.assertEqual(self.regular_user.userprofile.role, 'admin')

    def test_admin_update_user_role_forbidden_for_regular_user(self):
        """Test regular user cannot update roles"""
        self.client.cookies['access_token'] = self.get_user_token()
        
        data = {
            'user_id': self.regular_user.id,
            'role': 'admin'
        }
        
        response = self.client.post(self.update_role_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_update_user_role_invalid_role(self):
        """Test admin update with invalid role"""
        self.client.cookies['access_token'] = self.get_admin_token()
        
        data = {
            'user_id': self.regular_user.id,
            'role': 'invalid_role'
        }
        
        response = self.client.post(self.update_role_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_admin_update_nonexistent_user(self):
        """Test admin update nonexistent user"""
        self.client.cookies['access_token'] = self.get_admin_token()
        
        data = {
            'user_id': 99999,
            'role': 'admin'
        }
        
        response = self.client.post(self.update_role_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
