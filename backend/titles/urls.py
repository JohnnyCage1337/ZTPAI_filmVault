from django.urls import path
from . import views
from people import views as people_views
urlpatterns = [
    path('films/', views.FilmList.as_view()),
    path('films/<int:pk>/', views.FilmDetail.as_view()),
    path('tvseries/', views.TVSeriesList.as_view()),
    path('tvseries/<int:pk>/', views.TVSeriesDetail.as_view()),
    path('seasons/', views.SeasonList.as_view()),
    path('seasons<int:pk>/', views.SeasonDetail.as_view()),
    path('episodes/', views.EpisodeList.as_view()),
    path('episodes/<int:pk>/', views.EpisodeDetail.as_view()),
    path('films/<int:film_pk>/credits/',
         people_views.FilmCreditListCreate.as_view(),
         name='film-credit-list'),
    path('films/<int:film_pk>/credits/<int:pk>/',
         people_views.FilmCreditDetail.as_view(),
         name='film-credit-detail'),

    path('episodes/<int:episode_pk>/credits/',
         people_views.EpisodeCreditListCreate.as_view(),
         name='episode-credit-list'),
    path('episodes/<int:episode_pk>/credits/<int:pk>/',
         people_views.EpisodeCreditDetail.as_view(),
         name='episode-credit-detail'),
]
