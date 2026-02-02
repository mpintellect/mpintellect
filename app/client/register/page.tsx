// app/client/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation (same as before)
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Call Cloudflare auth API instead of Firebase
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password,
          displayName: email.split('@')[0] // Use part of email as display name
        })
      });

      const data = await response.json();

      if (data.success) {
        // Store session in localStorage (similar to Firebase)
        localStorage.setItem('cf_token', data.token);
        localStorage.setItem('cf_user', JSON.stringify(data.user));
        localStorage.setItem('cf_session_id', data.sessionId);
        
        // Redirect to dashboard
        router.push("/client/dashboard");
      } else {
        // Map Cloudflare errors to user-friendly messages
        if (data.error.includes('already exists')) {
          setError("Email already in use. Please login instead.");
        } else if (data.error.includes('Invalid email')) {
          setError("Invalid email address");
        } else if (data.error.includes('weak password')) {
          setError("Password is too weak. Use at least 6 characters.");
        } else {
          setError(data.error || "Registration failed. Please try again.");
        }
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Background Effects */}
      <div className="register-glow glow-top-left"></div>
      <div className="register-glow glow-bottom-right"></div>

      <div className="register-container">
        <div className="register-card">
          {/* Header */}
          <div className="register-header">
            <h1 className="register-title">Create Account</h1>
            <p className="register-subtitle">Get started with AI-powered trading insights</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="register-form">
            {/* Email Field */}
            <div className="input-group">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="register-input"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div className="input-group">
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="register-input"
                disabled={loading}
              />
            </div>

            {/* Confirm Password Field */}
            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="register-input"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-box">
                <p className="error-text">{error}</p>
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="register-btn"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          {/* Already have account */}
          <div className="register-footer">
            <p className="footer-text">
              Already have an account?{" "}
              <Link href="/client/login" className="footer-link">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}