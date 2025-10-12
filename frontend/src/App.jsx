import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/public/Home';
import MovieDetail from './pages/public/MovieDetail';
import SearchResults from './pages/public/SearchResults';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Sprawdzenie czy użytkownik jest zalogowany przy starcie
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Możesz tutaj sprawdzić czy token jest ważny
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }
    } catch (error) {
      console.log('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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
        <Route path="/" element={<Home onMovieSelect={handleMovieSelect} />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/movie/:slug" element={<MovieDetail onBack={() => navigate('/')} />} />
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