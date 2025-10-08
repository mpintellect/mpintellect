"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase"; // your client-side Firestore
import { toast } from "react-hot-toast";

export default function ActivatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const key = searchParams.get("key");
    if (!key) {
      setStatus("error");
      return;
    }

    const activateKey = async () => {
      const docRef = doc(db, "licenses", key);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setStatus("not_found");
        return;
      }

      const data = docSnap.data();
      const now = Date.now();

      if (data.expiresAt < now) {
        setStatus("expired");
        return;
      }

      // Optional: check if already used/activated
      if (data.status === "active") {
        setStatus("already_active");
        return;
      }

      // ✅ Mark as activated
      await updateDoc(docRef, { status: "active" });

      // Save in localStorage
      localStorage.setItem("MZP_LICENSE_KEY", key);
      localStorage.setItem("MZP_LICENSE_EXPIRES", data.expiresAt);

      setStatus("success");

      // Optional redirect after few seconds
      setTimeout(() => {
        router.push("/?activated=true");
      }, 2500);
    };

    activateKey();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      {status === "loading" && <p>🔄 Verifying your license key...</p>}
      {status === "success" && <p className="text-green-500">✅ License activated! Redirecting...</p>}
      {status === "expired" && <p className="text-red-500">❌ License expired.</p>}
      {status === "not_found" && <p className="text-red-500">❌ Invalid license key.</p>}
      {status === "already_active" && <p className="text-yellow-500">⚠️ License already activated.</p>}
      {status === "error" && <p className="text-red-500">❌ No license key provided.</p>}
    </div>
  );
}