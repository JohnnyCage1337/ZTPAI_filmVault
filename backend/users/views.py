from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer
from .permissions import IsAdminUser, IsUserOrAdmin
from .models import UserProfile
import jwt
from datetime import datetime

def set_jwt_cookies(response, user):
    """Helper function to set JWT tokens as HttpOnly cookies"""
    refresh = RefreshToken.for_user(user)
    access_token = refresh.access_token
    
    # Set access token cookie
    response.set_cookie(
        settings.JWT_AUTH_COOKIE,
        str(access_token),
        max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
        httponly=settings.JWT_AUTH_COOKIE_HTTP_ONLY,
        secure=settings.JWT_AUTH_COOKIE_SECURE,
        samesite=settings.JWT_AUTH_COOKIE_SAMESITE
    )
    
    # Set refresh token cookie
    response.set_cookie(
        settings.JWT_AUTH_REFRESH_COOKIE,
        str(refresh),
        max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
        httponly=settings.JWT_AUTH_COOKIE_HTTP_ONLY,
        secure=settings.JWT_AUTH_COOKIE_SECURE,
        samesite=settings.JWT_AUTH_COOKIE_SAMESITE
    )
    
    return response, str(access_token), str(refresh)

@extend_schema(
    summary="Register new user",
    description="Create a new user account with JWT authentication.",
    request=UserRegistrationSerializer,
    responses={
        201: OpenApiResponse(
            description="User created successfully",
            examples=[
                OpenApiExample(
                    'Registration Success',
                    value={
                        'message': 'User created successfully',
                        'user': {
                            'id': 1,
                            'username': 'newuser',
                            'email': 'user@example.com',
                            'first_name': 'John',
                            'last_name': 'Doe',
                            'profile': {'role': 'user'}
                        }
                    }
                )
            ]
        ),
        400: OpenApiResponse(description="Validation errors")
    },
    tags=['Authentication']
)
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    Rejestracja nowego użytkownika z JWT
    """
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        response = Response({
            'message': 'User created successfully',
            'user': UserSerializer(user).data,
        }, status=status.HTTP_201_CREATED)
        
        # Set JWT cookies
        response, access_token, refresh_token = set_jwt_cookies(response, user)
        
        return response
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(
    summary="User login",
    description="Authenticate user with JWT tokens in HttpOnly cookies.",
    request=UserLoginSerializer,
    responses={
        200: OpenApiResponse(
            description="Login successful",
            examples=[
                OpenApiExample(
                    'Login Success',
                    value={
                        'message': 'Login successful',
                        'user': {
                            'id': 1,
                            'username': 'testuser',
                            'email': 'user@example.com',
                            'profile': {'role': 'user'}
                        }
                    }
                )
            ]
        ),
        400: OpenApiResponse(description="Invalid credentials")
    },
    tags=['Authentication']
)
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Logowanie użytkownika z JWT
    """
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        response = Response({
            'message': 'Login successful',
            'user': UserSerializer(user).data,
        }, status=status.HTTP_200_OK)
        
        # Set JWT cookies
        response, access_token, refresh_token = set_jwt_cookies(response, user)
        
        return response
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(
    summary="User logout",
    description="Logout the authenticated user by clearing JWT cookies.",
    responses={
        200: OpenApiResponse(
            description="Logout successful",
            examples=[
                OpenApiExample(
                    'Logout Success',
                    value={'message': 'Logout successful'}
                )
            ]
        ),
        401: OpenApiResponse(description="Authentication required")
    },
    tags=['Authentication']
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Wylogowanie użytkownika - usuwa JWT cookies
    """
    response = Response({
        'message': 'Logout successful'
    }, status=status.HTTP_200_OK)
    
    # Clear JWT cookies
    response.delete_cookie(settings.JWT_AUTH_COOKIE)
    response.delete_cookie(settings.JWT_AUTH_REFRESH_COOKIE)
    
    return response

@extend_schema(
    summary="Get user profile",
    description="Retrieve the authenticated user's profile information.",
    responses={
        200: OpenApiResponse(
            description="User profile",
            examples=[
                OpenApiExample(
                    'Profile Data',
                    value={
                        'user': {
                            'id': 1,
                            'username': 'testuser',
                            'email': 'user@example.com',
                            'first_name': 'John',
                            'last_name': 'Doe'
                        }
                    }
                )
            ]
        ),
        401: OpenApiResponse(description="Authentication required")
    },
    tags=['Users']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """
    Profil zalogowanego użytkownika
    """
    return Response({
        'user': UserSerializer(request.user).data
    }, status=status.HTTP_200_OK)

@extend_schema(
    summary="Refresh JWT tokens",
    description="Refresh JWT access token using refresh token from cookies.",
    responses={
        200: OpenApiResponse(
            description="Token refreshed successfully",
            examples=[
                OpenApiExample(
                    'Refresh Success',
                    value={'message': 'Token refreshed successfully'}
                )
            ]
        ),
        401: OpenApiResponse(description="Invalid or expired refresh token")
    },
    tags=['Authentication']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token_view(request):
    """
    Odświeżanie JWT tokenów z cookies
    """
    refresh_token = request.COOKIES.get(settings.JWT_AUTH_REFRESH_COOKIE)
    
    if not refresh_token:
        return Response({
            'error': 'Refresh token not found'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        refresh = RefreshToken(refresh_token)
        user_id = refresh['user_id']
        user = User.objects.get(id=user_id)
        
        response = Response({
            'message': 'Token refreshed successfully'
        }, status=status.HTTP_200_OK)
        
        # Set new JWT cookies
        response, access_token, new_refresh_token = set_jwt_cookies(response, user)
        
        return response
        
    except (TokenError, User.DoesNotExist) as e:
        return Response({
            'error': 'Invalid refresh token'
        }, status=status.HTTP_401_UNAUTHORIZED)

@extend_schema(
    summary="Check authentication status",
    description="Check if the current request is from an authenticated user with token validation.",
    responses={
        200: OpenApiResponse(
            description="Authentication status",
            examples=[
                OpenApiExample(
                    'Authenticated User',
                    value={
                        'authenticated': True,
                        'user': {
                            'id': 1,
                            'username': 'testuser',
                            'email': 'user@example.com',
                            'profile': {'role': 'user'}
                        },
                        'token_valid': True
                    }
                ),
                OpenApiExample(
                    'Unauthenticated User',
                    value={'authenticated': False, 'token_valid': False}
                )
            ]
        )
    },
    tags=['Authentication']
)
@api_view(['GET'])
@permission_classes([AllowAny])
def check_auth_view(request):
    """
    Sprawdzenie czy użytkownik jest zalogowany z walidacją tokenu
    """
    access_token = request.COOKIES.get(settings.JWT_AUTH_COOKIE)
    
    if request.user.is_authenticated and access_token:
        try:
            # Validate token
            jwt.decode(
                access_token,
                settings.SECRET_KEY,
                algorithms=[settings.SIMPLE_JWT['ALGORITHM']]
            )
            return Response({
                'authenticated': True,
                'user': UserSerializer(request.user).data,
                'token_valid': True
            })
        except jwt.ExpiredSignatureError:
            return Response({
                'authenticated': False,
                'token_valid': False,
                'error': 'Token expired'
            }, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({
                'authenticated': False,
                'token_valid': False,
                'error': 'Invalid token'
            }, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response({'authenticated': False, 'token_valid': False})

@extend_schema(
    summary="Update user role (Admin only)",
    description="Update user role - only accessible by admin users.",
    request={
        'type': 'object',
        'properties': {
            'user_id': {'type': 'integer'},
            'role': {'type': 'string', 'enum': ['user', 'admin']}
        }
    },
    responses={
        200: OpenApiResponse(description="Role updated successfully"),
        403: OpenApiResponse(description="Admin access required"),
        404: OpenApiResponse(description="User not found")
    },
    tags=['Admin']
)
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_user_role(request):
    """
    Zmiana roli użytkownika (tylko admin)
    """
    user_id = request.data.get('user_id')
    new_role = request.data.get('role')
    
    if not user_id or not new_role:
        return Response({
            'error': 'user_id and role are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if new_role not in ['user', 'admin']:
        return Response({
            'error': 'Invalid role. Must be user or admin'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(id=user_id)
        user.profile.role = new_role
        user.profile.save()
        
        return Response({
            'message': f'User role updated to {new_role}',
            'user': UserSerializer(user).data
        })
    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)

@extend_schema(
    summary="Get all users (Admin only)",
    description="List all users with their roles - only accessible by admin users.",
    responses={
        200: OpenApiResponse(description="Users list"),
        403: OpenApiResponse(description="Admin access required")
    },
    tags=['Admin']
)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_users(request):
    """
    Lista wszystkich użytkowników (tylko admin)
    """
    users = User.objects.all().select_related('profile')
    serializer = UserSerializer(users, many=True)
    return Response({
        'users': serializer.data,
        'total': users.count()
    })
