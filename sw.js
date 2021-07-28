var cacheName = 'Calc';

var filesToCache = [
'/',
'/index.html'
];

self.addEventListener('install', function(event) {
		console.log('ServiceWorker installing');
		event.waitUntil(
			caches.open(cacheName).then(function(cache) {
					console.log('Service Worker caching app shell');
					return cache.addAll(filesToCache);
			})
		);
});

self.addEventListener('activate', function(event) {
		console.log('Service Worker activating');
		event.waitUntil(
			caches.keys().then(function(keyList) {
					return Promise.all(keyList.map(function(key) {
								if (key !== cacheName) {
									console.log('Service Worker removing old cache', key);
									return caches.delete(key);
								}
					}));
			})
		);
		return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
		console.log('Service Worker fetching ',
		event.request.url);
		event.respondWith(
			caches.match(event.request)
			.then(function(response) {
			return response || fetch(event.request);
			})
		);
	});