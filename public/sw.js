// Service Worker for caching all files in /scorms/
const CACHE_NAME = "scorms-cache-v1";
const SCORMS_PATH = "/scorms/";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Fetch the list of files to cache
      const response = await fetch(SCORMS_PATH + "manifest.json");
      if (response.ok) {
        const files = await response.json();
        await cache.addAll(files.map((f) => SCORMS_PATH + f));
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.startsWith(SCORMS_PATH)) {
    event.respondWith(
      caches.match(event.request).then(
        (response) =>
          response ||
          fetch(event.request).then((fetchRes) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, fetchRes.clone());
              return fetchRes;
            });
          })
      )
    );
  }
});
