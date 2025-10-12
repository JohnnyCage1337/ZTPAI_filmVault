import React, { useState, useEffect } from 'react';

// Mock movie data - poza komponentem żeby uniknąć problemów z React Hook dependencies
const MOCK_MOVIE_DETAILS = {
  1: {
    id: 1,
    title: "The Batman",
    originalTitle: "The Batman",
    description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
    fullDescription: "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler. As the evidence begins to lead closer to home and the scale of the perpetrator's plans become clear, Batman must forge new relationships, unmask the culprit, and bring justice to the abuse of power and corruption that has long plagued Gotham City.",
    poster: "🦇",
    backdrop: "linear-gradient(135deg, #1a0b2e 0%, #2d1b42 50%, #4a3b5c 100%)",
    rating: 8.2,
    year: 2022,
    runtime: 176,
    genre: ["Action", "Crime", "Drama"],
    director: "Matt Reeves",
    writers: ["Matt Reeves", "Peter Craig"],
    cast: [
      { name: "Robert Pattinson", character: "Bruce Wayne / Batman", photo: "🦇" },
      { name: "Zoë Kravitz", character: "Selina Kyle / Catwoman", photo: "🐱" },
      { name: "Paul Dano", character: "Edward Nashton / The Riddler", photo: "❓" },
      { name: "Jeffrey Wright", character: "James Gordon", photo: "👮" },
      { name: "John Turturro", character: "Carmine Falcone", photo: "👔" },
      { name: "Andy Serkis", character: "Alfred Pennyworth", photo: "🎩" }
    ],
    budget: "$185,000,000",
    boxOffice: "$771,000,000",
    language: "English",
    country: "USA",
    productionCompanies: ["Warner Bros.", "DC Films"],
    awards: ["Saturn Award Winner", "Critics Choice Nominee"],
    trivia: [
      "Robert Pattinson performed many of his own stunts",
      "The Batmobile was built as a fully functional car",
      "Filmed in Chicago and Liverpool doubling for Gotham",
      "Michael Giacchino composed a noir-influenced score"
    ],
    relatedMovies: [
      { id: 2, title: "Batman Begins", poster: "🦇", rating: 8.2 },
      { id: 3, title: "The Dark Knight", poster: "🃏", rating: 9.0 },
      { id: 4, title: "Joker", poster: "🤡", rating: 8.4 }
    ]
  },
  2: {
    id: 2,
    title: "Top Gun: Maverick",
    originalTitle: "Top Gun: Maverick",
    description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.",
    poster: "✈️",
    backdrop: "linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #0ea5e9 100%)",
    rating: 8.8,
    year: 2022,
    runtime: 131,
    genre: ["Action", "Drama"],
    director: "Joseph Kosinski",
    cast: [
      { name: "Tom Cruise", character: "Pete 'Maverick' Mitchell", photo: "✈️" },
      { name: "Miles Teller", character: "Bradley 'Rooster' Bradshaw", photo: "🐓" }
    ]
  },
  3: {
    id: 3,
    title: "Everything Everywhere All at Once",
    originalTitle: "Everything Everywhere All at Once",
    description: "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have lived.",
    poster: "🌀",
    backdrop: "linear-gradient(135deg, #ec4899 0%, #f97316 50%, #facc15 100%)",
    rating: 8.9,
    year: 2022,
    runtime: 139,
    genre: ["Action", "Adventure", "Comedy"],
    director: "Daniels",
    cast: [
      { name: "Michelle Yeoh", character: "Evelyn Quan Wang", photo: "👸" },
      { name: "Stephanie Hsu", character: "Joy Wang / Jobu Tupaki", photo: "🌟" }
    ]
  }
};

const MovieDetail = ({ movieId, onBack }) => {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    // Symulacja ładowania danych filmu
    setIsLoading(true);
    setTimeout(() => {
      const movieData = MOCK_MOVIE_DETAILS[movieId];
      setMovie(movieData || null);
      setIsLoading(false);
    }, 1000);

    // Symulacja sprawdzenia czy film jest w watchlist
    setIsInWatchlist(Math.random() > 0.5);
    setUserRating(Math.floor(Math.random() * 10) + 1);
  }, [movieId]);

  const handleRating = (rating) => {
    setUserRating(rating);
    // Tutaj dodać API call do zapisania oceny
  };

  const toggleWatchlist = () => {
    setIsInWatchlist(!isInWatchlist);
    // Tutaj dodać API call do dodania/usunięcia z watchlist
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
        background: movie.backdrop,
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
                {movie.poster}
              </div>
            </div>
            <div className="col-md-8">
              <h1 style={{ fontSize: '3rem', marginBottom: '16px', fontWeight: 'bold' }}>
                {movie.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StarRating rating={Math.floor(movie.rating)} readonly={true} />
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{movie.rating}/10</span>
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
                {movie.genre.map((g, index) => (
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
                    {g}
                  </span>
                ))}
              </div>

              <p style={{
                fontSize: '18px',
                lineHeight: '1.6',
                color: '#e2e8f0',
                marginBottom: '30px'
              }}>
                {movie.fullDescription || movie.description}
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
                  <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{movie.director}</span>
                </div>
                {movie.writers && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(79, 70, 229, 0.1)', paddingBottom: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Writers:</span>
                    <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{movie.writers.join(', ')}</span>
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
                    <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{movie.budget}</span>
                  </div>
                )}
                {movie.boxOffice && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Box Office:</span>
                    <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{movie.boxOffice}</span>
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
                      {person.photo}
                    </div>
                    <h5 style={{ color: '#e2e8f0', marginBottom: '8px', fontSize: '1.1rem' }}>
                      {person.name}
                    </h5>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                      {person.character}
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