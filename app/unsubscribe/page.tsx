'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function UnsubscribeInner() {
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      setStatus('error');
      return;
    }

    const unsubscribe = async () => {
      try {
        const res = await fetch('/api/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (res.ok) setStatus('done');
        else setStatus('error');
      } catch (err) {
        setStatus('error');
      }
    };

    unsubscribe();
  }, [email]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="max-w-md text-center">
        {status === 'loading' && <p>Processing your unsubscribe request...</p>}
        {status === 'done' && (
          <>
            <h1 className="text-3xl font-bold mb-6">You’ve been unsubscribed</h1>
            <p className="text-gray-300 mb-4">
              You will no longer receive emails from MZPrimer.
            </p>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="text-3xl font-bold mb-6">Something went wrong</h1>
            <p className="text-red-400">
              Could not unsubscribe. Please contact{' '}
              <a href="mailto:contact@mzprimer.com" className="underline">
                support
              </a>.
            </p>
          </>
        )}
      </div>
    </main>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="text-white p-8">Loading...</div>}>
      <UnsubscribeInner />
    </Suspense>
  );
}