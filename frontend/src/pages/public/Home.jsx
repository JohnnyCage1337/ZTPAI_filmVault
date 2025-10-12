import React, { useState, useEffect } from 'react';

const Home = ({ onMovieSelect }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Sample movie data
  const heroMovies = [
    {
      id: 1,
      title: "Dune: Part Two",
      description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
      backdrop: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      rating: 8.5,
      year: 2024,
      genre: "Sci-Fi"
    },
    {
      id: 2,
      title: "Oppenheimer",
      description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
      backdrop: "linear-gradient(135deg, #2c1810 0%, #5d4037 50%, #8d6e63 100%)",
      rating: 8.7,
      year: 2023,
      genre: "Biography"
    },
    {
      id: 3,
      title: "Spider-Man: Into the Spider-Verse",
      description: "Teen Miles Morales becomes Spider-Man and must save the multiverse from collapsing.",
      backdrop: "linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #42a5f5 100%)",
      rating: 8.4,
      year: 2023,
      genre: "Animation"
    }
  ];

  const trendingMovies = [
    { id: 1, title: "The Batman", poster: "🦇", rating: 8.2, year: 2024 },
    { id: 2, title: "Top Gun: Maverick", poster: "✈️", rating: 8.8, year: 2024 },
    { id: 3, title: "Everything Everywhere", poster: "🌀", rating: 8.9, year: 2024 },
    { id: 4, title: "Avatar: The Way of Water", poster: "🌊", rating: 8.1, year: 2024 },
    { id: 5, title: "Black Panther", poster: "🐾", rating: 8.5, year: 2024 },
    { id: 6, title: "Doctor Strange", poster: "🔮", rating: 8.3, year: 2024 }
  ];

  const trendingSeries = [
    { id: 1, title: "House of the Dragon", poster: "🐉", rating: 8.7, seasons: 2 },
    { id: 2, title: "The Bear", poster: "👨‍🍳", rating: 9.1, seasons: 3 },
    { id: 3, title: "Wednesday", poster: "🕷️", rating: 8.3, seasons: 1 },
    { id: 4, title: "Stranger Things", poster: "👾", rating: 8.8, seasons: 4 },
    { id: 5, title: "The Crown", poster: "👑", rating: 8.9, seasons: 6 },
    { id: 6, title: "Better Call Saul", poster: "⚖️", rating: 9.2, seasons: 6 }
  ];

  const topRated = [
    { id: 1, title: "The Godfather", poster: "🍷", rating: 9.2, year: 1972 },
    { id: 2, title: "The Shawshank Redemption", poster: "🔒", rating: 9.3, year: 1994 },
    { id: 3, title: "Schindler's List", poster: "📜", rating: 9.0, year: 1993 },
    { id: 4, title: "The Dark Knight", poster: "🃏", rating: 9.0, year: 2008 },
    { id: 5, title: "Pulp Fiction", poster: "💼", rating: 8.9, year: 1994 },
    { id: 6, title: "Forrest Gump", poster: "🏃‍♂️", rating: 8.8, year: 1994 }
  ];

  useEffect(() => {
    // Initialize data loading
    setTimeout(() => setIsLoading(false), 1500);

    // Auto-slide dla hero carousel
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroMovies.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [heroMovies.length]); // Dodano heroMovies.length jako dependency

  const MovieCard = ({ movie, type = 'movie' }) => (
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
        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '4rem',
        position: 'relative'
      }}>
        {movie.poster}

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
          ⭐ {movie.rating}
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
            {type === 'series' ? `${movie.seasons} Seasons` : movie.year}
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
              background: movie.backdrop,
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
                      {movie.genre} • {movie.year} • ⭐ {movie.rating}
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
                    {movie.description}
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
                <MovieCard movie={movie} type="movie" />
              </div>
            ))}
          </div>
        </section>

        {/* Trending Series */}
        <section style={{ marginBottom: '80px' }}>
          <SectionTitle
            title="📺 Trending Series"
            subtitle="Binge-worthy shows you can't miss"
          />
          <div className="row">
            {trendingSeries.map((series) => (
              <div key={series.id} className="col-md-4 col-lg-2 mb-4">
                <MovieCard movie={series} type="series" />
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
            {topRated.map((movie) => (
              <div key={movie.id} className="col-md-4 col-lg-2 mb-4">
                <MovieCard movie={movie} type="movie" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;