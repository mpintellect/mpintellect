import { useState, useEffect } from 'react';
import { urlBase64ToUint8Array } from '../lib/push-utils'; 
import { getAuthInstance, getDbInstance } from '../lib/firebaseClient'; 
import { signInAnonymously, onAuthStateChanged } from "firebase/auth"; 
import { doc, setDoc, Timestamp } from "firebase/firestore"; 

export function usePush() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [user, setUser] = useState<any>(null);
  const [authInstance, setAuthInstance] = useState<any>(null);
  const [dbInstance, setDbInstance] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // 1. Initialize Firebase instances
  useEffect(() => {
    try {
      const authInst = getAuthInstance();
      const dbInst = getDbInstance();
      setAuthInstance(authInst);
      setDbInstance(dbInst);
      
      // Set up auth state listener
      const unsubscribe = onAuthStateChanged(authInst, (user) => {
        setUser(user);
        setAuthLoading(false);
      });
      
      return () => unsubscribe();
    } catch (error) {
      console.error("Firebase not initialized in usePush:", error);
      setAuthLoading(false);
    }
  }, []);

  // 2. BROWSER CHECK + RESTORE STATE
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

  // 3. NEW: SILENT MIGRATION / SYNC
  useEffect(() => {
    async function syncUserSubscription() {
        // Conditions: User exists, Subscription exists, and User is NOT Anonymous (They logged in)
        if (user && subscription && !user.isAnonymous && dbInstance) {
            
            console.log("🔄 Detected Logged In User + Existing Push. Syncing...");
            
            // Check if this user already has this saved (Optimize reads)
            const userPushRef = doc(dbInstance, "push_subscriptions", user.uid);
            
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
  }, [user, subscription, dbInstance]);

  // 4. SUBSCRIBE FUNCTION (Triggered by Buttons)
  const subscribeToPush = async () => {
    if (!isSupported) {
        console.log("Push not supported");
        return;
    }
    
    setLoading(true);

    try {
        if (!authInstance || !dbInstance) {
            throw new Error("Firebase not initialized");
        }

        let currentUser = user;
        if (!currentUser) {
            console.log("Logging in Anonymously...");
            const userCredential = await signInAnonymously(authInstance);
            currentUser = userCredential.user;
            setUser(currentUser); // Update user state
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
        const userPushRef = doc(dbInstance, "push_subscriptions", currentUser.uid);
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

  const isLoading = loading || authLoading;

  return { isSupported, subscription, subscribeToPush, loading: isLoading };
}