import React, { useState } from 'react';

const RegisterPage = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account created successfully! You can now log in.');
        setFormData({
          username: '',
          email: '',
          password: '',
          password_confirm: ''
        });
        setTimeout(() => {
          onSwitchToLogin();
        }, 2000);
      } else {
        if (data.username) {
          setError(data.username[0]);
        } else if (data.email) {
          setError(data.email[0]);
        } else if (data.non_field_errors) {
          setError(data.non_field_errors[0]);
        } else {
          setError('Registration failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #0a0015 0%, #1a0828 25%, #2d1b42 50%, #1f2937 75%, #111827 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* Main Register Container */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '40px',
        width: '100%',
        maxWidth: '480px',
        margin: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '32px',
            fontWeight: '800',
            marginBottom: '8px',
            letterSpacing: '-0.025em'
          }}>
            🎬 FilmVault
          </div>
          <p style={{
            color: '#94a3b8',
            fontSize: '16px',
            margin: 0,
            fontWeight: '400'
          }}>
            Create your account to join our movie community
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {/* Error Message */}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#22c55e',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              ✅ {success}
            </div>
          )}



          {/* Username Field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#e2e8f0',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              disabled={loading}
              required
              style={{
                width: '100%',
                padding: '15px 18px',
                background: 'rgba(30, 41, 59, 0.7)',
                border: '2px solid rgba(79, 70, 229, 0.3)',
                borderRadius: '12px',
                color: '#e2e8f0',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#4f46e5';
                e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(79, 70, 229, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Email Field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#e2e8f0',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px 18px',
                background: 'rgba(30, 41, 59, 0.7)',
                border: '2px solid rgba(79, 70, 229, 0.3)',
                borderRadius: '12px',
                color: '#e2e8f0',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#4f46e5';
                e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(79, 70, 229, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#e2e8f0',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              disabled={loading}
              required
              style={{
                width: '100%',
                padding: '15px 18px',
                background: 'rgba(30, 41, 59, 0.7)',
                border: '2px solid rgba(79, 70, 229, 0.3)',
                borderRadius: '12px',
                color: '#e2e8f0',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#4f46e5';
                e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(79, 70, 229, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Confirm Password Field */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              color: '#e2e8f0',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              Confirm Password *
            </label>
            <input
              type="password"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={handleChange}
              placeholder="Confirm your password"
              disabled={loading}
              required
              style={{
                width: '100%',
                padding: '15px 18px',
                background: 'rgba(30, 41, 59, 0.7)',
                border: '2px solid rgba(79, 70, 229, 0.3)',
                borderRadius: '12px',
                color: '#e2e8f0',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#4f46e5';
                e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(79, 70, 229, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading
                ? 'rgba(79, 70, 229, 0.5)'
                : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#e2e8f0',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '30px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(79, 70, 229, 0.6)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(79, 70, 229, 0.4)';
              }
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '8px'
                }}></span>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Login Link */}
          <div style={{
            borderTop: '1px solid rgba(148, 163, 184, 0.2)',
            paddingTop: '20px',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#64748b',
              fontSize: '14px',
              margin: 0
            }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4f46e5',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Sign in here
              </button>
            </p>
          </div>
        </form>

        {/* CSS Animation for spinner */}
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default RegisterPage;