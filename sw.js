if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker.register("/sw.js").then(function(registration) {
            // Registration was successful!
            console.log(`ServiceWorker registration successful with scope: ${registration.scope}.`);
        }, function(err) {
            // Registration failed!
            console.log(`ServiceWorker registration failed: ${err}.`);
        });
    });
}

const CACHE_NAME = "restaurant-reviews-v1";
const URLSTOCACHE = [
    "/",
    "/css/main.css",
    "/data/restaurants.json",
    "/img/1.jpg",
    "/img/2.jpg",
    "/img/3.jpg",
    "/img/4.jpg",
    "/img/5.jpg",
    "/img/6.jpg",
    "/img/7.jpg",
    "/img/8.jpg",
    "/img/9.jpg",
    "/img/10.jpg",
    "/js/dbhelper.js",
    "/js/main.js",
    "/js/restaurant_info.js",
    "/index.html",
    "/restaurant.html"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log("Cache opened.");
                cache.addAll(URLSTOCACHE);
            })
    );
});

self.addEventListener("fetch", event => {
    if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") {
        event.respondWith(
            caches.match(event.request).then(response => {
                if (response) {
                    console.log(`ServiceWorker found in cache ${event.request.url}.`);
                    return response;
                }
                return fetch(event.request);
            })
        );
    }
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log(`ServiceWorker is removing files from ${cache}.`);
                        return caches.delete(cacheName);
                    }
                })
            ))
    );
});