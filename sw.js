const CACHE_NAME = "prince-qr-v3";
const ASSETS = [
    "./",
    "./index.html",
    "./about.html",
    "./faq.html",
    "./guide.html",
    "./login.html",
    "./dashboard.html",
    "./style.css",
    "./script.js",
    "./auth.js",
    "./site.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
    "https://unpkg.com/qr-code-styling@1.5.0/lib/qr-code-styling.js",
    "https://unpkg.com/html5-qrcode",
    "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js",
    "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap"
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
});

self.addEventListener("fetch", (e) => {
    const isHtmlRequest = e.request.mode === 'navigate' ||
        (e.request.method === 'GET' && e.request.headers.get('accept').includes('text/html'));

    if (isHtmlRequest) {
        // Network-First strategy for HTML files
        e.respondWith(
            fetch(e.request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
                    return response;
                })
                .catch(() => caches.match(e.request))
        );
    } else {
        // Cache-First strategy for assets
        e.respondWith(
            caches.match(e.request).then((response) => {
                return response || fetch(e.request);
            })
        );
    }
});
