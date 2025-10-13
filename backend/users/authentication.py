from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.conf import settings

class JWTCookieAuthentication(JWTAuthentication):
    """
    Custom JWT authentication that reads tokens from HTTP-only cookies
    """
    
    def authenticate(self, request):
        # Try to get token from cookie first
        raw_token = request.COOKIES.get(settings.JWT_AUTH_COOKIE)
        
        if raw_token is None:
            # Fallback to header authentication
            return super().authenticate(request)
        
        # Validate token
        validated_token = self.get_validated_token(raw_token)
        user = self.get_user(validated_token)
        
        return (user, validated_token)
    
    def get_validated_token(self, raw_token):
        """
        Validates an encoded JSON web token and returns a validated token
        wrapper object.
        """
        try:
            return AccessToken(raw_token)
        except TokenError as e:
            raise InvalidToken({
                'detail': 'Given token not valid',
                'message': str(e),
            })