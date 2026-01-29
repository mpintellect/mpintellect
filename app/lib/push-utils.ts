// app/lib/push-utils.ts
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Generate VAPID keys (run once)
export async function generateVAPIDKeys() {
  const webpush = await import('web-push');
  const vapidKeys = webpush.generateVAPIDKeys();
  
  return {
    publicKey: vapidKeys.publicKey,
    privateKey: vapidKeys.privateKey
  };
}

// Check browser support
export function checkPushSupport(): boolean {
  return typeof window !== 'undefined' && 
         'serviceWorker' in navigator && 
         'PushManager' in window &&
         'Notification' in window;
}