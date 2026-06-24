const CACHE_NAME = 'portfolio-v4';
const OFFLINE_URL = '/offline.html';

const STATIC_ASSETS = [
  '/offline.html',
  '/styles/shared.css',
  '/styles/polish.css',
  '/styles/dynamic.css',
  '/manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never cache Vite dev server paths or JS/TS modules
  if (
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/node_modules/') ||
    url.pathname.includes('?v=') ||
    url.pathname.includes('?t=') ||
    url.pathname.endsWith('.tsx') ||
    url.pathname.endsWith('.ts') ||
    url.pathname.endsWith('.jsx') ||
    url.pathname.endsWith('.js')
  ) {
    return;
  }

  // External requests: network only
  if (url.origin !== location.origin) {
    return;
  }

  // Navigation requests: network first
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Static assets: stale-while-revalidate
  // Serve cache for speed, but ALWAYS refetch in the background and update the
  // cache so edited CSS/assets propagate on the next load (no more stale styles).
  event.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return res;
      }).catch(() => cached || null);
      return cached || network;
    })
  );
});
