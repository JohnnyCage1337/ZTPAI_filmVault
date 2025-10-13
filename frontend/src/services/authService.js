const API_BASE = 'http://localhost:8000';

export const authService = {
  // Login with JWT cookies
  login: async (username, password) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage (not sensitive)
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isAuthenticated', 'true');
        return { success: true, data };
      } else {
        return { success: false, error: data.error || data.non_field_errors?.[0] || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  },

  // Register with JWT cookies
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isAuthenticated', 'true');
        return { success: true, data };
      } else {
        return { success: false, error: data };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error' };
    }
  },

  // Logout with cookie clearing
  logout: async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout/`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
  },

  // Refresh token automatically
  refreshToken: async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/refresh/`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        return { success: true };
      } else {
        // Token expired, logout
        this.logout();
        return { success: false, expired: true };
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      return { success: false, expired: true };
    }
  },

  // Check authentication status with server
  checkAuth: async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/check/`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.authenticated && data.token_valid) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isAuthenticated', 'true');
        return { success: true, user: data.user };
      } else {
        // Token expired or invalid
        if (data.error === 'Token expired') {
          const refreshResult = await this.refreshToken();
          if (refreshResult.success) {
            return this.checkAuth(); // Retry after refresh
          }
        }

        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        return { success: false, expired: data.error === 'Token expired' };
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      return { success: false };
    }
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if authenticated (from localStorage)
  isAuthenticated: () => {
    return localStorage.getItem('isAuthenticated') === 'true';
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.profile?.role === 'admin';
  },

  // API call helper with automatic token refresh
  apiCall: async (url, options = {}) => {
    const defaultOptions = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      let response = await fetch(url, defaultOptions);


      if (response.status === 401) {
        const refreshResult = await authService.refreshToken();
        if (refreshResult.success) {

          response = await fetch(url, defaultOptions);
        } else {

          window.location.href = '/login';
          return null;
        }
      }

      return response;
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  }
};