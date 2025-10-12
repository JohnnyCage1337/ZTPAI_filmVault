import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const SearchInput = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Szukaj filmów..."
        style={{
          width: '300px',
          padding: '8px 40px 8px 16px',
          borderRadius: '20px',
          border: '1px solid rgba(79, 70, 229, 0.3)',
          background: 'rgba(15, 23, 42, 0.8)',
          color: '#e2e8f0',
          fontSize: '14px',
          outline: 'none',
          transition: 'all 0.3s ease'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#4f46e5';
          e.target.style.boxShadow = '0 0 0 2px rgba(79, 70, 229, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(79, 70, 229, 0.3)';
          e.target.style.boxShadow = 'none';
        }}
      />
      <button
        type="submit"
        style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(79, 70, 229, 0.2)',
          border: 'none',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          color: '#a78bfa',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px'
        }}
      >
        🔍
      </button>
    </form>
  );
};

const Navbar = ({ user, onLogout, onLogin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset > 50;
      console.log('Scroll position:', window.pageYOffset, 'Is scrolled:', scrolled);
      setIsScrolled(scrolled);
    };

    // Check initial scroll position
    handleScroll();

    // Add event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      // Close mobile menu on desktop resize
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      // Close mobile menu when clicking outside, but not on hamburger button or menu itself
      if (isMobileMenuOpen &&
          !event.target.closest('.mobile-menu-container') &&
          !event.target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigationItems = [
    { name: 'Home', icon: '🏠' },
    { name: 'Movies', icon: '🎭' },
    { name: 'Genres', icon: '🎪' },
    { name: 'My List', icon: '📝' }
  ];

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: isScrolled
          ? 'rgba(15, 23, 42, 0.95)'
          : 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.4) 50%, transparent 100%)',
        backdropFilter: isScrolled ? 'blur(20px)' : 'blur(5px)',
        WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'blur(5px)',
        transition: 'all 0.3s ease',
        padding: '12px 0',
        borderBottom: isScrolled ? '1px solid rgba(79, 70, 229, 0.3)' : 'none',
        boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.4)' : 'none'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }} className="mobile-logo">
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
            </Link>

            {/* Desktop Navigation */}
            <div style={{
              display: 'none',
              '@media (min-width: 768px)': {
                display: 'flex'
              }
            }} className="d-none d-md-flex">
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '30px',
                listStyle: 'none',
                margin: 0,
                padding: 0
              }}>
                {navigationItems.map((item) => (
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

            {/* Desktop User Menu */}
            <div className="d-none d-md-flex">
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '15px'
              }}>
                {/* Search Input */}
                <SearchInput />

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
                  <button
                    onClick={onLogin}
                    style={{
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

            {/* Mobile User Info & Menu Button */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }} className="d-md-none">
              {/* Mobile User Avatar */}
              {user && (
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="mobile-menu-button"
                style={{
                  background: 'rgba(79, 70, 229, 0.1)',
                  border: '1px solid rgba(79, 70, 229, 0.3)',
                  borderRadius: '8px',
                  width: '44px',
                  height: '44px',
                  color: '#a78bfa',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  transition: 'all 0.3s ease',
                  padding: '8px'
                }}
              >
                <div className="hamburger-line" style={{
                  width: '20px',
                  height: '2px',
                  background: 'currentColor',
                  borderRadius: '1px',
                  transform: isMobileMenuOpen ? 'rotate(45deg) translateY(7px)' : 'none',
                  transition: 'all 0.3s ease'
                }}></div>
                <div className="hamburger-line" style={{
                  width: '20px',
                  height: '2px',
                  background: 'currentColor',
                  borderRadius: '1px',
                  opacity: isMobileMenuOpen ? 0 : 1,
                  transition: 'all 0.3s ease'
                }}></div>
                <div className="hamburger-line" style={{
                  width: '20px',
                  height: '2px',
                  background: 'currentColor',
                  borderRadius: '1px',
                  transform: isMobileMenuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
                  transition: 'all 0.3s ease'
                }}></div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '76px', // Height of navbar
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.98)',
          backdropFilter: 'blur(20px)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          animation: 'slideDown 0.3s ease-out',
          overflowY: 'auto'
        }} className="d-md-none mobile-menu-container">

          {/* Mobile Navigation Links */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            marginBottom: '30px'
          }}>
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setIsMobileMenuOpen(false)} // Close menu when item clicked
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#e2e8f0',
                  fontSize: '18px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'left',
                  width: '100%'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(79, 70, 229, 0.2)';
                  e.target.style.transform = 'translateX(8px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>

          {/* Mobile Search */}
          <div style={{ marginBottom: '30px' }}>
            <SearchInput />
          </div>

          {/* Mobile User Section */}
          {user ? (
            <div style={{
              background: 'rgba(79, 70, 229, 0.1)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(79, 70, 229, 0.2)',
              marginTop: 'auto'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '20px'
                }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{
                    color: '#e2e8f0',
                    fontSize: '18px',
                    fontWeight: '600',
                    margin: 0,
                    marginBottom: '4px'
                  }}>
                    {user.username}
                  </h3>
                  <p style={{
                    color: '#94a3b8',
                    fontSize: '14px',
                    margin: 0
                  }}>
                    Logged in
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  color: '#f87171',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'all 0.3s ease'
                }}
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              style={{
                background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 24px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: 'auto'
              }}>
              Sign In
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 767px) {
          .mobile-logo h1 {
            font-size: 1.4rem !important;
          }
          .mobile-logo span {
            font-size: 1.6rem !important;
          }
        }

        @media (max-width: 480px) {
          .mobile-logo h1 {
            font-size: 1.2rem !important;
          }
          .mobile-logo span {
            font-size: 1.4rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;