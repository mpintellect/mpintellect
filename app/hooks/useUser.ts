// app/hooks/useUser.ts (CLOUDFLARE VERSION)
"use client";

import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  display_name?: string;
  photo_url?: string;
  email_verified: boolean;
  license_type: string;
  setup_count: number;
  referral_code?: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [setupCount, setSetupCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('cf_token');
      const userData = localStorage.getItem('cf_user');
      
      if (!token || !userData) {
        setIsLoading(false);
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
            const userData = data.user;
            setUser(userData);
            setUserId(userData.id);
            setSetupCount(userData.setup_count || 0);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Refresh setup count
  const refreshSetupCount = async () => {
    if (!userId) return;
    
    try {
      const token = localStorage.getItem('cf_token');
      const response = await fetch(`/api/user/setup-count?userId=${userId}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSetupCount(data.setupCount || 0);
        }
      }
    } catch (error) {
      console.error('Error refreshing setup count:', error);
    }
  };

  return {
    user,
    userId,
    setupCount,
    isLoading,
    refreshSetupCount
  };
}