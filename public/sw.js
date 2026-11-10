// Field Shift Orbit service worker: makes the app installable and usable offline.
// App files: cache-first. NASA / map / font requests: network-first, cached copy when offline.
const VERSION = 'agrishift-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  if (sameOrigin && url.pathname.includes('/api/')) {
    // backend: network first, cached copy when offline
    e.respondWith(fetch(req).then((res) => { const copy = res.clone(); caches.open(VERSION + '-api').then((c) => c.put(req, copy)); return res; }).catch(() => caches.match(req)));
    return;
  }

  if (sameOrigin) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match('./index.html')))
    );
    return;
  }

  // Map tiles, fonts, NASA tiles: network first, fall back to cache.
  const cacheable = /tile\.openstreetmap|gibs\.earthdata|fonts\.(googleapis|gstatic)|unpkg/.test(url.host + url.pathname);
  if (cacheable) {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(VERSION + '-ext').then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req))
    );
  }
});
