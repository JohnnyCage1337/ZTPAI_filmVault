import { authService } from '../services/authService';

class SessionManager {
  constructor() {
    this.checkInterval = null;
    this.isChecking = false;
  }

  // Start automatic session checking
  startSessionCheck() {
    if (this.checkInterval) return;

    // Check immediately
    this.checkSession();

    // Check every 5 minutes
    this.checkInterval = setInterval(() => {
      this.checkSession();
    }, 5 * 60 * 1000); // 5 minutes
  }

  // Stop session checking
  stopSessionCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Check current session status
  async checkSession() {
    if (this.isChecking || !authService.isAuthenticated()) return;

    this.isChecking = true;
    try {
      const result = await authService.checkAuth();
      
      if (!result.success) {
        if (result.expired) {
          this.handleSessionExpiry();
        } else {
          this.handleAuthError();
        }
      }
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      this.isChecking = false;
    }
  }

  // Handle session expiry
  handleSessionExpiry() {
    // Show user-friendly message
    this.showSessionExpiredNotification();
    
    // Clear local data
    authService.logout();
    
    // Redirect to login after delay
    setTimeout(() => {
      window.location.href = '/login?expired=true';
    }, 3000);
  }

  // Handle authentication errors
  handleAuthError() {
    authService.logout();
    window.location.href = '/login';
  }

  // Show session expired notification
  showSessionExpiredNotification() {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 9999;
      font-family: Inter, sans-serif;
      font-size: 14px;
      max-width: 300px;
    `;
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span>⚠️</span>
        <div>
          <div style="font-weight: 600;">Session Expired</div>
          <div style="opacity: 0.9; font-size: 12px;">You will be redirected to login...</div>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  // Initialize session management
  init() {
    if (authService.isAuthenticated()) {
      this.startSessionCheck();
    }

    // Store event handlers for cleanup
    this.storageHandler = (e) => {
      if (e.key === 'isAuthenticated') {
        if (e.newValue === 'true') {
          this.startSessionCheck();
        } else {
          this.stopSessionCheck();
        }
      }
    };

    this.visibilityHandler = () => {
      if (!document.hidden && authService.isAuthenticated()) {
        this.checkSession();
      }
    };

    // Listen for authentication changes
    window.addEventListener('storage', this.storageHandler);

    // Check session on page focus (user returns to tab)
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  // Cleanup method for component unmounting
  cleanup() {
    this.stopSessionCheck();
    
    // Remove event listeners
    if (this.storageHandler) {
      window.removeEventListener('storage', this.storageHandler);
    }
    
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
    }
  }
}

// Create global session manager instance
export const sessionManager = new SessionManager();

// Auto-initialize when module loads
sessionManager.init();