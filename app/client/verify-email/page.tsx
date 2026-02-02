"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Please verify your email...");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem('cf_token');
        const userData = localStorage.getItem('cf_user');
        
        if (!token || !userData) {
          setMessage("Please log in first.");
          return;
        }

        const user = JSON.parse(userData);
        
        // Check email verification status via API
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.user.email_verified) {
            clearInterval(interval);
            setMessage("✅ Email verified! Redirecting to your dashboard...");
            setTimeout(() => router.push("/client/dashboard"), 2000);
          }
        }
      } catch (error) {
        console.error('Error checking email verification:', error);
        setMessage("Error checking verification status. Please refresh the page.");
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [router, mounted]);

  return (
    <div className="page-wrapper">
      <div className="card-container text-center">
        <h2 className="section-title">Verify Your Email</h2>
        <p className="text-normal">{message}</p>
        <p className="text-small-muted italic">This page auto-checks every 5 seconds.</p>
      </div>
    </div>
  );
}