const CACHE_NAME = 'todaylist-cache-v3'; // <= ¡CAMBIA ESTE NÚMERO cada vez que modifiques index.html, manifest.json, service-worker.js o añadas/cambies archivos estáticos cacheados!
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
    '/favicon.ico', // Aunque es menos común usarlo en PWA, inclúyelo si quieres compatibilidad total
    '/apple-touch-icon.png',
    '/ToDayList.png', // Tu icono principal si lo usas fuera del manifest
    '/ToDayList-192.png',
    '/ToDayList-512.png',
    // '/web-app-manifest-192x192.png', // Incluir si son diferentes o necesarios
    // '/web-app-manifest-512x512.png', // Incluir si son diferentes o necesarios

    // Páginas adicionales que quieres que estén disponibles offline
    '/privacy-policy.html',
    '/terms-of-service.html',

    // CDNs - Importante incluirlas para funcionalidad y diseño offline
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap', // El archivo CSS de Google Fonts
    'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;700&display=swap', // El archivo CSS de Google Fonts

    // **** MUY IMPORTANTE: AÑADIR LAS URLs EXACTAS DE LOS ARCHIVOS DE FUENTES REALES (.woff2, etc.) ****
    // VERIFICA ESTAS URLs CON LAS HERRAMIENTAS DE DESARROLLO (Network tab, filter: Font)
    // Estas URLs se encuentran referenciadas dentro de los archivos CSS de Google Fonts y Font Awesome.
    // Aquí hay EJEMPLOS comunes, PUEDEN VARIAR:
     'https://fonts.gstatic.com/s/quicksand/v31/6xKtdSZaM9iE8KbpRA_LLPFv.woff2', // Ejemplo Quicksand Regular
     'https://fonts.gstatic.com/s/quicksand/v31/6xKpdSZaM9iE8KbpRA_LLPFvOjKd.woff2', // Ejemplo Quicksand Bold
     'https://fonts.gstatic.com/s/lexend/v20/RrQDbo_9toNAJSEe_AKn4C_X6GG0k2n_B0Y.woff2', // Ejemplo Lexend Regular
     'https://fonts.gstatic.com/s/lexend/v20/RrQDbo_9toNAJSEe_AKn4C_X6Lq0k2n_B0Y.woff2', // Ejemplo Lexend Bold
     'https://fonts.gstatic.com/s/lexend/v20/RrQDbo_9toNAJSEe_AKn4C_X6Fm0k2n_B0Y.woff2', // Ejemplo Lexend Light
     'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-solid-900.woff2', // Ejemplo Font Awesome Solid
     'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-brands-400.woff2', // Ejemplo Font Awesome Brands (para PayPal)
     'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-regular-400.woff2', // Ejemplo Font Awesome Regular (para Calendario)
    // ... quizás otros formatos (.woff, .ttf) si quieres máxima compatibilidad offline
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
                        new URL(url); // Check if it's a full URL
                        return new Request(url, { mode: 'cors' });
                     } catch (e) {
                        return url; // Relative URL (e.g., /index.html)
                     }
                 }));
            })
            .catch(err => console.error('Service Worker: Error al cachear durante la instalación', err))
    );
});

// Evento 'activate': Limpia cachés viejas
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
            );
        })
    );
    // claim() permite que este SW tome control de la página inmediatamente después de la activación,
    // sin necesidad de recargar la página nuevamente.
    return self.clients.claim();
});

// Evento 'fetch': Intercepta peticiones de red
self.addEventListener('fetch', (event) => {
    // Ignora peticiones que no son HTTP/HTTPS (ej: chrome-extension://)
    if (!(event.request.url.startsWith('http:') || event.request.url.startsWith('https:'))) {
        return;
    }

     // Ignora las peticiones a las APIs de Google Drive/Calendar (siempre a la red)
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
                return fetch(event.request)
                     .then(networkResponse => {
                         // Opcional: Cachear nuevas respuestas si son exitosas (status 200)
                         // Esto es útil si la app carga recursos que no están en urlsToCache.
                         // Pero para una app con todo en index.html + CDNs pre-cacheables, no es estrictamente necesario.
                         /*
                         if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                             const responseToCache = networkResponse.clone();
                             caches.open(CACHE_NAME)
                                 .then(cache => {
                                     cache.put(event.request, responseToCache);
                                 });
                         }
                         */
                         return networkResponse;
                     })
                    .catch(() => {
                        // Si falla la red Y no estaba en caché
                        console.error('Service Worker: Fetch fallido y no en cache para:', event.request.url);

                        // Si la petición fallida era para una navegación (cargar una página HTML),
                        // intenta devolver la página offline cacheada (index.html)
                        if (event.request.mode === 'navigate') {
                            console.log('Service Worker: Network failed for navigation, serving offline page.');
                            return caches.match(OFFLINE_URL);
                        }

                        // Para otras peticiones fallidas (imágenes, fuentes, etc.),
                        // simplemente deja que la petición falle.
                        throw new Error('Network or cache failed');
                    });
            })
    );
});
