// app/client/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call Cloudflare auth API instead of Firebase
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        // Store token in localStorage (similar to Firebase's session)
        localStorage.setItem('cf_token', data.token);
        localStorage.setItem('cf_user', JSON.stringify(data.user));
        localStorage.setItem('cf_session_id', data.sessionId);
        
        router.push("/client/dashboard");
      } else {
        // Map Cloudflare errors to user-friendly messages
        if (data.error.includes('Invalid credentials') || data.error.includes('User not found')) {
          setError("Invalid email or password");
        } else {
          setError(data.error || "Login failed");
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="card-container">

        <h1 className="section-title">Login</h1>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="form-wrapper">
          <input
            type="email"
            className="input-field"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="password"
            className="input-field"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="small-muted">
          Don't have an account?{" "}
          <a href="/client/register" className="text-link">Register</a>
        </p>
      </div>
    </div>
  );
}