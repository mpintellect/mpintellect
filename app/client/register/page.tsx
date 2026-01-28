"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getAuthInstance, getDbInstance } from "@/app/lib/firebaseClient";
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
      // 1. Get Firebase instances inside the event handler
      const authInstance = getAuthInstance();
      const dbInstance = getDbInstance();
      
      // 2. Create user account
      const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
      const user = userCredential.user;

      // 3. Send email verification
      await sendEmailVerification(user);

      // 4. Create user document
      await setDoc(doc(dbInstance, "users", user.uid), {
        email: user.email?.toLowerCase().trim(),
        emailVerified: false,
        needsEmailVerification: true,
        uid: user.uid,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        setupCount: 1, // ✅ Give 1 free setup for registration
        plan: "free",
        subscriptionActive: false,
        referredBy: null
      });

      // 5. Redirect to dashboard
      router.push("/client/dashboard");

    } catch (error: any) {
      console.error("Registration error:", error);
      
      // User-friendly error messages with correct error codes
      if (error.code === "auth/email-already-in-use") {
        setError("Email already in use. Please login instead.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (error.code === "auth/weak-password") {
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