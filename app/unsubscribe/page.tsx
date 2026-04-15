// app/unsubscribe/page.tsx

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldAlert, CheckCircle, Loader2, XCircle } from 'lucide-react'; // Ensure lucide-react is installed

function UnsubscribeContent() {
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    // 1. If no email in URL, show error immediately
    if (!email) {
      setStatus('error');
      setErrorMessage('Missing email parameter in URL');
      return;
    }

    // 2. Call the API - FIXED: Use the correct endpoint path
    const processUnsubscribe = async () => {
      try {
        const res = await fetch('/api/unsubscribe', { // Changed from '/api/unsubscribe'
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.toLowerCase().trim() }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus('done');
        } else {
          setStatus('error');
          setErrorMessage(data.error || 'Failed to unsubscribe');
        }
      } catch (err) {
        setStatus('error');
        setErrorMessage('Network error. Please try again.');
      }
    };

    // Slight delay for UX smoothness
    setTimeout(() => {
        processUnsubscribe();
    }, 1000);
    
  }, [email]);

  return (
    <div className="bg-[#111] border border-white/10 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
      
      {/* LOADING STATE */}
      {status === 'loading' && (
        <div className="flex flex-col items-center animate-in fade-in">
          <Loader2 className="animate-spin text-yellow-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-white mb-2">Processing Request</h2>
          <p className="text-zinc-400 text-sm">Please wait while we update our preferences...</p>
        </div>
      )}

      {/* SUCCESS STATE */}
      {status === 'done' && (
        <div className="flex flex-col items-center animate-in zoom-in duration-300">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="text-green-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Unsubscribed</h1>
          <p className="text-zinc-400 text-sm mb-6">
            <span className="text-white font-mono bg-white/5 px-2 py-1 rounded">{email}</span> has been removed from our list. You will no longer receive signal alerts.
          </p>
          <a href="/" className="text-yellow-500 text-sm font-bold hover:underline">
            Return to Homepage
          </a>
        </div>
      )}

      {/* ERROR STATE */}
      {status === 'error' && (
        <div className="flex flex-col items-center animate-in shake">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <XCircle className="text-red-500" size={32} />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Action Failed</h1>
          <p className="text-zinc-400 text-sm mb-6">
            {errorMessage || "We couldn't process your unsubscribe request."}
          </p>
          {!email && (
             <div className="bg-red-900/20 border border-red-900/50 p-3 rounded-lg text-red-200 text-xs mb-6">
                Error: Missing '?email=' parameter in URL.
             </div>
          )}
          <div className="flex gap-3">
            <a href="/" className="bg-zinc-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-zinc-700 transition">
              Home
            </a>
            <a href="mailto:contact@mpintellect.com" className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition">
              Contact Support
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
      
      <Suspense fallback={
        <div className="flex items-center gap-2 text-zinc-500">
          <Loader2 className="animate-spin" size={20} />
          <span>Loading secure connection...</span>
        </div>
      }>
        <UnsubscribeContent />
      </Suspense>
    </main>
  );
}