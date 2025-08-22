import { Suspense } from 'react';
import CheckoutClient from './CheckoutClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  return (
    <Suspense fallback={<div className="checkout-container">Loading…</div>}>
      <CheckoutClient />
    </Suspense>
  );
}