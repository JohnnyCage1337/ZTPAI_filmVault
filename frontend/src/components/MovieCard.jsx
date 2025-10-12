import React from 'react';

const MovieCard = ({ movie, type = 'movie', onMovieSelect, showWatchlistButton = false, user, onWatchlistToggle, isInWatchlist = false }) => {
  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    if (onWatchlistToggle) {
      onWatchlistToggle(movie);
    }
  };

  return (
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
        position: 'relative',
        overflow: 'hidden',
        background: !movie.poster ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.style.background = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
              e.target.parentElement.innerHTML += '<span style="color: white; font-size: 4rem;">🎬</span>';
            }}
          />
        ) : (
          <span style={{ color: 'white', fontSize: '4rem' }}>🎬</span>
        )}

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

        {/* Watchlist Button for logged-in users */}
        {showWatchlistButton && user && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px'
          }}>
            <button
              onClick={handleWatchlistClick}
              style={{
                background: isInWatchlist ? 'rgba(34, 197, 94, 0.9)' : 'rgba(0, 0, 0, 0.7)',
                border: 'none',
                borderRadius: '6px',
                padding: '6px',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              {isInWatchlist ? '❤️' : '🤍'}
            </button>
          </div>
        )}
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

        {/* Genres if available */}
        {movie.genres && movie.genres.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            marginTop: '8px'
          }}>
            {movie.genres.slice(0, 2).map((genre, index) => (
              <span
                key={index}
                style={{
                  background: 'rgba(79, 70, 229, 0.1)',
                  color: '#a78bfa',
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}
              >
                {genre.name || genre}
              </span>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .movie-card:hover .play-overlay {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default MovieCard;