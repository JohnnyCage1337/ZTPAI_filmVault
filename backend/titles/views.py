# titles/views.py
from django.http import JsonResponse
from .models import Film

def film_list(request):
    if request.method == "GET":
        # Pobierz wszystkie filmy z bazy danych
        films = Film.objects.all()
        # Serializacja danych do formatu JSON
        data = [{"id": film.id, "title": film.title, "year": film.year} for film in films]
        return JsonResponse(data, safe=False)

def film_detail(request, film_id):
    if request.method == "GET":
        try:
            # Pobierz film o danym ID
            film = Film.objects.get(pk=film_id)
            # Serializacja danych do formatu JSON
            data = {
                "id": film.id,
                "title": film.title,
                "year": film.year,
                "runtime": film.runtime,
                "plot": film.plot,
            }
            return JsonResponse(data)
        except Film.DoesNotExist:
            return JsonResponse({"error": "Film not found"}, status=404)