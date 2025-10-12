import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import movieService from '../../services/movieService';

const MovieDetail = ({ onBack }) => {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);

        // Używamy slug z URL parametrów
        const movieData = await movieService.getMovieDetails(slug);
        setMovie(movieData);

        // Sprawdź czy użytkownik ocenił film (tylko jeśli zalogowany)
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const rating = await movieService.getUserRating(slug);
            setUserRating(rating.rating || 0);
          } catch {
            // Użytkownik nie ocenił filmu
            setUserRating(0);
          }

          try {
            const watchlistStatus = await movieService.checkWatchlistStatus(slug);
            setIsInWatchlist(watchlistStatus.in_watchlist);
          } catch {
            setIsInWatchlist(false);
          }
        }

      } catch (error) {
        console.error('Error fetching movie details:', error);
        setMovie(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchMovieDetails();
    }
  }, [slug]);

  const handleRating = async (rating) => {
    try {
      setUserRating(rating);
      await movieService.rateMovie(slug, rating);
    } catch (error) {
      console.error('Error rating movie:', error);
      // Można dodać toast notification o błędzie
    }
  };

  const toggleWatchlist = async () => {
    try {
      const newStatus = !isInWatchlist;
      setIsInWatchlist(newStatus);
      await movieService.toggleWatchlist(slug, newStatus);
    } catch (error) {
      console.error('Error updating watchlist:', error);
      // Przywróć poprzedni stan w przypadku błędu
      setIsInWatchlist(!isInWatchlist);
    }
  };

  const StarRating = ({ rating, onRate, readonly = false }) => {
    return (
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <span
            key={star}
            style={{
              fontSize: readonly ? '16px' : '24px',
              color: star <= rating ? '#fbbf24' : '#374151',
              cursor: readonly ? 'default' : 'pointer',
              transition: 'color 0.2s ease'
            }}
            onClick={() => !readonly && onRate && onRate(star)}
            onMouseOver={(e) => !readonly && (e.target.style.color = '#fbbf24')}
            onMouseOut={(e) => !readonly && star > rating && (e.target.style.color = '#374151')}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0a0015 0%, #1a0828 25%, #2d1b42 50%, #1f2937 75%, #111827 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        paddingTop: '80px'
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
          <h3>Loading movie details...</h3>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0a0015 0%, #1a0828 25%, #2d1b42 50%, #1f2937 75%, #111827 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        paddingTop: '80px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h3>Movie not found</h3>
          <button
            onClick={onBack}
            style={{
              background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              color: 'white',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a0015 0%, #1a0828 25%, #2d1b42 50%, #1f2937 75%, #111827 100%)',
      minHeight: '100vh',
      color: 'white',
      paddingTop: '80px'
    }}>
      {/* Back Button */}
      <div className="container" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(79, 70, 229, 0.3)',
            borderRadius: '12px',
            padding: '12px 24px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            marginBottom: '40px'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(79, 70, 229, 0.2)';
            e.target.style.transform = 'translateX(-4px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(15, 23, 42, 0.8)';
            e.target.style.transform = 'translateX(0)';
          }}
        >
          ← Back to Home
        </button>
      </div>

      {/* Hero Section */}
      <div style={{
        background: movie.background ?
          `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${movie.background})` :
          'linear-gradient(135deg, #1a0b2e 0%, #2d1b42 50%, #4a3b5c 100%)',
        minHeight: '500px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-4">
              <div style={{
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                borderRadius: '16px',
                padding: '40px',
                textAlign: 'center',
                fontSize: '6rem',
                border: '3px solid rgba(255, 255, 255, 0.2)'
              }}>
                {movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '15px'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#374151',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '60px'
                  }}>
                    🎬
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-8">
              <h1 style={{ fontSize: '3rem', marginBottom: '16px', fontWeight: 'bold' }}>
                {movie.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StarRating rating={Math.floor(movie.vote_average)} readonly={true} />
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{movie.vote_average}/10</span>
                </div>
                <span style={{
                  background: 'rgba(79, 70, 229, 0.3)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '14px'
                }}>
                  {movie.year}
                </span>
                <span style={{
                  background: 'rgba(79, 70, 229, 0.3)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '14px'
                }}>
                  {movie.runtime} min
                </span>
              </div>

              <div style={{ marginBottom: '20px' }}>
                {movie.genres && movie.genres.map((g, index) => (
                  <span
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      marginRight: '8px',
                      display: 'inline-block',
                      marginBottom: '8px'
                    }}
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              <p style={{
                fontSize: '18px',
                lineHeight: '1.6',
                color: '#e2e8f0',
                marginBottom: '30px'
              }}>
                {movie.overview}
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
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
                  gap: '8px'
                }}>
                  ▶️ Watch Now
                </button>

                <button
                  onClick={toggleWatchlist}
                  style={{
                    background: isInWatchlist ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    border: `1px solid ${isInWatchlist ? '#22c55e' : 'rgba(255, 255, 255, 0.3)'}`,
                    borderRadius: '12px',
                    padding: '16px 32px',
                    color: isInWatchlist ? '#22c55e' : '#e2e8f0',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {isInWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>

        {/* Your Rating */}
        <section style={{ marginBottom: '60px' }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            ⭐ Your Rating
          </h3>
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '16px',
            padding: '30px',
            border: '1px solid rgba(79, 70, 229, 0.2)'
          }}>
            <p style={{ marginBottom: '20px', color: '#94a3b8' }}>Rate this movie:</p>
            <StarRating rating={userRating} onRate={handleRating} />
            <p style={{ marginTop: '10px', color: '#e2e8f0' }}>
              Your rating: {userRating}/10
            </p>
          </div>
        </section>

        {/* Movie Info Grid */}
        <div className="row" style={{ marginBottom: '60px' }}>
          <div className="col-md-6">
            <section style={{
              background: 'rgba(15, 23, 42, 0.8)',
              borderRadius: '16px',
              padding: '30px',
              border: '1px solid rgba(79, 70, 229, 0.2)',
              height: '100%'
            }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                🎬 Movie Details
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(79, 70, 229, 0.1)', paddingBottom: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>Director:</span>
                  <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{movie.director?.name || 'N/A'}</span>
                </div>
                {movie.writers && movie.writers.length > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(79, 70, 229, 0.1)', paddingBottom: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Writers:</span>
                    <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{movie.writers.map(w => w.name).join(', ')}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(79, 70, 229, 0.1)', paddingBottom: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>Runtime:</span>
                  <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{movie.runtime} minutes</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(79, 70, 229, 0.1)', paddingBottom: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>Release Year:</span>
                  <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{movie.year}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(79, 70, 229, 0.1)', paddingBottom: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>Language:</span>
                  <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{movie.language}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(79, 70, 229, 0.1)', paddingBottom: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>Country:</span>
                  <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{movie.country}</span>
                </div>
                {movie.budget && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(79, 70, 229, 0.1)', paddingBottom: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Budget:</span>
                    <span style={{ color: '#e2e8f0', fontWeight: '500' }}>${movie.budget?.toLocaleString() || 'N/A'}</span>
                  </div>
                )}
                {movie.revenue && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Box Office:</span>
                    <span style={{ color: '#e2e8f0', fontWeight: '500' }}>${movie.revenue.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="col-md-6">
            <section style={{
              background: 'rgba(15, 23, 42, 0.8)',
              borderRadius: '16px',
              padding: '30px',
              border: '1px solid rgba(79, 70, 229, 0.2)',
              height: '100%'
            }}>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                🏆 Awards & Recognition
              </h3>
              {movie.awards && movie.awards.length > 0 ? (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {movie.awards.map((award, index) => (
                    <div key={index} style={{
                      background: 'rgba(79, 70, 229, 0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                      border: '1px solid rgba(79, 70, 229, 0.2)'
                    }}>
                      <span style={{ color: '#e2e8f0', fontWeight: '500' }}>🏆 {award}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#94a3b8' }}>No awards information available.</p>
              )}

              {movie.productionCompanies && (
                <div style={{ marginTop: '30px' }}>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#e2e8f0' }}>
                    Production Companies
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {movie.productionCompanies.map((company, index) => (
                      <span
                        key={index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          color: '#e2e8f0'
                        }}
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Cast & Crew */}
        {movie.cast && movie.cast.length > 0 && (
          <section style={{ marginBottom: '60px' }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              👥 Cast & Crew
            </h3>
            <div className="row">
              {movie.cast.map((person, index) => (
                <div key={index} className="col-md-4 col-lg-3 mb-4">
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(79, 70, 229, 0.2)',
                    textAlign: 'center',
                    transition: 'transform 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{
                      fontSize: '3rem',
                      marginBottom: '12px'
                    }}>
                      {person.person?.avatar ? (
                        <img
                          src={person.person.avatar}
                          alt={person.person.name}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '50%'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '60px',
                          height: '60px',
                          backgroundColor: '#4f46e5',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          color: 'white'
                        }}>
                          {person.person?.name ? person.person.name.charAt(0) : '👤'}
                        </div>
                      )}
                    </div>
                    <h5 style={{ color: '#e2e8f0', marginBottom: '8px', fontSize: '1.1rem' }}>
                      {person.person?.name}
                    </h5>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                      {person.character_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trivia */}
        {movie.trivia && movie.trivia.length > 0 && (
          <section style={{ marginBottom: '60px' }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              🎯 Did You Know?
            </h3>
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              borderRadius: '16px',
              padding: '30px',
              border: '1px solid rgba(79, 70, 229, 0.2)'
            }}>
              {movie.trivia.map((fact, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginBottom: index < movie.trivia.length - 1 ? '20px' : '0',
                  padding: '15px',
                  background: 'rgba(79, 70, 229, 0.05)',
                  borderRadius: '8px',
                  borderLeft: '4px solid #4f46e5'
                }}>
                  <span style={{ color: '#4f46e5', fontSize: '1.2rem', marginTop: '2px' }}>💡</span>
                  <p style={{ color: '#e2e8f0', margin: 0, lineHeight: '1.5' }}>{fact}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Movies */}
        {movie.relatedMovies && movie.relatedMovies.length > 0 && (
          <section>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              🎬 Related Movies
            </h3>
            <div className="row">
              {movie.relatedMovies.map((relatedMovie, index) => (
                <div key={index} className="col-md-6 col-lg-4 mb-4">
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(79, 70, 229, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(79, 70, 229, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}>
                      <div style={{
                        fontSize: '2.5rem',
                        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                        borderRadius: '8px',
                        padding: '12px',
                        minWidth: '70px',
                        textAlign: 'center'
                      }}>
                        {relatedMovie.poster}
                      </div>
                      <div>
                        <h5 style={{ color: '#e2e8f0', marginBottom: '8px' }}>
                          {relatedMovie.title}
                        </h5>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <StarRating rating={Math.floor(relatedMovie.rating)} readonly={true} />
                          <span style={{ color: '#94a3b8', fontSize: '14px' }}>
                            {relatedMovie.rating}/10
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
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

export default MovieDetail;