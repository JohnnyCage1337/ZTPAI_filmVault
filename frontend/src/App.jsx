import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/public/Home';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'home'
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sprawdzenie czy użytkownik jest zalogowany przy starcie
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/check/', {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.authenticated) {
        setUser(data.user);
        setCurrentView('home');
      }
    } catch (error) {
      console.log('Not authenticated');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('home');
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/api/auth/logout/', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      setUser(null);
      setCurrentView('login');
    }
  };

  const switchToRegister = () => {
    setCurrentView('register');
  };

  const switchToLogin = () => {
    setCurrentView('login');
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

  // Renderowanie strony głównej dla zalogowanych użytkowników
  if (currentView === 'home' && user) {
    return (
      <>
        <Navbar user={user} onLogout={handleLogout} />
        <Home />
        <Footer />
      </>
    );
  }

  // Renderowanie auth views dla niezalogowanych
  return (
    <>
      {currentView === 'login' ? (
        <LoginPage
          onSwitchToRegister={switchToRegister}
          onLogin={handleLogin}
        />
      ) : (
        <RegisterPage
          onSwitchToLogin={switchToLogin}
          onRegister={handleLogin}
        />
      )}
    </>
  );
}

export default App;