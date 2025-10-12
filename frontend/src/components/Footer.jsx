import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.9) 20%, #0f172a 100%)',
      marginTop: '80px',
      padding: '60px 0 30px',
      borderTop: '1px solid rgba(79, 70, 229, 0.1)'
    }}>
      <div className="container">
        <div className="row">
          {/* Logo & Description */}
          <div className="col-md-4 mb-4">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <span style={{
                fontSize: '2rem',
                filter: 'drop-shadow(0 0 10px rgba(79, 70, 229, 0.8))'
              }}>
                🎬
              </span>
              <h3 style={{
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: '700',
                background: 'linear-gradient(45deg, #e2e8f0, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                FilmVault
              </h3>
            </div>
            <p style={{
              color: '#94a3b8',
              fontSize: '14px',
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              Your ultimate destination for discovering, rating, and organizing your favorite movies and TV shows.
              Join millions of film enthusiasts worldwide.
            </p>

            {/* Social Media */}
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              {[
                { icon: '📘', name: 'Facebook' },
                { icon: '🐦', name: 'Twitter' },
                { icon: '📷', name: 'Instagram' },
                { icon: '📺', name: 'YouTube' }
              ].map((social) => (
                <button
                  key={social.name}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(79, 70, 229, 0.1)',
                    border: '1px solid rgba(79, 70, 229, 0.2)',
                    color: '#a78bfa',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    fontSize: '16px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(79, 70, 229, 0.2)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(79, 70, 229, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                  title={social.name}
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-2 mb-4">
            <h5 style={{
              color: '#e2e8f0',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '20px'
            }}>
              Discover
            </h5>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {['Popular Movies', 'Top Rated', 'New Releases', 'Coming Soon', 'Trending'].map((link) => (
                <button
                  key={link}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    padding: '4px 0',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#c7d2fe'}
                  onMouseOut={(e) => e.target.style.color = '#94a3b8'}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* Genres */}
          <div className="col-md-2 mb-4">
            <h5 style={{
              color: '#e2e8f0',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '20px'
            }}>
              Genres
            </h5>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'].map((genre) => (
                <button
                  key={genre}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    padding: '4px 0',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#c7d2fe'}
                  onMouseOut={(e) => e.target.style.color = '#94a3b8'}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="col-md-2 mb-4">
            <h5 style={{
              color: '#e2e8f0',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '20px'
            }}>
              Support
            </h5>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service', 'API'].map((link) => (
                <button
                  key={link}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    padding: '4px 0',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#c7d2fe'}
                  onMouseOut={(e) => e.target.style.color = '#94a3b8'}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-md-2 mb-4">
            <h5 style={{
              color: '#e2e8f0',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '20px'
            }}>
              Stay Updated
            </h5>
            <p style={{
              color: '#94a3b8',
              fontSize: '13px',
              marginBottom: '15px'
            }}>
              Get notified about new movies and features
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid rgba(79, 70, 229, 0.3)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#e2e8f0',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
              <button style={{
                background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 12px',
                color: 'white',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(79, 70, 229, 0.1)',
          paddingTop: '30px',
          marginTop: '40px'
        }}>
          <div className="row align-items-center">
            <div className="col-md-6">
              <p style={{
                color: '#64748b',
                fontSize: '13px',
                margin: 0
              }}>
                © 2025 FilmVault. All rights reserved. Made with ❤️ for movie lovers.
              </p>
            </div>
            <div className="col-md-6">
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '20px'
              }}>
                <span style={{
                  color: '#64748b',
                  fontSize: '13px'
                }}>
                  🌟 Powered by TMDB API
                </span>
                <span style={{
                  color: '#64748b',
                  fontSize: '13px'
                }}>
                  🚀 Built with React & Django
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;