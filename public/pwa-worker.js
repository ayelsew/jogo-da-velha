let cacheName = 'app-cache-v1';
let filesToCache = [
    '/',
    '/index.html',
    '/script/Game.js',
    '/script/Hashtag.js',
    '/script/Network.js',
    '/script/Players.js',
    '/script/UserInterface.js',
    '/css/style.css',
    '/vendor/jquery/jquery.min.js',
    '/vendor/bootstrap/bootstrap.min.js',
    '/vendor/bootstrap/bootstrap.min.css',
];

self.addEventListener('install', function(event) {
    console.log('[ServiceWorker] Install');
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
    console.log('[Service Worker] Fetch', event.request.url);    
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('activate', function(event) {
    console.log('[ServiceWorker] Activate');
    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});
