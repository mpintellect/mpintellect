import { useState, useEffect } from 'react';
import { urlBase64ToUint8Array } from '../lib/push-utils'; 
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebaseClient'; 
import { signInAnonymously } from "firebase/auth"; 

export function usePush() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      navigator.serviceWorker.ready.then(reg => {
          reg.pushManager.getSubscription().then(sub => { if (sub) setSubscription(sub); });
      }).catch(e => console.log(e));
    }
  }, []);

  const subscribeToPush = async () => {
    if (!isSupported) {
        alert("Not supported on this browser.");
        return;
    }
    setLoading(true);

    try {
        // 1. AUTH
        let currentUser = user;
        if (!currentUser) {
            console.log("Creating Anonymous User...");
            const userCredential = await signInAnonymously(auth);
            currentUser = userCredential.user;
        }

        // 2. VAPID KEY
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidKey) throw new Error("VAPID Key Missing");

        // 3. REGISTER WORKER
        console.log("Registering SW...");
        const registration = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });

        // 4. SAVE TO DB (THE CRASH POINT)
        const idToken = await currentUser.getIdToken();
        const res = await fetch('/api/push/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription: sub, idToken }),
        });

        // --- SAFELY READ RESPONSE ---
        // We get text first, because if it's not JSON, .json() crashes
        const responseText = await res.text();
        
        if (!res.ok) {
            // Throw specific error from server
            throw new Error(`Server Error (${res.status}): ${responseText.slice(0, 100)}...`);
        }
        
        // Parse JSON only if OK
        const data = responseText ? JSON.parse(responseText) : {};
        console.log("Register Success:", data);

        setSubscription(sub);

        // Welcome Msg
        fetch('/api/push/send', {
            method: 'POST',
            body: JSON.stringify({ targetUserId: currentUser.uid, title: "Welcome!", message: "Notifications Active." })
        }).catch(e => console.error("Welcome send skipped"));

    } catch (error: any) {
        console.error("DEBUG:", error);
        // Alert the actual server text
        alert(`Setup Failed: ${error.message}`);
    } finally {
        setLoading(false);
    }
  };

  return { isSupported, subscription, subscribeToPush, loading };
}