"use client";

import { useState } from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          displayName: email.split("@")[0]
        })
      });

      const data = await response.json();

      // ⭐ FIX: Reliable validation instead of fragile data.success
      if (response.ok && data.token && data.user) {
        localStorage.setItem("cf_token", data.token);
        localStorage.setItem("cf_user", JSON.stringify(data.user));
        localStorage.setItem("cf_session_id", data.sessionId || data.token);

        // Clear trials on successful registration
        localStorage.removeItem("MZP_TRIAL_COUNT");

        console.log("✅ Registration successful — redirecting...");

        // Hard redirect to dashboard
        window.location.href = "/client/dashboard?showPlans=true&status=new_user";
        return;
      }

      // 🔥 Error mapping
      if (data.error?.includes("already exists")) {
        setError("Email already in use. Please login instead.");
      } else {
        setError(data.error || "Registration failed. Please try again.");
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
      <div className="register-glow glow-top-left"></div>
      <div className="register-glow glow-bottom-right"></div>

      <div className="register-container">
        <div className="register-card">

          <div className="register-header">
            <h1 className="register-title">Create Account</h1>
            <p className="register-subtitle">Get started with AI-powered trading insights</p>
          </div>

          <form onSubmit={handleRegister} className="register-form">
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

            {error && (
              <div className="error-box">
                <p className="error-text">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="register-btn">
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

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