// app/hooks/usePush.ts - CLOUDFLARE VERSION
import { useState, useEffect } from 'react';
import { urlBase64ToUint8Array } from '../lib/push-utils'; 

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
      
      const response = await fetch('/api/push/sync', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('cf_token') || ''}`
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

 // 4. CHECK AND REGISTER SERVICE WORKER (Improved)
const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        // ✅ CRITICAL FIX: Wait for the worker to be "Ready"
        // This stops the AbortError by ensuring a worker is active before subscribing
        const activeRegistration = await navigator.serviceWorker.ready;
        
        console.log('Service Worker Live:', activeRegistration.active?.state);
        return activeRegistration;
      } catch (error) {
        console.error('SW Registration Error:', error);
        throw error;
      }
    }
    throw new Error('Service Workers not supported');
  };

// 5. SUBSCRIBE TO PUSH NOTIFICATIONS (Improved)
const subscribeToPush = async () => {
  if (!isSupported) {
    alert("Push notifications are not supported in your browser.");
    return;
  }
  
  setLoading(true);

  try {
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) throw new Error("VAPID public key is not configured");

    // 1. Ensure worker is registered AND active
    const registration = await registerServiceWorker();
    
    if (!registration.active) {
      throw new Error("Service worker failed to activate in time. Please refresh and try again.");
    }

    // 2. Check for existing subscription
    let existingSub = await registration.pushManager.getSubscription();
    
    if (existingSub) {
      console.log("Already subscribed");
      setSubscription(existingSub);
      setLoading(false);
      return;
    }

    // 3. Subscribe with the active registration
    const sub = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  // ✅ Directly call the utility and cast the result
  applicationServerKey: urlBase64ToUint8Array(vapidKey) as any,
});

    // 4. Save to Cloudflare D1 via your API
    const saveResponse = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('cf_token') || ''}`
      },
      body: JSON.stringify({
        subscription: JSON.parse(JSON.stringify(sub)),
        deviceInfo: navigator.userAgent
      })
    });

    if (!saveResponse.ok) throw new Error('Failed to save to server');

    setSubscription(sub);
    alert("🎉 Signals Activated!");

  } catch (error: any) {
    console.error("Subscribe Error:", error);
    // Handle the AbortError specifically
    if (error.name === 'AbortError') {
      alert("⚠️ Activation timed out. Please try one more time.");
    } else {
      alert("Activation failed: " + error.message);
    }
  } finally {
    setLoading(false);
  }
};

  // 6. SEND WELCOME NOTIFICATION
  const sendWelcomeNotification = async (userId?: string) => {
    try {
      const response = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('cf_token') || ''}`
        },
        body: JSON.stringify({
          targetUserId: userId,
          title: "✅ Signal Alert Active",
          message: "AI monitoring activated. You'll receive real-time Trade Parameterss!",
          icon: "/icons/icon-192x192.png",
          badge: "/icons/badge-72x72.png",
          tag: "welcome",
          data: {
            url: "/client/dashboard",
            timestamp: new Date().toISOString()
          }
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
      // Unsubscribe from push service
      const success = await subscription.unsubscribe();
      if (success) {
        console.log("Successfully unsubscribed from push notifications");
        setSubscription(null);
        
        // Notify server
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('cf_token') || ''}`
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
    }
  };

  // 8. CHECK PERMISSION STATUS
  const checkPermission = () => {
    if (!isSupported) return 'unsupported';
    
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

// Helper hook for components that need push notification status
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