// public/service-worker.js
self.addEventListener('push', function(event) {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: data.data || {},
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

self.addEventListener('pushsubscriptionchange', function(event) {
  event.waitUntil(
    fetch('/api/push/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        oldSubscription: event.oldSubscription ? event.oldSubscription.toJSON() : null,
        newSubscription: event.newSubscription ? event.newSubscription.toJSON() : null
      })
    })
  );
});