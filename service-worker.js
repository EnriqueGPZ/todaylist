const CACHE_NAME = 'todaylist-cache-v4'; // <= ¡IMPORTANTE: Incrementa el número! Ahora v4. Cambia esto CADA VEZ que actualices archivos cacheados.
const OFFLINE_URL = '/'; // La ruta a tu página principal (index.html)

// Archivos que se cachearán durante la instalación.
// Es fundamental incluir '/index.html', '/manifest.json' y todos los recursos estáticos que quieres offline.
const urlsToCache = [
    OFFLINE_URL, // Cachea la página principal (el propio index.html)
    '/index.html', // Redundancia segura si OFFLINE_URL es '/'
    '/manifest.json',

    // Iconos y otras imágenes que tienes en la raíz y usas
    '/favicon-96x96.png',
    '/favicon.svg',
    '/favicon.ico',
    '/apple-touch-icon.png',
    '/ToDayList.png',
    '/ToDayList-192.png',
    '/ToDayList-512.png',
    // Si los archivos web-app-manifest-XXX.png son necesarios o diferentes, añádelos aquí también
    /*
    '/web-app-manifest-192x192.png',
    '/web-app-manifest-512x512.png',
    */

    // Páginas adicionales que quieres que estén disponibles offline
    '/privacy-policy.html',
    '/terms-of-service.html',

    // CDNs esenciales (CSS y el script de Confetti)
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap', // El archivo CSS de Google Fonts que carga las fuentes
    'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;700&display=swap', // El archivo CSS de Google Fonts que carga las fuentes

    // **** URLs EXACTAS DE LOS ARCHIVOS DE FUENTES CONFIRMADAS ****
    // (Asegúrate de que estas URLs coinciden con lo que ves en la pestaña Network)
    // URLs de Google Fonts (archivos .woff2 de fonts.gstatic.com)
    'https://fonts.gstatic.com/s/quicksand/v31/6xKtdSZaM9iE8KbpRA_LLPFv.woff2', // Quicksand Regular
    'https://fonts.gstatic.com/s/quicksand/v31/6xKpdSZaM9iE8KbpRA_LLPFvOjKd.woff2', // Quicksand Bold
    'https://fonts.gstatic.com/s/lexend/v20/RrQDbo_9toNAJSEe_AKn4C_X6GG0k2n_B0Y.woff2', // Lexend Regular
    'https://fonts.gstatic.com/s/lexend/v20/RrQDbo_9toNAJSEe_AKn4C_X6Lq0k2n_B0Y.woff2', // Lexend Bold
    'https://fonts.gstatic.com/s/lexend/v20/RrQDbo_9toNAJSEe_AKn4C_X6Fm0k2n_B0Y.woff2', // Lexend Light

    // URLs de Font Awesome (archivos .woff2 de cdnjs.cloudflare.com)
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-solid-900.woff2', // Font Awesome Solid
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-brands-400.woff2', // Font Awesome Brands (para PayPal)
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-regular-400.woff2', // Font Awesome Regular (para Calendario)

    // Si usas otros formatos (.woff, .ttf) o versiones, añádelos aquí también.
];

// Evento 'install': Cacha los archivos listados
self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalando...');
    // skipWaiting() activa el nuevo service worker inmediatamente,
    // evitando que el usuario tenga que cerrar todas las pestañas viejas.
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Cacheando archivos esenciales:', urlsToCache);
                // cache.addAll puede fallar si una sola URL es inaccesible (404, CORS, etc.)
                // Envuelve las URLs de CDN en Request con mode: 'cors' si tienes problemas.
                // El .map ya lo hace en el código de ejemplo.
                return cache.addAll(urlsToCache.map(url => {
                     try {
                        // Verifica si es una URL completa para usar Request con mode: 'cors'
                        new URL(url);
                        return new Request(url, { mode: 'cors' });
                     } catch (e) {
                        // Para URLs relativas (ej: /index.html), devuélvelas directamente
                        return url;
                     }
                 }));
            })
            .catch(err => {
                console.error('Service Worker: Error al cachear durante la instalación. Esto puede impedir que la PWA sea instalable:', err);
                // Aquí podrías añadir lógica para notificar al usuario o intentar de nuevo
            })
    );
});

// Evento 'activate': Limpia cachés viejas y toma control
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activando...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Borra cualquier caché que no sea la actual (CACHE_NAME)
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Borrando cache antigua', cacheName);
                        return caches.delete(cacheName);
                    }
                    return null;
                })
            ).then(() => {
                console.log('Service Worker: Cachés antiguas limpiadas.');
            });
        })
    );
    // claim() permite que este SW tome control de la página inmediatamente después de la activación,
    // sin necesidad de recargar la página nuevamente.
    return self.clients.claim();
});

// Evento 'fetch': Intercepta peticiones de red y responde desde caché o red
self.addEventListener('fetch', (event) => {
    // Ignora peticiones que no son HTTP/HTTPS (ej: chrome-extension://)
    if (!(event.request.url.startsWith('http:') || event.request.url.startsWith('https:'))) {
        return;
    }

     // Ignora las peticiones a las APIs de Google Drive/Calendar/Auth (siempre a la red)
     // Estas URLs NO DEBEN ser cacheadas ya que son peticiones de API dinámicas y requieren autenticación.
     if (event.request.url.includes('googleapis.com') || event.request.url.includes('gsi/client') || event.request.url.includes('google.com/calendar') || event.request.url.includes('accounts.google.com')) {
         return fetch(event.request); // Siempre intenta ir a la red para estas URLs
     }

    // Estrategia Cache-first, falling back to network
    // Para todas las demás peticiones (index.html, CSS, JS, imágenes, fuentes, etc.):
    // 1. Intenta encontrar la respuesta en la caché.
    // 2. Si está en caché, la devuelve inmediatamente.
    // 3. Si NO está en caché, va a la red.
    // 4. Si la red responde, devuelve la respuesta Y opcionalmente la añade a la caché para futuras veces.
    // 5. Si la red falla Y NO estaba en caché:
    //    - Si la petición original fue una navegación (abrir la página), sirve la página offline cacheada (index.html) como fallback.
    //    - Para otras peticiones (un icono, una fuente, etc.), la petición simplemente falla.

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si encuentra la respuesta en la caché, la devuelve
                if (response) {
                    console.log('Service Worker: Sirviendo desde cache:', event.request.url);
                    return response;
                }

                // Si no está en caché, intenta obtenerla de la red
                console.log('Service Worker: Fetching de la red:', event.request.url);
                // Clonamos la petición porque una petición solo puede ser leída una vez
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest)
                     .then(networkResponse => {
                         // Revisa si la respuesta es válida para cachear (status 200, tipo basic)
                         if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                             return networkResponse; // No cachea respuestas inválidas
                         }

                         // Clonamos la respuesta porque una respuesta también solo puede ser leída una vez
                         const responseToCache = networkResponse.clone();

                         // Abre la caché y guarda la respuesta para futuras veces
                         caches.open(CACHE_NAME)
                             .then(cache => {
                                 cache.put(event.request, responseToCache);
                             });

                         return networkResponse;
                     })
                    .catch(() => {
                        // Si falla la red Y no estaba en caché
                        console.error('Service Worker: Fetch fallido y no en cache para:', event.request.url);

                        // Si la petición fallida era para una navegación (cargar una página HTML),
                        // intenta devolver la página offline cacheada (index.html) como fallback.
                        if (event.request.mode === 'navigate') {
                            console.log('Service Worker: Network failed for navigation, serving offline page.');
                            return caches.match(OFFLINE_URL);
                        }

                        // Para otras peticiones fallidas (imágenes, fuentes, etc.),
                        // simplemente deja que la petición falle.
                        // Puedes devolver una Response de error genérica si quieres:
                        // return new Response('Offline', { status: 503, statusText: 'Offline' });
                        throw new Error('Network or cache failed'); // O simplemente lanzar el error
                    });
            })
    );
});
