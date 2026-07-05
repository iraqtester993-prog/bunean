const CACHE_NAME = 'bunean-v9';
const urlsToCache = [
    '/bunean/',
    '/bunean/index.html',
    '/bunean/home.html',
    '/bunean/ideas.html',
    '/bunean/quotes.html',
    '/bunean/service-request.html',
    '/bunean/company.html',
    '/bunean/order-tracking.html',
    '/bunean/execute.html',
    '/bunean/product.html',
    '/bunean/market.html',
    '/bunean/account.html',
    '/bunean/privacy.html',
    '/bunean/css/style.css',
    '/bunean/icon-192.png',
    '/bunean/icon-512.png',
    '/bunean/js/nav.js',
    '/bunean/js/router.js',
    '/bunean/js/header.js',
    '/bunean/js/bottom-nav.js',
    '/bunean/js/project-modal.js',
    '/bunean/manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
