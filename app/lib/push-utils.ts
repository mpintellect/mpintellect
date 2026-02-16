// app/lib/push-utils.ts
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

// Type-safe function to get applicationServerKey
function getApplicationServerKey(): Uint8Array | null {
  if (!VAPID_PUBLIC_KEY) return null;
  try {
    return urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
  } catch (error) {
    console.error('Error converting VAPID key:', error);
    return null;
  }
}

// Subscribe to push notifications
// Subscribe to push notifications
export async function subscribeToPush(): Promise<{ success: boolean; subscription?: PushSubscription }> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications not supported');
    return { success: false };
  }

  try {
    // 1. Call the function and store the result in a variable
    const key = getApplicationServerKey(); 
    
    if (!key) {
      console.warn('VAPID public key not configured');
      return { success: false };
    }

    const registration = await navigator.serviceWorker.ready;

    // 2. Use that variable with the "as any" cast
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: key as any // ✅ Now 'key' is defined and cast correctly
    });

    return { success: true, subscription };
  } catch (error) {
    console.error('Error subscribing to push:', error);
    return { success: false };
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPush(): Promise<{ success: boolean }> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    console.error('Error unsubscribing from push:', error);
    return { success: false };
  }
}

// Send push notification (admin function)
export async function sendPushNotification(
  subscription: PushSubscriptionJSON,
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<{ success: boolean }> {
  try {
    const response = await fetch('/api/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription, title, body, data })
    });
    
    return { success: response.ok };
  } catch (error) {
    console.error('Error sending push:', error);
    return { success: false };
  }
}

// Get current subscription
export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch (error) {
    console.error('Error getting subscription:', error);
    return null;
  }
}

// Check if push is supported
export function isPushSupported(): boolean {
  return typeof window !== 'undefined' && 
         'serviceWorker' in navigator && 
         'PushManager' in window;
}

// Check if permission is granted
export async function getPushPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined') return 'default';
  return Notification.permission;
}

// Request push permission
export async function requestPushPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined') return 'default';
  
  // Handle Safari which doesn't support async Notification.requestPermission
  if (typeof Notification !== 'undefined' && 
      Notification.permission === 'default' &&
      typeof Notification.requestPermission === 'function') {
    return new Promise(resolve => {
      Notification.requestPermission(permission => resolve(permission));
    });
  }
  
  return await Notification.requestPermission();
}

// Convert subscription to JSON
export function subscriptionToJSON(subscription: PushSubscription | null): PushSubscriptionJSON | null {
  if (!subscription) return null;
  
  return {
    endpoint: subscription.endpoint,
    expirationTime: subscription.expirationTime,
    keys: {
      p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
      auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!)))
    }
  };
}

// Check if we have a valid subscription
export async function hasValidSubscription(): Promise<boolean> {
  if (!isPushSupported()) return false;
  
  try {
    const subscription = await getCurrentSubscription();
    return subscription !== null;
  } catch (error) {
    console.error('Error checking subscription:', error);
    return false;
  }
}

// Simple wrapper for compatibility
export default {
  urlBase64ToUint8Array,
  VAPID_PUBLIC_KEY,
  subscribeToPush,
  unsubscribeFromPush,
  sendPushNotification,
  getCurrentSubscription,
  isPushSupported,
  getPushPermission,
  requestPushPermission,
  hasValidSubscription
};