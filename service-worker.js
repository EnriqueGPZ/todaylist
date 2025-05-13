// service-worker.js

// Define un nombre único para la caché (cámbialo si haces cambios importantes en los archivos cacheados)
const CACHE_NAME = 'todaylist-cache-v1.1.4'; // Incrementa la versión si actualizas archivos

// Lista de archivos esenciales para que la app funcione offline
const FILES_TO_CACHE = [
  '/', // La página principal
  '/index.html', // Redundante si '/' sirve index.html, pero seguro incluirlo
  '/manifest.json',
  '/favicon-96x96.png',
  '/favicon.svg',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/ToDayList.png', // El logo usado en la app y welcome
  '/Logo.png', // El logo del título h1
  '/ToDayList_192.png', // Icono PWA
  '/ToDayList_512.png', // Icono PWA
  '/ding.mp3', // Sonido de alarma
  // '/privacy-policy.html', // Opcional: Si quieres que también funcionen offline
  // '/terms-of-service.html' // Opcional
  // URLs externas (más complejo, omitido por simplicidad inicial):
  // 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  // 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap',
  // 'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;700&display=swap',
  // 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js'
];

// Evento 'install': Se dispara cuando el Service Worker se instala por primera vez.
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  // Espera a que la promesa de caches.open y cache.addAll se resuelva.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Pre-caching offline page');
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => {
        console.log('[ServiceWorker] Files cached successfully');
        // Fuerza la activación del nuevo SW inmediatamente (útil en desarrollo)
        // En producción, podrías querer esperar a que el usuario cierre todas las pestañas
        return self.skipWaiting();
      })
      .catch(error => {
         console.error('[ServiceWorker] Failed to cache files:', error);
         // Puedes inspeccionar el error para ver qué archivo falló
         // Común error: un archivo en FILES_TO_CACHE no existe o hay un problema de red/CORS
      })
  );
});

// Evento 'activate': Se dispara cuando el Service Worker se activa.
// Es un buen momento para limpiar cachés antiguas.
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
    .then(() => {
        console.log('[ServiceWorker] Claiming clients');
        // Toma control inmediato de las páginas abiertas que están dentro de su scope.
        return self.clients.claim();
    })
  );
});

// Evento 'fetch': Se dispara cada vez que la PWA realiza una petición de red.
self.addEventListener('fetch', (event) => {
  // console.log('[ServiceWorker] Fetch', event.request.url);

  // Solo interceptamos peticiones GET
  if (event.request.method !== 'GET') {
    // console.log('[ServiceWorker] Ignoring non-GET request:', event.request.method, event.request.url);
    return;
  }

  // Estrategia: Cache first, falling back to network
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si la respuesta está en caché, la retornamos
        if (response) {
          // console.log('[ServiceWorker] Returning response from cache:', event.request.url);
          return response;
        }

        // Si no está en caché, intentamos obtenerla de la red
        // console.log('[ServiceWorker] Fetching request from network:', event.request.url);
        return fetch(event.request)
          .then((networkResponse) => {
            // Si la petición fue exitosa, la clonamos y guardamos en caché para futuras peticiones
            if (networkResponse && networkResponse.status === 200) {
             // console.log('[ServiceWorker] Caching new resource:', event.request.url);
              const responseToCache = networkResponse.clone(); // Clonamos porque la respuesta solo se puede consumir una vez
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            // Retornamos la respuesta original de la red
            return networkResponse;
          })
          .catch((error) => {
            console.error('[ServiceWorker] Fetch failed; returning offline page instead.', error);
            // Aquí podrías retornar una página offline genérica si la tuvieras
            // return caches.match('/offline.html');
            // O simplemente dejar que falle si no hay alternativa offline
          });
      })
  );
});