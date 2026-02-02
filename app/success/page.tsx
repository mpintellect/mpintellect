// app/success/page.tsx
"use client";

import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="success-page">
        <div className="success-container">
          <h1>Processing your payment...</h1>
          <p>Please wait while we confirm your payment.</p>
          <div className="loading-spinner"></div>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}