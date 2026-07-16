const CACHE_NAME = "democodex-v4";
const ASSETS = [
  "./",
  "index.html",
  "manifest.json",
  "assets/sfondo.jpg",
  "assets/copertina.png",
  "assets/striscia.png",
  "assets/cartasegreta.jpg",
  "assets/mistero.jpg",
  "assets/volto.jpg",
  "assets/icon192.png",
  "assets/icon512.png",
  "assets/icon512maskable.png",
  "assets/rune-1.png",
  "assets/rune-2.png",
  "assets/rune-3.png",
  "assets/rune-4.png",
  "assets/rune-5.png",
  "assets/rune-6.png",
  "assets/rune-7.png",
  "assets/rune-8.png",
  "assets/rune-9.png"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(event) {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        if (response.ok) {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, copy);
          });
        }
        return response;
      }).catch(function() {
        return cached;
      });
    })
  );
});
