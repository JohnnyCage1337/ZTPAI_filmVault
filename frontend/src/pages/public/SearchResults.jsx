import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import movieService from '../../services/movieService';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = searchParams.get('q') || '';

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const results = await movieService.searchMovies(query);
        setMovies(results.results || []);
      } catch (err) {
        console.error('Search error:', err);
        setError('Wystąpił błąd podczas wyszukiwania');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, navigate]);

  const handleMovieSelect = (movie) => {
    navigate(`/movie/${movie.slug}`);
  };

  const MovieCard = ({ movie }) => (
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
      onClick={() => handleMovieSelect(movie)}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(79, 70, 229, 0.4)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
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
          ⭐ {movie.vote_average || 'N/A'}
        </div>
      </div>

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
            borderRadius: '6px',
            padding: '2px 8px',
            color: '#a78bfa',
            fontSize: '11px',
            fontWeight: '500'
          }}>
            {movie.genres?.[0]?.name || 'Movie'}
          </div>
        </div>

        <p style={{
          color: '#94a3b8',
          fontSize: '12px',
          lineHeight: '1.4',
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {movie.overview || 'Brak opisu'}
        </p>
      </div>
    </div>
  );

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
          <p>Wyszukiwanie filmów...</p>
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
        <div style={{
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h1 style={{
            color: '#e2e8f0',
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '16px'
          }}>
            Wyniki wyszukiwania
          </h1>
          <p style={{
            color: '#94a3b8',
            fontSize: '18px',
            margin: 0
          }}>
            {error ? error : `Znaleziono ${movies.length} filmów dla "${query}"`}
          </p>
        </div>

        {!error && movies.length > 0 && (
          <div className="row">
            {movies.map(movie => (
              <div key={movie.id} className="col-lg-2 col-md-3 col-sm-4 col-6 mb-4">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}

        {!error && movies.length === 0 && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '16px',
            padding: '60px',
            textAlign: 'center',
            border: '1px solid rgba(79, 70, 229, 0.2)'
          }}>
            <span style={{ fontSize: '4rem', marginBottom: '20px', display: 'block' }}>🔍</span>
            <h3 style={{ color: '#e2e8f0', marginBottom: '16px' }}>
              Brak wyników
            </h3>
            <p style={{ color: '#94a3b8', margin: 0 }}>
              Nie znaleziono filmów pasujących do wyszukiwania "{query}"
            </p>
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(220, 38, 38, 0.1)',
            borderRadius: '16px',
            padding: '60px',
            textAlign: 'center',
            border: '1px solid rgba(220, 38, 38, 0.2)'
          }}>
            <span style={{ fontSize: '4rem', marginBottom: '20px', display: 'block' }}>⚠️</span>
            <h3 style={{ color: '#ef4444', marginBottom: '16px' }}>
              Wystąpił błąd
            </h3>
            <p style={{ color: '#94a3b8', margin: 0 }}>
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;