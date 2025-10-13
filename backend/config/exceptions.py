from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from django.core.exceptions import ValidationError
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """
    Custom exception handler for REST API responses.
    Returns consistent error format across all endpoints.
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)
    
    if response is not None:
        custom_response_data = {
            'error': True,
            'message': 'An error occurred',
            'details': response.data,
            'status_code': response.status_code
        }
        
        # Handle specific error types
        if response.status_code == status.HTTP_400_BAD_REQUEST:
            custom_response_data['message'] = 'Bad request - invalid data provided'
        elif response.status_code == status.HTTP_401_UNAUTHORIZED:
            custom_response_data['message'] = 'Authentication required'
        elif response.status_code == status.HTTP_403_FORBIDDEN:
            custom_response_data['message'] = 'Permission denied'
        elif response.status_code == status.HTTP_404_NOT_FOUND:
            custom_response_data['message'] = 'Resource not found'
        elif response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED:
            custom_response_data['message'] = 'Method not allowed'
        elif response.status_code >= 500:
            custom_response_data['message'] = 'Internal server error'
            # Log server errors
            logger.error(f"Server error: {exc}")
        
        response.data = custom_response_data
        return response
    
    # Handle Django validation errors and other exceptions not caught by DRF
    if isinstance(exc, Http404):
        return Response({
            'error': True,
            'message': 'Resource not found',
            'details': {'detail': str(exc)},
            'status_code': 404
        }, status=status.HTTP_404_NOT_FOUND)
    
    if isinstance(exc, ValidationError):
        return Response({
            'error': True,
            'message': 'Validation error',
            'details': {'detail': str(exc)},
            'status_code': 400
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Log unexpected errors
    logger.error(f"Unexpected error: {exc}")
    
    return Response({
        'error': True,
        'message': 'An unexpected error occurred',
        'details': {'detail': 'Please contact support if this persists'},
        'status_code': 500
    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)