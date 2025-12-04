"use client";

import { useEffect } from "react";

// 👇 FIX: Tell TypeScript that 'fbq' exists on window
declare global {
  interface Window {
    fbq: any;
  }
}

type Props = {
  amount: number;
  currency: string;
  orderId: string;
  productName: string;
};

export default function PurchaseTracker({ amount, currency, orderId, productName }: Props) {
  useEffect(() => {
    // Check if Facebook Pixel is loaded
    if (typeof window.fbq !== "undefined") {
      
      // Track the Purchase Event
      window.fbq("track", "Purchase", {
        content_name: productName || "MZPrimer Product",
        content_ids: [orderId],
        content_type: "product",
        value: amount,
        currency: currency
      });
      
      console.log(`✅ FB Pixel: Purchase tracked for $${amount}`);
    }
  }, [amount, currency, orderId, productName]);

  return null;
}