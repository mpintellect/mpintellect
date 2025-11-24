'use client';

import { usePush } from '@/app/hooks/usePush'; // Adjust path if needed '../hooks/usePush'
import { useState, useEffect } from 'react';
import { Bell, CheckCircle, Loader2 } from 'lucide-react'; // If you don't have Lucide, use SVG

export default function NotificationButton() {
  const { isSupported, subscription, subscribeToPush, loading } = usePush();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch (ensure it renders on client)
  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. If not mounted yet (server-side), show a placeholder to keep layout stable
  if (!mounted) {
     return <div className="text-gray-600 text-xs">Loading options...</div>;
  }

  // 2. IMPORTANT: Even if isSupported is false initially, show 'Checking...' 
  // or a disabled button instead of null, so you can debug layout.
  // We only hide if we are 100% sure it's NOT supported (after mount).
  if (mounted && !isSupported && 'serviceWorker' in navigator) {
      // browser is likely checking
  } else if (mounted && !isSupported) {
      return null; // NOW it is safe to return null (it really isn't supported)
  }

  return (
    <div className="notification-container">
      {subscription ? (
        <div className="notification-active-text">
          {/* <CheckCircle size={18} /> */}
          <span className="checkmark-icon">✓</span>
          <span>Notifications Active</span>
        </div>
      ) : (
        <button
          onClick={subscribeToPush}
          disabled={loading}
          className="btn-notification-gold"
          title="Receive signals & updates"
        >
          {loading ? (
             // <Loader2 size={16} className="animate-spin" /> 
             <span>...</span>
          ) : (
             // <Bell size={16} /> 
             <span>🔔</span>
          )}
          <span>{loading ? 'Activating...' : 'Enable Notifications'}</span>
        </button>
      )}
    </div>
  );
}