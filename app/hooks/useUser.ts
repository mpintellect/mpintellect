"use client";

import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  display_name?: string;
  photo_url?: string;
  email_verified: number;
  license_type: string;
  setup_count: number;
  trial_count: number;
  created_at: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('cf_token');
      const userData = localStorage.getItem('cf_user');
      
      if (!token || !userData) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Verify token with Cloudflare API
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(data.user);
          } else {
            // Token invalid, clear local storage
            localStorage.removeItem('cf_token');
            localStorage.removeItem('cf_user');
            localStorage.removeItem('cf_session_id');
            setUser(null);
          }
        } else {
          // Token invalid, clear local storage
          localStorage.removeItem('cf_token');
          localStorage.removeItem('cf_user');
          localStorage.removeItem('cf_session_id');
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cf_user' || e.key === 'cf_token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const refreshUser = async () => {
    const token = localStorage.getItem('cf_token');
    const userData = localStorage.getItem('cf_user');
    
    if (!token || !userData) {
      setUser(null);
      return;
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          localStorage.setItem('cf_user', JSON.stringify(data.user));
        }
      }
    } catch (error) {
      console.error("Refresh user error:", error);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('cf_token');
      const sessionId = localStorage.getItem('cf_session_id');
      
      if (token && sessionId) {
        // Call Cloudflare logout API
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sessionId })
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage
      localStorage.removeItem('cf_token');
      localStorage.removeItem('cf_user');
      localStorage.removeItem('cf_session_id');
      setUser(null);
    }
  };

  return {
    user,
    loading,
    refreshUser,
    logout,
    isAuthenticated: !!user
  };
}