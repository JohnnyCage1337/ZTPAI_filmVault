import React, { useState, useEffect } from 'react';
import movieService from '../../services/movieService';

const Home = ({ onMovieSelect }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [heroMovies, setHeroMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);

        // Fetch all home data in one request
        const homeData = await movieService.getHomeData();

        setTrendingMovies(homeData.trending.slice(0, 6));
        setTopRatedMovies(homeData.top_rated.slice(0, 6));
        setPopularMovies(homeData.popular.slice(0, 6));

        // Use hero_movies from backend or fallback to trending
        setHeroMovies(homeData.hero_movies || homeData.trending.slice(0, 3));

      } catch (error) {
        console.error('Error fetching movies:', error);
        // Fallback to empty arrays on error
        setTrendingMovies([]);
        setTopRatedMovies([]);
        setPopularMovies([]);
        setHeroMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Auto-slide dla hero carousel
  useEffect(() => {
    if (heroMovies.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroMovies.length);
      }, 6000);

      return () => clearInterval(interval);
    }
  }, [heroMovies]);

  const MovieCard = ({ movie, type = 'movie', onMovieSelect }) => (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.8)',
        borderRadius: '12px',
        padding: '0',
        border: '1px solid rgba(79, 70, 229, 0.2)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        height: '320px'
      }}
      onClick={() => onMovieSelect && onMovieSelect(movie)}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(79, 70, 229, 0.4)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Poster */}
      <div style={{
        height: '200px',
        backgroundImage: movie.poster ? `url(${movie.poster})` : 'none',
        background: !movie.poster ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '4rem',
        position: 'relative'
      }}>
        {!movie.poster && '🎬'}

        {/* Play Button Overlay */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'rgba(79, 70, 229, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: 'opacity 0.3s ease'
        }}
        className="play-overlay">
          <span style={{ color: 'white', fontSize: '24px' }}>▶️</span>
        </div>

        {/* Rating Badge */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '6px',
          padding: '4px 8px',
          color: '#fbbf24',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          ⭐ {movie.vote_average || movie.rating || 'N/A'}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '16px' }}>
        <h6 style={{
          color: '#e2e8f0',
          margin: '0 0 8px 0',
          fontSize: '16px',
          fontWeight: '600',
          lineHeight: '1.3'
        }}>
          {movie.title}
        </h6>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <span style={{
            color: '#94a3b8',
            fontSize: '13px'
          }}>
            {movie.year || (movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A')}
          </span>
          <div style={{
            background: 'rgba(79, 70, 229, 0.2)',
            borderRadius: '4px',
            padding: '2px 6px',
            color: '#a78bfa',
            fontSize: '11px'
          }}>
            {type === 'series' ? 'TV' : 'MOVIE'}
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          <button style={{
            flex: 1,
            background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
            border: 'none',
            borderRadius: '6px',
            padding: '8px',
            color: 'white',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            ▶️ Play
          </button>
          <button style={{
            background: 'rgba(79, 70, 229, 0.1)',
            border: '1px solid rgba(79, 70, 229, 0.3)',
            borderRadius: '6px',
            padding: '8px',
            color: '#a78bfa',
            fontSize: '12px',
            cursor: 'pointer'
          }}>
            + List
          </button>
        </div>
      </div>

      <style jsx>{`
        .movie-card:hover .play-overlay {
          opacity: 1;
        }
      `}</style>
    </div>
  );

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
      {/* Hero Carousel */}
      <section style={{
        height: '70vh',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '80px'
      }}>
        {heroMovies.map((movie, index) => (
          <div
            key={movie.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: movie.background ?
                `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${movie.background})` :
                'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <div className="container">
              <div className="row align-items-center" style={{ height: '100%' }}>
                <div className="col-md-6">
                  <div style={{
                    background: 'rgba(79, 70, 229, 0.1)',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    display: 'inline-block',
                    marginBottom: '16px'
                  }}>
                    <span style={{
                      color: '#a78bfa',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {movie.genres?.[0]?.name || 'Movie'} • {movie.year || (movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A')} • ⭐ {movie.vote_average || 'N/A'}
                    </span>
                  </div>

                  <h1 style={{
                    color: '#e2e8f0',
                    fontSize: '4rem',
                    fontWeight: '800',
                    marginBottom: '20px',
                    lineHeight: '1.1'
                  }}>
                    {movie.title}
                  </h1>

                  <p style={{
                    color: '#94a3b8',
                    fontSize: '18px',
                    lineHeight: '1.6',
                    marginBottom: '30px',
                    maxWidth: '500px'
                  }}>
                    {movie.overview || 'No description available.'}
                  </p>

                  <div style={{
                    display: 'flex',
                    gap: '16px'
                  }}>
                    <button style={{
                      background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '16px 32px',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'transform 0.3s ease'
                    }}
                    onClick={() => onMovieSelect && onMovieSelect(movie)}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                      ▶️ Watch Now
                    </button>

                    <button style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '12px',
                      padding: '16px 32px',
                      color: '#e2e8f0',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    >
                      ℹ️ More Info
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Indicators */}
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '12px'
        }}>
          {heroMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: index === currentSlide ? '40px' : '12px',
                height: '4px',
                borderRadius: '2px',
                border: 'none',
                background: index === currentSlide
                  ? 'linear-gradient(45deg, #4f46e5, #7c3aed)'
                  : 'rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </section>

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
                <MovieCard movie={movie} type="movie" onMovieSelect={onMovieSelect} />
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
                <MovieCard movie={movie} type="movie" onMovieSelect={onMovieSelect} />
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
                <MovieCard movie={movie} type="movie" onMovieSelect={onMovieSelect} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;