self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force the waiting service worker to become active immediately
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim()); // Take control of all pages
});
