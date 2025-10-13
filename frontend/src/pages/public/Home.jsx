import React, { useState, useEffect, useMemo } from 'react';
import movieService from '../../services/movieService';
import MovieCard from '../../components/MovieCard';
import { useMultipleWatchlist } from '../../hooks/useWatchlist';

const Home = ({ onMovieSelect, user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);

  // Combine all movies for watchlist management - memoized to prevent infinite re-renders
  const allMovies = useMemo(() => {
    return [...trendingMovies, ...topRatedMovies, ...popularMovies];
  }, [trendingMovies, topRatedMovies, popularMovies]);

  const { watchlistStatus, toggleWatchlist } = useMultipleWatchlist(allMovies, user);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);

        // Fe0
        const homeData = await movieService.getHomeData();

        setTrendingMovies(homeData.trending.slice(0, 6));
        setTopRatedMovies(homeData.top_rated.slice(0, 6));
        setPopularMovies(homeData.popular.slice(0, 6));

      } catch (error) {
        console.error('Error fetching movies:', error);
        // Fallback to empty arrays on error
        setTrendingMovies([]);
        setTopRatedMovies([]);
        setPopularMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);



  const SectionTitle = ({ title, subtitle }) => (
    <div style={{
      textAlign: 'center',
      marginBottom: '40px'
    }}>
      <h2 style={{
        color: '#e2e8f0',
        fontSize: '2.5rem',
        fontWeight: '700',
        marginBottom: '10px',
        background: 'linear-gradient(45deg, #e2e8f0, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        {title}
      </h2>
      <p style={{
        color: '#94a3b8',
        fontSize: '16px',
        margin: 0
      }}>
        {subtitle}
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0a0015 0%, #1a0828 25%, #2d1b42 50%, #1f2937 75%, #111827 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(79, 70, 229, 0.3)',
            borderTop: '4px solid #4f46e5',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Loading FilmVault...</h3>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Preparing your cinematic experience</p>
        </div>

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a0015 0%, #1a0828 25%, #2d1b42 50%, #1f2937 75%, #111827 100%)',
      minHeight: '100vh',
      paddingTop: '80px'
    }}>


      {/* Main sections */}
      <div className="container">
        {/* Trending Movies */}
        <section style={{ marginBottom: '80px' }}>
          <SectionTitle
            title="🔥 Trending Movies"
            subtitle="What everyone's watching right now"
          />
          <div className="row">
            {trendingMovies.map((movie) => (
              <div key={movie.id} className="col-md-4 col-lg-2 mb-4">
                <MovieCard
                  movie={movie}
                  type="movie"
                  onMovieSelect={onMovieSelect}
                  showWatchlistButton={!!user}
                  user={user}
                  onWatchlistToggle={toggleWatchlist}
                  isInWatchlist={watchlistStatus[movie.slug] || false}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Top Rated */}
        <section style={{ marginBottom: '80px' }}>
          <SectionTitle
            title="🏆 Top Rated All Time"
            subtitle="The greatest films ever made"
          />
          <div className="row">
            {topRatedMovies.map((movie) => (
              <div key={movie.id} className="col-md-4 col-lg-2 mb-4">
                <MovieCard
                  movie={movie}
                  type="movie"
                  onMovieSelect={onMovieSelect}
                  showWatchlistButton={!!user}
                  user={user}
                  onWatchlistToggle={toggleWatchlist}
                  isInWatchlist={watchlistStatus[movie.slug] || false}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Popular Movies */}
        <section style={{ marginBottom: '80px' }}>
          <SectionTitle
            title="🌟 Popular Movies"
            subtitle="Most watched movies"
          />
          <div className="row">
            {popularMovies.map((movie) => (
              <div key={movie.id} className="col-md-4 col-lg-2 mb-4">
                <MovieCard
                  movie={movie}
                  type="movie"
                  onMovieSelect={onMovieSelect}
                  showWatchlistButton={!!user}
                  user={user}
                  onWatchlistToggle={toggleWatchlist}
                  isInWatchlist={watchlistStatus[movie.slug] || false}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;