// sw.js - Institutional Grade Service Worker
const CACHE_NAME = 'mzprimer-v1';
const LOGO_CACHE_NAME = 'mzprimer-logos-v1';

const LOGO_URLS = [
  '/logos/mzlogo.webp',
  '/logos/icon-512.webp',
  '/logos/icon-512.webp',
  '/logos/icon-192.webp',
  '/logos/stripe.svg',
  '/logos/visa.svg',
  '/logos/mastercard.svg',
  '/logos/Applepay.svg',
  '/logos/google.svg',
  '/logos/pci.svg'
];

// 1. Install - Cache Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(LOGO_CACHE_NAME).then((cache) => cache.addAll(LOGO_URLS))
    .then(() => self.skipWaiting()) // Force activation
  );
});

// 2. Activate - Cleanup & Claim
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((k) => (k !== LOGO_CACHE_NAME && k !== CACHE_NAME) && caches.delete(k))
    )).then(() => self.clients.claim()) // Take control immediately
  );
});

// 3. Fetch - Cache First for Logos
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/logos/')) {
    event.respondWith(
      caches.match(event.request).then((res) => res || fetch(event.request))
    );
  }
});

// 4. Push - Combined Logic
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();

  const options = {
    body: data.body || data.message || 'New market intelligence available.',
    icon: '/logos/icon-512.webp',
    badge: '/logos/icon-512.webp',
    vibrate: [100, 50, 100],
    tag: data.tag || 'mz-signal',
    data: { url: data.url || data.data?.url || '/' },
    actions: [
      { action: 'view', title: '📈 View Intel' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'MZ Intelligence', options)
  );
});

// 5. Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const targetUrl = event.notification.data.url;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsList) => {
      for (const client of clientsList) {
        if (client.url === targetUrl && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});