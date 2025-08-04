// sw.js
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  clients.claim();
});

// Optional: cache important assets (not strictly required for share target)
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});
