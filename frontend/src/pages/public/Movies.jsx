import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../../components/MovieCard';
import { useMultipleWatchlist } from '../../hooks/useWatchlist';

const Movies = ({ onMovieSelect, user }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const moviesPerPage = 24; // 6x4 grid
  const currentGenre = searchParams.get('genre');

  // Watchlist management
  const { watchlistStatus, toggleWatchlist } = useMultipleWatchlist(movies, user);

  useEffect(() => {
    const page = parseInt(searchParams.get('page')) || 1;
    const genre = searchParams.get('genre');
    setCurrentPage(page);
    fetchMovies(page, genre);
  }, [searchParams]);

  const fetchMovies = async (page = 1, genreSlug = null) => {
    try {
      setLoading(true);
      setError(null);

      // Build URL with pagination and optional genre filter
      let url = `http://localhost:8000/api/v1/movies/?page=${page}&page_size=${moviesPerPage}`;
      if (genreSlug) {
        url += `&genres=${genreSlug}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      // Handle both paginated and non-paginated responses
      if (data.results) {
        // Paginated response
        setMovies(data.results);
        setTotalCount(data.count);
        setTotalPages(Math.ceil(data.count / moviesPerPage));
      } else if (Array.isArray(data)) {
        // Non-paginated response - create pagination manually
        const startIndex = (page - 1) * moviesPerPage;
        const endIndex = startIndex + moviesPerPage;
        const paginatedMovies = data.slice(startIndex, endIndex);

        setMovies(paginatedMovies);
        setTotalCount(data.length);
        setTotalPages(Math.ceil(data.length / moviesPerPage));
      }
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to load movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ page: newPage.toString() });
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 7;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pageNumbers.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          style={{
            padding: '8px 12px',
            margin: '0 4px',
            background: 'rgba(79, 70, 229, 0.1)',
            border: '1px solid rgba(79, 70, 229, 0.3)',
            borderRadius: '6px',
            color: '#a78bfa',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ←
        </button>
      );
    }

    // First page if not visible
    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          style={{
            padding: '8px 12px',
            margin: '0 4px',
            background: 'rgba(79, 70, 229, 0.1)',
            border: '1px solid rgba(79, 70, 229, 0.3)',
            borderRadius: '6px',
            color: '#a78bfa',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          1
        </button>
      );

      if (startPage > 2) {
        pageNumbers.push(
          <span key="ellipsis1" style={{ margin: '0 8px', color: '#64748b' }}>
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          style={{
            padding: '8px 12px',
            margin: '0 4px',
            background: i === currentPage ? '#4f46e5' : 'rgba(79, 70, 229, 0.1)',
            border: '1px solid rgba(79, 70, 229, 0.3)',
            borderRadius: '6px',
            color: i === currentPage ? 'white' : '#a78bfa',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: i === currentPage ? '600' : '400'
          }}
        >
          {i}
        </button>
      );
    }

    // Last page if not visible
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="ellipsis2" style={{ margin: '0 8px', color: '#64748b' }}>
            ...
          </span>
        );
      }

      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          style={{
            padding: '8px 12px',
            margin: '0 4px',
            background: 'rgba(79, 70, 229, 0.1)',
            border: '1px solid rgba(79, 70, 229, 0.3)',
            borderRadius: '6px',
            color: '#a78bfa',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pageNumbers.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          style={{
            padding: '8px 12px',
            margin: '0 4px',
            background: 'rgba(79, 70, 229, 0.1)',
            border: '1px solid rgba(79, 70, 229, 0.3)',
            borderRadius: '6px',
            color: '#a78bfa',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          →
        </button>
      );
    }

    return pageNumbers;
  };

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0a0015 0%, #1a0828 25%, #2d1b42 50%, #1f2937 75%, #111827 100%)',
        minHeight: '100vh',
        paddingTop: '80px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          border: '1px solid rgba(79, 70, 229, 0.2)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(79, 70, 229, 0.3)',
            borderTop: '3px solid #4f46e5',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#e2e8f0', margin: 0 }}>Loading movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0a0015 0%, #1a0828 25%, #2d1b42 50%, #1f2937 75%, #111827 100%)',
        minHeight: '100vh',
        paddingTop: '80px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }}>
          <p style={{ color: '#f87171', fontSize: '18px', margin: 0 }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a0015 0%, #1a0828 25%, #2d1b42 50%, #1f2937 75%, #111827 100%)',
      minHeight: '100vh',
      paddingTop: '80px'
    }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{
            color: '#e2e8f0',
            fontSize: '3rem',
            fontWeight: '700',
            marginBottom: '16px',
            background: 'linear-gradient(45deg, #e2e8f0, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🎬 {currentGenre ? `${currentGenre.charAt(0).toUpperCase() + currentGenre.slice(1).replace('-', ' ')} Movies` : 'All Movies'}
          </h1>
          <p style={{
            color: '#94a3b8',
            fontSize: '1.2rem',
            margin: 0
          }}>
            {currentGenre ? `Discover amazing ${currentGenre.replace('-', ' ')} movies` : 'Discover amazing movies from our collection'}
          </p>

          {/* Results info */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '12px',
            padding: '16px',
            marginTop: '24px',
            border: '1px solid rgba(79, 70, 229, 0.2)'
          }}>
            <p style={{
              color: '#a78bfa',
              fontSize: '16px',
              margin: 0
            }}>
              Showing {((currentPage - 1) * moviesPerPage) + 1}-{Math.min(currentPage * moviesPerPage, totalCount)} of {totalCount} movies
            </p>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="row" style={{ marginBottom: '60px' }}>
          {movies.map((movie) => (
            <div key={movie.id} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-4">
              <MovieCard
                movie={movie}
                onMovieSelect={onMovieSelect}
                showWatchlistButton={!!user}
                user={user}
                onWatchlistToggle={toggleWatchlist}
                isInWatchlist={watchlistStatus[movie.slug] || false}
              />
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '40px',
            flexWrap: 'wrap'
          }}>
            {renderPagination()}
          </div>
        )}

        {/* Page info */}
        {totalPages > 1 && (
          <div style={{
            textAlign: 'center',
            marginTop: '20px'
          }}>
            <p style={{
              color: '#64748b',
              fontSize: '14px',
              margin: 0
            }}>
              Page {currentPage} of {totalPages}
            </p>
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

export default Movies;