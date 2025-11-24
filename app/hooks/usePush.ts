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
    // 1. Initial Check: Does this browser support SW?
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      
      // Attempt to restore existing sub
      navigator.serviceWorker.ready.then(reg => {
          reg.pushManager.getSubscription().then(sub => {
              if (sub) setSubscription(sub);
          });
      }).catch(e => console.log("SW not ready yet"));
      
    } else {
      setIsSupported(false);
      console.warn("Push Notifications are NOT supported in this browser.");
    }
  }, []);

  const subscribeToPush = async () => {
    // 2. CRASH PROTECTION: Stop if API missing
    if (!isSupported || !('serviceWorker' in navigator)) {
        alert("Your browser does not support notifications (or you are in Private/Incognito mode).");
        return;
    }

    setLoading(true);

    try {
        // 3. STEP A: LOGIN (Ghost User)
        let currentUser = user;
        if (!currentUser) {
            console.log("Creating Anonymous User...");
            try {
                const userCredential = await signInAnonymously(auth);
                currentUser = userCredential.user;
            } catch (authError: any) {
                console.error("Auth Failed:", authError);
                // Depending on Firebase settings, this might fail on networks with strict firewalls
                throw new Error("Could not create anonymous ID. Adblocker might be interfering.");
            }
        }

        // 4. STEP B: VAPID KEY
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidKey) throw new Error("Missing VAPID Key");

        // 5. STEP C: BROWSER PERMISSION
        console.log("Registering Worker...");
        // Use '.ready' to ensure we don't race against the browser logic
        // Try registering, or wait if it's already there
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        await navigator.serviceWorker.ready; // Wait until active

        console.log("Asking Permission...");
        const sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });

        // 6. STEP D: SAVE TO DB
        console.log("Saving to DB for UID:", currentUser.uid);
        const idToken = await currentUser.getIdToken();

        const res = await fetch('/api/push/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription: sub, idToken }),
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "Server failed to save subscription");
        }

        // 7. SUCCESS
        setSubscription(sub);
        
        // Welcome Message (Optional, failures ignored)
        fetch('/api/push/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                targetUserId: currentUser.uid, 
                title: "Welcome to MZ Primer!", 
                message: "Notifications are now active.",
                url: "/" 
            }),
        }).catch(e => console.log("Welcome msg skipped"));

    } catch (error: any) {
        console.error("Subscription Flow Failed:", error);
        alert(`Setup Failed: ${error.message}`);
    } finally {
        setLoading(false);
    }
  };

  return { isSupported, subscription, subscribeToPush, loading };
}