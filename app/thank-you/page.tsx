// app/thank-you/page.tsx
import Link from 'next/link';

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; license?: string; session_id?: string }>;
}) {
  const params = await searchParams;
  const orderId = params?.orderId ?? "";
  const pageLicense = params?.license ?? "";
  const sessionId = params?.session_id ?? "";

  // Try to fetch order info by session id
  let fetched: any = null;
  let isBotPurchase = false;
  let productName = "";

  if (sessionId) {
    try {
      const r = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/orders/by-session?session_id=${encodeURIComponent(sessionId)}`,
        { 
          cache: "no-store",
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      );
      
      if (r.ok) {
        fetched = await r.json();
        if (fetched?.ok && fetched.order) {
          isBotPurchase = !!fetched.order.filePath; // Check if it's a bot purchase
          productName = fetched.order.productName || "";
        }
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    }
  }

  const resolvedOrder = fetched?.ok ? fetched.order : null;

  return (
    <div className="checkout-wrap">
      <h1 className="checkout-title">Thank you for your purchase! 🎉</h1>

      <div className="checkout-card">
        <h3 className="checkout-card-title">Payment received successfully</h3>

        {orderId && (
          <p>
            <strong>Order ID:</strong> <code>{orderId}</code>
          </p>
        )}
        
        {sessionId && (
          <p>
            <strong>Stripe session:</strong> <code className="session-code">{sessionId}</code>
          </p>
        )}

        {resolvedOrder ? (
          <>
            <p><strong>Product:</strong> {productName}</p>
            <p><strong>Amount:</strong> ${resolvedOrder.amountUsd?.toFixed(2) || "0.00"}</p>
            
            {isBotPurchase ? (
              <div className="download-info">
                <p>📥 Your download link has been sent to your email.</p>
                <p className="small-text">Check your inbox (and spam folder) for the download instructions.</p>
              </div>
            ) : (
              <div className="subscription-info">
                <p>✅ Your subscription is now active!</p>
                <Link href="/tools/ai-assistant" className="checkout-btn">
                  Open AI Assistant
                </Link>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="pending-info">
              <p>We're processing your order...</p>
              <p>We've sent a confirmation email{orderId ? " with your order details" : ""}.</p>
              <p className="small-text">
                If you don't see the email within a few minutes, please check your spam folder.
              </p>
            </div>
          </>
        )}

        {/* Support information */}
        <div className="support-section">
          <h4>Need help?</h4>
          <p>Contact us at <a href="mailto:contact@mzprimer.com">contact@mzprimer.com</a></p>
        </div>
      </div>
    </div>
  );
}