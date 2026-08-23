const CACHE_NAME = 'dinnerbydesign-shell-v2';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/logo.svg'
      ]);
    }).finally(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    }).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests and skip API endpoints
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
    return;
  }

  const request = event.request;
  const isNavigation = request.mode === 'navigate';
  const isSameOrigin = new URL(request.url).origin === self.location.origin;
  const isApplicationAsset = new URL(request.url).pathname.startsWith('/assets/');

  // Hashed JavaScript and CSS files must always come from the current release.
  // Caching them here can leave an old HTML shell pointing at an unavailable chunk.
  if (isApplicationAsset) {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (isSameOrigin && response.ok && !isNavigation) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(async () => {
        if (isNavigation) {
          const cachedHome = await caches.match('/');
          if (cachedHome) return cachedHome;
        }

        const cached = await caches.match(request);
        return cached || Response.error();
      })
  );
});
