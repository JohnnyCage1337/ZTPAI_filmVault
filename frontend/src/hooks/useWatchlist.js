import { useState, useEffect, useCallback } from 'react';
import { toggleWatchlist, checkWatchlistStatus, checkMultipleWatchlistStatus } from '../services/watchlistService';

export const useWatchlist = (movie, user) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsInWatchlist(false);
    setIsLoading(false);

    if (!user || typeof user !== 'object' || !user.id || !movie?.slug) {
      return;
    }

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
  }, [movie?.slug, user]);

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

export const useMultipleWatchlist = (movies, user) => {
  const [watchlistStatus, setWatchlistStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setWatchlistStatus({});
    setIsLoading(false);

    if (!user || typeof user !== 'object' || !user.id || !movies?.length) {
      return;
    }

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
  }, [movies, user]);

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