import Link from 'next/link';
import PurchaseTracker from './PurchaseTracker';

// Add this for static export
export const dynamic = 'force-static';

// Since this page uses searchParams (dynamic), we need to handle it differently
export default function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; license?: string; session_id?: string }>;
}) {
  // For static export, we can't use await searchParams
  // Instead, we'll show a generic thank you page and handle params client-side
  
  return (
    <div className="checkout-wrap">
      <h1 className="checkout-title">Thank you for your purchase! 🎉</h1>

      <div className="checkout-card">
        <h3 className="checkout-card-title">Payment received successfully</h3>

        <div className="pending-info">
          <p>We're processing your order...</p>
          <p>We've sent a confirmation email with your order details.</p>
          <p className="small-text">
            If you don't see the email within a few minutes, please check your spam folder.
          </p>
        </div>

        {/* Support information */}
        <div className="support-section">
          <h4>Need help?</h4>
          <p>Contact us at <a href="mailto:contact@mzprimer.com">contact@mzprimer.com</a></p>
        </div>
      </div>

      {/* Client-side purchase tracker will handle params */}
      <PurchaseTracker />
    </div>
  );
}