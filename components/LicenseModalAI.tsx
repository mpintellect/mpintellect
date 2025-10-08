// components/LicenseModalAI.tsx
"use client";

import { useState } from "react";

export default function LicenseModalAI({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (key: string) => Promise<void> | void;
}) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleActivate = async () => {
    if (!key.trim()) {
      setError("Please enter a license key");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("🔄 Activating license:", key);
      await onSubmit(key);
      console.log("✅ License activation successful");
      onClose();
    } catch (err: any) {
      console.error("❌ License activation failed:", err);
      setError(err.message || "Invalid or expired license key.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="license-modal">
      <div className="modal-box">
        <h2>🔐 Enter Your License Key</h2>
        <input
          type="text"
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            setError("");
          }}
          placeholder="MZP-AI-XXXXXX"
          className="license-input"
          disabled={isLoading}
        />
        {error && <p className="error">{error}</p>}
        <button 
          onClick={handleActivate} 
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? "Activating..." : "Activate"}
        </button>
        <button 
          onClick={onClose} 
          className="close-button"
          disabled={isLoading}
        >
          Close
        </button>
      </div>
    </div>
  );
}