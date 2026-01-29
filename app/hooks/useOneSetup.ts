"use client";

import { useState } from "react";

export function useOneSetup() {
  const [loading, setLoading] = useState(false);

  const deductSetup = async (): Promise<"ok" | "no-credits" | "error"> => {
    setLoading(true);
    
    try {
      // Get auth token
      const token = localStorage.getItem('cf_token');
      const userData = localStorage.getItem('cf_user');
      
      if (!token || !userData) {
        console.error("Not authenticated");
        return "error";
      }

      const user = JSON.parse(userData);
      
      // Call Cloudflare API to use one setup
      const response = await fetch('/api/user/use-setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user.id })
      });

      if (!response.ok) {
        if (response.status === 400) {
          // No credits available
          return "no-credits";
        }
        return "error";
      }

      const data = await response.json();
      
      if (data.success) {
        // Update local user data with new setup count
        const updatedUser = { ...user, setup_count: data.newCount };
        localStorage.setItem('cf_user', JSON.stringify(updatedUser));
        return "ok";
      } else {
        return "error";
      }
    } catch (error) {
      console.error("Error using setup:", error);
      return "error";
    } finally {
      setLoading(false);
    }
  };

  return {
    deductSetup,
    loading
  };
}