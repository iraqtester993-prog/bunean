const CACHE_NAME = 'bunnan-v6';
const urlsToCache = [
    '/bnn/',
    '/bnn/index.html',
    '/bnn/home.html',
    '/bnn/ideas.html',
    '/bnn/quotes.html',
    '/bnn/service-request.html',
    '/bnn/company.html',
    '/bnn/order-tracking.html',
    '/bnn/execute.html',
    '/bnn/product.html',
    '/bnn/market.html',
    '/bnn/account.html',
    '/bnn/css/style.css',
    '/bnn/icon-192.png',
    '/bnn/icon-512.png',
    '/bnn/js/nav.js',
    '/bnn/js/router.js',
    '/bnn/js/header.js',
    '/bnn/js/bottom-nav.js',
    '/bnn/images/img1.jpg',
    '/bnn/images/img2.jpg',
    '/bnn/images/img3.jpg',
    '/bnn/images/img4.jpg',
    '/bnn/images/img5.jpg',
    '/bnn/images/img6.jpg',
    '/bnn/images/img7.jpg',
    '/bnn/images/img8.jpg',
    '/bnn/images/img9.jpg',
    '/bnn/images/img10.jpg',
    '/bnn/images/img11.jpg',
    '/bnn/images/img12.jpg',
    '/bnn/images/img13.jpg',
    '/bnn/images/img14.jpg',
    '/bnn/images/img15.jpg',
    '/bnn/images/img16.jpg',
    '/bnn/images/img17.jpg',
    '/bnn/images/img18.jpg',
    '/bnn/images/img19.jpg',
    '/bnn/images/img20.jpg',
    '/bnn/images/img21.jpg',
    '/bnn/images/img22.jpg',
    '/bnn/images/img23.jpg',
    '/bnn/images/img24.jpg',
    '/bnn/images/img25.jpg',
    '/bnn/images/img26.jpg',
    '/bnn/images/img27.jpg',
    '/bnn/images/img28.jpg',
    '/bnn/images/img29.jpg',
    '/bnn/images/img30.jpg',
    '/bnn/images/img31.jpg',
    'https://unpkg.com/vue@3/dist/vue.global.js',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap',
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
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
