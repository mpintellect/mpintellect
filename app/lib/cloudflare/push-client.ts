// app/lib/cloudflare/push-client.ts

const PUSH_WORKER_URL = process.env.NEXT_PUBLIC_PUSH_WORKER_URL || 'https://push.mzprimer.com';

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  timestamp?: number;
}

export class CloudflarePushClient {
  private workerUrl: string;

  constructor(workerUrl: string = PUSH_WORKER_URL) {
    this.workerUrl = workerUrl;
  }

  // Subscribe to push notifications
  async subscribe(subscription: PushSubscriptionData, userId?: string, email?: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.workerUrl}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          userId,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error(`Subscription failed: ${response.status}`);
      }

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Subscribe error:', error);
      return false;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe(endpoint: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.workerUrl}/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint }),
      });

      if (!response.ok) {
        throw new Error(`Unsubscribe failed: ${response.status}`);
      }

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Unsubscribe error:', error);
      return false;
    }
  }

  // Send a single push notification
  async sendNotification(
    subscription: PushSubscriptionData,
    notification: PushNotification
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.workerUrl}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          payload: notification,
        }),
      });

      if (!response.ok) {
        throw new Error(`Send failed: ${response.status}`);
      }

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Send notification error:', error);
      return false;
    }
  }

  // Broadcast to all users
  async broadcast(notification: PushNotification): Promise<{
    success: boolean;
    stats?: any;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.workerUrl}/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        throw new Error(`Broadcast failed: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Broadcast error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get push statistics
  async getStats(): Promise<any> {
    try {
      const response = await fetch(`${this.workerUrl}/stats`);
      
      if (!response.ok) {
        throw new Error(`Stats failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get stats error:', error);
      return null;
    }
  }

  // Test push notification
  async testPush(endpoint?: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.workerUrl}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint }),
      });

      if (!response.ok) {
        throw new Error(`Test failed: ${response.status}`);
      }

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Test push error:', error);
      return false;
    }
  }

  // Request browser permission and subscribe
  async requestPermissionAndSubscribe(userId?: string, email?: string): Promise<PushSubscriptionData | null> {
    try {
      // Check if service workers are supported
      if (!('serviceWorker' in navigator)) {
        console.warn('Service workers not supported');
        return null;
      }

      // Check if push manager is supported
      if (!('PushManager' in window)) {
        console.warn('Push notifications not supported');
        return null;
      }

      // Request permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
        return null;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw-push.js');
      
      // Get subscription
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        // Subscribe with VAPID public key
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidPublicKey) {
          throw new Error('VAPID public key not configured');
        }

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey),
        });
      }

      // Convert to our format
      const subscriptionData: PushSubscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(
            String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))
          ),
          auth: btoa(
            String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!))
          ),
        },
      };

      // Register with Cloudflare worker
      const success = await this.subscribe(subscriptionData, userId, email);
      
      if (success) {
        return subscriptionData;
      } else {
        // Unsubscribe if registration failed
        await subscription.unsubscribe();
        return null;
      }
    } catch (error) {
      console.error('Permission/subscribe error:', error);
      return null;
    }
  }

  // Helper to convert base64 URL to Uint8Array
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
  }
}

// Singleton instance
export const pushClient = new CloudflarePushClient();