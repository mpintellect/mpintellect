// app/hooks/useUser.ts
"use client";
import { useState, useEffect, useCallback } from "react";

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("cf_token");

    if (!token) {
      console.log("Hooks: No token found in localStorage");
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        console.warn("Hooks: Auth not ready, retrying...");
        setTimeout(checkAuth, 800); // retry instead of wiping token
        return;
      }
    } catch (e) {
      console.warn("Hooks: Auth error, retrying…");
      setTimeout(checkAuth, 800);
      return;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    userId: user?.id || null,
    setupCount: user?.setup_count || 0,
    refreshUser: checkAuth,
    logout: () => {
      localStorage.removeItem("cf_token");
      localStorage.removeItem("cf_user");
      localStorage.removeItem("cf_session_id");
      setUser(null);
    }
  };
}