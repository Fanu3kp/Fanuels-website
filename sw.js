/* Otuya Global — service worker.
 * Makes repeat visits to otuyaglobal.duckdns.org instant:
 * hashed assets and images are served from cache, HTML is
 * fetched fresh with a cached shell as offline fallback.
 * Bump CACHE whenever the deploy changes and the old
 * caches are purged automatically on activation. */

const CACHE = 'otuya-v4';
const CORE = ['/', '/404.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Fingerprinted bundles (main-XXXX.js, styles-XXXX.css):
  // content-addressed, so cache-first is always safe.
  if (/\.[a-f0-9]{8,}\.(js|css)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((hit) => {
        if (hit) return hit;
        return fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return response;
        });
      })
    );
    return;
  }

  // Images and other static files: cache-first.
  if (url.pathname.startsWith('/images/') || url.pathname.startsWith('/favicon')) {
    event.respondWith(
      caches.match(request).then((hit) => hit || fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
        return response;
      }))
    );
    return;
  }

  // HTML (index, 404 shell, client-side routes): network-first
  // so deploys are picked up immediately, with the cached shell
  // as an offline fallback.
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() =>
        caches.match(request).then((hit) => hit || caches.match('/404.html'))
      )
  );
});
