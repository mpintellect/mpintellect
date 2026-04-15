'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

// 🛑 CONFIG: Your Affiliate Link
const BROKER_LINK = "https://www.litefinance.org/fr/?uid=967798214";

export default function BrokerInvitePage() {
  const [redirecting, setRedirecting] = useState(true);
  const [count, setCount] = useState(3);

  useEffect(() => {
    // 1. Fire Pixel (Track this as a Conversion)
    if (typeof window !== 'undefined' && (window as any).fbq) {
      console.log('📡 Firing FB Lead Event');
      (window as any).fbq('track', 'Lead', {
        content_name: 'Broker Handoff',
        currency: 'USD',
        value: 10.00 // Arbitrary value for the lead
      });
    }

    // 2. Countdown Logic
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRedirect = () => {
    setRedirecting(false); // Stop loader visual
    window.location.href = BROKER_LINK; // Go to broker
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center font-sans">
      
      {/* CARD */}
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>

        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6 border border-zinc-700">
          <ShieldCheck className="text-green-500 w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Secure Handoff</h1>
        <p className="text-zinc-400 text-sm mb-8">
          Redirecting you to our verified partner broker for secure registration.
        </p>

        {/* Status Box */}
        <div className="bg-black/50 border border-zinc-800 rounded-lg p-4 mb-8 flex items-center justify-center gap-3">
          {count > 0 ? (
            <>
              <Loader2 className="animate-spin text-blue-500" size={20} />
              <span className="text-zinc-300 text-sm">Redirecting in {count}s...</span>
            </>
          ) : (
            <span className="text-green-500 text-sm font-bold">Transferring...</span>
          )}
        </div>

        {/* Manual Button (In case auto fails) */}
        <button
          onClick={handleRedirect}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
        >
          Continue to Broker <ArrowRight size={18} />
        </button>

        <p className="mt-6 text-[10px] text-zinc-600">
          You are leaving MPIntellect. Ensure you are on the official broker URL.
        </p>

      </div>
    </div>
  );
}