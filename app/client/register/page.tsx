"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getAuthInstance, getDbInstance } from "@/app/lib/firebaseClient";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [firebaseReady, setFirebaseReady] = useState(false);

  // Check Firebase initialization
  useEffect(() => {
    if (getAuthInstance()) {
      setFirebaseReady(true);
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
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
      // 1. Create user account (NO email verification sent)
      const userCredential = await createUserWithEmailAndPassword(getAuthInstance(), email, password);
      const user = userCredential.user;

      // 2. Create user document with needsEmailVerification flag
      await setDoc(doc(getDbInstance(), "users", user.uid), {
        email: user.email,
        emailVerified: false, // Will update when they verify later
        needsEmailVerification: true, // Flag to show banner in dashboard
        uid: user.uid,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        setupCount: 0,
        plan: "free",
        subscriptionActive: false
      });

      // 3. Redirect directly to dashboard (NO waiting for verification)
      router.push("/client/dashboard");

    } catch (error: any) {
      console.error("Registration error:", error);
      
      // User-friendly error messages
      if (error.code === "getAuthInstance()/email-already-in-use") {
        setError("Email already in use. Please login instead.");
      } else if (error.code === "getAuthInstance()/invalid-email") {
        setError("Invalid email address");
      } else if (error.code === "getAuthInstance()/weak-password") {
        setError("Password is too weak. Use at least 6 characters.");
      } else {
        setError("Registration failed. Please try again.");
      }
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

          {/* Alert for Firebase Initialization */}
          {!firebaseReady && (
            <div className="alert-box">
              <p className="alert-text">Initializing authentication service...</p>
            </div>
          )}

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
                disabled={loading || !firebaseReady}
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
                disabled={loading || !firebaseReady}
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
                disabled={loading || !firebaseReady}
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
              disabled={loading || !firebaseReady}
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