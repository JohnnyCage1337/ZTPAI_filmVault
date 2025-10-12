import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserWatchlist } from '../../services/watchlistService';
import MovieCard from '../../components/MovieCard';
import { useMultipleWatchlist } from '../../hooks/useWatchlist';

const Watchlist = ({ user }) => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Watchlist management for removing items
  const { toggleWatchlist } = useMultipleWatchlist(movies, user);

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login');
      return;
    }

    fetchWatchlist();
  }, [user, navigate]);

  const fetchWatchlist = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getUserWatchlist();
      const watchlistMovies = response.map(item => item.movie);
      setMovies(watchlistMovies);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      setError('Failed to load your watchlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWatchlistToggle = async (movie) => {
    try {
      await toggleWatchlist(movie);
      // Remove movie from the list after successful removal
      setMovies(prev => prev.filter(m => m.slug !== movie.slug));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const handleMovieSelect = (movie) => {
    navigate(`/movie/${movie.slug}`);
  };

  if (isLoading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0a0015 0%, #1a0828 25%, #2d1b42 50%, #1f2937 75%, #111827 100%)',
        minHeight: '100vh',
        paddingTop: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(79, 70, 229, 0.3)',
            borderTop: '4px solid #4f46e5',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h3 style={{ margin: 0, fontSize: '20px', opacity: 0.9 }}>Loading your watchlist...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a0015 0%, #1a0828 25%, #2d1b42 50%, #1f2937 75%, #111827 100%)',
      minHeight: '100vh',
      paddingTop: '120px'
    }}>
      <div className="container">
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          padding: '0 20px'
        }}>
          <h1 style={{
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '3.5rem',
            fontWeight: 'bold',
            margin: '0 0 20px 0',
            lineHeight: '1.2'
          }}>
            ❤️ My Watchlist
          </h1>
          <p style={{
            color: '#94a3b8',
            fontSize: '18px',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Movies you've saved to watch later
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            margin: '0 auto 40px',
            maxWidth: '600px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#f87171', margin: 0, fontSize: '16px' }}>
              {error}
            </p>
          </div>
        )}

        {!error && movies.length > 0 && (
          <>
            <div style={{
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              <p style={{
                color: '#e2e8f0',
                fontSize: '18px',
                margin: 0
              }}>
                You have {movies.length} movie{movies.length !== 1 ? 's' : ''} in your watchlist
              </p>
            </div>

            <div className="row">
              {movies.map((movie) => (
                <div key={movie.id} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-4">
                  <MovieCard
                    movie={movie}
                    onMovieSelect={handleMovieSelect}
                    showWatchlistButton={true}
                    user={user}
                    onWatchlistToggle={handleWatchlistToggle}
                    isInWatchlist={true}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {!error && movies.length === 0 && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '16px',
            padding: '60px',
            margin: '0 auto',
            maxWidth: '600px',
            textAlign: 'center',
            border: '1px solid rgba(79, 70, 229, 0.2)'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '20px'
            }}>
              🎬
            </div>
            <h3 style={{
              color: '#e2e8f0',
              fontSize: '24px',
              marginBottom: '16px'
            }}>
              Your watchlist is empty
            </h3>
            <p style={{
              color: '#94a3b8',
              fontSize: '16px',
              marginBottom: '30px',
              lineHeight: '1.6'
            }}>
              Start adding movies to your watchlist by clicking the heart icon on any movie card.
            </p>
            <button
              onClick={() => navigate('/movies')}
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 30px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 30px rgba(79, 70, 229, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Browse Movies
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Watchlist;