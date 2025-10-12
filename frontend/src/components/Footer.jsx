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
        <div className="row justify-content-center">
          {/* Logo & Description */}
          <div className="col-md-6 text-center mb-4">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
              justifyContent: 'center'
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
              gap: '12px',
              justifyContent: 'center'
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