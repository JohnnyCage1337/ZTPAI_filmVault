import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GenreCard = ({ genre, onGenreClick }) => {
  const getGenreEmoji = (genreName) => {
    const emojiMap = {
      'Action': '💥',
      'Adventure': '🗺️',
      'Animation': '🎨',
      'Comedy': '😂',
      'Crime': '🔫',
      'Documentary': '📽️',
      'Drama': '🎭',
      'Family': '👨‍👩‍👧‍👦',
      'Fantasy': '🧙‍♂️',
      'History': '⏳',
      'Horror': '👻',
      'Music': '🎵',
      'Mystery': '🕵️‍♂️',
      'Romance': '💕',
      'Science Fiction': '🚀',
      'Thriller': '😰',
      'War': '⚔️',
      'Western': '🤠'
    };
    return emojiMap[genreName] || '🎬';
  };

  const getGenreColor = (genreName) => {
    const colorMap = {
      'Action': 'linear-gradient(135deg, #ef4444, #dc2626)',
      'Adventure': 'linear-gradient(135deg, #10b981, #059669)',
      'Animation': 'linear-gradient(135deg, #f59e0b, #d97706)',
      'Comedy': 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      'Crime': 'linear-gradient(135deg, #6b7280, #4b5563)',
      'Documentary': 'linear-gradient(135deg, #0ea5e9, #0284c7)',
      'Drama': 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      'Family': 'linear-gradient(135deg, #06b6d4, #0891b2)',
      'Fantasy': 'linear-gradient(135deg, #a855f7, #9333ea)',
      'History': 'linear-gradient(135deg, #92400e, #78350f)',
      'Horror': 'linear-gradient(135deg, #1f2937, #111827)',
      'Music': 'linear-gradient(135deg, #ec4899, #db2777)',
      'Mystery': 'linear-gradient(135deg, #374151, #1f2937)',
      'Romance': 'linear-gradient(135deg, #f472b6, #ec4899)',
      'Science Fiction': 'linear-gradient(135deg, #3b82f6, #2563eb)',
      'Thriller': 'linear-gradient(135deg, #dc2626, #b91c1c)',
      'War': 'linear-gradient(135deg, #7f1d1d, #991b1b)',
      'Western': 'linear-gradient(135deg, #a16207, #92400e)'
    };
    return colorMap[genreName] || 'linear-gradient(135deg, #4f46e5, #7c3aed)';
  };

  return (
    <div
      onClick={() => onGenreClick(genre)}
      style={{
        background: getGenreColor(genre.name),
        borderRadius: '16px',
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Background pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }}></div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '16px',
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
        }}>
          {getGenreEmoji(genre.name)}
        </div>

        <h3 style={{
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: '700',
          margin: '0 0 8px 0',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          {genre.name}
        </h3>

        <p style={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '14px',
          margin: 0,
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
        }}>
          Explore {genre.name.toLowerCase()} movies
        </p>
      </div>
    </div>
  );
};

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8000/api/v1/genres/');

      if (!response.ok) {
        throw new Error('Failed to fetch genres');
      }

      const data = await response.json();
      setGenres(data);
    } catch (err) {
      console.error('Error fetching genres:', err);
      setError('Failed to load genres. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenreClick = (genre) => {
    // Navigate to movies page with genre filter
    navigate(`/movies?genre=${genre.slug}`);
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
          <p style={{ color: '#e2e8f0', margin: 0 }}>Loading genres...</p>
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
        <div style={{ marginBottom: '50px', textAlign: 'center' }}>
          <h1 style={{
            color: '#e2e8f0',
            fontSize: '3.5rem',
            fontWeight: '700',
            marginBottom: '20px',
            background: 'linear-gradient(45deg, #e2e8f0, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
          }}>
            🎪 Movie Genres
          </h1>
          <p style={{
            color: '#94a3b8',
            fontSize: '1.3rem',
            margin: '0 0 30px 0',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.6'
          }}>
            Explore movies by genre and find your next favorite film
          </p>

          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '12px',
            padding: '16px',
            marginTop: '24px',
            border: '1px solid rgba(79, 70, 229, 0.2)',
            display: 'inline-block'
          }}>
            <p style={{
              color: '#a78bfa',
              fontSize: '16px',
              margin: 0
            }}>
              {genres.length} genres available
            </p>
          </div>
        </div>

        {/* Genres Grid */}
        <div className="row">
          {genres.map((genre) => (
            <div key={genre.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4">
              <GenreCard
                genre={genre}
                onGenreClick={handleGenreClick}
              />
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          borderRadius: '16px',
          padding: '30px',
          marginTop: '50px',
          border: '1px solid rgba(79, 70, 229, 0.2)',
          textAlign: 'center'
        }}>
          <h3 style={{
            color: '#e2e8f0',
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '16px'
          }}>
            🎬 Discover Amazing Movies
          </h3>
          <p style={{
            color: '#94a3b8',
            fontSize: '16px',
            margin: 0,
            lineHeight: '1.6'
          }}>
            Click on any genre to explore movies in that category. Each genre offers a unique cinematic experience
            with carefully curated collections of the best films.
          </p>
        </div>
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

export default Genres;