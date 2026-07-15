const CACHE_NAME = 'bunean-v15';
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
    '/bunean/search.html',
    '/bunean/all-works.html',
    '/bunean/notifications.html',
    '/bunean/profile.html',
    '/bunean/request-detail.html',
    '/bunean/quote-request.html',
    '/bunean/css/base.css',
    '/bunean/css/components.css',
    '/bunean/css/pages.css',
    '/bunean/css/market.css',
    '/bunean/icon-192.png',
    '/bunean/icon-512.png',
    '/bunean/js/nav.js',
    '/bunean/js/router.js',
    '/bunean/js/header.js',
    '/bunean/js/bottom-nav.js',
    '/bunean/js/project-modal.js',
    '/bunean/js/notifications.js',
    '/bunean/js/back-nav.js',
    '/bunean/js/pull-to-refresh.js',
    '/bunean/js/global-viewer.js',
    '/bunean/js/utils.js',
    '/bunean/js/page-home.js',
    '/bunean/js/page-account.js',
    '/bunean/js/page-market.js',
    '/bunean/js/page-ideas.js',
    '/bunean/js/page-notifications.js',
    '/bunean/js/page-loader.js',
    '/bunean/manifest.json',
    '/bunean/dashboard/',
    '/bunean/dashboard/index.html',
    '/bunean/dashboard/css/dashboard.css',
    '/bunean/dashboard/js/dashboard.js'
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

/* ===== Push Notifications ===== */
self.addEventListener('push', function(event) {
    var data = { title: 'بنيان', body: 'لديك إشعار جديد', icon: '/bunean/icon-192.png', data: {} };
    if (event.data) {
        try { data = Object.assign(data, event.data.json()); } catch(e) { data.body = event.data.text(); }
    }
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon || '/bunean/icon-192.png',
            badge: '/bunean/icon-192.png',
            vibrate: [200, 100, 200],
            tag: data.tag || 'bunean-push',
            renotify: true,
            data: data.data || {}
        })
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    var url = '/bunean/home.html';
    if (event.notification.data && event.notification.data.link) {
        url = event.notification.data.link;
    }
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url.indexOf('/bunean/') !== -1 && 'focus' in client) {
                    client.navigate(url);
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
