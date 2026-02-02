"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

// 👇 FIX: Tell TypeScript that 'fbq' exists on window
declare global {
  interface Window {
    fbq: any;
  }
}

export default function PurchaseTracker() {
  const searchParams = useSearchParams();
  
  const orderId = searchParams?.get("orderId") || "";
  const license = searchParams?.get("license") || "";
  const sessionId = searchParams?.get("session_id") || "";

  useEffect(() => {
    // Try to fetch order info client-side if we have sessionId
    const fetchOrderAndTrack = async () => {
      if (sessionId) {
        try {
          const response = await fetch(
            `/api/orders/by-session?session_id=${encodeURIComponent(sessionId)}`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data?.ok && data.order) {
              // Track purchase with Facebook Pixel
              if (typeof window.fbq !== "undefined") {
                window.fbq("track", "Purchase", {
                  content_name: data.order.productName || "MZPrimer Product",
                  content_ids: [orderId || sessionId],
                  content_type: "product",
                  value: data.order.amountUsd || 0,
                  currency: "USD"
                });
                console.log(`✅ FB Pixel: Purchase tracked for $${data.order.amountUsd || 0}`);
              }
            }
          }
        } catch (error) {
          console.error("Failed to fetch order:", error);
        }
      }
    };

    fetchOrderAndTrack();
  }, [sessionId, orderId]);

  return null;
}