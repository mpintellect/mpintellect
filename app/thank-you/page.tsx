export const dynamic = 'force-dynamic';

export default function ThankYouPage({
  searchParams,
}: {
  searchParams?: { orderId?: string; license?: string };
}) {
  const orderId = searchParams?.orderId || '';
  const license = searchParams?.license || '';

  return (
    <div className="checkout-wrap">
      <h1 className="checkout-title">Thank you!</h1>
      <div className="checkout-card">
        <p>✅ Your payment was confirmed.</p>
        {orderId && <p><b>Order ID:</b> {orderId}</p>}
        {license && (
          <p>
            <b>License key:</b> <code>{license}</code>
          </p>
        )}
        <div style={{ marginTop: 16 }}>
          <a className="checkout-btn" href="/tools/ai-assistant">Open AI Assistant</a>
        </div>
      </div>
    </div>
  );
}