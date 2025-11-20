"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../lib/firebaseClient";

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      if (auth && db) {
        setFirebaseReady(true);
      } else {
        setError("Firebase not properly initialized");
      }
    } catch (err) {
      setError("Firebase configuration error");
      console.error("Firebase init error:", err);
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (!firebaseReady) {
      setError("System not ready. Please refresh the page.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, "users", user.uid), {
        email: email.toLowerCase().trim(),
        setupCount: 1,
        referredBy: null,
        emailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      router.push("/client/verify-email");
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Please login instead.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Invalid email address format.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password is too weak. Please use a stronger password.");
      } else if (err.code === 'auth/configuration-not-found') {
        setError("Authentication service not configured. Please contact support.");
      } else {
        setError(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-title">Register</h1>

        {!firebaseReady && (
          <div className="alert-box">
            <p className="alert-text">Initializing authentication service...</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="register-form">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="register-input"
            disabled={loading || !firebaseReady}
          />

          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="register-input"
            disabled={loading || !firebaseReady}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="register-input"
            disabled={loading || !firebaseReady}
          />

          {error && (
            <div className="error-box">
              <p className="error-text">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !firebaseReady}
            className="register-btn"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="register-footer">
          Already have an account?{" "}
          <a href="/client/login" className="register-link">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}