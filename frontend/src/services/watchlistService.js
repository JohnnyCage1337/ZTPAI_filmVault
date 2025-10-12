const API_BASE_URL = 'http://localhost:8000/api';

// Get authentication token
const getAuthToken = () => {
  const token = localStorage.getItem('access_token');
  return token ? `Bearer ${token}` : null;
};

// Create headers with authentication
const createAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: token })
  };
};

// Toggle movie in watchlist (add/remove)
export const toggleWatchlist = async (movieSlug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/${movieSlug}/watchlist/`, {
      method: 'POST',
      headers: createAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required');
      }
      throw new Error('Failed to toggle watchlist');
    }

    return await response.json();
  } catch (error) {
    console.error('Error toggling watchlist:', error);
    throw error;
  }
};

// Check if movie is in watchlist
export const checkWatchlistStatus = async (movieSlug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/${movieSlug}/watchlist-status/`, {
      method: 'GET',
      headers: createAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required');
      }
      throw new Error('Failed to check watchlist status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking watchlist status:', error);
    throw error;
  }
};

// Get user's complete watchlist
export const getUserWatchlist = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/watchlist/`, {
      method: 'GET',
      headers: createAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required');
      }
      throw new Error('Failed to get watchlist');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting watchlist:', error);
    throw error;
  }
};

// Batch check watchlist status for multiple movies
export const checkMultipleWatchlistStatus = async (movies) => {
  try {
    const promises = movies.map(movie =>
      checkWatchlistStatus(movie.slug).catch(() => ({ in_watchlist: false }))
    );

    const results = await Promise.all(promises);

    // Create a map of movie slug to watchlist status
    const statusMap = {};
    movies.forEach((movie, index) => {
      statusMap[movie.slug] = results[index]?.in_watchlist || false;
    });

    return statusMap;
  } catch (error) {
    console.error('Error checking multiple watchlist status:', error);
    return {};
  }
};