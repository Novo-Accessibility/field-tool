/* Senior Home Safety — Assessment Tool
   Offline cache.

   Strategy: stale-while-revalidate. The tool is served from the iPad's own
   cache the moment it is opened, so it works in a basement with no signal.
   A fresh copy is fetched quietly in the background whenever there is a
   connection, and that copy is what loads next time.

   Client data is never touched here. Assessments live in the browser's own
   storage on the device and never reach the server.

   Bump CACHE_VERSION whenever index.html changes. */

const CACHE_VERSION = 'shs-tool-v3-6';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_VERSION).then(cache =>
      cache.match(req, { ignoreSearch: true }).then(cached => {
        const network = fetch(req)
          .then(res => {
            if (res && res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);

        // Cached copy first when there is one; otherwise wait on the network.
        return cached || network;
      })
    )
  );
});
