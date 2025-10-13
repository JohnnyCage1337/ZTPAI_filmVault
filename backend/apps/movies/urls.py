from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_page, name='home'),

    path('movies/search/', views.search_movies, name='search-movies'),

    path('movies/trending/', views.trending_movies, name='trending-movies'),
    path('movies/top-rated/', views.top_rated_movies, name='top-rated-movies'),
    path('movies/popular/', views.popular_movies, name='popular-movies'),

    path('movies/', views.MovieListView.as_view(), name='movie-list'),
    path('movies/<slug:slug>/', views.MovieDetailView.as_view(), name='movie-detail'),

    path('movies/<slug:movie_slug>/ratings/', views.rate_movie, name='rate-movie'),
    path('movies/<slug:movie_slug>/ratings/me/', views.get_user_rating, name='get-user-rating'),
    path('movies/<slug:movie_slug>/watchlist/', views.watchlist_toggle, name='watchlist-toggle'),
    path('movies/<slug:movie_slug>/watchlist/status/', views.check_watchlist_status, name='check-watchlist-status'),

    path('users/watchlist/', views.user_watchlist, name='user-watchlist'),

    path('genres/', views.GenreListView.as_view(), name='genre-list'),
]