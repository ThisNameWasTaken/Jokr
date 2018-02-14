self.addEventListener('install', event => event.waitUntil(
    caches.open('jokr-static-v1')
        .then(cache => cache.addAll([
            '/Jokr/',
            '/Jokr/main.min.css',
            '/Jokr/jokr.bundle.min.js',
            '/Jokr/images/buffer.svg',
            '/Jokr/images/tick-mask.svg',
            '/Jokr/images/tick.svg',
            'https://fonts.googleapis.com/icon?family=Material+Icons',
            'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700'
        ]))
));

self.addEventListener('message', event => {
    if (event.data.action == 'skipWaiting') {
        self.skipWaiting();
    }
});

self.addEventListener('fetch', event => event.respondWith(
    caches.match(event.request)
        .then(response => response || fetch(event.request))
));