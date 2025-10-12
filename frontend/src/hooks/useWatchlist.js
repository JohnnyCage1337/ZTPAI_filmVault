import { useState, useEffect, useCallback } from 'react';
import { toggleWatchlist, checkWatchlistStatus, checkMultipleWatchlistStatus } from '../services/watchlistService';

// Hook for managing individual movie watchlist status
export const useWatchlist = (movie, user) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check initial watchlist status
  useEffect(() => {
    if (user && movie?.slug) {
      const checkStatus = async () => {
        try {
          setIsLoading(true);
          const response = await checkWatchlistStatus(movie.slug);
          setIsInWatchlist(response.in_watchlist);
        } catch (error) {
          console.error('Error checking watchlist status:', error);
          setIsInWatchlist(false);
        } finally {
          setIsLoading(false);
        }
      };

      checkStatus();
    }
  }, [movie?.slug, user]);

  // Toggle watchlist status
  const handleToggle = useCallback(async () => {
    if (!user || !movie?.slug || isLoading) return;

    try {
      setIsLoading(true);
      const response = await toggleWatchlist(movie.slug);
      setIsInWatchlist(response.in_watchlist);
      return response;
    } catch (error) {
      console.error('Error toggling watchlist:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [movie?.slug, user, isLoading]);

  return {
    isInWatchlist,
    isLoading,
    toggleWatchlist: handleToggle
  };
};

// Hook for managing multiple movies watchlist status
export const useMultipleWatchlist = (movies, user) => {
  const [watchlistStatus, setWatchlistStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Check watchlist status for all movies
  useEffect(() => {
    if (user && movies?.length > 0) {
      const checkMultipleStatus = async () => {
        try {
          setIsLoading(true);
          const statusMap = await checkMultipleWatchlistStatus(movies);
          setWatchlistStatus(statusMap);
        } catch (error) {
          console.error('Error checking multiple watchlist status:', error);
          setWatchlistStatus({});
        } finally {
          setIsLoading(false);
        }
      };

      checkMultipleStatus();
    }
  }, [movies, user]);

  // Toggle individual movie in watchlist
  const handleToggle = useCallback(async (movie) => {
    if (!user || !movie?.slug || isLoading) return;

    try {
      const response = await toggleWatchlist(movie.slug);
      setWatchlistStatus(prev => ({
        ...prev,
        [movie.slug]: response.in_watchlist
      }));
      return response;
    } catch (error) {
      console.error('Error toggling watchlist:', error);
      throw error;
    }
  }, [user, isLoading]);

  return {
    watchlistStatus,
    isLoading,
    toggleWatchlist: handleToggle
  };
};