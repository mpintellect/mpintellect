// sw.js - Service Worker with Logo Caching
const CACHE_NAME = 'mzprimer-v1';
const LOGO_CACHE_NAME = 'mzprimer-logos-v1';

// Logo URLs to cache
const LOGO_URLS = [
  '/logos/mzlogo.webp',
  '/logos/icon-192.png',
  '/logos/icon-512.png',
  '/logos/icon-180.png',
  '/logos/stripe.svg',
  '/logos/visa.svg',
  '/logos/mastercard.svg',
  '/logos/Applepay.svg',
  '/logos/google.svg',
  '/logos/pci.svg'
];

// Install event - Cache logos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(LOGO_CACHE_NAME).then((cache) => {
      console.log('Caching logos...');
      return cache.addAll(LOGO_URLS);
    }).then(() => {
      console.log('Logo cache complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== LOGO_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Serve logos from cache first
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Check if this is a logo request
  const isLogoRequest = url.pathname.startsWith('/logos/');
  
  if (isLogoRequest) {
    event.respondWith(
      caches.open(LOGO_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          // Return cached logo or fetch new
          return response || fetch(event.request).then((fetchResponse) => {
            // Cache the new logo for future use
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
    return;
  }
  
  // For non-logo requests, use network-first strategy
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// Push notifications
self.addEventListener('push', function (event) {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'New trading insights available',
    icon: '/logos/icon-192.png', // Use cached PWA icon
    badge: '/logos/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    },
    actions: data.actions || [
      {
        action: 'view',
        title: 'View'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'MZPrimer Alert', options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  event.waitUntil(
    clients.matchAll({ 
      type: 'window',
      includeUncontrolled: true 
    }).then((windowClients) => {
      const url = event.notification.data.url || '/';
      
      // Check if window is already open
      for (let client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});