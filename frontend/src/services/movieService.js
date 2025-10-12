const API_BASE = 'http://localhost:8000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Token ${token}` })
  };
};

export default {
  // Get home page data (all data in one request)
  getHomeData: async () => {
    try {
      const response = await fetch(`${API_BASE}/`, {
        headers: getAuthHeaders(),
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

  // Get all movies with optional filtering
  getMovies: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE}/movies/${queryString ? `?${queryString}` : ''}`, {
        headers: getAuthHeaders(),
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

  // Get movie details by slug
  getMovieDetails: async (slug) => {
    try {
      const response = await fetch(`${API_BASE}/movies/${slug}/`, {
        headers: getAuthHeaders(),
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

  // Get trending movies
  getTrendingMovies: async () => {
    try {
      const response = await fetch(`${API_BASE}/movies/trending/`, {
        headers: getAuthHeaders(),
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

  // Get top rated movies
  getTopRatedMovies: async () => {
    try {
      const response = await fetch(`${API_BASE}/movies/top-rated/`, {
        headers: getAuthHeaders(),
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

  // Get popular movies
  getPopularMovies: async () => {
    try {
      const response = await fetch(`${API_BASE}/movies/popular/`, {
        headers: getAuthHeaders(),
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

  // Rate a movie (requires authentication)
  rateMovie: async (movieSlug, rating, review = '') => {
    try {
      const response = await fetch(`${API_BASE}/movies/${movieSlug}/rate/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rating, review }),
      });

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

  // Get user's rating for a movie
  getUserRating: async (movieSlug) => {
    try {
      const response = await fetch(`${API_BASE}/movies/${movieSlug}/rating/`, {
        headers: getAuthHeaders(),
      });

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

  // Toggle movie in watchlist
  toggleWatchlist: async (movieSlug, add = true) => {
    try {
      const method = add ? 'POST' : 'DELETE';
      const response = await fetch(`${API_BASE}/movies/${movieSlug}/watchlist/`, {
        method,
        headers: getAuthHeaders(),
      });

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

  // Check if movie is in user's watchlist
  checkWatchlistStatus: async (movieSlug) => {
    try {
      const response = await fetch(`${API_BASE}/movies/${movieSlug}/watchlist-status/`, {
        headers: getAuthHeaders(),
      });

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

  // Get user's watchlist
  getUserWatchlist: async () => {
    try {
      const response = await fetch(`${API_BASE}/watchlist/`, {
        headers: getAuthHeaders(),
      });

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

  // Get genres
  getGenres: async () => {
    try {
      const response = await fetch(`${API_BASE}/genres/`, {
        headers: getAuthHeaders(),
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

  // Search movies
  searchMovies: async (query) => {
    try {
      const response = await fetch(`${API_BASE}/search/?q=${encodeURIComponent(query)}`, {
        headers: getAuthHeaders(),
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