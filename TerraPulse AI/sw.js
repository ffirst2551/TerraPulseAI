const CACHE_NAME = 'terrapulse-v2-clear';

// Force immediate update and clear all old caches
self.addEventListener('install', (event) => {
  console.log('[SW] Force Update: Clearing all caches');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => self.clients.claim())
  );
});

// Pass-through all fetches directly to the network during debugging
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
