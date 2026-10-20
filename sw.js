const CACHE = 'outfit-v2';
const FILES = ['./', 'index.html', 'style.css', 'app.js', 'colors.js', 'recommend.js', 'weather.js', 'garment-svg.js', 'character-svg.js', 'db.js', 'manifest.webmanifest', 'icons/icon.svg'];

self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
// 앱 파일은 캐시 우선(오프라인 지원), 날씨 API 같은 외부 요청은 건드리지 않음
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request)));
});
