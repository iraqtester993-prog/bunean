const CACHE_NAME = 'bunean-v7';
const urlsToCache = [
    './',
    './index.html',
    './home.html',
    './ideas.html',
    './quotes.html',
    './service-request.html',
    './company.html',
    './order-tracking.html',
    './execute.html',
    './product.html',
    './market.html',
    './account.html',
    './css/style.css',
    './icon-192.png',
    './icon-512.png',
    './js/nav.js',
    './js/router.js',
    './js/header.js',
    './js/bottom-nav.js',
    './js/project-modal.js',
    './manifest.json'
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
