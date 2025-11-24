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
    // 1. Robust Feature Detection
    const checkSupport = () => {
        if (typeof window === 'undefined') return;
        // Check for Service Worker & Push API
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);
            
            // Try to find existing subscription
            navigator.serviceWorker.ready.then(reg => {
                reg.pushManager.getSubscription().then(sub => {
                    if (sub) setSubscription(sub);
                });
            }).catch(e => console.log("SW check error", e));
        } else {
            console.log("Push not supported on this device/browser.");
        }
    };
    checkSupport();
  }, []);

  const subscribeToPush = async () => {
    // 2. Allow logic to proceed if supported, otherwise alert
    if (!isSupported) {
        alert("Push notifications are not supported on this browser (or need 'Add to Homescreen' on iOS).");
        return;
    }
    setLoading(true);

    try {
        // --- A. AUTHENTICATE ---
        let currentUser = user;
        if (!currentUser) {
            try {
                const userCredential = await signInAnonymously(auth);
                currentUser = userCredential.user;
            } catch (e: any) {
                throw new Error("Login failed. Check internet connection.");
            }
        }

        // --- B. VALIDATE KEY ---
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidKey) throw new Error("Server configuration error: VAPID Key missing");

        // --- C. BROWSER PERMISSION ---
        // Ensure worker is active
        const registration = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready; // Wait for active state

        // Prompt User
        const sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });

        // --- D. DATABASE REGISTER ---
        const idToken = await currentUser.getIdToken();
        const res = await fetch('/api/push/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription: sub, idToken }),
        });

        const textResponse = await res.text(); // Read text to see error HTML if 500/404 happens
        if (!res.ok) {
            console.error("Backend Error Response:", textResponse);
            throw new Error(`Server connection failed (${res.status})`);
        }

        setSubscription(sub);

        // --- E. WELCOME MSG ---
        fetch('/api/push/send', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                targetUserId: currentUser.uid, 
                title: "Notifications Active", 
                message: "You will receive AI trade signals here." 
            })
        }).catch(e => console.log("Welcome msg skipped"));

    } catch (error: any) {
        console.error("FULL SUBSCRIBE ERROR:", error);
        alert(`Setup Failed: ${error.message}`);
    } finally {
        setLoading(false);
    }
  };

  return { isSupported, subscription, subscribeToPush, loading };
}