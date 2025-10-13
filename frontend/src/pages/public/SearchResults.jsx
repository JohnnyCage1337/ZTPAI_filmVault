import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import movieService from '../../services/movieService';
import MovieCard from '../../components/MovieCard';
import { useMultipleWatchlist } from '../../hooks/useWatchlist';

const SearchResults = ({ user }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = searchParams.get('q') || '';
  const selectedGenre = searchParams.get('genre') || '';
  const sortBy = searchParams.get('sort') || 'relevance';

  const { watchlistStatus, toggleWatchlist } = useMultipleWatchlist(filteredMovies, user);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await movieService.getGenres();
        setGenres(genresData);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    let filtered = [...movies];

    // Only apply sorting (genre filtering now handled by API)
    switch (sortBy) {
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'year':
        filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (parseFloat(b.vote_average) || 0) - (parseFloat(a.vote_average) || 0));
        break;
      default:
        break;
    }

    setFilteredMovies(filtered);
  }, [movies, sortBy]);

  const handleGenreChange = (genreSlug) => {
    const newParams = new URLSearchParams(searchParams);
    if (genreSlug) {
      newParams.set('genre', genreSlug);
    } else {
      newParams.delete('genre');
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (sortOption) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', sortOption);
    setSearchParams(newParams);
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim() && !selectedGenre) {
        navigate('/');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const results = await movieService.searchMovies(query, selectedGenre);
        setMovies(results.results || []);
      } catch (err) {
        console.error('Search error:', err);
        setError('Wystąpił błąd podczas wyszukiwania');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, selectedGenre, navigate]);

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
            {error ? error : `Znaleziono ${filteredMovies.length} filmów${query ? ` dla "${query}"` : ''}${selectedGenre ? ` w gatunku "${genres.find(g => g.slug === selectedGenre)?.name || selectedGenre}"` : ''}`}
          </p>
        </div>

        {/* Filters */}
        {!error && movies.length > 0 && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
            border: '1px solid rgba(79, 70, 229, 0.2)'
          }}>
            <div className="row align-items-center">
              <div className="col-md-6 mb-3 mb-md-0">
                <label style={{ color: '#e2e8f0', marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: '500' }}>
                  Filtruj po gatunku:
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => handleGenreChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(79, 70, 229, 0.3)',
                    background: 'rgba(30, 41, 59, 0.8)',
                    color: '#e2e8f0',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Wszystkie gatunki</option>
                  {Array.isArray(genres) && genres.map(genre => (
                    <option key={genre.id} value={genre.slug}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label style={{ color: '#e2e8f0', marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: '500' }}>
                  Sortuj według:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(79, 70, 229, 0.3)',
                    background: 'rgba(30, 41, 59, 0.8)',
                    color: '#e2e8f0',
                    fontSize: '14px'
                  }}
                >
                  <option value="relevance">Trafność</option>
                  <option value="title">Tytuł (A-Z)</option>
                  <option value="year">Rok (najnowsze)</option>
                  <option value="rating">Ocena (najwyższa)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {!error && filteredMovies.length > 0 && (
          <div className="row">
            {filteredMovies.map(movie => (
              <div key={movie.id} className="col-lg-2 col-md-3 col-sm-4 col-6 mb-4">
                <MovieCard
                  movie={movie}
                  onMovieSelect={() => navigate(`/movie/${movie.slug}`)}
                  showWatchlistButton={!!user}
                  user={user}
                  onWatchlistToggle={toggleWatchlist}
                  isInWatchlist={watchlistStatus[movie.slug] || false}
                />
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
              Nie znaleziono filmów{query ? ` pasujących do wyszukiwania "${query}"` : ''}{selectedGenre ? ` w gatunku "${genres.find(g => g.slug === selectedGenre)?.name || selectedGenre}"` : ''}
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