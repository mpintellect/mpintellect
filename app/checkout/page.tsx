import { Suspense } from 'react';
import CheckoutClient from './CheckoutClient';
// app/checkout/page.tsx
export const metadata = {
  title: 'Checkout – MZPrimer',
  description: 'Secure checkout for MZPrimer products.',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  return (
    <Suspense fallback={<div className="checkout-container">Loading…</div>}>
      <CheckoutClient />
    </Suspense>
  );
}