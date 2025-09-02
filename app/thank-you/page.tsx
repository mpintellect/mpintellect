// app/thank-you/page.tsx
export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; license?: string; session_id?: string }>;
}) {
  const params = await searchParams;
  const orderId = params?.orderId ?? "";
  const pageLicense = params?.license ?? "";
  const sessionId = params?.session_id ?? "";

  // Try to fetch order info by session id (works if webhook already ran)
  let fetched: any = null;
  if (sessionId) {
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/orders/by-session?session_id=${encodeURIComponent(sessionId)}`, { cache: "no-store" });
      fetched = await r.json();
    } catch {}
  }

  const resolvedOrder = fetched?.ok ? fetched.order : null;
  // const resolvedLicense = resolvedOrder?.licenseKey || pageLicense; // if you later store it

  return (
    <div className="checkout-wrap">
      <h1 className="checkout-title">Thank you!</h1>

      <div className="checkout-card">
        <h3 className="checkout-card-title">Payment received</h3>

        {orderId && <p>Order ID: <b>{orderId}</b></p>}
        {sessionId && <p>Stripe session: <code>{sessionId}</code></p>}

        {resolvedOrder ? (
          <>
            <p><b>Product:</b> {resolvedOrder.productName}</p>
            {/* If you later expose license/download here, show it */}
            {/* {resolvedLicense && <pre className="code-block">{resolvedLicense}</pre>} */}
            <a className="checkout-btn" href="/tools/ai-assistant">
              Open AI Assistant
            </a>
          </>
        ) : (
          <>
            <p>We’ve sent a confirmation email{orderId ? " with your details" : ""}.</p>
            <a className="checkout-btn" href="/tools/ai-assistant">
              Open AI Assistant
            </a>
          </>
        )}
      </div>
    </div>
  );
}