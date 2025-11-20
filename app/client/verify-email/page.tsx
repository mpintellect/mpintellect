"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/lib/firebaseClient";
import { doc, updateDoc } from "firebase/firestore";

export const dynamic = "force-dynamic";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Please verify your email...");

  useEffect(() => {
    const interval = setInterval(async () => {
      await auth.currentUser?.reload();

      if (auth.currentUser?.emailVerified) {
        const uid = auth.currentUser.uid;

        await updateDoc(doc(db, "users", uid), { emailVerified: true });

        clearInterval(interval);
        setMessage("✅ Email verified! Redirecting to your dashboard...");
        setTimeout(() => router.push("/client/dashboard"), 2000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

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