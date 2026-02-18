// app/hooks/usePush.ts
import { useState, useEffect } from 'react';

// Helper function to convert base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePush() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  // 1. Get current user from localStorage (Cloudflare auth)
  useEffect(() => {
    const getUserSession = () => {
      try {
        const userStr = localStorage.getItem("cf_user");
        if (userStr) {
          const userData = JSON.parse(userStr);
          setUser(userData);
        }
        setUserLoading(false);
      } catch (error) {
        console.error("Error reading user session:", error);
        setUserLoading(false);
      }
    };

    getUserSession();
    
    // Listen for auth changes (login/logout)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cf_user") {
        getUserSession();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 2. BROWSER CHECK + RESTORE STATE
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      
      // Check for existing subscription
      navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then(sub => { 
          if (sub) {
            setSubscription(sub);
            
            // Sync with server if we have a user
            if (user?.id) {
              syncSubscriptionWithServer(sub, user);
            }
          }
        });
      }).catch(e => console.log("SW check error", e));
    }
  }, [user?.id]);

  // 3. SYNC SUBSCRIPTION WITH SERVER (when user logs in)
  const syncSubscriptionWithServer = async (sub: PushSubscription, currentUser: any) => {
    try {
      console.log("🔄 Syncing push subscription with server...");
      
      const token = localStorage.getItem('cf_token') || '';
      
      const response = await fetch('/api/push/sync', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: currentUser.id,
          subscription: JSON.parse(JSON.stringify(sub)),
          userData: {
            email: currentUser.email,
            displayName: currentUser.displayName || currentUser.email?.split('@')[0]
          }
        })
      });

      if (response.ok) {
        console.log("✅ Push subscription synced with server");
      }
    } catch (error) {
      console.error("Error syncing subscription:", error);
    }
  };

  // 4. REGISTER SERVICE WORKER WITH TIMEOUT
  const registerServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) throw new Error('SW_NOT_SUPPORTED');

    console.log("📡 SW: Registering...");
    
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    console.log("📡 SW: Waiting for ready state...");
    
    // Wait for the service worker to be ready with timeout
    const readyPromise = navigator.serviceWorker.ready;
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error("SW_TIMEOUT")), 10000)
    );

    const activeRegistration = await Promise.race([readyPromise, timeoutPromise]);
    
    if (!activeRegistration.active) {
      throw new Error("SW_INACTIVE");
    }
    
    console.log('📡 SW: Live -', activeRegistration.active?.state);
    return activeRegistration;
  };

  // 5. SUBSCRIBE TO PUSH NOTIFICATIONS
  const subscribeToPush = async () => {
    if (!isSupported) {
      alert("Push notifications are not supported in your browser.");
      return;
    }
    
    setLoading(true);
    console.log("🚀 STARTING_PUSH_ACTIVATION");

    try {
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) throw new Error("MISSING_VAPID_KEY");

      // 1. Register and Wait with timeout
      const registration = await registerServiceWorker();
      console.log("📡 SW: Active and Ready");

      // 2. Check for existing subscription
      let existingSub = await registration.pushManager.getSubscription();
      
      if (existingSub) {
        console.log("Already subscribed");
        setSubscription(existingSub);
        
        // Sync with server
        if (user?.id) {
          await syncSubscriptionWithServer(existingSub, user);
        }
        
        setLoading(false);
        alert("🎉 You're already subscribed to signals!");
        return;
      }

      // 3. Request Permission Explicitly
      console.log("🔔 Requesting notification permission...");
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') throw new Error("PERMISSION_DENIED");

      // 4. Subscribe - Fix TypeScript error
      console.log("📡 SW: Attempting Subscription...");
      
      // Convert VAPID key to Uint8Array then get buffer as ArrayBuffer
      const uint8Array = urlBase64ToUint8Array(vapidKey);
      const applicationServerKey = uint8Array.buffer as ArrayBuffer;
      
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      });

      console.log("📡 SW: Subscription Object Created");

      // 5. Save to Cloudflare D1 via the correct endpoint
      console.log("💾 Saving subscription to server...");
      const token = localStorage.getItem('cf_token') || '';
      
      // Safely convert subscription to JSON for D1 storage
      let subscriptionData: any;
      try {
        if (typeof sub.toJSON === 'function') {
          subscriptionData = sub.toJSON();
        } else {
          // Manual conversion for older browsers
          subscriptionData = {
            endpoint: sub.endpoint,
            expirationTime: sub.expirationTime,
            keys: {
              p256dh: arrayBufferToBase64(sub.getKey('p256dh')!),
              auth: arrayBufferToBase64(sub.getKey('auth')!)
            }
          };
        }
      } catch (e) {
        console.error("Error converting subscription:", e);
        throw new Error("SUBSCRIPTION_CONVERSION_FAILED");
      }
      
      // Using the Cloudflare Function endpoint
      const saveResponse = await fetch('/api/push/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscription: subscriptionData,
          token: token,
          deviceInfo: navigator.userAgent,
          userData: user ? {
            userId: user.id,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0]
          } : undefined
        })
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json().catch(() => ({}));
        console.error("Server save failed:", errorData);
        throw new Error(errorData.error || "SERVER_SAVE_FAILED");
      }

      setSubscription(sub);
      console.log("✅ PUSH_SUCCESS");
      
      // Send welcome notification if user is logged in
      if (user?.id) {
        await sendWelcomeNotification(user.id);
      }
      
      alert("🎉 Signals Activated!");

    } catch (error: any) {
      console.error("❌ PUSH_CRASH:", error.message || error);
      
      // Handle specific error cases
      if (error.message === "SW_TIMEOUT") {
        alert("⚠️ Connection Timeout. Please refresh and try again.");
      } else if (error.message === "PERMISSION_DENIED") {
        alert("⚠️ Please enable notifications in your browser settings.");
      } else if (error.message === "MISSING_VAPID_KEY") {
        alert("⚠️ Push notification configuration is missing.");
      } else if (error.message === "SERVER_SAVE_FAILED") {
        alert("⚠️ Failed to save to server. Please try again.");
      } else if (error.name === 'AbortError' || error.message === "SW_INACTIVE") {
        alert("⚠️ Activation timed out. Please try again.");
      } else if (error.message === "SW_NOT_SUPPORTED") {
        alert("⚠️ Your browser doesn't support notifications.");
      } else {
        alert(`Error: ${error.message || "Unknown error"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper to convert ArrayBuffer to Base64 for D1 storage
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // 6. SEND WELCOME NOTIFICATION
  const sendWelcomeNotification = async (userId?: string) => {
    try {
      const token = localStorage.getItem('cf_token') || '';
      
      const response = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          targetUserId: userId,
          title: "✅ Signal Alert Active",
          message: "AI monitoring activated. You'll receive real-time Trade Parameters!",
          icon: "/logos/icon-192.png",
          badge: "/logos/icon-192.png",
          tag: "welcome",
          url: "/client/dashboard"
        })
      });

      if (!response.ok) {
        console.warn("Failed to send welcome notification");
      }
    } catch (error) {
      console.error("Error sending welcome notification:", error);
    }
  };

  // 7. UNSUBSCRIBE FROM PUSH NOTIFICATIONS
  const unsubscribeFromPush = async () => {
    if (!subscription) return;

    try {
      setLoading(true);
      
      // Unsubscribe from push service
      const success = await subscription.unsubscribe();
      if (success) {
        console.log("Successfully unsubscribed from push notifications");
        setSubscription(null);
        
        // Notify server to remove from D1
        const token = localStorage.getItem('cf_token') || '';
        
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint
          })
        });
        
        alert("Push notifications disabled.");
      }
    } catch (error) {
      console.error("Error unsubscribing:", error);
      alert("Failed to unsubscribe from push notifications.");
    } finally {
      setLoading(false);
    }
  };

  // 8. CHECK PERMISSION STATUS
  const checkPermission = () => {
    if (!isSupported) return 'unsupported';
    if (!('Notification' in window)) return 'unsupported';
    
    if (Notification.permission === 'granted') {
      return 'granted';
    } else if (Notification.permission === 'denied') {
      return 'denied';
    } else {
      return 'default';
    }
  };

  const isLoading = loading || userLoading;

  return { 
    isSupported, 
    subscription, 
    subscribeToPush, 
    unsubscribeFromPush,
    checkPermission,
    loading: isLoading,
    permissionStatus: checkPermission(),
    user
  };
}

// Helper hook for components
export function usePushStatus() {
  const { 
    isSupported, 
    subscription, 
    permissionStatus, 
    loading,
    user 
  } = usePush();
  
  return {
    isPushEnabled: !!subscription,
    isSupported,
    permissionStatus,
    isLoading: loading,
    hasPermission: permissionStatus === 'granted',
    isLoggedIn: !!user?.id,
    canEnablePush: isSupported && permissionStatus !== 'denied' && !subscription
  };
}