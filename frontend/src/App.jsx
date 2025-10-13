import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/public/Home';
import Movies from './pages/public/Movies';
import MovieDetail from './pages/public/MovieDetail';
import SearchResults from './pages/public/SearchResults';
import Watchlist from './pages/auth/Watchlist';
import { authService } from './services/authService';
import { sessionManager } from './utils/sessionManager';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Sprawdzenie czy użytkownik jest zalogowany przy starcie
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userData = await authService.checkAuth();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.log('User not authenticated:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();

    // Initialize session manager for automatic token refresh and expiry handling
    sessionManager.init();

    // Cleanup on unmount
    return () => {
      sessionManager.cleanup();
    };
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      setUser(null);
      navigate('/');
    }
  };

  const handleMovieSelect = (movie) => {
    navigate(`/movie/${movie.slug}`);
  };

  if (isLoading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0a0015 0%, #1a0828 25%, #2d1b42 50%, #1f2937 75%, #111827 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
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
          <h3 style={{ margin: 0, fontSize: '1.5rem' }}>🎬 FilmVault</h3>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading...</p>
        </div>

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} onLogin={() => navigate('/login')} />
      <Routes>
        <Route path="/" element={<Home onMovieSelect={handleMovieSelect} user={user} />} />
        <Route path="/movies" element={<Movies onMovieSelect={handleMovieSelect} user={user} />} />
        <Route path="/search" element={<SearchResults user={user} />} />
        <Route path="/watchlist" element={<Watchlist user={user} />} />
        <Route path="/movie/:slug" element={<MovieDetail onBack={() => navigate('/')} user={user} />} />
        <Route path="/login" element={
          <LoginPage
            onSwitchToRegister={() => navigate('/register')}
            onLogin={handleLogin}
          />
        } />
        <Route path="/register" element={
          <RegisterPage
            onSwitchToLogin={() => navigate('/login')}
            onRegister={handleLogin}
          />
        } />
      </Routes>
      <Footer />
    </>
  );
}

export default App;