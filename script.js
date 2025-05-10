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
let exportDriveButton;
let importDriveButton;
// -------------------------------------------------------------------------------------
// IMPORTANTE: REEMPLAZA ESTOS VALORES CON TUS CREDENCIALES DE GOOGLE CLOUD CONSOLE
// -------------------------------------------------------------------------------------
const CLIENT_ID = '25607067695-mgv7jfvio4vr1goi5ci6o952mgpii8nf.apps.googleusercontent.com'; // <<<< VERIFICA/REEMPLAZA CON TU CLIENT_ID REAL
const API_KEY = 'AIzaSyAhr2kqUcRf5qZi0yMHsFDsyp_x8Ekfj7k';         // <<<< ESTA ES TU API_KEY (YA INSERTADA)
// -------------------------------------------------------------------------------------
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
let tokenClient;
let gapiInited = false;
let gisInited = false;
// Fin Google Drive Integration Variables

let welcomeSection;
let startAppButton;
let appMainInterface;
let installInstructionsSection;

let todos = [];

const TODOS_STORAGE_KEY = 'todoListAppTasks';
const MEDALS_STORAGE_KEY = 'todoListDailyMedalData';
const THEME_STORAGE_KEY = 'todoListTheme';

const PRIORITY_COLORS = ['none', 'red', 'orange', 'yellow', 'green'];
const PRIORITY_ORDER = { 'red': 1, 'orange': 2, 'yellow': 3, 'green': 4, 'none': 5 };

// --- Funciones de Google API ---
window.gisLoaded = () => {
    if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
        console.error("Objeto 'google.accounts.oauth2' no encontrado. GIS no cargó correctamente.");
        alert("Error al cargar los servicios de identidad de Google. Intenta recargar la página.");
        return;
    }
    try {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: '',
        });
        gisInited = true;
        console.log("Google Identity Services (GIS) loaded.");
        maybeEnableDriveButtons();
    } catch (e) {
        console.error("Error inicializando Google Identity Services (GIS):", e);
        alert("Error crítico al inicializar la autenticación de Google. Revisa la consola.");
    }
};

window.gapiLoaded = () => {
    if (typeof gapi === 'undefined' || !gapi.load) {
        console.error("Objeto 'gapi' no encontrado. Google API Client no cargó correctamente.");
        alert("Error al cargar el cliente de API de Google. Intenta recargar la página.");
        return;
    }
    try {
        gapi.load('client:picker', () => {
            gapiInited = true;
            console.log("Google API Client (gapi) and Picker loaded.");
            maybeEnableDriveButtons();
        });
    } catch (e) {
        console.error("Error cargando gapi client:picker:", e);
        alert("Error crítico al cargar el selector de archivos de Google. Revisa la consola.");
    }
};

function maybeEnableDriveButtons() {
    if (gapiInited && gisInited) {
        if (exportDriveButton) exportDriveButton.disabled = false;
        if (importDriveButton) importDriveButton.disabled = false;
        console.log("Google Drive buttons enabled.");
    } else {
        console.log("Google APIs not fully loaded yet. gapiInited:", gapiInited, "gisInited:", gisInited);
        if (exportDriveButton) exportDriveButton.disabled = true;
        if (importDriveButton) importDriveButton.disabled = true;
    }
}

function handleAuthClick(callbackFn) {
    if (!tokenClient) {
        alert("El cliente de autenticación de Google no está listo. Intenta recargar la página.");
        console.error("tokenClient no está inicializado en handleAuthClick.");
        return;
    }
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            console.error("Error de autenticación de Google:", resp);
            if (resp.error !== 'popup_closed_by_user' && resp.error !== 'access_denied') {
                alert("Error de autenticación con Google: " + (resp.error_description || resp.error || "Desconocido"));
            }
            return;
        }
        console.log("Autenticación con Google exitosa o token refrescado.");

        if (gapi && gapi.client) {
            gapi.client.setToken(resp);
        } else {
            console.error("gapi.client no está disponible para setToken.");
            alert("Error: El cliente API de Google no está listo.");
            return;
        }

        if (callbackFn) {
            try {
                await callbackFn();
            } catch (callbackError) {
                console.error("Error en la función callback después de la autenticación:", callbackError);
                alert("Ocurrió un error al procesar tu solicitud después de la autenticación.");
            }
        }
    };

    if (gapi && gapi.client && gapi.client.getToken && gapi.client.getToken() !== null) {
        console.log("Token existente encontrado, solicitando acceso (puede ser silencioso).");
        tokenClient.requestAccessToken({prompt: ''});
    } else {
        console.log("No hay token o gapi.client no está listo, solicitando con consentimiento.");
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
            console.error("gapi.client.load no está disponible para cargar 'drive'.");
            return reject(new Error("gapi.client.load no está disponible."));
        }
        try {
            gapi.client.load('drive', 'v3', () => {
                console.log("Google Drive API client cargado exitosamente.");
                resolve();
            });
        } catch (e) {
            console.error("Error síncrono al llamar a gapi.client.load('drive', 'v3'):", e);
            reject(e);
        }
    });
}

async function exportToGoogleDrive() {
    if (!gapi || !gapi.client || !gapi.client.getToken || !gapi.client.getToken()) {
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

        console.log("Iniciando subida a Google Drive...");
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
            console.log('Archivo exportado a Google Drive:', response.result);
            alert('¡Datos exportados a Google Drive con éxito como ' + fileName + '!');
        } else {
            console.error('Respuesta inesperada al exportar a Google Drive:', response);
            alert('Error al exportar: Respuesta inesperada del servidor. Revisa la consola.');
        }

    } catch (error) {
        console.error('Error exportando a Google Drive:', error);
        let errorMessage = "Error desconocido. Revisa la consola.";
        if (error.result && error.result.error && error.result.error.message) {
            errorMessage = error.result.error.message;
        } else if (error.message) {
            errorMessage = error.message;
        }
        alert('Error al exportar datos a Google Drive: ' + errorMessage);
    }
}

function loadPicker(callbackFn) {
    if (typeof google !== 'undefined' && google.picker) {
         if (callbackFn) callbackFn();
    } else {
        console.error("Google Picker API no está cargada. Intentando cargarla de nuevo...");
        alert("Error: La API de selección de archivos de Google no está lista. Intenta recargar.");
    }
}

function importFromGoogleDrive() {
    if (!gapi || !gapi.client || !gapi.client.getToken || !gapi.client.getToken()) {
        alert("Por favor, conéctate con Google Drive primero.");
        handleAuthClick(importFromGoogleDrive);
        return;
    }

    loadPicker(() => {
        try {
            const oauthToken = gapi.client.getToken().access_token;
            if (!oauthToken) {
                alert("No se pudo obtener el token de acceso. Intenta conectarte de nuevo.");
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
            console.log("Google Picker abierto.");
        } catch (e) {
            console.error("Error al construir o mostrar el Google Picker:", e);
            alert("Error al abrir el selector de archivos de Google Drive: " + e.message);
        }
    });
}

async function pickerCallback(data) {
    console.log("Picker callback data:", data);
    if (data.action === google.picker.Action.PICKED && data.docs && data.docs.length > 0) {
        const fileId = data.docs[0].id;
        const fileName = data.docs[0].name;
        console.log(`Archivo seleccionado de Drive: "${fileName}", ID: ${fileId}`);

        try {
            await ensureDriveClientLoaded();

            console.log("Descargando archivo de Google Drive...");
            const response = await gapi.client.drive.files.get({
                fileId: fileId,
                alt: 'media'
            });

            if (typeof response.body !== 'string') {
                console.error("El contenido del archivo descargado no es un string:", response.body);
                alert("Error: El formato del archivo descargado es incorrecto.");
                return;
            }

            const importedData = JSON.parse(response.body);
            console.log("Datos parseados desde Google Drive:", importedData);

            if (!confirm(`¡Atención! Importar "${fileName}" desde Google Drive reemplazará todos los datos actuales. ¿Deseas continuar?`)) {
                return;
            }
            applyImportedData(importedData, `Google Drive (${fileName})`);

        } catch (error) {
            console.error('Error importando desde Google Drive:', error);
            let errorMessage = "Error desconocido. Revisa la consola.";
             if (error.result && error.result.error && error.result.error.message) {
                errorMessage = error.result.error.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            alert('Error al importar datos desde Google Drive: ' + errorMessage);
        }
    } else if (data.action === google.picker.Action.CANCEL) {
        console.log("Selección de archivo de Google Drive cancelada por el usuario.");
    } else if (data.action === google.picker.Action.ERROR ) {
         console.error("Error en Google Picker:", data);
         alert("Ocurrió un error con el selector de archivos de Google Drive.");
    } else if (data.error) {
        console.error("Error explícito de Google Picker:", data.error);
        alert("Ocurrió un error con el selector de archivos de Google Drive: " + data.error);
    } else if (!data.docs || data.docs.length === 0 && data.action !== google.picker.Action.CANCEL) {
        console.log("Ningún archivo seleccionado en Google Picker o acción desconocida.");
    }
}
// --- Fin Funciones de Google API ---

function generateLocalId() {
    return '_' + Math.random().toString(36).substring(2, 15);
}

function findTaskById(taskId) {
    return todos.find(todo => todo.id === taskId);
}

function findTaskIndexById(taskId) {
    return todos.findIndex(todo => todo.id === taskId);
}

function getTodayDateString() {
    return new Date().toISOString().split('T')[0];
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
            date: typeof task.date === 'string' && task.date.match(/^\d{4}-\d{2}-\d{2}$/) ? task.date : null,
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

    const today = getTodayDateString();

    if (!medalData || medalData.date !== today) {
        let countForToday = 0;
        if (todos && todos.length > 0) {
            todos.forEach(task => {
                if (task.completed && task.completedDate === today) countForToday++;
            });
        }
        medalData = { date: today, count: countForToday };
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

function updateDateHighlight(listItemElement, task) {
    const calendarLabel = listItemElement.querySelector('.calendar-button'); // Este es el label para el input de fecha de la tarea
    const calendarIcon = calendarLabel ? calendarLabel.querySelector('i') : null;

    if (!calendarLabel || !calendarIcon) return;

    const todayString = getTodayDateString();
    const isToday = task.date === todayString;
    const hasDate = !!task.date;

    calendarLabel.classList.remove('date-set', 'date-today');
    calendarIcon.style.color = '';
    calendarIcon.style.fontWeight = 'normal';
    // El title se actualiza en base a si la tarea está completada o tiene fecha
    // calendarLabel.title = 'Establecer fecha'; // No resetear aquí, se maneja abajo

    if (task.completed) {
        if (hasDate) calendarLabel.title = `Fecha: ${task.date} (Completada)`;
        else calendarLabel.title = 'Fecha no establecida (Completada)';
        return; // No más actualizaciones si está completada
    }

    // Si no está completada:
    if (hasDate) {
        calendarLabel.classList.add('date-set');
        calendarLabel.title = `Fecha: ${task.date}`;
    } else {
         calendarLabel.title = 'Añadir fecha';
    }

    if (isToday) {
        calendarLabel.classList.add('date-today');
        const computedStyle = getComputedStyle(listItemElement);
        const priorityColorForToday = computedStyle.borderLeftColor;
        calendarIcon.style.color = priorityColorForToday;
        calendarLabel.title = `Fecha: ${task.date} (Hoy)`;
    }
}

function calculateSubtaskProgress(subtasks) {
    if (!subtasks || subtasks.length === 0) return 0;
    const completed = subtasks.filter(sub => sub.completed).length;
    return (completed / subtasks.length) * 100;
}

function createMainTaskHeader(mainTask) {
    const mainTaskHeader = document.createElement('div');
    mainTaskHeader.classList.add('main-task-header');

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

    const calendarLabel = document.createElement('label'); // Este es el label para el input de fecha de la tarea
    calendarLabel.classList.add('app-button', 'calendar-button');
    calendarLabel.innerHTML = '<i class="fas fa-calendar-alt"></i>';
    calendarLabel.setAttribute('aria-label', 'Establecer fecha para la tarea'); // Modificado para ser más específico
    // El title para este calendarLabel se gestiona en updateDateHighlight

    const actualDateInput = document.createElement('input');
    actualDateInput.type = 'date';
    actualDateInput.classList.add('task-date-input-real');
    const dateInputId = `date-input-${mainTask.id || generateLocalId()}`;
    actualDateInput.id = dateInputId;
    calendarLabel.htmlFor = dateInputId;
    actualDateInput.value = mainTask.date || '';

    actualDateInput.addEventListener('change', (event) => {
        const task = findTaskById(mainTask.id);
        if (!task) return;
        updateTaskDate(task.id, event.target.value);
    });

    // --- NUEVO BOTÓN PARA GOOGLE CALENDAR ---
    const addToGoogleCalendarButton = document.createElement('button');
    addToGoogleCalendarButton.classList.add('app-button', 'google-calendar-button');
    addToGoogleCalendarButton.innerHTML = '<i class="fab fa-google"></i><i class="fas fa-calendar-plus" style="margin-left: 3px;"></i>';
    addToGoogleCalendarButton.setAttribute('aria-label', 'Agendar en Google Calendar');
    addToGoogleCalendarButton.title = 'Agendar en Google Calendar';

    if (mainTask.completed) { // Deshabilitar si la tarea está completada
        addToGoogleCalendarButton.disabled = true;
    }

    addToGoogleCalendarButton.addEventListener('click', () => {
        const task = findTaskById(mainTask.id);
        if (!task || task.completed) return;

        let taskDate = task.date;
        if (!taskDate) {
            if (confirm("Esta tarea no tiene una fecha asignada. ¿Deseas agendarla para hoy en Google Calendar?")) {
                taskDate = getTodayDateString();
            } else {
                return; // El usuario canceló
            }
        }

        // Formato para Google Calendar: YYYYMMDD (para eventos de todo el día)
        const googleDate = taskDate.replace(/-/g, '');
        const startDate = googleDate;
        // Para un evento de todo el día, la fecha de fin es el día siguiente.
        let nextDay = new Date(taskDate); // Asegurarse de que la hora es 00:00:00 en la zona local
        nextDay.setDate(nextDay.getDate() + 1);
        const endDate = nextDay.toISOString().split('T')[0].replace(/-/g, '');


        let calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE`;
        calendarUrl += `&text=${encodeURIComponent(task.text)}`;
        calendarUrl += `&dates=${startDate}/${endDate}`; // Ej: 20240315/20240316 para un evento de todo el día el 20240315

        let details = `Tarea de ToDayList: ${task.text}`;
        if (task.linkUrl) {
            details += `\nEnlace: ${task.linkUrl}`;
        }
        if (task.subtasks && task.subtasks.length > 0) {
            details += `\n\nSubtareas:`;
            task.subtasks.forEach(sub => {
                details += `\n- ${sub.text} ${sub.completed ? '(Completada)' : ''}`;
            });
        }
        calendarUrl += `&details=${encodeURIComponent(details)}`;
        // Puedes añadir más parámetros como &location=... &crm=... etc.

        window.open(calendarUrl, '_blank');
    });
    // --- FIN NUEVO BOTÓN ---

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

    // Orden de los botones: Enlace, Fecha Tarea, Input Fecha Tarea (oculto), Agendar Google Cal, Eliminar
    taskActionsGroup.append(linkButton, calendarLabel, actualDateInput, addToGoogleCalendarButton, deleteMainButton);
    taskBody.append(mainTaskSpan, taskActionsGroup);
    mainTaskHeader.append(mainCheckbox, priorityLabel, taskBody);
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
        updateDateHighlight(listItem, mainTask); // Asegúrate que esto se llama después de añadir al DOM si depende de estilos computados.
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
             updateDateHighlight(listItemElement, task);
         }
     }
}

function updateTaskDate(taskId, newDateValue) {
    const task = findTaskById(taskId);
    if (task && !task.completed) {
        task.date = newDateValue || null;
        saveTodosToLocalStorage();
        syncAndRender(); // Esto re-renderizará y llamará a updateDateHighlight
    } else if (task && task.completed) {
        // Si está completada y se cambia la fecha, simplemente re-renderizar para actualizar el title del input de fecha
        task.date = newDateValue || null; // Permitir cambiar la fecha incluso si está completada (para registro)
        saveTodosToLocalStorage();
        syncAndRender();
    }
}

function showAppInterface() {
    if (welcomeSection) welcomeSection.classList.add('hidden');
    if (installInstructionsSection) installInstructionsSection.classList.add('hidden');
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
         mainTask.completed = false; // Si se añade sub-tarea, la principal no puede estar completada
         mainTask.completedDate = null;
         mainTask.showSubtaskUI = false; // Ocultar input después de añadir
         saveTodosToLocalStorage();
         syncAndRender();
         if (subtaskInput) subtaskInput.value = '';
     }
}

function deleteTodo(taskId) {
    const taskIndex = findTaskIndexById(taskId);
    if (taskIndex > -1) {
        const taskToDelete = todos[taskIndex];
        if (taskToDelete.completed && taskToDelete.completedDate === getTodayDateString()) {
            updateMedalCount(-1);
        }
        todos.splice(taskIndex, 1);
        saveTodosToLocalStorage();
        syncAndRender();
        if (todos.length === 0 && welcomeSection && appMainInterface && installInstructionsSection) {
            welcomeSection.classList.remove('hidden');
            installInstructionsSection.classList.remove('hidden');
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
             // mainTask.completed = false; // No necesariamente, depende de otras sub-tareas
             // mainTask.completedDate = null;
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
        const wasCompletedTodayBefore = task.completed && task.completedDate === getTodayDateString();

        task.completed = isChecked;
        const today = getTodayDateString();

        if (isChecked) {
            task.completedDate = today;
            task.priorityColor = 'none'; // Reset priority on completion
            task.showSubtaskUI = false;
            if (!wasCompletedTodayBefore) {
                updateMedalCount(1);
            }
            if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 90, origin: { y: 0.55 }});
        } else { // Unchecking
            if (wasCompletedTodayBefore) {
                updateMedalCount(-1);
            }
            task.completedDate = null;
            // No cambiar priorityColor al desmarcar, el usuario podría querer mantenerla
        }
        // Sincronizar estado de subtareas con la tarea principal si se completa/descompleta la principal
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

         const dateA = a.date ? new Date(a.date).getTime() : Infinity;
         const dateB = b.date ? new Date(b.date).getTime() : Infinity;
         if (dateA !== dateB) return dateA - dateB;

         return (a.order || 0) - (b.order || 0); // Mantener orden original como último criterio
     });
     // Actualizar el 'order' property después de ordenar, para futuras clasificaciones que lo usen como fallback
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
    // syncAndRender(); // No es estrictamente necesario si los estilos CSS se aplican bien, pero puede ser útil si JS afecta estilos dinámicamente basados en el tema
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
            localStorage.setItem(QUICK_NOTES_STORAGE_KEY, importedData.quickNotesContent);
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
            date: (typeof task.date === 'string' && task.date.match(/^\d{4}-\d{2}-\d{2}$/)) ? task.date : null,
            linkUrl: typeof task.linkUrl === 'string' ? task.linkUrl : null,
            order: typeof task.order === 'number' ? task.order : Date.now()
        }));

        saveTodosToLocalStorage();

        if (todos.length === 0) {
            if (welcomeSection) welcomeSection.classList.remove('hidden');
            if (installInstructionsSection) installInstructionsSection.classList.remove('hidden');
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
    installInstructionsSection = document.getElementById('install-instructions-section');

    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === 'light') {
        disableDarkMode();
    } else {
        enableDarkMode(); // Default a dark
    }

    loadTodosFromLocalStorage();

    if (todos.length === 0) {
        if (welcomeSection) welcomeSection.classList.remove('hidden');
        if (installInstructionsSection) installInstructionsSection.classList.remove('hidden');
        if (appMainInterface) appMainInterface.classList.add('hidden');
    } else {
        if (welcomeSection) welcomeSection.classList.add('hidden');
        if (installInstructionsSection) installInstructionsSection.classList.add('hidden');
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

    maybeEnableDriveButtons();
});
