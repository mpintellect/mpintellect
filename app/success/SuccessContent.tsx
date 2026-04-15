// app/success/SuccessContent.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (orderId) {
      // Clear trial limits since user has paid
      localStorage.removeItem("MZP_TRIAL_COUNT");
      console.log("Payment successful with order:", orderId);
      setStatus("success");
    } else {
      setStatus("error");
    }
  }, [orderId]);

  if (status === "loading") {
    return (
      <div className="success-page">
        <div className="success-container">
          <h1>Processing your payment...</h1>
          <p>Please wait while we confirm your payment.</p>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="success-page">
        <div className="success-container">
          <h1>Something went wrong</h1>
          <p>We couldn't verify your payment. Please contact support if you see any charges.</p>
          <Link href="/AIChat" className="return-button">
            Return to AI Assistant
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="success-container">
        <h1>🎉 Payment Successful!</h1>
        <p>Thank you for your purchase. Your license key has been sent to your email.</p>
        
        <div className="next-steps">
          <h3>To Activate Your License:</h3>
          <ol>
            <li><strong>Check your email</strong> for the license key (subject: "Your MPIntellect Intelligence Order")</li>
            <li><strong>Return to the AI Assistant</strong> below</li>
            <li><strong>Click "Activate License"</strong> button</li>
            <li><strong>Enter your license key</strong> when prompted</li>
            <li><strong>Start using unlimited AI analysis!</strong></li>
          </ol>
        </div>

        <div className="license-reminder">
          <p><strong>Important:</strong> Your license key will be sent to the email address you used during checkout.</p>
        </div>
        
        <Link href="/AIChat" className="return-button">
          Return to MPIntellect Intelligence Assistant
        </Link>
        
        <div className="support-note">
          <p>Didn't receive the email? Check your spam folder or <a href="mailto:contact@mpintellect.com">contact support</a>.</p>
        </div>
      </div>
    </div>
  );
}