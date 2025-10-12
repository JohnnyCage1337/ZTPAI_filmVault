from django.urls import path
from . import views

urlpatterns = [
    # Home page
    path('', views.home_page, name='home'),

    # Search movies
    path('search/', views.search_movies, name='search-movies'),

    # Special movie endpoints (must come before slug patterns)
    path('movies/trending/', views.trending_movies, name='trending-movies'),
    path('movies/top-rated/', views.top_rated_movies, name='top-rated-movies'),
    path('movies/popular/', views.popular_movies, name='popular-movies'),

    # Movies
    path('movies/', views.MovieListView.as_view(), name='movie-list'),
    path('movies/<slug:slug>/', views.MovieDetailView.as_view(), name='movie-detail'),

    # User interactions (require authentication)
    path('movies/<slug:movie_slug>/rate/', views.rate_movie, name='rate-movie'),
    path('movies/<slug:movie_slug>/rating/', views.get_user_rating, name='get-user-rating'),
    path('movies/<slug:movie_slug>/watchlist/', views.watchlist_toggle, name='watchlist-toggle'),
    path('movies/<slug:movie_slug>/watchlist-status/', views.check_watchlist_status, name='check-watchlist-status'),
    path('watchlist/', views.user_watchlist, name='user-watchlist'),

    # Genres
    path('genres/', views.GenreListView.as_view(), name='genre-list'),
]