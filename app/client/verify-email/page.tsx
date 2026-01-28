"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/lib/firebaseClient";
import { doc, updateDoc } from "firebase/firestore";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Please verify your email...");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !auth) return; // Check if auth exists
    
    const interval = setInterval(async () => {
      try {
        // Type-safe check
        const currentUser = auth?.currentUser;
        if (!currentUser) {
          setMessage("Please log in first.");
          return;
        }

        await currentUser.reload();

        if (currentUser.emailVerified) {
          const uid = currentUser.uid;

          if (db) {
            await updateDoc(doc(db, "users", uid), { emailVerified: true });
          }

          clearInterval(interval);
          setMessage("✅ Email verified! Redirecting to your dashboard...");
          setTimeout(() => router.push("/client/dashboard"), 2000);
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