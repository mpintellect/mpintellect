'use client';

import { usePush } from '../app/hooks/usePush';

export default function NotificationButton() {
  const { isSupported, subscription, subscribeToPush, loading } = usePush();

  // Don't render if browser doesn't support Push API (e.g. very old browser)
  if (!isSupported) {
    return null;
  }

  return (
    <div className="my-4">
      {subscription ? (
        <div className="flex items-center text-green-600 gap-2">
          <span className="text-xl">✓</span>
          <span className="text-sm font-semibold">Notifications Active</span>
        </div>
      ) : (
        <button
          onClick={subscribeToPush}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm px-4 py-2 rounded transition-colors shadow-md"
        >
          {loading ? 'Enabling...' : 'Enable Push Notifications'}
        </button>
      )}
    </div>
  );
}