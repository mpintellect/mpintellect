import { Suspense } from 'react';
import CheckoutClient from '../checkout/CheckClient';

export const metadata = {
  title: 'Checkout – MPIntellect ',
  description: 'Secure checkout for MPIntellect  products.',
  robots: { index: false, follow: false },
};

// CHANGE: Remove dynamic, make it static
// export const dynamic = 'force-dynamic'; // ❌ REMOVE THIS
// export const revalidate = 0; // ❌ REMOVE THIS

// ADD: Make it static
export const dynamic = 'force-static';

export default function Page() {
  return (
    <Suspense fallback={<div className="checkout-container">Loading…</div>}>
      <CheckoutClient />
    </Suspense>
  );
}