// public/sw-push.js

// Service Worker for handling push notifications
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  console.log('Push event received:', event);

  let notificationData = {
    title: 'MPIntellect ',
    body: 'New notification',
    icon: '/logos/mzlogo.webp',
    badge: '/logos/mzlogo.webp',
    data: {},
  };

  try {
    if (event.data) {
      const data = event.data.json();
      notificationData = {
        title: data.title || 'MPIntellect ',
        body: data.body || 'New notification',
        icon: data.icon || '/logos/mzlogo.webp',
        badge: data.badge || '/logos/mzlogo.webp',
        data: data.data || {},
        actions: data.actions || [],
        tag: data.tag || 'default',
      };
    }
  } catch (error) {
    console.error('Error parsing push data:', error);
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    data: notificationData.data,
    actions: notificationData.actions,
    tag: notificationData.tag,
    vibrate: [200, 100, 200],
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification);

  event.notification.close();

  const urlToOpen = event.notification.data?.url || 'https://mpintellect.com';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification);
});