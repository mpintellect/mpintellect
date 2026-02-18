// app/lib/push-utils.ts
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
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

export const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

// Type-safe function to get applicationServerKey
export function getApplicationServerKey(): Uint8Array | null {
  if (!VAPID_PUBLIC_KEY) return null;
  try {
    return urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
  } catch (error) {
    console.error('Error converting VAPID key:', error);
    return null;
  }
}

// Check if push is supported
export function isPushSupported(): boolean {
  return typeof window !== 'undefined' && 
         'serviceWorker' in navigator && 
         'PushManager' in window;
}

// Get current subscription
export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  try {
    if (!isPushSupported()) return null;
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch (error) {
    console.error('Error getting subscription:', error);
    return null;
  }
}

// Check if permission is granted
export async function getPushPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined') return 'default';
  return Notification.permission;
}

// Request push permission
export async function requestPushPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined') return 'default';
  return await Notification.requestPermission();
}

// Convert subscription to JSON safely
export function subscriptionToJSON(subscription: PushSubscription | null): PushSubscriptionJSON | null {
  if (!subscription) return null;
  
  try {
    // Try using the built-in toJSON method first
    if (typeof subscription.toJSON === 'function') {
      return subscription.toJSON();
    }
    
    // Fallback to manual conversion
    return {
      endpoint: subscription.endpoint,
      expirationTime: subscription.expirationTime,
      keys: {
        p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
        auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!)))
      }
    };
  } catch (error) {
    console.error('Error converting subscription to JSON:', error);
    return null;
  }
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