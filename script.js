Entendido. Vamos a hacer que el modal de recordatorio se vea más integrado con la estética minimalista de tu aplicación y a corregir el estilo del botón de cerrar para que sea consistente con el del modal de información.

Aquí tienes los archivos `index.html`, `style.css` y `script.js` modificados.

---

**1. Archivo `index.html` (Modificado)**

He cambiado la clase del botón de cerrar en el modal de recordatorio de `close-button` a `app-button close-modal` para que use los mismos estilos que el botón de cerrar del modal de información. También lo he cambiado a un elemento `<button>` por semántica y he añadido un `aria-label` para accesibilidad.

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">

    <!-- METAETIQUETAS PARA CONTROL DE CACHÉ (PARA EL HTML PRINCIPAL) -->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <!-- FIN METAETIQUETAS PARA CONTROL DE CACHÉ -->

    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0">

    <!-- SEO Meta Tags -->
    <title>ToDayList - Simplifica Tu Día, Organiza Tus Tareas</title>
    <meta name="description" content="ToDayList es tu gestor de tareas diarias minimalista y eficiente. Organiza tus pendientes, establece prioridades, añade subtareas y fechas límite. ¡Mejora tu productividad hoy!">
    <meta name="keywords" content="lista de tareas, to-do list, gestor de tareas diarias, organizador personal, productividad, planificación diaria, tareas pendientes, subtareas, prioridades, web app, enrique gil, ToDayList, google calendar, google drive">
    <meta name="author" content="Enrique Gil">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://www.todaylist.es/">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.todaylist.es/">
    <meta property="og:title" content="ToDayList - Simplifica Tu Día, Organiza Tus Tareas">
    <meta property="og:description" content="Organiza tus pendientes con ToDayList: tu gestor de tareas diarias minimalista.">
    <meta property="og:image" content="https://www.todaylist.es/ToDayList.png">
    <meta property="og:site_name" content="ToDayList">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://www.todaylist.es/">
    <meta property="twitter:title" content="ToDayList - Simplifica Tu Día, Organiza Tus Tareas">
    <meta property="twitter:description" content="Organiza tus pendientes con ToDayList: tu gestor de tareas diarias minimalista.">
    <meta property="twitter:image" content="https://www.todaylist.es/ToDayList.png">

    <!-- FAVICONS -->
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <!-- <link rel="manifest" href="/site.webmanifest">  <-- ELIMINADO -->
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#e74c3c"> <!-- Color de acento -->
    <link rel="shortcut icon" href="/favicon.ico">
    <!-- <meta name="msapplication-TileColor" content="#e74c3c"> <-- ELIMINADO -->
    <!-- <meta name="msapplication-config" content="/browserconfig.xml"> <-- ELIMINADO -->
    <!-- <meta name="theme-color" content="#f4f7f6"> <-- ELIMINADO -->
    <!-- FIN FAVICONS -->

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

    <!-- Enlace al archivo CSS externo -->
    <link rel="stylesheet" href="style.css">

    <!-- Schema.org markup for Google -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "ToDayList",
      "applicationCategory": ["ProductivityApplication", "UtilityApplication"],
      "operatingSystem": "Web Browser",
      "description": "ToDayList es un gestor de tareas diarias minimalista y eficiente que te ayuda a organizar tus pendientes, establecer prioridades, añadir subtareas, y agendar recordatorios en Google Calendar para mejorar tu productividad. Permite exportar e importar datos localmente o usando Google Drive.",
      "url": "https://www.todaylist.es/",
      "author": {
        "@type": "Person",
        "name": "Enrique Gil"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "image": "https://www.todaylist.es/ToDayList.png",
      "screenshot": "https://www.todaylist.es/images/todaylist-screenshot.jpg",
      "softwareVersion": "1.2.3", /* Nueva versión por corrección de carga de API */
      "datePublished": "2024-03-15",
      "keywords": "lista de tareas, to-do list, gestor de tareas diarias, productividad, organización, planificación, web app, tareas pendientes, subtareas, prioridades, google drive, google calendar, favicon"
    }
    </script>

    <!-- ***** INICIO: Script global para los callbacks onload de Google ***** -->
    <script>
        // Estas funciones se definen globalmente y son llamadas por los scripts de Google.
        // Luego, llaman a las funciones dentro de nuestro módulo cuando estén disponibles.
        window.onGisLoaded = function() {
            console.log("HTML SCRIPT: onGisLoaded CALLED by Google GSI Client");
            if (window.googleApiCallbacks && typeof window.googleApiCallbacks.gisLoaded === 'function') {
                window.googleApiCallbacks.gisLoaded();
            } else {
                // Guardar una bandera para que script.js sepa que GIS está listo si carga después
                window.isGoogleGisScriptReady = true;
                console.log("HTML SCRIPT: GIS script loaded, app script (module) might not be ready yet.");
            }
        };

        window.onGapiLoaded = function() {
            console.log("HTML SCRIPT: onGapiLoaded CALLED by Google API.js");
            if (window.googleApiCallbacks && typeof window.googleApiCallbacks.gapiLoaded === 'function') {
                window.googleApiCallbacks.gapiLoaded();
            } else {
                // Guardar una bandera para que script.js sepa que GAPI está listo si carga después
                window.isGoogleGapiScriptReady = true;
                console.log("HTML SCRIPT: GAPI script loaded, app script (module) might not be ready yet.");
            }
        };
    </script>
    <!-- ***** FIN: Script global para los callbacks onload de Google ***** -->


    <!-- Google API Scripts (Necesarios si mantienes la funcionalidad de Google Drive) -->
    <!-- Ahora llaman a las funciones definidas globalmente arriba -->
    <script async defer src="https://accounts.google.com/gsi/client" onload="onGisLoaded()"></script>
    <script async defer src="https://apis.google.com/js/api.js" onload="onGapiLoaded()"></script>

</head>
<body>

    <div class="container">
        <button id="info-button" class="app-button" aria-label="Información de la aplicación" title="Cómo usar la aplicación">
            i
        </button>
        <h1>ToDayList</h1>
        <h2 class="subtitle">Tu Gestor de Tareas Diarias</h2>
        <p class="app-description-static">
            Organiza tu día y aumenta tu productividad de forma sencilla y eficaz.
        </p>

        <section id="welcome-section" class="hidden">
            <img src="https://www.todaylist.es/ToDayList.png" alt="ToDayList Icono" class="welcome-icon">
            <h2>¡Bienvenido a ToDayList!</h2>
            <p>
                ToDayList es más que una simple lista de tareas. Es una aplicación web diseñada para ayudarte
                a gestionar tu tiempo y tus proyectos de manera eficiente. Descubre cómo ToDayList puede transformar
                tu productividad diaria:
            </p>
            <ul>
                <li><strong>Gestión Intuitiva de Tareas:</strong> Crea, edita y organiza tus tareas fácilmente.</li>
                <li><strong>Subtareas Detalladas:</strong> Desglosa tareas complejas en pasos manejables.</li>
                <li><strong>Prioridades Visuales:</strong> Asigna colores para enfocarte en lo importante.</li>
                <li><strong>Agendar en Google Calendar:</strong> Genera un enlace para añadir recordatorios de tus tareas directamente a tu Google Calendar.</li>
                <li><strong>Enlaces Relevantes:</strong> Asocia URLs directamente a tus tareas.</li>
                <li><strong>Modo Oscuro/Claro:</strong> Adapta la interfaz a tus preferencias visuales.</li>
                <li><strong>Progreso y Motivación:</strong> Visualiza el avance y gana medallas por completar tareas.</li>
                <li><strong>Exportación e Importación de Datos:</strong> Realiza copias de seguridad o transfiere tus datos (local o Google Drive).</li>
                <li><strong>Anotaciones Rápidas:</strong> Un espacio para tomar notas sin crear una tarea formal.</li>
            </ul>
            <p>
                ¡Comienza a organizar tu día ahora!
            </p>
            <button id="start-app-button" class="app-button">Empezar a Organizar</button>
        </section>

        <section id="install-instructions-section" class="hidden">
            <h4>¡Acceso Rápido a ToDayList!</h4>
            <p>Guarda ToDayList en tu dispositivo para acceder como una app:</p>
            <ul>
                <li><strong>Chrome (Escritorio):</strong> Clic en el icono <i class="fas fa-download" title="Instalar"></i> en la barra de direcciones, o Menú (<i class="fas fa-ellipsis-v"></i>) → "Instalar ToDayList".</li>
                <li><strong>Android (Chrome):</strong> Menú (<i class="fas fa-ellipsis-v"></i>) → "Instalar aplicación" o "Añadir a pantalla de inicio".</li>
                <li><strong>iPhone/iPad (Safari):</strong> Icono Compartir (<i class="fas fa-share-square" title="Compartir"></i>) → "Añadir a pantalla de inicio".</li>
                <li><strong>Mac (Safari):</strong> Desde el menú "Archivo" → "Añadir al Dock".</li>
            </ul>
        </section>

        <div id="app-main-interface" class="hidden">
            <div id="medal-counter-container">
                <i class="fas fa-medal"></i> <span id="medal-count">0</span>
            </div>

            <ul id="todo-list"></ul>
            <div id="todo-input-container">
                <input type="text" id="new-todo-input" placeholder="Agregar nueva tarea...">
                <button id="add-todo-button" class="app-button add-button" aria-label="Agregar Tarea"><i class="fas fa-plus"></i></button>
                <button id="reorder-button" class="app-button sort-button" aria-label="Reordenar Tareas"><i class="fas fa-sort-amount-down-alt"></i></button>
            </div>
            <div id="priority-legend">
                Prioridad:
                <span class="priority-legend-item"><span class="priority-color-label" data-color="red"></span>Urgente</span>
                > <!-- Usar entidad HTML para > -->
                <span class="priority-legend-item"><span class="priority-color-label" data-color="orange"></span>Alta</span>
                > <!-- Usar entidad HTML para > -->
                <span class="priority-legend-item"><span class="priority-color-label" data-color="yellow"></span>No Olvidar</span>
                > <!-- Usar entidad HTML para > -->
                <span class="priority-legend-item"><span class="priority-color-label" data-color="green"></span>Puede Esperar</span>
            </div>

            <div id="quick-notes-container">
                <textarea id="quick-notes-area" placeholder="Anotaciones rápidas..."></textarea>
                <button id="clear-notes-button" class="app-button" aria-label="Borrar anotaciones">
                    <i class="fas fa-eraser"></i> Borrar
                </button>
            </div>

            <div id="data-management-section">
                <h4>Gestión de Datos</h4>
                <p class="data-management-intro">
                    Guarda tus tareas para usarlas en otros dispositivos o como copia de seguridad.
                    Puedes exportar/importar un archivo local o usar tu Google Drive.
                </p>
                <div id="export-options-container" class="data-options-row">
                    <button id="export-data-button" class="app-button data-action-button" aria-label="Exportar datos locales">
                        <i class="fas fa-file-export"></i> Exportar Local
                    </button>
                    <button id="export-drive-button" class="app-button data-action-button drive-button-style" aria-label="Exportar a Google Drive" disabled>
                        <i class="fab fa-google-drive"></i> Exportar a Drive
                    </button>
                </div>
                <div id="import-options-container" class="data-options-row">
                    <input type="file" id="import-file-input" accept=".json" style="display: none;">
                    <button id="import-data-button" class="app-button data-action-button" aria-label="Importar datos locales">
                        <i class="fas fa-file-import"></i> Importar Local
                    </button>
                    <button id="import-drive-button" class="app-button data-action-button drive-button-style" aria-label="Importar desde Google Drive" disabled>
                        <i class="fab fa-google-drive"></i> Importar de Drive
                    </button>
                </div>
            </div>

        </div> <!-- Fin de #app-main-interface -->

    </div> <!-- Fin de .container -->

    <!-- Modal para agendar recordatorio (MODIFICADO) -->
    <div id="reminder-modal" class="modal-overlay">
        <div class="modal-content">
            <!-- Botón de cerrar con las mismas clases que el de info-modal -->
            <button class="app-button close-modal" id="close-reminder-modal" aria-label="Cerrar ventana de recordatorio">&times;</button>
            <h2>Agendar Recordatorio</h2>
            <p id="reminder-task-text"></p> <!-- Para mostrar el nombre de la tarea -->
            <div class="modal-input-group">
                <label for="reminder-date">Fecha:</label>
                <input type="date" id="reminder-date" required>
            </div>
            <div class="modal-input-group">
                <label for="reminder-time">Hora:</label>
                <input type="time" id="reminder-time" value="09:00" required>
            </div>
            <button id="schedule-reminder-button" class="app-button">Agendar en Google Calendar</button>
        </div>
    </div>
    <!-- Fin Modal para agendar recordatorio -->


    <footer>
        <img src="https://www.todaylist.es/ToDayList.png" alt="Logo ToDayList" class="footer-logo">
        <p class="footer-text">WebApp creada por Henry Gil</p>

        <div id="support-section-footer">
            <p class="support-intro-text">¿Te gusta ToDayList? Si te ha sido útil...</p>
            <a href="https://paypal.me/todaylistHenry" target="_blank" rel="noopener noreferrer" class="paypal-link-footer">
                <i class="fab fa-paypal"></i> Apoya este proyecto
            </a>
        </div>
        <div class="footer-legal-links">
            <a href="privacy-policy.html" target="_blank" rel="noopener noreferrer">Política de Privacidad</a>
            <span>|</span>
            <a href="terms-of-service.html" target="_blank" rel="noopener noreferrer">Condiciones del Servicio</a>
        </div>
    </footer>

    <button id="dark-mode-toggle" class="app-button" aria-label="Alternar modo oscuro/claro"><i class="fas fa-moon"></i></button>

    <div id="info-modal" class="modal-overlay">
        <div class="modal-content">
            <button id="close-modal-button" class="app-button close-modal" aria-label="Cerrar ventana de información">×</button>
            <h2>Cómo usar ToDayList</h2>
            <ol>
                <li><strong>Añadir Tareas:</strong> Escribe tu tarea en el campo inferior y pulsa el botón <i class="fas fa-plus"></i> o la tecla "Enter".</li>
                <li><strong>Marcar como Completada:</strong> Haz clic en el círculo a la izquierda de la tarea. ¡Ganas una medalla <i class="fas fa-medal"></i> por cada tarea completada en el día!</li>
                <li><strong>Prioridad:</strong> Haz clic en el cuadrado de color junto al círculo para cambiar la prioridad de la tarea (Rojo: Urgente > Naranja: Alta > Amarillo: No Olvidar > Verde: Puede Esperar > Gris: Sin prioridad).</li>
                <li><strong>Agendar en Google Calendar:</strong> Haz clic en el icono de calendario <i class="far fa-calendar-plus"></i> para que se abra una plantilla de Google Calendar con los detalles de la tarea. Introduce la fecha/hora deseada y guarda el evento en tu calendario. Esta opción está deshabilitada para tareas completadas.</li>
                <li><strong>Enlaces:</strong> Haz clic en el icono de enlace <i class="fas fa-link"></i> para añadir o abrir un enlace web asociado a la tarea.</li>
                <li><strong>Sub-Tareas:</strong>
                    <ul>
                        <li>Pulsa el botón <i class="fas fa-plus"></i> (pequeño, a la derecha de la tarea principal, debajo de la barra de progreso) para mostrar el campo y añadir sub-tareas.</li>
                        <li>Una vez añadida una sub-tarea, el campo de texto se ocultará. Pulsa el botón <i class="fas fa-plus"></i> de nuevo si deseas añadir más.</li>
                        <li>Las sub-tareas tienen su propio círculo para marcarlas como completadas, botones para moverlas <i class="fas fa-arrow-up"></i><i class="fas fa-arrow-down"></i>, o eliminarlas <i class="fas fa-trash-alt"></i>.</li>
                    </ul>
                </li>
                <li><strong>Barra de Progreso:</strong> Indica el porcentaje de sub-tareas completadas. Se llena al 100% cuando la tarea principal se marca como completada.</li>
                <li><strong>Reordenar Tareas:</strong> Pulsa el botón de reordenar <i class="fas fa-sort-amount-down-alt"></i> para organizar automáticamente todas las tareas por prioridad (de más a menos urgente) y luego por fecha (las más antiguas primero, si tienen).</li>
                <li><strong>Modo Oscuro/Claro:</strong> Utiliza el botón <i class="fas fa-moon"></i> / <i class="fas fa-sun"></i> situado abajo a la derecha para cambiar el tema visual de la aplicación.</li>
                <li><strong>Eliminar Tareas:</strong> Haz clic en el icono de papelera <i class="fas fa-trash-alt"></i> para eliminar tareas principales o sub-tareas.</li>
                <li><strong>Anotaciones Rápidas:</strong> Utiliza el área debajo de la leyenda para notas temporales. Puedes borrarlas con el botón "Borrar".</li>
                <li><strong>Exportar/Importar Datos:</strong> Usa los botones "Exportar Local" e "Importar Local" para guardar/restaurar datos desde un archivo en tu dispositivo. Usa "Exportar a Drive" e "Importar de Drive" para usar tu Google Drive. <strong>¡Atención!</strong> Importar reemplazará los datos actuales.</li>
            </ol>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>

    <!-- Enlace al archivo JavaScript externo -->
    <script type="module" src="script.js"></script>

</body>
</html>
```

---

**2. Archivo `style.css` (Modificado)**

He ajustado los estilos para el modal de recordatorio (`#reminder-modal .modal-content`) para que se parezcan más al modal de información. He añadido estilos específicos para los inputs de fecha y hora dentro del modal para que se integren mejor con el tema.

```css
/* Contenido del archivo style.css */
:root {
    --bg-color: #f4f7f6;
    --text-color: #333;
    --heading-color: #222;
    --item-bg: #ffffff;
    --border-color: #e0e0e0;
    --input-bg: #f8f8f8;
    --input-text-color: #333;
    --placeholder-color: #888;
    --button-color: #555;
    --button-hover-color: #e74c3c;
    --delete-button-color: var(--button-color);
    --delete-button-hover-color: var(--button-hover-color);
    --completed-text-color: #999;
    --progress-bg: #e0ffe0;
    --progress-bar-color: #66c266;
    --progress-bar-completed-color: #28a745;
    --empty-list-color: #888;
    --fixed-button-bg: #ffffff;
    --fixed-button-border: #ccc;
    --fixed-button-shadow: 0 2px 5px rgba(0,0,0,0.2);
    --legend-text-color: #666;
    --sort-button-color: #555;
    --sort-button-hover-color: #3498db;
    --footer-text-color: #aaa;
    --medal-color: #ffd700;
    --medal-text-color: var(--text-color);
    --subtitle-color: #777;
    --app-description-color: #555;
    --priority-red-color: #e74c3c;
    --priority-orange-color: #f39c12;
    --priority-yellow-color: #f1c40f;
    --priority-green-color: #2ecc71;
    --priority-none-color: var(--border-color);
    --welcome-button-bg: #e74c3c;
    --welcome-button-text: #fff;
    --welcome-button-hover-bg: #c0392b;
    --drive-icon-color: #4285F4;
    --accent-color: #3498db;

    /* Nuevas variables para el modal de recordatorio */
    --modal-input-background-color: var(--input-bg);
    --modal-input-border-color: var(--border-color);
    --modal-button-background-color: var(--accent-color);
    --modal-button-text-color: #fff;
    --modal-button-hover-background-color: #2980b9; /* Un poco más oscuro que accent-color */
    --modal-button-disabled-background: #bdc3c7;
    --modal-button-disabled-text: #7f8c8d;
}

body.dark-mode {
    --bg-color: #2c3e50;
    --text-color: #ecf0f1;
    --heading-color: #ecf0f1;
    --item-bg: #34495e;
    --border-color: #4a627a;
    --input-bg: #445b71;
    --input-text-color: #ecf0f1;
    --placeholder-color: #bdc3c7;
    --button-color: #bdc3c7;
    --button-hover-color: #f39c12;
    --delete-button-color: var(--button-color);
    --delete-button-hover-color: var(--button-hover-color);
    --completed-text-color: #7f8c8d;
    --progress-bg: #4a627a;
    --progress-bar-color: #8bc34a;
    --progress-bar-completed-color: #28a745;
    --empty-list-color: #bdc3c7;
    --fixed-button-bg: #34495e;
    --fixed-button-border: #4a627a;
    --fixed-button-shadow: 0 2px 5px rgba(0,0,0,0.4);
    --legend-text-color: #a0a0a0;
    --sort-button-color: #bdc3c7;
    --sort-button-hover-color: #3498db;
    --checkbox-checkmark-color: var(--bg-color);
    --footer-text-color: #777;
    --medal-text-color: var(--text-color);
    --subtitle-color: #bdc3c7;
    --app-description-color: #a0a0a0;
    --welcome-button-bg: #f39c12;
    --welcome-button-text: #2c3e50;
    --welcome-button-hover-bg: #e67e22;
    --drive-icon-color: #4A90E2;
    --accent-color: #5dade2;

    /* Nuevas variables para el modal de recordatorio (Dark Mode) */
    --modal-input-background-color: var(--input-bg);
    --modal-input-border-color: var(--border-color);
    --modal-button-background-color: var(--accent-color);
    --modal-button-text-color: var(--text-color); /* Texto claro en botón oscuro */
    --modal-button-hover-background-color: #3498db; /* Un poco más oscuro que accent-color en DM */
    --modal-button-disabled-background: #4a627a;
    --modal-button-disabled-text: #7f8c8d;
}

body {
    font-family: 'Lexend', sans-serif;
    margin: 0;
    padding: 20px;
    background-color: var(--bg-color);
    color: var(--text-color);
    line-height: 1.6;
    padding-bottom: 120px;
    transition: background-color 0.3s ease, color 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    box-sizing: border-box;
}

.container {
    width: 100%;
    max-width: 600px;
    padding: 0 10px;
    box-sizing: border-box;
    flex-grow: 1;
    position: relative;
    padding-bottom: 20px;
}

h1 {
    font-family: 'Quicksand', sans-serif;
    color: var(--heading-color);
    text-align: center;
    margin-top: 0;
    margin-bottom: 2px;
    font-weight: 700;
    font-size: 2.8rem;
    letter-spacing: -0.5px;
    padding-top: 45px;
}
.subtitle {
    text-align: center;
    font-family: 'Lexend', sans-serif;
    font-size: 1.1rem;
    font-weight: 400;
    color: var(--subtitle-color);
    margin-top: 0;
    margin-bottom: 10px;
    letter-spacing: 0.2px;
}
.app-description-static {
    text-align: center;
    font-family: 'Lexend', sans-serif;
    font-size: 0.9rem;
    font-weight: 300;
    color: var(--app-description-color);
    margin-top: 0;
    margin-bottom: 20px;
    line-height: 1.5;
    max-width: 90%;
    margin-left: auto;
    margin-right: auto;
}

#welcome-section {
    margin-top: 20px;
    margin-bottom: 30px;
    padding: 25px;
    background-color: var(--item-bg);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    text-align: center;
}
.welcome-icon {
    width: 64px;
    height: 64px;
    margin-bottom: 15px;
    border-radius: 12px;
}
#welcome-section h2 {
    font-family: 'Quicksand', sans-serif;
    font-size: 1.8rem;
    color: var(--heading-color);
    margin-top: 0;
    margin-bottom: 15px;
}
#welcome-section p {
    font-size: 0.95rem;
    color: var(--text-color);
    margin-bottom: 15px;
    line-height: 1.6;
}
#welcome-section ul {
    list-style: none;
    padding-left: 0;
    margin: 20px auto;
    max-width: 400px;
    text-align: left;
}
#welcome-section ul li {
    font-size: 0.9rem;
    color: var(--text-color);
    margin-bottom: 10px;
    padding-left: 25px;
    position: relative;
    line-height: 1.5;
}
#welcome-section ul li::before {
    content: "\f00c";
    font-family: "Font Awesome 6 Free";
    font-weight: 900;
    position: absolute;
    left: 0;
    top: 3px;
    color: var(--progress-bar-completed-color);
}
body.dark-mode #welcome-section ul li::before {
    color: var(--progress-bar-color);
}
#start-app-button {
    background-color: var(--welcome-button-bg);
    color: var(--welcome-button-text);
    border: none;
    padding: 12px 25px;
    font-size: 1.1rem;
    font-weight: bold;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.2s ease;
    margin-top: 20px;
    display: inline-block;
}
#start-app-button:hover {
    background-color: var(--welcome-button-hover-bg);
    transform: translateY(-2px);
}
#start-app-button:focus, #start-app-button:focus-visible {
     outline: 3px solid var(--button-hover-color);
     outline-offset: 2px;
}

#install-instructions-section {
    margin-top: 20px;
    margin-bottom: 30px;
    padding: 18px 22px;
    background-color: var(--item-bg);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    font-size: 0.85rem;
    color: var(--text-color);
}
#install-instructions-section h4 {
    font-family: 'Quicksand', sans-serif;
    font-size: 1.2rem;
    color: var(--subtitle-color);
    margin-top: 0;
    margin-bottom: 8px;
    text-align: center;
}
#install-instructions-section p {
    font-size: 0.95em;
    color: var(--text-color);
    margin-bottom: 12px;
    line-height: 1.45;
    text-align: center;
}
#install-instructions-section ul {
    list-style: none;
    padding-left: 5px;
    margin: 0 auto;
    max-width: 480px;
}
#install-instructions-section ul li {
    margin-bottom: 8px;
    line-height: 1.5;
    font-size: 0.92em;
    padding-left: 25px;
    position: relative;
    text-align: left;
}
#install-instructions-section ul li::before {
    font-family: "Font Awesome 6 Brands", "Font Awesome 6 Free";
    font-weight: 400;
    position: absolute;
    left: 0px;
    top: 1px;
    width: 20px;
    text-align: center;
    color: var(--button-color);
    font-size: 1.1em;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
#install-instructions-section ul li:nth-child(1)::before { content: "\f268"; }
#install-instructions-section ul li:nth-child(2)::before { content: "\f17b"; }
#install-instructions-section ul li:nth-child(3)::before { content: "\f179"; }
#install-instructions-section ul li:nth-child(4)::before { content: "\f267"; }
#install-instructions-section ul li strong {
    color: var(--heading-color);
    font-weight: 700;
}
#install-instructions-section ul li i.fas.fa-download,
#install-instructions-section ul li i.fas.fa-ellipsis-v,
#install-instructions-section ul li i.fas.fa-share-square {
    color: var(--button-hover-color);
    margin-left: 0.1em;
    margin-right: 0.1em;
    font-size: 0.9em;
}

.hidden {
    display: none !important;
}

#medal-counter-container {
    text-align: center;
    font-size: 1.2rem;
    color: var(--medal-text-color);
    margin-bottom: 20px;
}
#medal-counter-container .fa-medal {
    color: var(--medal-color);
    margin-right: 5px;
}
#medal-count {
    font-weight: bold;
}

#priority-legend {
    text-align: center;
    font-size: 0.75rem;
    color: var(--legend-text-color);
    margin-top: 30px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px 10px;
}
#priority-legend .priority-legend-item {
     display: inline-flex;
     align-items: center;
     gap: 4px;
}
 #priority-legend .priority-color-label {
     width: 10px;
     height: 10px;
     margin-right: 0;
     flex-shrink: 0;
 }
 #priority-legend .priority-color-label:hover {
     transform: none;
 }

#todo-list {
    list-style: none;
    padding: 0;
    margin: 0 0 30px 0;
}

.todo-item {
    background-color: var(--item-bg);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    box-sizing: border-box;
    transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    border-left: 5px solid var(--border-color);
    padding-left: 10px;
}
 .todo-item:last-child {
     margin-bottom: 0;
 }

.todo-item[data-priority-color="red"] { border-left-color: var(--priority-red-color); }
.todo-item[data-priority-color="orange"] { border-left-color: var(--priority-orange-color); }
.todo-item[data-priority-color="yellow"] { border-left-color: var(--priority-yellow-color); }
.todo-item[data-priority-color="green"] { border-left-color: var(--priority-green-color); }
.todo-item[data-priority-color="none"] { border-left-color: var(--priority-none-color); }


 .app-button {
     background: none;
     border: none;
     border-radius: 4px;
     cursor: pointer;
     transition: color 0.2s ease, background-color 0.2s ease, opacity 0.2s ease;
     flex-shrink: 0;
     padding: 6px 10px;
     font-size: 1rem;
     line-height: 1;
     display: inline-flex;
     align-items: center;
     justify-content: center;
     text-decoration: none;
     color: var(--button-color);
 }
 .app-button:hover {
     color: var(--button-hover-color);
 }
 .app-button:focus, .app-button:focus-visible {
      outline: 2px solid var(--button-hover-color);
      outline-offset: 2px;
 }
 .app-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
 }
 .app-button:disabled:hover {
    color: var(--button-color);
 }

 .add-button {
     color: var(--button-color);
     font-weight: bold;
 }
 .add-button:hover {
     color: var(--button-hover-color);
 }
 .delete-button {
     color: var(--delete-button-color);
 }
 .delete-button:hover {
     color: var(--delete-button-hover-color);
 }
 .sort-button {
     color: var(--sort-button-color);
     font-weight: normal;
     padding: 10px 15px;
     font-size: 1.1rem;
 }
 .sort-button:hover {
     color: var(--sort-button-hover-color);
 }

 #dark-mode-toggle {
     position: fixed;
     bottom: 20px;
     right: 20px;
     font-size: 1.3rem;
     color: var(--button-color);
     z-index: 1000;
     background-color: var(--fixed-button-bg);
     border: 1px solid var(--fixed-button-border);
     border-radius: 50%;
     width: 45px;
     height: 45px;
     display: flex;
     justify-content: center;
     align-items: center;
     box-shadow: var(--fixed-button-shadow);
     transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
 }
 #dark-mode-toggle:hover {
     color: var(--button-hover-color);
 }
 #dark-mode-toggle i {
     line-height: 1;
 }

#new-todo-input,
.todo-item .subtask-input-container input[type="text"] {
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    flex-grow: 1;
    min-width: 150px;
    font-size: 0.95rem;
    box-sizing: border-box;
    background-color: var(--input-bg);
    color: var(--input-text-color);
    outline: none;
    transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}
#new-todo-input:focus,
.todo-item .subtask-input-container input[type="text"]:focus {
    border-color: var(--button-hover-color);
    box-shadow: 0 0 0 0.2rem rgba(231, 76, 60, 0.25);
}
#new-todo-input::placeholder,
.todo-item .subtask-input-container input[type="text"]::placeholder {
     color: var(--placeholder-color);
     opacity: 1;
}

 .custom-checkbox {
     /* margin-right: 10px; /* Controlado por el gap del task-prefix-group */
     border: 1px solid var(--text-color);
     border-radius: 50%;
     appearance: none;
     -webkit-appearance: none;
     width: 20px;
     height: 20px;
     background-color: var(--item-bg);
     cursor: pointer;
     position: relative;
     flex-shrink: 0;
     box-sizing: border-box;
     transition: background-color 0.2s ease, border-color 0.2s ease;
 }
 .custom-checkbox:checked {
      background-color: var(--text-color);
      border-color: var(--text-color);
 }

 .custom-checkbox:checked::after {
     content: '';
     position: absolute;
     box-sizing: content-box;
     width: 5px;
     height: 9px;
     border: solid var(--item-bg);
     border-width: 0 2px 2px 0;
     top: 3px;
     left: 6px;
     transform: rotate(45deg);
 }
 body.dark-mode .custom-checkbox:checked::after {
     border-color: var(--checkbox-checkmark-color) !important;
 }

.todo-item .main-task-header {
    display: flex;
    align-items: flex-start; /* Alinear elementos al inicio (arriba) del contenedor principal */
    margin-bottom: 15px;
    padding: 0;
    gap: 8px; /* Espacio entre task-prefix-group y task-body. Ajusta si es necesario. */
}

/* Grupo de checkbox y etiqueta de prioridad */
.todo-item .main-task-header .task-prefix-group {
    display: flex;
    align-items: center; /* Centrar verticalmente checkbox y etiqueta de prioridad entre sí */
    gap: 4px; /* Espacio entre checkbox y etiqueta de color. AJUSTA (e.g., 4px, 5px). */
    flex-shrink: 0;
    /* Si el texto es de una sola línea, este grupo podría necesitar un empuje hacia arriba para centrarse con el texto.
       O, mejor, el texto necesitará un line-height adecuado o padding.
       Por ahora, lo dejamos sin margin-top aquí. */
}

/* Eliminamos el margin-top individual de los hijos del task-prefix-group
   ya que ahora se centran con align-items: center en su padre. */
/*
.todo-item .main-task-header .task-prefix-group .custom-checkbox,
.todo-item .main-task-header .task-prefix-group .priority-color-label {
    margin-top: 3px;
}
*/

.todo-item .priority-color-label { /* Estilo global para la etiqueta, usado también en la leyenda */
     display: inline-block;
     width: 16px;
     height: 16px;
     border: 1px solid var(--border-color);
     border-radius: 4px;
     cursor: pointer;
     flex-shrink: 0;
     transition: border-color 0.2s ease, transform 0.1s ease, background-color 0.2s ease;
     box-sizing: border-box;
}
 .todo-item .priority-color-label:hover {
     transform: scale(1.1);
 }
.priority-color-label[data-color="red"] { background-color: var(--priority-red-color); border-color: var(--priority-red-color); }
.priority-color-label[data-color="orange"] { background-color: var(--priority-orange-color); border-color: var(--priority-orange-color); }
.priority-color-label[data-color="yellow"] { background-color: var(--priority-yellow-color); border-color: var(--priority-yellow-color); }
.priority-color-label[data-color="green"] { background-color: var(--priority-green-color); border-color: var(--priority-green-color); }
.priority-color-label[data-color="none"] { background-color: transparent; border-color: var(--border-color); }

.todo-item .main-task-header .task-body {
    display: flex;
    flex-grow: 1;
    align-items: flex-start; /* Para que el texto de varias líneas y el grupo de acciones se alineen arriba */
    gap: 8px;
    min-width: 0;
    flex-wrap: wrap;
}

.todo-item .main-task-header .task-body span {
    font-weight: 700;
    font-size: 1.1rem;
    flex-grow: 1;
    color: var(--text-color);
    transition: color 0.3s ease, text-decoration 0.3s ease;
    min-width: 0;
    word-break: break-word;
    line-height: 1.45; /* AJUSTA este valor. Un valor ligeramente mayor que 1 (ej. 1.4 o 1.5)
                          ayudará a centrar el texto de una sola línea con los iconos de 20px de alto.
                          Si es muy grande, el espacio entre líneas múltiples aumentará. */
    padding-top: 1px;  /* AJUSTA (0px, 1px, 2px). Un pequeño empujón hacia abajo del texto
                          para alinearlo mejor con el centro visual de los iconos del prefix-group. */
}

.todo-item .main-task-header .task-body .task-actions-group {
    display: flex;
    align-items: center; /* Centra los botones dentro de su propio grupo */
    gap: 2px;
    margin-left: auto;
    flex-shrink: 0;
    /* El line-height y padding-top del span deberían ayudar a alinear esto.
       Si aún se ve muy alto, considera un pequeño margin-top aquí. */
    /* margin-top: 1px; /* AJUSTA si es necesario */
}

.todo-item .main-task-header .task-body .task-actions-group .link-button,
.todo-item .main-task-header .task-body .task-actions-group .google-calendar-button {
    padding-left: 4px;
    padding-right: 4px;
    font-size: 1rem;
}

.todo-item .main-task-header .task-body .task-actions-group .google-calendar-button i {
    color: var(--button-color);
    transition: color 0.2s ease;
}
.todo-item .main-task-header .task-body .task-actions-group .google-calendar-button:hover i {
    color: var(--button-hover-color);
}

.todo-item .main-task-header .task-body .link-button {
    font-size: 1rem;
    opacity: 0.5;
}
.todo-item .main-task-header .task-body .link-button.link-on {
    opacity: 1;
}

.todo-item .main-task-header .task-body .task-actions-group .delete-button {
     padding: 4px 8px;
     font-size: 1rem;
     margin-left: 6px;
}

.todo-item .add-subtasks-toggle {
     display: block;
     width: fit-content;
     margin: 10px 0 0 auto;
     padding: 4px 8px;
     font-size: 1.1rem;
     font-weight: normal;
     color: var(--legend-text-color);
}
 .todo-item .add-subtasks-toggle:hover {
     color: var(--button-hover-color);
 }

.todo-item .subtask-input-container {
    display: none;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 15px;
    padding: 0;
    align-items: center;
}
 .todo-item .subtask-input-container button {
     padding: 8px 12px;
     font-size: 1rem;
 }

.todo-item .subtasks-list {
    list-style: none;
    padding: 0;
    margin-top: 15px;
    border-left: 2px solid var(--border-color);
    padding-left: 20px;
    transition: border-left-color 0.3s ease;
}
.todo-item .subtasks-list li {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    gap: 5px;
}
 .todo-item .subtasks-list li:last-child {
     margin-bottom: 0;
 }

.todo-item .subtasks-list li input[type="checkbox"] {
     width: 18px;
     height: 18px;
     border-color: var(--text-color);
     background-color: var(--item-bg);
}
 .todo-item .subtasks-list li input[type="checkbox"]:checked {
      background-color: var(--text-color);
      border-color: var(--text-color);
 }

.todo-item .subtasks-list li input[type="checkbox"]:checked::after {
    content: '';
    position: absolute;
    box-sizing: content-box;
    width: 4px;
    height: 8px;
    border: solid var(--item-bg);
    border-width: 0 1.8px 1.8px 0;
    top: 2.5px;
    left: 5px;
    transform: rotate(45deg);
}
 body.dark-mode .todo-item .subtasks-list li input[type="checkbox"]:checked::after {
     border-color: var(--checkbox-checkmark-color) !important;
 }

.todo-item .subtasks-list li span {
     flex-grow: 1;
     margin-right: 5px;
     color: var(--button-color);
     text-decoration: none;
     transition: color 0.3s ease, text-decoration 0.3s ease;
     word-break: break-word;
     font-size: 0.85em;
     font-weight: 300;
}
 .todo-item .subtasks-list li .subtask-move-button {
     color: var(--button-color);
     padding: 4px;
     font-size: 0.9rem;
 }
 .todo-item .subtasks-list li .subtask-move-button:hover {
     color: var(--button-hover-color);
 }
 .todo-item .subtasks-list li .subtask-move-button:disabled {
     opacity: 0.3;
     cursor: not-allowed;
     color: var(--button-color);
 }
 .todo-item .subtasks-list li .subtask-move-button:disabled:hover {
     color: var(--button-color);
 }
 .todo-item .subtasks-list li .delete-button {
     padding: 4px 8px;
     font-size: 1rem;
 }

.todo-item .progress-container {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    margin-top: 15px;
    margin-bottom: 0;
    overflow: hidden;
    background-color: var(--progress-bg);
    transition: background-color 0.3s ease;
}
.todo-item .progress-bar {
    height: 100%;
    background-color: var(--progress-bar-color);
    width: 0%;
    transition: width 0.5s ease-in-out, background-color 0.3s ease;
}
 .todo-item .progress-text { display: none; }

#todo-list:empty:before {
    content: "No hay tareas. ¡Agrega una!";
    display: block;
    text-align: center;
    color: var(--empty-list-color);
    margin-top: 20px;
    font-style: italic;
    transition: color 0.3s ease;
}

.todo-item.show-subtask-ui .subtask-input-container {
     display: flex;
}
.todo-item.show-subtask-ui .add-subtasks-toggle {
     display: none;
}

.todo-item.completed .main-task-header .task-body span,
.todo-item.completed .subtasks-list li span {
    color: var(--completed-text-color);
    text-decoration: line-through;
}
.todo-item.completed .progress-bar {
    background-color: var(--progress-bar-completed-color);
}

.todo-item.completed .priority-color-label,
.todo-item.completed .subtasks-list li .app-button {
    opacity: 0.7;
    cursor: default;
}

.todo-item.completed .main-task-header .task-body .task-actions-group .google-calendar-button {
    opacity: 0.7;
    cursor: default;
    pointer-events: none;
}
.todo-item.completed .main-task-header .task-body .task-actions-group .google-calendar-button i {
    color: var(--completed-text-color) !important;
}
.todo-item.completed .main-task-header .task-body .task-actions-group .google-calendar-button:hover i {
    color: var(--completed-text-color) !important;
}

.todo-item.completed .main-task-header .task-body .task-actions-group .delete-button {
    opacity: 0.7;
}
.todo-item.completed .main-task-header .task-body .task-actions-group .delete-button:hover {
    opacity: 0.7;
    color: var(--delete-button-color);
}

.todo-item.completed .main-task-header .task-body .link-button.link-on {
    opacity: 0.8;
    cursor: pointer;
}
.todo-item.completed .main-task-header .task-body .link-button.link-on:hover {
    color: var(--button-hover-color);
    opacity: 1;
}
.todo-item.completed .main-task-header .task-body .link-button.link-off {
    opacity: 0.4;
    cursor: default;
}
.todo-item.completed .main-task-header .task-body .link-button.link-off:hover {
    color: var(--button-color);
    opacity: 0.4;
}

.todo-item.completed .priority-color-label:hover,
.todo-item.completed .subtasks-list li .app-button:hover {
    color: inherit;
    text-decoration: none;
    transform: none;
}

 .todo-item.completed .main-task-header .task-prefix-group .custom-checkbox {
     border-color: var(--completed-text-color);
     background-color: var(--completed-text-color);
 }
  body.dark-mode .todo-item.completed .main-task-header .task-prefix-group .custom-checkbox {
      border-color: var(--completed-text-color);
      background-color: var(--completed-text-color);
  }
 .todo-item.completed .main-task-header .task-prefix-group .custom-checkbox:checked::after {
      border-color: var(--item-bg) !important;
 }
  body.dark-mode .todo-item.completed .main-task-header .task-prefix-group .custom-checkbox:checked::after {
      border-color: var(--item-bg) !important;
  }

 #todo-input-container {
     display: flex;
     gap: 10px;
     padding: 0;
     align-items: center;
     margin-bottom: 20px;
     flex-wrap: wrap;
 }
  #todo-input-container #add-todo-button {
       margin-left: 0;
       padding: 10px 15px;
       font-size: 1.1rem;
  }
  #todo-input-container #reorder-button {
       margin-left: auto;
  }

#quick-notes-container {
    margin-top: 25px;
    margin-bottom: 50px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

#quick-notes-area {
    width: 100%;
    min-height: 70px;
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-family: 'Lexend', sans-serif;
    font-weight: 300;
    font-size: 0.85rem;
    line-height: 1.4;
    background-color: var(--input-bg);
    color: var(--input-text-color);
    box-sizing: border-box;
    resize: vertical;
    outline: none;
    transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}
#quick-notes-area::placeholder {
    color: var(--placeholder-color);
    opacity: 1;
}
#quick-notes-area:focus {
    border-color: var(--button-hover-color);
    box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.15);
}
body.dark-mode #quick-notes-area:focus {
    box-shadow: 0 0 0 2px rgba(243, 156, 18, 0.2);
}

#clear-notes-button {
    align-self: flex-end;
    padding: 5px 10px;
    font-size: 0.8rem;
    color: var(--button-color);
    background-color: var(--item-bg);
    border: 1px solid var(--border-color);
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    border-radius: 4px;
}
#clear-notes-button:hover {
    color: var(--button-hover-color);
    border-color: var(--button-hover-color);
    background-color: var(--fixed-button-bg);
}
#clear-notes-button i {
    margin-right: 4px;
}

#data-management-section {
    margin-top: 30px;
    margin-bottom: 20px;
    padding: 0 10px;
}
#data-management-section h4 {
    font-family: 'Quicksand', sans-serif;
    font-size: 1.2rem;
    color: var(--subtitle-color);
    margin-top: 0;
    margin-bottom: 10px;
    text-align: center;
}
.data-management-intro {
    font-size: 0.85rem;
    color: var(--legend-text-color);
    text-align: center;
    margin-bottom: 20px;
    line-height: 1.5;
    max-width: 90%;
    margin-left: auto;
    margin-right: auto;
}
.data-options-row {
    display: flex;
    justify-content: space-around;
    gap: 15px;
    margin-bottom: 15px;
    flex-wrap: wrap;
}
.data-options-row:last-child {
    margin-bottom: 0;
}
.data-action-button {
    flex-grow: 1;
    min-width: 200px;
    padding: 9px 15px !important;
    font-size: 0.9rem !important;
    background-color: var(--item-bg);
    border: 1px solid var(--border-color) !important;
    box-shadow: 0 1px 2px rgba(0,0,0,0.06);
    color: var(--button-color);
    font-weight: 400;
    border-radius: 6px;
}
.data-action-button:hover {
    border-color: var(--button-hover-color) !important;
    background-color: var(--fixed-button-bg);
    color: var(--button-hover-color);
}
.data-action-button i {
    margin-right: 8px;
    font-size: 0.95em;
}
.drive-button-style i.fab.fa-google-drive {
     color: var(--drive-icon-color);
}
.drive-button-style:disabled i.fab.fa-google-drive {
    color: inherit;
    opacity: 0.7;
}
.drive-button-style:disabled {
    background-color: var(--input-bg) !important;
    border-color: var(--border-color) !important;
    color: var(--placeholder-color) !important;
    opacity: 0.7;
}

#info-button {
    position: absolute;
    top: 15px;
    left: 15px;
    font-family: 'Quicksand', sans-serif;
    font-weight: bold;
    font-size: 1.3rem;
    color: var(--button-color);
    background-color: var(--item-bg);
    border: 1px solid var(--border-color);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    z-index: 900;
    line-height: 1;
    padding: 0;
    transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}
#info-button:hover {
    color: var(--button-hover-color);
    background-color: var(--fixed-button-bg);
    border-color: var(--button-hover-color);
}

footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 0.8rem;
    color: var(--footer-text-color);
    margin-top: 30px;
    padding: 20px 10px 15px;
    width: 100%;
    max-width: 600px;
    box-sizing: border-box;
    border-top: 1px solid var(--border-color);
}
.footer-logo {
    width: 48px;
    height: 48px;
    margin-bottom: 10px;
}
.footer-text {
    margin: 0 0 8px 0;
    color: var(--footer-text-color);
    font-size: 0.85em;
}
#support-section-footer {
    margin-top: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.support-intro-text {
    font-size: 0.7rem;
    color: var(--legend-text-color);
    margin-bottom: 3px;
    line-height: 1.3;
}
.paypal-link-footer {
    display: inline-flex;
    align-items: center;
    font-size: 0.7rem;
    color: var(--legend-text-color);
    text-decoration: none;
    transition: color 0.2s ease;
}
.paypal-link-footer:hover {
    color: var(--button-hover-color);
    text-decoration: underline;
}
.paypal-link-footer i.fab.fa-paypal {
    margin-right: 4px;
    font-size: 0.9em;
}
.footer-legal-links {
    margin-top: 15px;
    font-size: 0.75em;
}
.footer-legal-links a {
    margin: 0 5px;
    color: var(--legend-text-color);
    text-decoration: none;
}
.footer-legal-links a:hover {
    text-decoration: underline;
    color: var(--button-hover-color);
}
.footer-legal-links span {
    color: var(--legend-text-color);
}


@media (max-width: 500px) {
    h1 {
        padding-top: 50px;
        font-size: 2.3rem;
    }
    .subtitle {
        font-size: 1rem;
    }
    .app-description-static {
        font-size: 0.85rem;
    }
    #info-button {
        font-size: 1.2rem;
        width: 32px;
        height: 32px;
        top: 10px;
        left: 10px;
    }
    .todo-item .main-task-header {
        row-gap: 8px;
    }

    .todo-item .main-task-header .task-body .task-actions-group {
        /* width: 100%; */
        /* justify-content: flex-end; */
        /* margin-left: 0; */
    }

    .todo-item .main-task-header .task-body .link-button { order: 1; }
    .todo-item .main-task-header .task-body .google-calendar-button { order: 2; }
    .todo-item .main-task-header .task-body .delete-button { order: 3; }


     #todo-input-container #reorder-button {
          margin-left: 0;
     }
    #data-management-section {
        padding: 15px 10px;
    }
    #data-management-section h4 {
        font-size: 1.1rem;
    }
    .data-management-intro {
        font-size: 0.8rem;
        margin-bottom: 15px;
    }
     .data-options-row {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
    }
    .data-action-button {
        min-width: unset;
        width: 100%;
        margin-bottom: 0;
    }
    .data-options-row .data-action-button + .data-action-button {
         margin-top: 10px;
    }


     #welcome-section h2 {
         font-size: 1.5rem;
     }
     #welcome-section p {
         font-size: 0.9rem;
     }
     #welcome-section ul li {
         font-size: 0.85rem;
     }
     #start-app-button {
        padding: 10px 20px;
        font-size: 1rem;
    }
    #install-instructions-section {
        padding: 15px 18px;
        font-size: 0.8rem;
    }
    #install-instructions-section h4 {
        font-size: 1.1rem;
    }
    #install-instructions-section ul li {
        font-size: 0.95em;
        padding-left: 22px;
        margin-bottom: 7px;
    }
    #install-instructions-section ul li::before {
        top: 0px;
        font-size: 1em;
    }
    footer {
        font-size: 0.75rem;
        padding-top: 15px;
    }
    .footer-logo {
        width: 40px;
        height: 40px;
        margin-bottom: 8px;
    }
    .footer-text {
        margin-bottom: 6px;
        font-size: 0.9em;
    }
    .support-intro-text,
    .paypal-link-footer {
        font-size: 0.7em;
    }
    .support-intro-text {
        margin-bottom: 2px;
    }
    .footer-legal-links {
        font-size: 0.7em;
    }
}

/* Estilos para los modales (info y recordatorio) */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.65);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0s linear 0.3s;
    padding-top: 60px; /* Espacio superior para evitar que se pegue al top */
    box-sizing: border-box;
}
.modal-overlay.visible {
    opacity: 1;
    visibility: visible;
    transition: opacity 0.3s ease, visibility 0s linear 0s;
}
.modal-content {
    background-color: var(--item-bg);
    color: var(--text-color);
    padding: 25px 30px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    width: 90%;
    max-width: 580px;
    max-height: 85vh;
    overflow-y: auto;
    position: relative;
    transform: scale(0.95);
    transition: transform 0.3s ease;
    box-sizing: border-box;
}
.modal-overlay.visible .modal-content {
    transform: scale(1);
}
.modal-content h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: var(--heading-color);
    text-align: center;
    font-family: 'Quicksand', sans-serif;
    font-size: 1.8rem;
}

/* Estilos específicos para el modal de recordatorio */
#reminder-modal .modal-content h2 {
    color: var(--accent-color); /* Usar color de acento para el título del recordatorio */
}

#reminder-modal p#reminder-task-text {
    text-align: center;
    font-style: italic;
    margin-bottom: 20px;
    word-break: break-word; /* Romper palabras largas */
    color: var(--text-color);
    font-size: 1rem; /* Ajustar tamaño de texto de la tarea */
    font-weight: normal;
}

.modal-input-group {
    margin-bottom: 15px;
}

.modal-input-group label {
    display: block; /* Etiqueta en su propia línea */
    margin-bottom: 5px;
    font-weight: bold;
    color: var(--text-color);
    font-size: 0.95rem; /* Ajustar tamaño etiqueta */
}

.modal-input-group input[type="date"],
.modal-input-group input[type="time"] {
    width: calc(100% - 22px); /* Ancho completo menos padding y borde */
    padding: 10px;
    border: 1px solid var(--modal-input-border-color); /* Usar color de borde del tema */
    border-radius: 4px;
    background-color: var(--modal-input-background-color); /* Usar color de fondo de input del tema */
    color: var(--input-text-color); /* Usar color de texto del tema */
    font-size: 1rem;
    box-sizing: border-box;
    outline: none;
    transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
    font-family: 'Lexend', sans-serif; /* Usar la misma fuente que el resto de inputs */
}

.modal-input-group input[type="date"]:focus,
.modal-input-group input[type="time"]:focus {
    border-color: var(--button-hover-color);
    box-shadow: 0 0 0 0.2rem rgba(231, 76, 60, 0.25);
}
body.dark-mode .modal-input-group input[type="date"]:focus,
body.dark-mode .modal-input-group input[type="time"]:focus {
     box-shadow: 0 0 0 0.2rem rgba(243, 156, 18, 0.2);
}


/* Estilos para el input de fecha/hora en modo oscuro (puede variar según navegador) */
/* Intentamos invertir colores, pero la apariencia nativa es difícil de controlar */
/* body.dark-mode .modal-input-group input[type="date"], */
/* body.dark-mode .modal-input-group input[type="time"] { */
     /* filter: invert(1) hue-rotate(180deg); */
/* } */


#reminder-modal .modal-content button.app-button {
    display: block; /* Botón en su propia línea */
    width: 100%; /* Ancho completo */
    padding: 12px;
    background-color: var(--modal-button-background-color); /* Usar color de acento */
    color: var(--modal-button-text-color); /* Color de texto del botón */
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.1rem;
    transition: background-color 0.2s ease;
    font-weight: bold;
}

#reminder-modal .modal-content button.app-button:hover {
    background-color: var(--modal-button-hover-background-color); /* Color de acento más oscuro al pasar el ratón */
}

#reminder-modal .modal-content button.app-button:disabled {
    background-color: var(--modal-button-disabled-background);
    color: var(--modal-button-disabled-text);
    cursor: not-allowed;
    opacity: 1; /* No reducir opacidad, solo cambiar color */
}
#reminder-modal .modal-content button.app-button:disabled:hover {
    background-color: var(--modal-button-disabled-background); /* Mantener color deshabilitado al pasar el ratón */
    color: var(--modal-button-disabled-text);
}


/* Estilos para el modal de información (ya existían, solo se asegura compatibilidad) */
.modal-content ol {
    padding-left: 20px;
    margin-bottom: 0;
}
.modal-content ol li {
    margin-bottom: 12px;
    line-height: 1.5;
}
.modal-content ol li ul {
    padding-left: 20px;
    margin-top: 8px;
    list-style-type: disc;
}
.modal-content ol li ul li {
    margin-bottom: 8px;
    font-size: 0.95em;
}
.modal-content strong {
    color: var(--heading-color);
}
.modal-content i.fas, .modal-content i.far, .modal-content i.fab {
    color: var(--button-hover-color);
    margin: 0 2px;
    font-size: 0.9em;
}
/* Estilo para el botón de cerrar (aplicado a ambos modales) */
.close-modal {
    position: absolute;
    top: 10px;
    right: 12px;
    font-size: 1.9rem; /* Tamaño del icono */
    color: var(--button-color);
    padding: 5px 10px; /* Padding para el área clickeable */
    line-height: 1;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.2s ease;
}
.close-modal:hover {
    color: var(--button-hover-color);
}
/* Asegurarse de que el botón de cerrar no tenga estilos de botón normales */
.close-modal.app-button {
    /* Sobrescribir estilos de .app-button si es necesario */
    background: none !important;
    border: none !important;
    box-shadow: none !important;
    padding: 5px 10px !important; /* Mantener padding del close-modal */
}


@media (max-width: 500px) {
    /* ... (media queries existentes) ... */

    /* Ajustes para modales en pantallas pequeñas */
    .modal-overlay {
        padding-top: 20px; /* Reducir padding top en móviles */
    }
    .modal-content {
        padding: 20px 25px; /* Reducir padding */
        max-height: 90vh; /* Permitir que ocupe más alto si es necesario */
    }
    .modal-content h2 {
        font-size: 1.5rem; /* Reducir tamaño título */
        margin-bottom: 15px;
    }
    #reminder-modal p#reminder-task-text {
        font-size: 0.9rem; /* Reducir tamaño texto tarea */
        margin-bottom: 15px;
    }
    .modal-input-group {
        margin-bottom: 10px;
    }
    .modal-input-group label {
        font-size: 0.9rem;
        margin-bottom: 3px;
    }
    .modal-input-group input[type="date"],
    .modal-input-group input[type="time"] {
        padding: 8px;
        font-size: 0.95rem;
    }
    #reminder-modal .modal-content button.app-button {
        padding: 10px;
        font-size: 1rem;
    }
    .modal-content ol li {
        font-size: 0.9em;
        margin-bottom: 10px;
    }
    .modal-content ol li ul li {
        font-size: 0.9em;
        margin-bottom: 6px;
    }
    .close-modal {
        font-size: 1.7rem;
        top: 8px;
        right: 10px;
        padding: 3px 8px;
    }
}
```

---

**3. Archivo `script.js` (Sin cambios en la lógica, solo se asegura que las referencias HTML/CSS sean correctas)**

El código JavaScript que te pasé antes ya estaba preparado para usar los IDs y la lógica del modal. No necesita cambios adicionales para este ajuste estético, ya que los cambios son solo en el HTML (clase del botón) y CSS (estilos).

```javascript
// Contenido del archivo script.js
let todoInput;
let addTodoButton;
let todoListContainer;
let reorderButton;
let darkModeToggle;
let body;
let medalCountDisplay;
let infoButton, infoModal, closeModalButton;

let quickNotesArea;
let clearNotesButton;
const QUICK_NOTES_STORAGE_KEY = 'todoListQuickNotes';

let exportDataButton;
let importDataButton;
let importFileInput;

// Google Drive Integration Variables
let exportDriveButton; // Se asignará en DOMContentLoaded
let importDriveButton; // Se asignará en DOMContentLoaded
// -------------------------------------------------------------------------------------
const CLIENT_ID = '25607067695-mgv7jfvio4vr1goi5ci6o952mgpii8nf.apps.googleusercontent.com'; // Para Google Drive
const API_KEY = 'AIzaSyAhr2kqUcRf5qZi0yMHxFDsyp_x8Ekfj7k';         // Para Google Picker (Drive)
// -------------------------------------------------------------------------------------
const SCOPES = 'https://www.googleapis.com/auth/drive.file'; // Solo Drive
let tokenClient; // Para Drive
let gapiInited = false; // Para gapi client (Drive Picker)
let gisInited = false;  // Para Google Identity Services (Drive Auth)

let welcomeSection;
let startAppButton;
let appMainInterface;
let installInstructionsSection; // Mantenemos la variable, pero la lógica de mostrar/ocultar cambia

let todos = [];

const TODOS_STORAGE_KEY = 'todoListAppTasks';
const MEDALS_STORAGE_KEY = 'todoListDailyMedalData';
const THEME_STORAGE_KEY = 'todoListTheme';

const PRIORITY_COLORS = ['none', 'red', 'orange', 'yellow', 'green'];
const PRIORITY_ORDER = { 'red': 1, 'orange': 2, 'yellow': 3, 'green': 4, 'none': 5 };

// Nuevas variables para el modal de recordatorio
let reminderModal;
let closeReminderModalButton;
let reminderTaskTextElement;
let reminderDateInput;
let reminderTimeInput;
let scheduleReminderButton;
let currentTaskIdForReminder = null; // Para guardar el ID de la tarea actual


// --- Namespace para callbacks de Google ---
window.googleApiCallbacks = {
    gisLoaded: function() {
        console.log("SCRIPT.JS MODULE: googleApiCallbacks.gisLoaded called");
        if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
            console.error("Objeto 'google.accounts.oauth2' no encontrado. GIS no cargó correctamente (para Drive).");
            // Reintentar si el script de Google cargó pero el objeto 'google' no está listo inmediatamente
            if (window.isGoogleGisScriptReady && !gisInited) {
                console.log("Retrying GIS init in 100ms as google object might not be fully ready.");
                setTimeout(window.googleApiCallbacks.gisLoaded, 100);
            }
            return;
        }
        if (gisInited) {
            console.log("SCRIPT.JS MODULE: GIS already initialized.");
            return;
        }
        try {
            tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: '', // El callback real se establece en handleAuthClick
            });
            gisInited = true;
            console.log("Google Identity Services (GIS) loaded and initialized (for Drive).");
            maybeEnableDriveButtons();
        } catch (e) {
            console.error("Error inicializando Google Identity Services (GIS for Drive):", e);
        }
    },
    gapiLoaded: function() {
        console.log("SCRIPT.JS MODULE: googleApiCallbacks.gapiLoaded called");
        if (typeof gapi === 'undefined' || !gapi.load) {
            console.error("Objeto 'gapi' no encontrado. Google API Client no cargó correctamente (para Drive).");
            // Reintentar si el script de Google cargó pero el objeto 'gapi' no está listo inmediatamente
            if (window.isGoogleGapiScriptReady && !gapiInited) {
                console.log("Retrying GAPI init in 100ms as gapi object might not be fully ready.");
                setTimeout(window.googleApiCallbacks.gapiLoaded, 100);
            }
            return;
        }
        if (gapiInited) {
            console.log("SCRIPT.JS MODULE: GAPI already initialized.");
            return;
        }
        try {
            gapi.load('client:picker', () => {
                gapiInited = true;
                console.log("Google API Client (gapi) and Picker loaded (for Drive).");
                maybeEnableDriveButtons();
            });
        } catch (e) {
            console.error("Error cargando gapi client:picker (for Drive):", e);
        }
    }
};
// --- Fin Namespace ---


function maybeEnableDriveButtons() {
    if (gapiInited && gisInited) {
        if (exportDriveButton) exportDriveButton.disabled = false; // Asegurarse que exportDriveButton está definido
        if (importDriveButton) importDriveButton.disabled = false; // Asegurarse que importDriveButton está definido
        console.log("Google Drive buttons enabled.");
    } else {
        console.log("Google APIs (for Drive) not fully loaded yet. gapiInited:", gapiInited, "gisInited:", gisInited);
        if (exportDriveButton) exportDriveButton.disabled = true;
        if (importDriveButton) importDriveButton.disabled = true;
    }
}

function handleAuthClick(callbackFn, ...args) {
    if (!gisInited || !tokenClient) {
        alert("Los servicios de autenticación de Google (para Drive) no están listos. Intenta recargar la página.");
        console.error("tokenClient o GIS no están inicializados en handleAuthClick (for Drive).");
        return;
    }
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            console.error("Error de autenticación de Google (for Drive):", resp);
            if (resp.error !== 'popup_closed_by_user' && resp.error !== 'access_denied') {
                alert("Error de autenticación con Google (para Drive): " + (resp.error_description || resp.error || "Desconocido"));
            }
            return;
        }
        console.log("Autenticación con Google (para Drive) exitosa o token refrescado.");

        if (gapi && gapi.client) {
            gapi.client.setToken(resp);
        } else {
            console.error("gapi.client no está disponible para setToken (for Drive).");
            alert("Error: El cliente API de Google (para Drive) no está listo.");
            return;
        }

        if (callbackFn) {
            try {
                await callbackFn(...args);
            } catch (callbackError) {
                console.error("Error en la función callback después de la autenticación (for Drive):", callbackError);
                alert("Ocurrió un error al procesar tu solicitud después de la autenticación (para Drive).");
            }
        }
    };

    if (gapi && gapi.client && gapi.client.getToken && gapi.client.getToken() !== null) {
        tokenClient.requestAccessToken({prompt: ''});
    } else {
        tokenClient.requestAccessToken({prompt: 'consent'});
    }
}

async function ensureDriveClientLoaded() {
    if (gapi && gapi.client && gapi.client.drive) {
        return Promise.resolve();
    }
    console.log("Cliente de Google Drive API no cargado, cargando ahora...");
    return new Promise((resolve, reject) => {
        if (!gapi || !gapi.client || !gapi.client.load) {
            return reject(new Error("gapi.client.load no está disponible (for Drive)."));
        }
        try {
            gapi.client.load('drive', 'v3', () => {
                console.log("Google Drive API client cargado exitosamente.");
                resolve();
            });
        } catch (e) {
            reject(e);
        }
    });
}

async function exportToGoogleDrive() {
    if (!gisInited || !gapiInited || !gapi.client.getToken || !gapi.client.getToken()) {
         alert("Por favor, conéctate con Google Drive primero.");
         handleAuthClick(exportToGoogleDrive);
         return;
    }
    try {
        await ensureDriveClientLoaded();
        const dataToExport = {
            theme: localStorage.getItem(THEME_STORAGE_KEY) || 'dark',
            dailyMedalData: JSON.parse(localStorage.getItem(MEDALS_STORAGE_KEY) || '{}'),
            quickNotesContent: localStorage.getItem(QUICK_NOTES_STORAGE_KEY) || '',
            tasks: todos
        };
        const jsonString = JSON.stringify(dataToExport, null, 2);
        const dateStr = new Date().toISOString().slice(0,10).replace(/-/g,'');
        const fileName = `todaylist_backup_${dateStr}.json`;

        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        const metadata = {
            'name': fileName,
            'mimeType': 'application/json; charset=UTF-8',
        };

        const multipartRequestBody =
            delimiter +
            'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
            jsonString +
            close_delim;

        const request = gapi.client.request({
            'path': '/upload/drive/v3/files',
            'method': 'POST',
            'params': {'uploadType': 'multipart'},
            'headers': {
                'Content-Type': 'multipart/related; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody
        });

        const response = await request;

        if (response && response.result && response.result.id) {
            alert('¡Datos exportados a Google Drive con éxito como ' + fileName + '!');
        } else {
            alert('Error al exportar a Drive: Respuesta inesperada. Revisa la consola.');
        }

    } catch (error) {
        console.error('Error exportando a Google Drive:', error);
        alert('Error al exportar datos a Google Drive: ' + (error.message || (error.result && error.result.error && error.result.error.message) || "Error desconocido."));
    }
}

function loadPicker(callbackFn) {
    if (typeof google !== 'undefined' && google.picker) {
         if (callbackFn) callbackFn();
    } else {
        console.error("Google Picker API no está cargada (for Drive).");
        alert("Error: La API de selección de archivos de Google (para Drive) no está lista.");
    }
}

function importFromGoogleDrive() {
    if (!gisInited || !gapiInited || !gapi.client.getToken || !gapi.client.getToken()) {
        alert("Por favor, conéctate con Google Drive primero.");
        handleAuthClick(importFromGoogleDrive);
        return;
    }
    loadPicker(() => {
        try {
            const oauthToken = gapi.client.getToken().access_token;
            if (!oauthToken) {
                alert("No se pudo obtener el token de acceso (para Drive).");
                handleAuthClick(importFromGoogleDrive);
                return;
            }
            const view = new google.picker.View(google.picker.ViewId.DOCS);
            view.setMimeTypes("application/json");
            const picker = new google.picker.PickerBuilder()
                .setAppId(null)
                .setOAuthToken(oauthToken)
                .addView(view)
                .setDeveloperKey(API_KEY)
                .setCallback(pickerCallback)
                .build();
            picker.setVisible(true);
        } catch (e) {
            console.error("Error al construir/mostrar Google Picker (for Drive):", e);
            alert("Error al abrir el selector de archivos de Google Drive: " + e.message);
        }
    });
}

async function pickerCallback(data) {
    if (data.action === google.picker.Action.PICKED && data.docs && data.docs.length > 0) {
        const fileId = data.docs[0].id;
        const fileName = data.docs[0].name;
        try {
            await ensureDriveClientLoaded();
            const response = await gapi.client.drive.files.get({
                fileId: fileId,
                alt: 'media'
            });
            if (typeof response.body !== 'string') {
                alert("Error: El formato del archivo descargado de Drive es incorrecto.");
                return;
            }
            const importedData = JSON.parse(response.body);
            if (!confirm(`¡Atención! Importar "${fileName}" desde Google Drive reemplazará todos los datos actuales. ¿Deseas continuar?`)) {
                return;
            }
            applyImportedData(importedData, `Google Drive (${fileName})`);
        } catch (error) {
            console.error('Error importando desde Google Drive:', error);
            alert('Error al importar datos desde Google Drive: ' + (error.message || (error.result && error.result.error && error.result.error.message) || "Error desconocido."));
        }
    }
     else if (data.action === google.picker.Action.CANCEL) {
        console.log("Selección de archivo de Google Drive cancelada por el usuario.");
    } else if (data.action === google.picker.Action.ERROR ) {
         console.error("Error en Google Picker:", data);
         alert("Ocurrió un error con el selector de archivos de Google Drive.");
    } else if (!data.docs || data.docs.length === 0 && data.action !== google.picker.Action.CANCEL) {
        console.log("Ningún archivo seleccionado en Google Picker o acción desconocida.");
    }
}

function getTodayDateString(format = 'dd-mm-yyyy') {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    if (format === 'yyyy-mm-dd') {
        return `${yyyy}-${mm}-${dd}`;
    }
    return `${dd}-${mm}-${yyyy}`;
}

// --- Función para mostrar el modal de recordatorio (NUEVA) ---
function showReminderModal(taskId) {
    const task = findTaskById(taskId);
    if (!task || task.completed) {
        // No mostrar si la tarea no existe o ya está completada
        return;
    }

    currentTaskIdForReminder = taskId;
    reminderTaskTextElement.textContent = `Tarea: "${task.text}"`;

    // Establecer la fecha por defecto (hoy)
    const today = getTodayDateString('yyyy-mm-dd'); // Usar YYYY-MM-DD para el input type="date"
    reminderDateInput.value = today;

    // Establecer la hora por defecto (ej: 09:00)
    reminderTimeInput.value = "09:00";

    reminderModal.classList.add('visible');
}

// --- Función para ocultar el modal de recordatorio (NUEVA) ---
function hideReminderModal() {
    reminderModal.classList.remove('visible');
    currentTaskIdForReminder = null; // Limpiar el ID de la tarea
    reminderTaskTextElement.textContent = ''; // Limpiar texto de la tarea
    // Opcional: Limpiar inputs si quieres que siempre empiecen vacíos o con defaults
    // reminderDateInput.value = '';
    // reminderTimeInput.value = '09:00';
}

// --- Función para manejar la acción de agendar desde el modal (NUEVA) ---
function handleScheduleReminderClick() {
    if (!currentTaskIdForReminder) return;

    const dateStrInput = reminderDateInput.value; // Formato YYYY-MM-DD
    const timeStr = reminderTimeInput.value;     // Formato HH:MM

    if (!dateStrInput || !timeStr) {
        alert("Por favor, selecciona una fecha y hora.");
        return;
    }

    // Validar formato básico (aunque input type="date"/"time" ya ayuda)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStrInput)) {
        alert("Formato de fecha inválido. Usa el selector de calendario.");
        return;
    }
    if (!/^\d{2}:\d{2}$/.test(timeStr)) {
        alert("Formato de hora inválido. Usa el selector de hora.");
        return;
    }

    const task = findTaskById(currentTaskIdForReminder);
    if (!task) {
        alert("Error: Tarea no encontrada.");
        hideReminderModal();
        return;
    }

    const summary = task.text;

    // Convertir YYYY-MM-DD a DD-MM-YYYY para mostrar en el título del botón si lo deseas
    const dateParts = dateStrInput.split('-');
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const day = parseInt(dateParts[2], 10);

    const [hours, minutes] = timeStr.split(':').map(Number);

    // Validar rangos (aunque input type="date"/"time" ayuda, es buena práctica)
     if (month < 1 || month > 12 || day < 1 || day > 31 || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
         alert("Fecha u hora inválida. Verifica los valores.");
         return;
     }

    const startDate = new Date(year, month - 1, day, hours, minutes);
    // Validación adicional para fechas no existentes (ej. 31 de Febrero)
    if (isNaN(startDate.getTime()) || startDate.getDate() !== day || startDate.getMonth() !== month - 1 || startDate.getFullYear() !== year) {
        alert("La fecha ingresada no es válida (ej. 31 de Febrero).");
        return;
    }

    const endDate = new Date(startDate.getTime() + 60 * 60000); // Evento de 1 hora, puedes ajustar

    const formatDateForGoogle = (dateObj) => {
        // Asegurarse de que la fecha sea válida antes de formatear
        if (isNaN(dateObj.getTime())) {
             console.error("Fecha inválida proporcionada a formatDateForGoogle");
             return ''; // O manejar el error apropiadamente
        }
        // Google Calendar espera formato UTC
        return dateObj.getUTCFullYear() +
               ('0' + (dateObj.getUTCMonth() + 1)).slice(-2) +
               ('0' + dateObj.getUTCDate()).slice(-2) +
               'T' +
               ('0' + dateObj.getUTCHours()).slice(-2) +
               ('0' + dateObj.getUTCMinutes()).slice(-2) +
               ('0' + dateObj.getUTCSeconds()).slice(-2) +
               'Z';
    };

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Recordatorio ToDayList: ' + summary)}&dates=${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}&details=${encodeURIComponent('Recordatorio para la tarea: "' + summary + '" de tu ToDayList.')}&sprop=name:ToDayList&sprop=website:${encodeURIComponent(window.location.href)}`;

    window.open(googleCalendarUrl, '_blank');

    // Opcional: Marcar el botón de calendario en la tarea como "usado"
    const listItemElement = todoListContainer.querySelector(`li[data-task-id="${task.id}"]`);
    if (listItemElement) {
        const calButton = listItemElement.querySelector('.google-calendar-button i');
        if (calButton) {
            calButton.style.color = 'var(--accent-color)'; // Cambiar color
            // Actualizar el título para reflejar la última fecha/hora intentada
            calButton.parentElement.title = `Se intentó agendar un recordatorio. Última fecha/hora: ${dateParts[2]}-${dateParts[1]}-${dateParts[0]} ${timeStr}. Confirma en Google Calendar.`;
        }
    }

    hideReminderModal(); // Ocultar el modal después de abrir el enlace
}


function generateLocalId() {
    return '_' + Math.random().toString(36).substring(2, 15);
}

function findTaskById(taskId) {
    return todos.find(todo => todo.id === taskId);
}

function findTaskIndexById(taskId) {
    return todos.findIndex(todo => todo.id === taskId);
}

function displayMedalCount(count) {
    if (medalCountDisplay) {
        medalCountDisplay.textContent = count;
    }
}

function loadTodosFromLocalStorage() {
    const storedTodos = localStorage.getItem(TODOS_STORAGE_KEY);
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
        todos = todos.map(task => ({
            id: task.id || generateLocalId(),
            text: task.text || 'Tarea sin nombre',
            completed: typeof task.completed === 'boolean' ? task.completed : false,
            completedDate: task.completedDate || null,
            subtasks: Array.isArray(task.subtasks) ? task.subtasks.map(sub => ({
                id: sub.id || generateLocalId(), text: sub.text || 'Sub-tarea sin nombre',
                completed: typeof sub.completed === 'boolean' ? sub.completed : false
            })) : [],
            showSubtaskUI: typeof task.showSubtaskUI === 'boolean' ? task.showSubtaskUI : false,
            priorityColor: PRIORITY_COLORS.includes(task.priorityColor) ? task.priorityColor : 'none',
            date: (typeof task.date === 'string' && task.date.match(/^\d{4}-\d{2}-\d{2}$/))
                    ? task.date.split('-').reverse().join('-') // Convertir YYYY-MM-DD a DD-MM-YYYY
                    : ((typeof task.date === 'string' && task.date.match(/^\d{2}-\d{2}-\d{4}$/)) ? task.date : null),
            linkUrl: typeof task.linkUrl === 'string' ? task.linkUrl : null,
            order: typeof task.order === 'number' ? task.order : Date.now()
        }));
    } else {
        todos = [];
    }
}

function saveTodosToLocalStorage() {
    localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
}


function loadAndRefreshMedalData() {
    let medalDataString = localStorage.getItem(MEDALS_STORAGE_KEY);
    let medalData;
    try {
        medalData = medalDataString ? JSON.parse(medalDataString) : null;
    } catch (e) {
        console.error("Error parsing medal data from localStorage", e);
        medalData = null;
    }

    const todayForMedal = getTodayDateString('yyyy-mm-dd');

    if (!medalData || medalData.date !== todayForMedal) {
        let countForToday = 0;
        if (todos && todos.length > 0) {
            todos.forEach(task => {
                if (task.completed && task.completedDate === todayForMedal) countForToday++;
            });
        }
        medalData = { date: todayForMedal, count: countForToday };
        localStorage.setItem(MEDALS_STORAGE_KEY, JSON.stringify(medalData));
    }
    return medalData;
}

function updateMedalCount(change) {
    let medalData = loadAndRefreshMedalData();
    medalData.count += change;
    if (medalData.count < 0) medalData.count = 0;
    localStorage.setItem(MEDALS_STORAGE_KEY, JSON.stringify(medalData));
    displayMedalCount(medalData.count);
}

function syncAndRender() {
    renderTodosUI();
}

function calculateSubtaskProgress(subtasks) {
    if (!subtasks || subtasks.length === 0) return 0;
    const completed = subtasks.filter(sub => sub.completed).length;
    return (completed / subtasks.length) * 100;
}

function createMainTaskHeader(mainTask) {
    const mainTaskHeader = document.createElement('div');
    mainTaskHeader.classList.add('main-task-header');

    const taskPrefixGroup = document.createElement('div');
    taskPrefixGroup.classList.add('task-prefix-group');

    const mainCheckbox = document.createElement('input');
    mainCheckbox.type = 'checkbox';
    mainCheckbox.classList.add('custom-checkbox');
    mainCheckbox.checked = mainTask.completed;
    mainCheckbox.addEventListener('change', (event) => {
        toggleMainCompletion(mainTask.id, event.target.checked);
    });

    const priorityLabel = document.createElement('div');
    priorityLabel.classList.add('priority-color-label');
    priorityLabel.dataset.color = mainTask.priorityColor;
    priorityLabel.title = `Prioridad: ${mainTask.priorityColor.charAt(0).toUpperCase() + mainTask.priorityColor.slice(1)}`;
    priorityLabel.addEventListener('click', () => {
         if (!mainTask.completed) cyclePriorityColor(mainTask.id);
    });

    taskPrefixGroup.append(mainCheckbox, priorityLabel);

    const taskBody = document.createElement('div');
    taskBody.classList.add('task-body');

    const mainTaskSpan = document.createElement('span');
    mainTaskSpan.textContent = mainTask.text;
    mainTaskSpan.title = mainTask.text;

    const taskActionsGroup = document.createElement('div');
    taskActionsGroup.classList.add('task-actions-group');

    const linkButton = document.createElement('button');
    linkButton.classList.add('app-button', 'link-button');
    linkButton.innerHTML = '<i class="fas fa-link"></i>';
    linkButton.setAttribute('aria-label', 'Gestionar enlace');
    if (mainTask.linkUrl) {
        linkButton.classList.add('link-on');
        linkButton.title = `Abrir enlace: ${mainTask.linkUrl}`;
    } else {
        linkButton.classList.add('link-off');
        linkButton.title = 'Añadir enlace';
    }
    linkButton.addEventListener('click', () => {
        const task = findTaskById(mainTask.id);
        if (!task) return;
        if (task.completed && !task.linkUrl) return;
        if (task.linkUrl) {
            window.open(task.linkUrl, '_blank');
        } else if (!task.completed) {
            const newUrl = prompt("Introduce la URL (ej: https://ejemplo.com):", task.linkUrl || "");
            if (newUrl === null) return;
            let finalUrl = newUrl.trim();
            if (finalUrl !== "" && !finalUrl.toLowerCase().startsWith('http://') && !finalUrl.toLowerCase().startsWith('https://')) {
                finalUrl = 'https://' + finalUrl;
            }
            task.linkUrl = finalUrl || null;
            saveTodosToLocalStorage();
            syncAndRender();
        }
    });

    const googleCalendarButton = document.createElement('button');
    googleCalendarButton.classList.add('app-button', 'google-calendar-button');
    googleCalendarButton.innerHTML = '<i class="far fa-calendar-plus"></i>';
    googleCalendarButton.setAttribute('aria-label', 'Agendar recordatorio en Google Calendar');
    googleCalendarButton.title = 'Agendar recordatorio en Google Calendar';
    if (mainTask.completed) {
        googleCalendarButton.disabled = true;
         // Opcional: Resetear color si la tarea se completa
         googleCalendarButton.querySelector('i').style.color = '';
         googleCalendarButton.title = 'Tarea completada, no se pueden agendar recordatorios.';
    } else {
         googleCalendarButton.disabled = false;
         // Mantener el color si ya se intentó agendar antes (basado en el título guardado)
         // Esto requiere guardar la fecha/hora en la tarea misma, lo cual no hacemos actualmente.
         // Para esta implementación simple, el color se resetea al recargar o al completar la tarea.
         googleCalendarButton.querySelector('i').style.color = ''; // Asegurar color por defecto si no está completada
    }

    // Modificar el event listener para mostrar el modal en lugar de llamar scheduleGoogleCalendarReminder directamente
    googleCalendarButton.addEventListener('click', () => {
        if (!mainTask.completed) {
            showReminderModal(mainTask.id); // Llama a la nueva función para mostrar el modal
        }
    });

    const deleteMainButton = document.createElement('button');
    deleteMainButton.classList.add('app-button', 'delete-button');
    deleteMainButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteMainButton.setAttribute('aria-label', 'Eliminar tarea');
    deleteMainButton.addEventListener('click', () => {
        const task = findTaskById(mainTask.id);
        if (!task) return;
         if ((task.subtasks && task.subtasks.length > 0) || task.completed) {
             if (!confirm(`¿Seguro que quieres eliminar "${task.text}"?`)) return;
         }
        deleteTodo(task.id);
    });

    taskActionsGroup.append(linkButton, googleCalendarButton, deleteMainButton);
    taskBody.append(mainTaskSpan, taskActionsGroup);
    mainTaskHeader.append(taskPrefixGroup, taskBody);

    return mainTaskHeader;
}


function createProgressBar(mainTask) {
     const progressContainer = document.createElement('div');
     progressContainer.classList.add('progress-container');
     const progressBar = document.createElement('div');
     progressBar.classList.add('progress-bar');
     let displayedProgress = 0;
     if (mainTask.completed) {
         displayedProgress = 100;
     } else if (mainTask.subtasks && mainTask.subtasks.length > 0) {
         const subtaskProgress = calculateSubtaskProgress(mainTask.subtasks);
         displayedProgress = subtaskProgress === 100 ? 90 : subtaskProgress;
     }
     progressBar.style.width = `${displayedProgress}%`;
     progressContainer.appendChild(progressBar);
     return progressContainer;
}

function createAddSubtasksToggle(mainTaskId) {
     const addSubtasksToggle = document.createElement('button');
     addSubtasksToggle.classList.add('app-button', 'add-button', 'add-subtasks-toggle');
     addSubtasksToggle.innerHTML = '<i class="fas fa-plus"></i>';
     addSubtasksToggle.setAttribute('aria-label', 'Agregar sub-tarea');
     addSubtasksToggle.addEventListener('click', () => {
         const task = findTaskById(mainTaskId);
         if (task) {
             if (task.completed) return;
             task.showSubtaskUI = !task.showSubtaskUI;
             if (task.showSubtaskUI && (!task.subtasks || task.subtasks.length === 0)) {
                 task.subtasks = [];
             }
             saveTodosToLocalStorage();
             syncAndRender();
             if (task.showSubtaskUI) {
                 const listItemElement = todoListContainer.querySelector(`li[data-task-id="${mainTaskId}"]`);
                 if (listItemElement) {
                   setTimeout(() => {
                       const inputElement = listItemElement.querySelector('.subtask-input-container input[type="text"]');
                       if (inputElement) inputElement.focus();
                   }, 0);
                 }
             }
         }
     });
     return addSubtasksToggle;
}

function createSubtasksList(mainTask) {
    const subtasksList = document.createElement('ul');
    subtasksList.classList.add('subtasks-list');
    if (mainTask.subtasks && mainTask.subtasks.length > 0) {
        mainTask.subtasks.forEach((subtask, subIndex) => {
            const subtaskItem = document.createElement('li');
            subtaskItem.dataset.subtaskId = subtask.id;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('custom-checkbox');
            checkbox.checked = subtask.completed;
            if (mainTask.completed) checkbox.disabled = true;
            checkbox.addEventListener('change', () => {
                 if (!mainTask.completed) toggleSubtaskCompletion(mainTask.id, subtask.id);
            });
            const subtaskSpan = document.createElement('span');
            subtaskSpan.textContent = subtask.text;
            subtaskSpan.title = subtask.text;
            const moveUpButton = document.createElement('button');
            moveUpButton.classList.add('app-button', 'subtask-move-button');
            moveUpButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
            moveUpButton.setAttribute('aria-label', 'Mover sub-tarea arriba');
            if (mainTask.completed || subIndex === 0) moveUpButton.disabled = true;
            moveUpButton.addEventListener('click', () => {
                 if (!mainTask.completed) moveSubtaskUp(mainTask.id, subtask.id);
            });
            const moveDownButton = document.createElement('button');
            moveDownButton.classList.add('app-button', 'subtask-move-button');
            moveDownButton.innerHTML = '<i class="fas fa-arrow-down"></i>';
            moveDownButton.setAttribute('aria-label', 'Mover sub-tarea abajo');
            if (mainTask.completed || subIndex === mainTask.subtasks.length - 1) moveDownButton.disabled = true;
            moveDownButton.addEventListener('click', () => {
                 if (!mainTask.completed) moveSubtaskDown(mainTask.id, subtask.id);
            });
            const deleteSubtaskButton = document.createElement('button');
            deleteSubtaskButton.classList.add('app-button', 'delete-button');
            deleteSubtaskButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteSubtaskButton.setAttribute('aria-label', 'Eliminar sub-tarea');
             if (mainTask.completed) deleteSubtaskButton.disabled = true;
            deleteSubtaskButton.addEventListener('click', () => {
                 if (!mainTask.completed) deleteSubtask(mainTask.id, subtask.id);
            });
            subtaskItem.append(checkbox, subtaskSpan, moveUpButton, moveDownButton, deleteSubtaskButton);
            subtasksList.appendChild(subtaskItem);
        });
    }
    return subtasksList;
}

function createSubtaskInputContainer(mainTaskId) {
     const subtaskInputContainer = document.createElement('div');
     subtaskInputContainer.classList.add('subtask-input-container');
     const subtaskInput = document.createElement('input');
     subtaskInput.type = 'text';
     subtaskInput.placeholder = 'Agregar nueva sub-tarea...';
     const addSubtaskButton = document.createElement('button');
     addSubtaskButton.classList.add('app-button', 'add-button');
     addSubtaskButton.innerHTML = '<i class="fas fa-plus"></i>';
     const handleAddSubtask = () => addSubtask(mainTaskId, subtaskInput);
     addSubtaskButton.addEventListener('click', handleAddSubtask);
     subtaskInput.addEventListener('keypress', (e) => { if (e.key==='Enter'){ e.preventDefault(); handleAddSubtask();}});
     subtaskInputContainer.append(subtaskInput, addSubtaskButton);
     return subtaskInputContainer;
}

function renderTodosUI() {
    if (!todoListContainer) return;
    todoListContainer.innerHTML = '';
    todos.forEach((mainTask) => {
        const listItem = document.createElement('li');
        listItem.classList.add('todo-item');
        listItem.dataset.taskId = mainTask.id;
        listItem.dataset.priorityColor = mainTask.priorityColor || 'none';
        if (mainTask.completed) listItem.classList.add('completed');
        if (mainTask.showSubtaskUI) listItem.classList.add('show-subtask-ui');

        listItem.appendChild(createMainTaskHeader(mainTask));
        listItem.appendChild(createProgressBar(mainTask));
        if (!mainTask.completed) {
            listItem.appendChild(createAddSubtasksToggle(mainTask.id));
        } else { mainTask.showSubtaskUI = false; }

        if (mainTask.subtasks && mainTask.subtasks.length > 0) {
            listItem.appendChild(createSubtasksList(mainTask));
        }
        if (mainTask.showSubtaskUI && !mainTask.completed) {
             listItem.appendChild(createSubtaskInputContainer(mainTask.id));
        }
        todoListContainer.appendChild(listItem);
    });
    if (todoInput) todoInput.value = '';
}

function cyclePriorityColor(taskId) {
     const task = findTaskById(taskId);
     if (task && !task.completed) {
         const currentIndex = PRIORITY_COLORS.indexOf(task.priorityColor || 'none');
         task.priorityColor = PRIORITY_COLORS[(currentIndex + 1) % PRIORITY_COLORS.length];
         saveTodosToLocalStorage();
         const listItemElement = todoListContainer.querySelector(`li[data-task-id="${task.id}"]`);
         if (listItemElement) {
             listItemElement.dataset.priorityColor = task.priorityColor;
             const priorityLabelElement = listItemElement.querySelector('.priority-color-label');
             if (priorityLabelElement) {
                 priorityLabelElement.dataset.color = task.priorityColor;
                 priorityLabelElement.title = `Prioridad: ${task.priorityColor.charAt(0).toUpperCase() + task.priorityColor.slice(1)}`;
             }
         }
     }
}

function showAppInterface() {
    if (welcomeSection) welcomeSection.classList.add('hidden');
    // Ya no ocultamos installInstructionsSection aquí específicamente
    // if (installInstructionsSection) installInstructionsSection.classList.add('hidden');
    if (appMainInterface) appMainInterface.classList.remove('hidden');
    if (todoInput) todoInput.focus();
}

function addTodo() {
    const newTodoText = todoInput.value.trim();
    if (newTodoText === '') return alert('Ingresa el nombre de la tarea.');
    const maxOrder = todos.length > 0 ? Math.max(...todos.map(t => t.order || 0)) : -1;
    const newTodo = {
        id: generateLocalId(),
        text: newTodoText,
        completed: false,
        completedDate: null,
        subtasks: [],
        showSubtaskUI: false,
        priorityColor: 'none',
        date: null,
        linkUrl: null,
        order: maxOrder + 1
    };
    todos.push(newTodo);
    saveTodosToLocalStorage();
    syncAndRender();
    if (todoInput) todoInput.value = '';

    // Si es la primera tarea añadida y la sección de bienvenida está visible, la ocultamos
    if (todos.length === 1 && welcomeSection && !welcomeSection.classList.contains('hidden')) {
        showAppInterface();
    }
}

function addSubtask(mainTaskId, subtaskInput) {
     const newSubtaskText = subtaskInput.value.trim();
     if (newSubtaskText === '') return alert('Ingresa el nombre de la sub-tarea.');
     const mainTask = findTaskById(mainTaskId);
     if (mainTask && !mainTask.completed) {
         if (!mainTask.subtasks) mainTask.subtasks = [];
         mainTask.subtasks.push({ id: generateLocalId(), text: newSubtaskText, completed: false });
         mainTask.completed = false;
         mainTask.completedDate = null;
         mainTask.showSubtaskUI = false;
         saveTodosToLocalStorage();
         syncAndRender();
     }
}

function deleteTodo(taskId) {
    const taskIndex = findTaskIndexById(taskId);
    if (taskIndex > -1) {
        const taskToDelete = todos[taskIndex];
        if (taskToDelete.completed && taskToDelete.completedDate === getTodayDateString('yyyy-mm-dd')) {
            updateMedalCount(-1);
        }
        todos.splice(taskIndex, 1);
        saveTodosToLocalStorage();
        syncAndRender();
        // Si no quedan tareas, mostramos la sección de bienvenida
        if (todos.length === 0 && welcomeSection && appMainInterface) {
            welcomeSection.classList.remove('hidden');
            // Ya no mostramos installInstructionsSection aquí
            // if (installInstructionsSection) installInstructionsSection.classList.remove('hidden');
            appMainInterface.classList.add('hidden');
        }
    }
}

function deleteSubtask(mainTaskId, subtaskId) {
     const mainTask = findTaskById(mainTaskId);
     if (mainTask && mainTask.subtasks && !mainTask.completed) {
         const subtaskIndex = mainTask.subtasks.findIndex(sub => sub.id === subtaskId);
         if (subtaskIndex > -1) {
             mainTask.subtasks.splice(subtaskIndex, 1);
             mainTask.completed = false;
             mainTask.completedDate = null;
             saveTodosToLocalStorage();
             syncAndRender();
         }
     }
}

function toggleSubtaskCompletion(mainTaskId, subtaskId) {
     const mainTask = findTaskById(mainTaskId);
     if (mainTask && mainTask.subtasks && !mainTask.completed) {
        const subtask = mainTask.subtasks.find(sub => sub.id === subtaskId);
        if (subtask) {
             subtask.completed = !subtask.completed;
             saveTodosToLocalStorage();
             syncAndRender();
         }
     }
}

function toggleMainCompletion(taskId, isChecked) {
    const task = findTaskById(taskId);
    if (task) {
        const todayForMedal = getTodayDateString('yyyy-mm-dd');
        const wasCompletedTodayBefore = task.completed && task.completedDate === todayForMedal;

        task.completed = isChecked;

        if (isChecked) {
            task.completedDate = todayForMedal;
            task.priorityColor = 'none';
            task.showSubtaskUI = false;
            if (!wasCompletedTodayBefore) {
                updateMedalCount(1);
            }
            if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 90, origin: { y: 0.55 }});
        } else {
            if (wasCompletedTodayBefore) {
                updateMedalCount(-1);
            }
            task.completedDate = null;
        }
        if (task.subtasks) {
            task.subtasks.forEach(sub => sub.completed = isChecked);
        }
        saveTodosToLocalStorage();
        syncAndRender();
    }
}

function moveSubtask(mainTaskId, subtaskId, direction) {
    const mainTask = findTaskById(mainTaskId);
    if (mainTask && mainTask.subtasks && !mainTask.completed) {
        const subtaskIndex = mainTask.subtasks.findIndex(sub => sub.id === subtaskId);
        if (subtaskIndex === -1) return;

        const newIndex = subtaskIndex + direction;
        if (newIndex >= 0 && newIndex < mainTask.subtasks.length) {
            [mainTask.subtasks[subtaskIndex], mainTask.subtasks[newIndex]] =
            [mainTask.subtasks[newIndex], mainTask.subtasks[subtaskIndex]];
            saveTodosToLocalStorage();
            syncAndRender();
        }
    }
}
function moveSubtaskUp(mainTaskId, subtaskId) { moveSubtask(mainTaskId, subtaskId, -1); }
function moveSubtaskDown(mainTaskId, subtaskId) { moveSubtask(mainTaskId, subtaskId, 1); }

function performManualSort() {
     todos.sort((a, b) => {
         const rankA = PRIORITY_ORDER[a.priorityColor] || PRIORITY_ORDER['none'];
         const rankB = PRIORITY_ORDER[b.priorityColor] || PRIORITY_ORDER['none'];
         if (rankA !== rankB) return rankA - rankB;

         const parseDateDDMMYYYY = (dateStr) => {
            if (!dateStr || !/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return Infinity;
            const [day, month, year] = dateStr.split('-').map(Number);
            return new Date(year, month - 1, day).getTime();
         };

         const dateA = a.date ? parseDateDDMMYYYY(a.date) : Infinity;
         const dateB = b.date ? parseDateDDMMYYYY(b.date) : Infinity;
         if (dateA !== dateB) return dateA - dateB;

         return (a.order || 0) - (b.order || 0);
     });
     todos.forEach((task, index) => {
         task.order = index;
     });
     saveTodosToLocalStorage();
     syncAndRender();
}

function enableDarkMode() {
    body.classList.add('dark-mode');
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    if (darkModeToggle) {
        darkModeToggle.querySelector('i').className = 'fas fa-sun';
        darkModeToggle.setAttribute('aria-label', 'Alternar a modo claro');
        darkModeToggle.title = 'Alternar a modo claro';
    }
}

function disableDarkMode() {
    body.classList.remove('dark-mode');
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    if (darkModeToggle) {
         darkModeToggle.querySelector('i').className = 'fas fa-moon';
         darkModeToggle.setAttribute('aria-label', 'Alternar a modo oscuro');
         darkModeToggle.title = 'Alternar a modo oscuro';
    }
}

function toggleDarkMode() {
    body.classList.contains('dark-mode') ? disableDarkMode() : enableDarkMode();
    syncAndRender();
}

function exportAllDataLocal() {
    const dataToExport = {
        theme: localStorage.getItem(THEME_STORAGE_KEY) || 'dark',
        dailyMedalData: JSON.parse(localStorage.getItem(MEDALS_STORAGE_KEY) || '{}'),
        quickNotesContent: localStorage.getItem(QUICK_NOTES_STORAGE_KEY) || '',
        tasks: todos
    };

    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().slice(0,10).replace(/-/g,'');
    a.download = `todolist-backup-local-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Datos exportados localmente como ' + a.download);
}

function applyImportedData(importedData, source = "local file") {
    try {
        if (typeof importedData !== 'object' || importedData === null || !Array.isArray(importedData.tasks)) {
            throw new Error('El formato del archivo es inválido o no contiene tareas.');
        }

        const themeToApply = importedData.theme === 'light' ? 'light' : 'dark';
        localStorage.setItem(THEME_STORAGE_KEY, themeToApply);
        if (themeToApply === 'dark') {
            enableDarkMode();
        } else {
            disableDarkMode();
        }

        if (importedData.dailyMedalData && typeof importedData.dailyMedalData === 'object') {
            localStorage.setItem(MEDALS_STORAGE_KEY, JSON.stringify(importedData.dailyMedalData));
            displayMedalCount(importedData.dailyMedalData.count || 0);
        } else {
            localStorage.removeItem(MEDALS_STORAGE_KEY);
            displayMedalCount(0);
        }

        if (typeof importedData.quickNotesContent === 'string') {
            quickNotesArea.value = importedData.quickNotesContent;
            localStorage.setItem(QUICK_NOTES_STORAGE_KEY, quickNotesArea.value);
        } else {
            quickNotesArea.value = '';
            localStorage.removeItem(QUICK_NOTES_STORAGE_KEY);
        }

        todos = importedData.tasks.map(task => ({
            id: task.id || generateLocalId(),
            text: task.text || 'Tarea importada',
            completed: !!task.completed,
            completedDate: task.completedDate || null,
            subtasks: Array.isArray(task.subtasks) ? task.subtasks.map(sub => ({
                id: sub.id || generateLocalId(),
                text: sub.text || 'Sub-tarea importada',
                completed: !!sub.completed
            })) : [],
            showSubtaskUI: !!task.showSubtaskUI,
            priorityColor: PRIORITY_COLORS.includes(task.priorityColor) ? task.priorityColor : 'none',
            date: (typeof task.date === 'string' && task.date.match(/^\d{4}-\d{2}-\d{2}$/))
                    ? task.date.split('-').reverse().join('-')
                    : ((typeof task.date === 'string' && task.date.match(/^\d{2}-\d{2}-\d{4}$/)) ? task.date : null),
            linkUrl: typeof task.linkUrl === 'string' ? task.linkUrl : null,
            order: typeof task.order === 'number' ? task.order : Date.now()
        }));

        saveTodosToLocalStorage();

        if (todos.length === 0) {
            if (welcomeSection) welcomeSection.classList.remove('hidden');
            // Ya no mostramos installInstructionsSection aquí
            // if (installInstructionsSection) installInstructionsSection.classList.remove('hidden');
            if (appMainInterface) appMainInterface.classList.add('hidden');
        } else {
            showAppInterface();
        }
        syncAndRender();

        alert(`Datos importados exitosamente desde ${source}.`);

    } catch (error) {
        console.error(`Error al procesar datos importados desde ${source}:`, error);
        alert(`Error al procesar datos importados: ${error.message}`);
    }
}


function importAllDataLocal(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!confirm("¡Atención! Importar datos reemplazará todos los datos actuales (tareas, notas, medallas, tema). ¿Deseas continuar?")) {
        if (importFileInput) importFileInput.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);
            applyImportedData(importedData, "archivo local");
        } catch (error) {
             console.error('Error al parsear JSON del archivo local:', error);
             alert(`Error al leer el archivo local: ${error.message}. Asegúrate de que sea un archivo JSON válido de ToDayList.`);
        } finally {
            if (importFileInput) importFileInput.value = '';
        }
    };
    reader.onerror = () => {
        alert('Error al leer el archivo local.');
        if (importFileInput) importFileInput.value = '';
    };
    reader.readAsText(file);
}


document.addEventListener('DOMContentLoaded', () => {
    todoInput = document.getElementById('new-todo-input');
    addTodoButton = document.getElementById('add-todo-button');
    todoListContainer = document.getElementById('todo-list');
    reorderButton = document.getElementById('reorder-button');
    darkModeToggle = document.getElementById('dark-mode-toggle');
    body = document.body;
    medalCountDisplay = document.getElementById('medal-count');

    infoButton = document.getElementById('info-button');
    infoModal = document.getElementById('info-modal');
    closeModalButton = document.getElementById('close-modal-button');

    quickNotesArea = document.getElementById('quick-notes-area');
    clearNotesButton = document.getElementById('clear-notes-button');

    exportDataButton = document.getElementById('export-data-button');
    importDataButton = document.getElementById('import-data-button');
    importFileInput = document.getElementById('import-file-input');

    exportDriveButton = document.getElementById('export-drive-button');
    importDriveButton = document.getElementById('import-drive-button');

    welcomeSection = document.getElementById('welcome-section');
    startAppButton = document.getElementById('start-app-button');
    appMainInterface = document.getElementById('app-main-interface');
    installInstructionsSection = document.getElementById('install-instructions-section'); // Todavía obtenemos la referencia, pero no la usamos para mostrar/ocultar basada en tareas

    // Obtener referencias a los elementos del modal de recordatorio (NUEVO)
    reminderModal = document.getElementById('reminder-modal');
    closeReminderModalButton = document.getElementById('close-reminder-modal');
    reminderTaskTextElement = document.getElementById('reminder-task-text');
    reminderDateInput = document.getElementById('reminder-date');
    reminderTimeInput = document.getElementById('reminder-time');
    scheduleReminderButton = document.getElementById('schedule-reminder-button');


    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === 'light') {
        disableDarkMode();
    } else {
        enableDarkMode();
    }

    loadTodosFromLocalStorage();
    saveTodosToLocalStorage(); // Guardar por si hubo conversión de formato de fecha en loadTodos

    // Lógica de visibilidad inicial ajustada para no depender de installInstructionsSection
    if (todos.length === 0) {
        if (welcomeSection) welcomeSection.classList.remove('hidden');
        // Ya no mostramos installInstructionsSection aquí
        // if (installInstructionsSection) installInstructionsSection.classList.remove('hidden');
        if (appMainInterface) appMainInterface.classList.add('hidden');
    } else {
        if (welcomeSection) welcomeSection.classList.add('hidden');
        // Ya no ocultamos installInstructionsSection aquí
        // if (installInstructionsSection) installInstructionsSection.classList.add('hidden');
        if (appMainInterface) appMainInterface.classList.remove('hidden');
        renderTodosUI();
    }

    const initialMedalData = loadAndRefreshMedalData();
    displayMedalCount(initialMedalData.count);

    addTodoButton.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => { if (e.key==='Enter'){ e.preventDefault(); addTodo();}});
    reorderButton.addEventListener('click', performManualSort);
    darkModeToggle.addEventListener('click', toggleDarkMode);

    if (startAppButton) {
        startAppButton.addEventListener('click', showAppInterface);
    }

    if (infoButton && infoModal && closeModalButton) {
        infoButton.addEventListener('click', () => infoModal.classList.add('visible'));
        closeModalButton.addEventListener('click', () => infoModal.classList.remove('visible'));
        infoModal.addEventListener('click', (event) => {
            if (event.target === infoModal) infoModal.classList.remove('visible');
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && infoModal.classList.contains('visible')) {
                infoModal.classList.remove('visible');
            }
        });
    }

    // Añadir event listeners para el modal de recordatorio (NUEVO)
    if (reminderModal && closeReminderModalButton && scheduleReminderButton) {
        closeReminderModalButton.addEventListener('click', hideReminderModal);
        scheduleReminderButton.addEventListener('click', handleScheduleReminderClick);

        // Cerrar modal haciendo clic fuera del contenido
        reminderModal.addEventListener('click', (event) => {
            if (event.target === reminderModal) {
                hideReminderModal();
            }
        });

        // Cerrar modal con tecla Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && reminderModal.classList.contains('visible')) {
                hideReminderModal();
            }
        });
    }


    if (quickNotesArea && clearNotesButton) {
        const savedNotes = localStorage.getItem(QUICK_NOTES_STORAGE_KEY);
        if (savedNotes) quickNotesArea.value = savedNotes;
        quickNotesArea.addEventListener('input', () => {
            localStorage.setItem(QUICK_NOTES_STORAGE_KEY, quickNotesArea.value);
        });
        clearNotesButton.addEventListener('click', () => {
            quickNotesArea.value = '';
            localStorage.removeItem(QUICK_NOTES_STORAGE_KEY);
            quickNotesArea.focus();
        });
    }

    if (exportDataButton) {
        exportDataButton.addEventListener('click', exportAllDataLocal);
    }
    if (importDataButton && importFileInput) {
        importDataButton.addEventListener('click', () => importFileInput.click());
        importFileInput.addEventListener('change', importAllDataLocal);
    }

    if (exportDriveButton) {
        exportDriveButton.addEventListener('click', exportToGoogleDrive);
    }
    if (importDriveButton) {
        importDriveButton.addEventListener('click', importFromGoogleDrive);
    }

    // Llamar a las funciones de inicialización de Google si los scripts ya cargaron
    // (esto es por si el script del módulo carga después de los scripts de Google)
    if (window.isGoogleGisScriptReady) {
        console.log("DOMContentLoaded: GIS script was ready, ensuring initialization.");
        window.googleApiCallbacks.gisLoaded();
    }
    if (window.isGoogleGapiScriptReady) {
        console.log("DOMContentLoaded: GAPI script was ready, ensuring initialization.");
        window.googleApiCallbacks.gapiLoaded();
    }
    // Si las APIs aún no están listas, maybeEnableDriveButtons() las deshabilitará
    // y los callbacks de Google (onGisLoaded/onGapiLoaded -> googleApiCallbacks...)
    // llamarán a maybeEnableDriveButtons() cuando terminen.
    maybeEnableDriveButtons();
});
