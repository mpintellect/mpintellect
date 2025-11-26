import { useState, useEffect } from 'react';
import { urlBase64ToUint8Array } from '../lib/push-utils'; 
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../lib/firebaseClient'; 
import { signInAnonymously } from "firebase/auth"; 
import { doc, setDoc, Timestamp, getDoc } from "firebase/firestore"; 

export function usePush() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  // 1. BROWSER CHECK + RESTORE STATE
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      navigator.serviceWorker.ready.then(reg => {
          reg.pushManager.getSubscription().then(sub => { 
              if (sub) setSubscription(sub); 
          });
      }).catch(e => console.log("SW check error", e));
    }
  }, []);

  // 2. NEW: SILENT MIGRATION / SYNC
  // Whenever 'user' or 'subscription' changes, ensure DB is synced.
  useEffect(() => {
    async function syncUserSubscription() {
        // Conditions: User exists, Subscription exists, and User is NOT Anonymous (They logged in)
        if (user && subscription && !user.isAnonymous) {
            
            console.log("🔄 Detected Logged In User + Existing Push. Syncing...");
            
            // Check if this user already has this saved (Optimize reads)
            const userPushRef = doc(db, "push_subscriptions", user.uid);
            
            // We save cleanly to the NEW Real User ID
            await setDoc(userPushRef, {
                userId: user.uid,
                // Add Personal Data if available
                email: user.email || null,
                phoneNumber: user.phoneNumber || null,
                displayName: user.displayName || null,
                
                // Keep the Token
                subscriptionData: JSON.parse(JSON.stringify(subscription)), 
                lastSynced: Timestamp.now(),
                
                // Update Type
                type: 'identified_client', // IMPORTANT: Now we know who they are
                source: 'conversion_sync',
                deviceInfo: navigator.userAgent
            }, { merge: true });

            console.log("✅ Push Subscription linked to Email/Phone User:", user.email);
        }
    }

    syncUserSubscription();
  }, [user, subscription]); // Runs automatically when user logs in or allows push

  // 3. SUBSCRIBE FUNCTION (Triggered by Buttons)
  const subscribeToPush = async () => {
    if (!isSupported) {
        console.log("Push not supported");
        return;
    }
    
    setLoading(true);

    try {
        let currentUser = user;
        if (!currentUser) {
            console.log("Logging in Anonymously...");
            const userCredential = await signInAnonymously(auth);
            currentUser = userCredential.user;
        }
        
        if (!currentUser) throw new Error("Auth Failed");

        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidKey) throw new Error("VAPID Key Missing");

        const registration = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;

        const sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });

        // Client-Side Save
        const userPushRef = doc(db, "push_subscriptions", currentUser.uid);
        const pushData = {
            userId: currentUser.uid,
            // Capture email/phone if they happen to be logged in already
            email: currentUser.email || null,
            phoneNumber: currentUser.phoneNumber || null,
            
            subscriptionData: JSON.parse(JSON.stringify(sub)),
            createdAt: Timestamp.now(),
            type: currentUser.isAnonymous ? 'anonymous_lead' : 'identified_client',
            source: 'welcome_popup',
            deviceInfo: navigator.userAgent
        };

        await setDoc(userPushRef, pushData, { merge: true });
        setSubscription(sub);

        // Send Welcome Ping
        fetch('/api/push/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                targetUserId: currentUser.uid, 
                title: "Signal Alert Active", 
                message: "Monitoring AI feeds...",
                sendToAll: false 
            })
        }).catch(err => {});

    } catch (error: any) {
        console.error("Subscribe Error:", error);
        alert("Activation failed: " + error.message);
    } finally {
        setLoading(false);
    }
  };

  return { isSupported, subscription, subscribeToPush, loading };
}