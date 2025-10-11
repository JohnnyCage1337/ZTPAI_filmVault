from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_test(request):
    return JsonResponse({'message': 'FILMVAULT API działa!', 'status': 'OK'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/test/', api_test, name='api_test'),
    path('movies/', include('movies.urls')),
]

# Obsługa plików media w trybie deweloperskim
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)