import { useState, useEffect } from 'react';
import { urlBase64ToUint8Array } from '../lib/push-utils';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebaseClient'; // Your provided client file

export function usePush() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check support on mount
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkExistingSubscription();
    }
  }, []);

  const checkExistingSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready; // wait for SW
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        setSubscription(sub);
      }
    } catch (error) {
      console.error("Error checking subscription", error);
    }
  };

  const subscribeToPush = async () => {
    if (!user) {
        alert("You must be logged in to subscribe.");
        return;
    }

    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // 1. Ask browser for permission
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      });

      // 2. Get Firebase ID Token
      const idToken = await user.getIdToken();

      // 3. Send to your Backend
      const res = await fetch('/api/push/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub, idToken }),
      });

      if (!res.ok) throw new Error('Failed to save subscription on server');

      setSubscription(sub);
      alert("Success! Notifications enabled.");
    } catch (error) {
      console.error("Subscription failed:", error);
      alert("Failed to enable notifications. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return { isSupported, subscription, subscribeToPush, loading };
}