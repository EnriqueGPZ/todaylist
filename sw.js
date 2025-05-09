// sw.js

const CACHE_NAME = 'todaylist-cache-v1.1'; // Cambia la versión si actualizas los archivos cacheados
const urlsToCache = [
  '/', // Tu página principal
  '/index.html', // Alias de la página principal
  '/manifest.json',
  'https://www.todaylist.es/ToDayList.png', // Tu icono principal
  'https://www.todaylist.es/ToDayList-192.png', // Icono PWA
  'https://www.todaylist.es/ToDayList-512.png', // Icono PWA
  // CSS (tu CSS en línea ya está en index.html, pero si lo tuvieras externo, lo añadirías aquí)
  // '/style.css',
  // JavaScript (tu JS en línea ya está en index.html, pero si tuvieras archivos JS externos)
  // '/app.js',
  // Fuentes y otros assets críticos
  'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js'
];

// Evento 'install': se dispara cuando el Service Worker se instala por primera vez.
self.addEventListener('install', event => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('[Service Worker] Failed to cache app shell:', error);
      })
  );
});

// Evento 'activate': se dispara después de la instalación, cuando el SW se activa.
// Aquí es un buen lugar para limpiar cachés antiguas.
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Permite que el SW controle las páginas abiertas inmediatamente
});

// Evento 'fetch': se dispara cada vez que la aplicación realiza una solicitud de red (fetch).
// Estrategia: Cache First (primero intenta servir desde caché, si no, va a la red)
self.addEventListener('fetch', event => {
  // No queremos cachear solicitudes que no sean GET (ej. POST)
  if (event.request.method !== 'GET') {
    return;
  }

  // Para las fuentes de Google y Font Awesome, usar "Cache First, then Network"
  // o "Stale While Revalidate" para un mejor rendimiento y actualizaciones.
  // Aquí un ejemplo simple de Cache First para todo lo que está en urlsToCache.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          // Sirve desde caché
          // console.log('[Service Worker] Fetching from cache:', event.request.url);
          return response;
        }
        // Si no está en caché, ve a la red
        // console.log('[Service Worker] Fetching from network:', event.request.url);
        return fetch(event.request).then(
          networkResponse => {
            // Opcional: Cachear la nueva respuesta si es una URL que nos interesa y no de terceros que no controlamos
            // if (urlsToCache.includes(event.request.url) || event.request.url.startsWith(self.location.origin)) {
            //   return caches.open(CACHE_NAME).then(cache => {
            //     cache.put(event.request, networkResponse.clone());
            //     return networkResponse;
            //   });
            // }
            return networkResponse;
          }
        );
      })
      .catch(error => {
        // Manejo de errores de fetch, por ejemplo, si no hay conexión y no está en caché.
        // Podrías devolver una página offline personalizada aquí si `event.request.mode === 'navigate'`
        console.error('[Service Worker] Fetch error:', error);
        // throw error; // Propagar el error
      })
  );
});