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
    const calendarLabel = listItemElement.querySelector('.calendar-button');
    const calendarIcon = calendarLabel ? calendarLabel.querySelector('i') : null;

    if (!calendarLabel || !calendarIcon) return;

    const todayString = getTodayDateString();
    const isToday = task.date === todayString;
    const hasDate = !!task.date;

    calendarLabel.classList.remove('date-set', 'date-today');
    calendarIcon.style.color = '';
    calendarIcon.style.fontWeight = 'normal';
    calendarLabel.title = 'Establecer fecha';

    if (task.completed) {
        if (hasDate) calendarLabel.title = `Fecha: ${task.date} (Completada)`;
        else calendarLabel.title = 'Fecha no establecida (Completada)';
        return;
    }

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

    const calendarLabel = document.createElement('label');
    calendarLabel.classList.add('app-button', 'calendar-button');
    calendarLabel.innerHTML = '<i class="fas fa-calendar-alt"></i>';
    calendarLabel.setAttribute('aria-label', 'Establecer fecha');

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

    taskActionsGroup.append(linkButton, calendarLabel, actualDateInput, deleteMainButton);
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
        updateDateHighlight(listItem, mainTask);
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
        syncAndRender();
    } else if (task && task.completed) {
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
         mainTask.completed = false;
         mainTask.completedDate = null;
         mainTask.showSubtaskUI = false;
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
        const wasCompletedTodayBefore = task.completed && task.completedDate === getTodayDateString();

        task.completed = isChecked;
        const today = getTodayDateString();

        if (isChecked) {
            task.completedDate = today;
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

         const dateA = a.date ? new Date(a.date).getTime() : Infinity;
         const dateB = b.date ? new Date(b.date).getTime() : Infinity;
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

function exportAllData() {
    const dataToExport = {
        theme: localStorage.getItem(THEME_STORAGE_KEY) || 'light',
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
    a.download = `todolist-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Datos exportados exitosamente como ' + a.download);
}

function importAllData(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!confirm("¡Atención! Importar datos reemplazará todos los datos actuales (tareas, notas, medallas, tema). ¿Deseas continuar?")) {
        importFileInput.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);

            if (typeof importedData !== 'object' || importedData === null || !Array.isArray(importedData.tasks)) {
                throw new Error('El formato del archivo es inválido o no contiene tareas.');
            }

            const themeToApply = importedData.theme === 'dark' ? 'dark' : 'light';
            localStorage.setItem(THEME_STORAGE_KEY, themeToApply);
            if (themeToApply === 'dark') enableDarkMode(); else disableDarkMode();

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

            alert('Datos importados exitosamente.');

        } catch (error) {
            console.error('Error al importar datos:', error);
            alert(`Error al importar datos: ${error.message}`);
        } finally {
            importFileInput.value = '';
        }
    };
    reader.onerror = () => {
        alert('Error al leer el archivo.');
        importFileInput.value = '';
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

    welcomeSection = document.getElementById('welcome-section');
    startAppButton = document.getElementById('start-app-button');
    appMainInterface = document.getElementById('app-main-interface');
    installInstructionsSection = document.getElementById('install-instructions-section');


    if (localStorage.getItem(THEME_STORAGE_KEY) === 'dark') {
        enableDarkMode();
    } else {
        disableDarkMode();
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
        exportDataButton.addEventListener('click', exportAllData);
    }
    if (importDataButton && importFileInput) {
        importDataButton.addEventListener('click', () => importFileInput.click());
        importFileInput.addEventListener('change', importAllData);
    }
});
