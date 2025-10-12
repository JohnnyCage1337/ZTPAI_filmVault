import React, { useState, useEffect } from 'react';

const Navbar = ({ user, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: isScrolled
        ? 'rgba(15, 23, 42, 0.95)'
        : 'linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, transparent 100%)',
      backdropFilter: isScrolled ? 'blur(20px)' : 'none',
      transition: 'all 0.3s ease',
      padding: '12px 0',
      borderBottom: isScrolled ? '1px solid rgba(79, 70, 229, 0.2)' : 'none'
    }}>
      <div className="container">
        <div className="row align-items-center">
          {/* Logo */}
          <div className="col-md-3">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{
                fontSize: '2rem',
                filter: 'drop-shadow(0 0 10px rgba(79, 70, 229, 0.8))'
              }}>
                🎬
              </span>
              <h1 style={{
                margin: 0,
                fontSize: '1.8rem',
                fontWeight: '700',
                background: 'linear-gradient(45deg, #e2e8f0, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
              }}>
                FilmVault
              </h1>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="col-md-6">
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '30px',
              listStyle: 'none',
              margin: 0,
              padding: 0
            }}>
              {[
                { name: 'Home', icon: '🏠' },
                { name: 'Movies', icon: '🎭' },
                { name: 'TV Shows', icon: '📺' },
                { name: 'Genres', icon: '🎪' },
                { name: 'My List', icon: '📝' }
              ].map((item) => (
                <button
                  key={item.name}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#e2e8f0',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(79, 70, 229, 0.2)';
                    e.target.style.color = '#c7d2fe';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'none';
                    e.target.style.color = '#e2e8f0';
                  }}
                >
                  <span style={{ fontSize: '14px' }}>{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="col-md-3">
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '15px'
            }}>
              {/* Search */}
              <button style={{
                background: 'rgba(79, 70, 229, 0.1)',
                border: '1px solid rgba(79, 70, 229, 0.3)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                color: '#a78bfa',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}>
                🔍
              </button>

              {/* Notifications */}
              <button style={{
                background: 'rgba(79, 70, 229, 0.1)',
                border: '1px solid rgba(79, 70, 229, 0.3)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                color: '#a78bfa',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}>
                🔔
              </button>

              {/* User Profile */}
              {user ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span style={{
                    color: '#e2e8f0',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {user.username}
                  </span>
                  <button
                    onClick={onLogout}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      color: '#f87171',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button style={{
                  background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;