import { authService } from './authService.js';

const API_BASE = 'http://localhost:8000';

export default {
  getHomeData: async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to fetch home data');
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
      throw error;
    }
  },

  getMovies: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE}/api/v1/movies/${queryString ? `?${queryString}` : ''}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to fetch movies');
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  },

  getMovieDetails: async (slug) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/movies/${slug}/`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to fetch movie details');
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  getTrendingMovies: async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/movies/trending/`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to fetch trending movies');
      }
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },

  // Get top rated movies - PUBLIC
  getTopRatedMovies: async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/movies/top-rated/`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to fetch top rated movies');
      }
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  },

  getPopularMovies: async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/movies/popular/`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to fetch popular movies');
      }
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  rateMovie: async (movieSlug, rating, review = '') => {
    try {
      const response = await authService.apiCall(`${API_BASE}/api/v1/movies/${movieSlug}/ratings/`, {
        method: 'POST',
        body: JSON.stringify({ rating, review }),
      });

      if (!response) {
        throw new Error('Authentication required');
      }

      if (response.ok) {
        return await response.json();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to rate movie');
      }
    } catch (error) {
      console.error('Error rating movie:', error);
      throw error;
    }
  },

  getUserRating: async (movieSlug) => {
    try {
      const response = await authService.apiCall(`${API_BASE}/api/v1/movies/${movieSlug}/ratings/me/`, {
        method: 'GET'
      });

      if (!response) {
        throw new Error('Authentication required');
      }

      if (response.ok) {
        return await response.json();
      } else if (response.status === 404) {
        return { rating: null };
      } else {
        throw new Error('Failed to fetch user rating');
      }
    } catch (error) {
      console.error('Error fetching user rating:', error);
      throw error;
    }
  },

  toggleWatchlist: async (movieSlug, add = true) => {
    try {
      const method = add ? 'POST' : 'DELETE';
      const response = await authService.apiCall(`${API_BASE}/api/v1/movies/${movieSlug}/watchlist/`, {
        method
      });

      if (!response) {
        throw new Error('Authentication required');
      }

      if (response.ok || response.status === 204) {
        const data = response.status === 204 ? {} : await response.json();
        return data;
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update watchlist');
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
      throw error;
    }
  },

  checkWatchlistStatus: async (movieSlug) => {
    try {
      const response = await authService.apiCall(`${API_BASE}/api/v1/movies/${movieSlug}/watchlist/status/`, {
        method: 'GET'
      });

      if (!response) {
        return { in_watchlist: false };
      }

      if (response.ok) {
        return await response.json();
      } else {
        return { in_watchlist: false };
      }
    } catch (error) {
      console.error('Error checking watchlist status:', error);
      return { in_watchlist: false };
    }
  },

  getUserWatchlist: async () => {
    try {
      const response = await authService.apiCall(`${API_BASE}/api/v1/users/watchlist/`, {
        method: 'GET'
      });

      if (!response) {
        throw new Error('Authentication required');
      }

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to fetch watchlist');
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      throw error;
    }
  },

  getGenres: async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/genres/`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to fetch genres');
      }
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    }
  },

  // Search movies - PUBLIC
  searchMovies: async (query, genre = null) => {
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (genre) params.append('genre', genre);

      const response = await fetch(`${API_BASE}/api/v1/movies/search/?${params.toString()}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to search movies');
      }
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  }
};