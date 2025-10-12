import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login' lub 'register'

  const switchToRegister = () => {
    setCurrentView('register');
  };

  const switchToLogin = () => {
    setCurrentView('login');
  };

  return (
    <>
      {currentView === 'login' ? (
        <LoginPage onSwitchToRegister={switchToRegister} />
      ) : (
        <RegisterPage onSwitchToLogin={switchToLogin} />
      )}
    </>
  );
}

export default App;