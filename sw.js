// Service worker de Atlas: la app abre sin conexión. Lo de ARCHIVOS se guarda al instalar y se
// sirve desde el teléfono. Cada publicación cambia VERSION: el teléfono baja la nueva en segundo
// plano (cuando hay red) y la usa la siguiente vez que se abre la app.
const VERSION = 'atlas-c12471e8b204';
const ARCHIVOS = ["./", "index.html", "manifest.webmanifest", "fuentes/jakarta-latin.woff2", "icono-180.png", "icono-192.png", "icono-512.png"];
self.addEventListener('install', e => e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return; // Google y Firebase van por su lado
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(g => g || fetch(r)));
});
