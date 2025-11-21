import { useState, useEffect } from 'react';
import { urlBase64ToUint8Array } from '../lib/push-utils'; // Ensure correct path
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebaseClient'; 

export function usePush() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkExistingSubscription();
    }
  }, []);

  const checkExistingSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
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
    
    // SAFETY CHECK: Verify Vapid Key Exists
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) {
        console.error("Missing VAPID public key in environment variables.");
        alert("System Error: Push keys are missing.");
        return;
    }

    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      const idToken = await user.getIdToken();

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
      alert("Failed to enable. Check permissions.");
    } finally {
      setLoading(false);
    }
  };

  return { isSupported, subscription, subscribeToPush, loading };
}