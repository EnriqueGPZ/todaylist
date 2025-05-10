// Import necessary Firebase functions (already exposed globally in index.html)
// import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
// import { getFirestore, collection, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from "firebase/firestore";

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
// const QUICK_NOTES_STORAGE_KEY = 'todoListQuickNotes'; // No longer used

// let exportDataButton; // No longer used for direct export/import
// let importDataButton; // No longer used for direct export/import
// let importFileInput; // No longer used

let welcomeSection;
// let startAppButton; // No longer needed, auth state handles visibility
let appMainInterface;
let installInstructionsSection;

let authBox;
let btnGoogle;
let authStatus;
let logoutButton;

let currentUser = null; // To store the authenticated user

let todos = []; // Array to hold tasks fetched from Firestore

// const TODOS_STORAGE_KEY = 'todoListAppTasks'; // No longer used
// const MEDALS_STORAGE_KEY = 'todoListDailyMedalData'; // No longer used
const THEME_STORAGE_KEY = 'todoListTheme'; // Still used for local theme preference

const PRIORITY_COLORS = ['none', 'red', 'orange', 'yellow', 'green'];
const PRIORITY_ORDER = { 'red': 1, 'orange': 2, 'yellow': 3, 'green': 4, 'none': 5 };

// --- Firebase Functions ---

// Function to get the user's Firestore document reference
function getUserDocRef(userId) {
    return window.doc(window.db, 'users', userId);
}

// Function to get the user's tasks collection reference
function getTasksCollectionRef(userId) {
    return window.collection(window.db, 'users', userId, 'tasks');
}

// Function to get the user's quick notes document reference
function getQuickNotesDocRef(userId) {
    return window.doc(window.db, 'users', userId, 'quickNotes', 'notes');
}

// Function to get the user's medal data document reference
function getMedalDataDocRef(userId) {
    return window.doc(window.db, 'users', userId, 'medalData', 'daily');
}

// Function to get the user's theme preference document reference
function getThemeDocRef(userId) {
    return window.doc(window.db, 'users', userId, 'theme', 'preference');
}


// Load theme preference from local storage (before Firebase loads)
function loadThemePreference() {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === 'dark') {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
}

// Save theme preference to Firebase
async function saveThemePreference(theme) {
    if (!currentUser) return;
    try {
        await window.setDoc(getThemeDocRef(currentUser.uid), { theme: theme }, { merge: true });
        localStorage.setItem(THEME_STORAGE_KEY, theme); // Keep local storage in sync
    } catch (e) {
        console.error("Error saving theme preference to Firebase:", e);
    }
}

// Load theme preference from Firebase (overwrites local storage)
async function loadThemePreferenceFromFirebase() {
    if (!currentUser) return;
    try {
        const docSnap = await window.getDoc(getThemeDocRef(currentUser.uid));
        if (docSnap.exists()) {
            const theme = docSnap.data().theme;
            if (theme === 'dark') {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        } else {
             // If no theme saved in Firebase, save the current local one
             const currentLocalTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
             await saveThemePreference(currentLocalTheme);
        }
    } catch (e) {
        console.error("Error loading theme preference from Firebase:", e);
        // Fallback to local storage if Firebase load fails
        loadThemePreference();
    }
}


// Load quick notes from Firebase
async function loadQuickNotesFromFirebase() {
    if (!currentUser || !quickNotesArea) return;
    try {
        const docSnap = await window.getDoc(getQuickNotesDocRef(currentUser.uid));
        if (docSnap.exists()) {
            quickNotesArea.value = docSnap.data().content || '';
        } else {
            quickNotesArea.value = ''; // Clear if no notes in Firebase
        }
    } catch (e) {
        console.error("Error loading quick notes from Firebase:", e);
        quickNotesArea.value = 'Error al cargar notas.'; // Indicate error
    }
}

// Save quick notes to Firebase
async function saveQuickNotesToFirebase() {
    if (!currentUser || !quickNotesArea) return;
    try {
        await window.setDoc(getQuickNotesDocRef(currentUser.uid), { content: quickNotesArea.value });
    } catch (e) {
        console.error("Error saving quick notes to Firebase:", e);
    }
}

// Load medal data from Firebase
async function loadMedalDataFromFirebase() {
    if (!currentUser) return;
    try {
        const docSnap = await window.getDoc(getMedalDataDocRef(currentUser.uid));
        const today = getTodayDateString();
        let medalData = { date: today, count: 0 };

        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.date === today) {
                medalData.count = data.count || 0;
            } else {
                // Reset count for a new day
                medalData.count = 0;
                // Optionally, save the reset count immediately
                await window.setDoc(getMedalDataDocRef(currentUser.uid), medalData);
            }
        } else {
             // If no medal data exists, create the initial document
             await window.setDoc(getMedalDataDocRef(currentUser.uid), medalData);
        }
        displayMedalCount(medalData.count);

    } catch (e) {
        console.error("Error loading medal data from Firebase:", e);
        displayMedalCount(0); // Show 0 on error
    }
}

// Update medal count in Firebase
async function updateMedalCountInFirebase(change) {
    if (!currentUser) return;
    try {
        const medalDataRef = getMedalDataDocRef(currentUser.uid);
        const docSnap = await window.getDoc(medalDataRef);
        const today = getTodayDateString();
        let currentCount = 0;
        let medalData = { date: today, count: 0 };

        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.date === today) {
                currentCount = data.count || 0;
            }
            // If date is different, it will be reset below
        }

        medalData.count = currentCount + change;
        if (medalData.count < 0) medalData.count = 0;

        await window.setDoc(medalDataRef, medalData);
        displayMedalCount(medalData.count);

    } catch (e) {
        console.error("Error updating medal count in Firebase:", e);
        // Attempt to reload medal count on error
        loadMedalDataFromFirebase();
    }
}


// Add a new task to Firebase
async function addTaskToFirebase(task) {
    if (!currentUser) return;
    try {
        const docRef = await window.addDoc(getTasksCollectionRef(currentUser.uid), task);
        console.log("Task added with ID: ", docRef.id);
        // The onSnapshot listener will handle updating the UI
    } catch (e) {
        console.error("Error adding task: ", e);
        alert("Error al agregar la tarea.");
    }
}

// Update an existing task in Firebase
async function updateTaskInFirebase(taskId, updates) {
    if (!currentUser) return;
    try {
        const taskRef = window.doc(getTasksCollectionRef(currentUser.uid), taskId);
        await window.updateDoc(taskRef, updates);
        console.log("Task updated:", taskId);
        // The onSnapshot listener will handle updating the UI
    } catch (e) {
        console.error("Error updating task:", e);
        alert("Error al actualizar la tarea.");
    }
}

// Delete a task from Firebase
async function deleteTaskFromFirebase(taskId) {
    if (!currentUser) return;
    try {
        const taskRef = window.doc(getTasksCollectionRef(currentUser.uid), taskId);
        await window.deleteDoc(taskRef);
        console.log("Task deleted:", taskId);
        // The onSnapshot listener will handle updating the UI
    } catch (e) {
        console.error("Error deleting task:", e);
        alert("Error al eliminar la tarea.");
    }
}

// Set up real-time listener for tasks
let unsubscribeTasks = null;
function setupTasksListener(userId) {
    if (unsubscribeTasks) {
        unsubscribeTasks(); // Detach previous listener
    }
    const tasksCollection = getTasksCollectionRef(userId);
    const q = window.query(tasksCollection, window.orderBy('order', 'asc')); // Order by the 'order' field

    unsubscribeTasks = window.onSnapshot(q, (snapshot) => {
        todos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        // Ensure subtasks have IDs if they don't (for older data or migration)
        todos.forEach(task => {
            if (task.subtasks && Array.isArray(task.subtasks)) {
                task.subtasks = task.subtasks.map(sub => ({
                    id: sub.id || generateLocalId(), // Add ID if missing
                    text: sub.text || 'Sub-tarea sin nombre',
                    completed: typeof sub.completed === 'boolean' ? sub.completed : false
                }));
            } else {
                task.subtasks = []; // Ensure subtasks is always an array
            }
             // Ensure other fields have default values if missing
            task.completed = typeof task.completed === 'boolean' ? task.completed : false;
            task.completedDate = task.completedDate || null;
            task.showSubtaskUI = typeof task.showSubtaskUI === 'boolean' ? task.showSubtaskUI : false;
            task.priorityColor = PRIORITY_COLORS.includes(task.priorityColor) ? task.priorityColor : 'none';
            task.date = (typeof task.date === 'string' && task.date.match(/^\d{4}-\d{2}-\d{2}$/)) ? task.date : null;
            task.linkUrl = typeof task.linkUrl === 'string' ? task.linkUrl : null;
            task.order = typeof task.order === 'number' ? task.order : Date.now(); // Assign order if missing
        });

        renderTodosUI(); // Re-render the UI with the latest data
        checkInitialState(); // Check if welcome/install sections should be shown
    }, (error) => {
        console.error("Error listening to tasks:", error);
        // Handle error, maybe show a message to the user
    });
}

// --- Authentication Functions ---

async function signInWithGoogle() {
    try {
        await window.signInWithPopup(window.auth, window.googleProvider);
        // onAuthStateChanged listener will handle the rest
    } catch (error) {
        console.error("Error signing in with Google:", error);
        authStatus.textContent = `Error al iniciar sesión: ${error.message}`;
    }
}

async function signOutUser() {
    try {
        await window.signOut(window.auth);
        // onAuthStateChanged listener will handle the rest
    } catch (error) {
        console.error("Error signing out:", error);
        authStatus.textContent = `Error al cerrar sesión: ${error.message}`;
    }
}

// --- UI Rendering and Logic (Adapted for Firebase) ---

function getTodayDateString() {
    return new Date().toISOString().split('T')[0];
}

function displayMedalCount(count) {
    if (medalCountDisplay) {
        medalCountDisplay.textContent = count;
    }
}

function findTaskById(taskId) {
    return todos.find(todo => todo.id === taskId);
}

function findTaskIndexById(taskId) {
    return todos.findIndex(todo => todo.id === taskId);
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
        if (task.completed && !task.linkUrl) return; // Don't allow adding link to completed task
        if (task.linkUrl) {
            window.open(task.linkUrl, '_blank');
        } else if (!task.completed) {
            const newUrl = prompt("Introduce la URL (ej: https://ejemplo.com):", task.linkUrl || "");
            if (newUrl === null) return;
            let finalUrl = newUrl.trim();
            if (finalUrl !== "" && !finalUrl.toLowerCase().startsWith('http://') && !finalUrl.toLowerCase().startsWith('https://')) {
                finalUrl = 'https://' + finalUrl;
            }
            updateTaskInFirebase(task.id, { linkUrl: finalUrl || null });
        }
    });

    const calendarLabel = document.createElement('label');
    calendarLabel.classList.add('app-button', 'calendar-button');
    calendarLabel.innerHTML = '<i class="fas fa-calendar-alt"></i>';
    calendarLabel.setAttribute('aria-label', 'Establecer fecha');

    const actualDateInput = document.createElement('input');
    actualDateInput.type = 'date';
    actualDateInput.classList.add('task-date-input-real');
    const dateInputId = `date-input-${mainTask.id}`; // Use Firebase ID
    actualDateInput.id = dateInputId;
    calendarLabel.htmlFor = dateInputId;
    actualDateInput.value = mainTask.date || '';
    if (mainTask.completed) actualDateInput.disabled = true;


    actualDateInput.addEventListener('change', (event) => {
        const task = findTaskById(mainTask.id);
        if (!task || task.completed) return;
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
         displayedProgress = subtaskProgress === 100 ? 90 : subtaskProgress; // Show 90% if subtasks complete but main not
     }
     progressBar.style.width = `${displayedProgress}%`;
     if (mainTask.completed) {
         progressBar.classList.add('completed');
     } else {
         progressBar.classList.remove('completed');
     }
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
         if (task && !task.completed) {
             // Toggle showSubtaskUI state in Firebase
             updateTaskInFirebase(task.id, { showSubtaskUI: !task.showSubtaskUI });
             // UI will update via onSnapshot
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
        } else {
            // If main task is completed, hide the toggle and input container
            mainTask.showSubtaskUI = false; // Ensure state is correct
        }

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
         const newPriorityColor = PRIORITY_COLORS[(currentIndex + 1) % PRIORITY_COLORS.length];
         updateTaskInFirebase(taskId, { priorityColor: newPriorityColor });
         // UI will update via onSnapshot
     }
}

function updateTaskDate(taskId, newDateValue) {
    const task = findTaskById(taskId);
    if (task && !task.completed) {
        updateTaskInFirebase(taskId, { date: newDateValue || null });
        // UI will update via onSnapshot
    }
}

function showAppInterface() {
    if (authBox) authBox.hidden = true;
    if (app) app.hidden = false; // Use the #app div
    if (welcomeSection) welcomeSection.classList.remove('hidden'); // Show welcome/install initially
    if (installInstructionsSection) installInstructionsSection.classList.remove('hidden');
    if (todoInput) todoInput.focus();
}

function hideAppInterface() {
    if (authBox) authBox.hidden = false;
    if (app) app.hidden = true; // Use the #app div
    if (welcomeSection) welcomeSection.classList.add('hidden');
    if (installInstructionsSection) installInstructionsSection.classList.add('hidden');
}

function checkInitialState() {
    // If there are tasks, hide welcome/install sections
    if (todos.length > 0) {
        if (welcomeSection) welcomeSection.classList.add('hidden');
        if (installInstructionsSection) installInstructionsSection.classList.add('hidden');
    } else {
        // If no tasks, show them
        if (welcomeSection) welcomeSection.classList.remove('hidden');
        if (installInstructionsSection) installInstructionsSection.classList.remove('hidden');
    }
}


async function addTodo() {
    if (!currentUser) return;
    const newTodoText = todoInput.value.trim();
    if (newTodoText === '') return alert('Ingresa el nombre de la tarea.');

    // Find the maximum order value to add the new task at the end
    const maxOrder = todos.length > 0 ? Math.max(...todos.map(t => t.order || 0)) : -1;

    const newTodo = {
        text: newTodoText,
        completed: false,
        completedDate: null,
        subtasks: [],
        showSubtaskUI: false,
        priorityColor: 'none',
        date: null,
        linkUrl: null,
        order: maxOrder + 1 // Assign an order value
    };

    await addTaskToFirebase(newTodo);
    if (todoInput) todoInput.value = '';
    // UI update handled by onSnapshot
}

async function addSubtask(mainTaskId, subtaskInput) {
     if (!currentUser) return;
     const newSubtaskText = subtaskInput.value.trim();
     if (newSubtaskText === '') return alert('Ingresa el nombre de la sub-tarea.');
     const mainTask = findTaskById(mainTaskId);
     if (mainTask && !mainTask.completed) {
         const updatedSubtasks = Array.isArray(mainTask.subtasks) ? [...mainTask.subtasks] : [];
         updatedSubtasks.push({ id: generateLocalId(), text: newSubtaskText, completed: false });

         // Update the task in Firebase
         await updateTaskInFirebase(mainTaskId, {
             subtasks: updatedSubtasks,
             completed: false, // Mark main task as not completed if adding subtask
             completedDate: null,
             showSubtaskUI: false // Hide input after adding
         });

         if (subtaskInput) subtaskInput.value = '';
         // UI update handled by onSnapshot
     }
}

async function deleteTodo(taskId) {
    if (!currentUser) return;
    const taskIndex = findTaskIndexById(taskId);
    if (taskIndex > -1) {
        const taskToDelete = todos[taskIndex];
        const today = getTodayDateString();
        if (taskToDelete.completed && taskToDelete.completedDate === today) {
            await updateMedalCountInFirebase(-1);
        }
        await deleteTaskFromFirebase(taskId);
        // UI update handled by onSnapshot
    }
}

async function deleteSubtask(mainTaskId, subtaskId) {
     if (!currentUser) return;
     const mainTask = findTaskById(mainTaskId);
     if (mainTask && mainTask.subtasks && !mainTask.completed) {
         const updatedSubtasks = mainTask.subtasks.filter(sub => sub.id !== subtaskId);
         // Update the task in Firebase
         await updateTaskInFirebase(mainTaskId, {
             subtasks: updatedSubtasks,
             completed: false, // Mark main task as not completed if deleting subtask
             completedDate: null
         });
         // UI update handled by onSnapshot
     }
}

async function toggleSubtaskCompletion(mainTaskId, subtaskId) {
     if (!currentUser) return;
     const mainTask = findTaskById(mainTaskId);
     if (mainTask && mainTask.subtasks && !mainTask.completed) {
        const updatedSubtasks = mainTask.subtasks.map(sub => {
            if (sub.id === subtaskId) {
                return { ...sub, completed: !sub.completed };
            }
            return sub;
        });
        // Update the task in Firebase
        await updateTaskInFirebase(mainTaskId, { subtasks: updatedSubtasks });
        // UI update handled by onSnapshot
     }
}

async function toggleMainCompletion(taskId, isChecked) {
    if (!currentUser) return;
    const task = findTaskById(taskId);
    if (task) {
        const wasCompletedTodayBefore = task.completed && task.completedDate === getTodayDateString();
        const today = getTodayDateString();

        const updates = {
            completed: isChecked,
            completedDate: isChecked ? today : null,
            showSubtaskUI: isChecked ? false : task.showSubtaskUI // Hide subtask UI if completed
        };

        // If completing, mark all subtasks as complete
        if (isChecked && task.subtasks) {
            updates.subtasks = task.subtasks.map(sub => ({ ...sub, completed: true }));
        } else if (!isChecked && task.subtasks) {
             // If uncompleting, mark all subtasks as incomplete
             updates.subtasks = task.subtasks.map(sub => ({ ...sub, completed: false }));
        }


        await updateTaskInFirebase(taskId, updates);

        if (isChecked && !wasCompletedTodayBefore) {
            await updateMedalCountInFirebase(1);
            if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 90, origin: { y: 0.55 }});
        } else if (!isChecked && wasCompletedTodayBefore) {
            await updateMedalCountInFirebase(-1);
        }
        // UI update handled by onSnapshot
    }
}

async function moveSubtask(mainTaskId, subtaskId, direction) {
    if (!currentUser) return;
    const mainTask = findTaskById(mainTaskId);
    if (mainTask && mainTask.subtasks && !mainTask.completed) {
        const subtaskIndex = mainTask.subtasks.findIndex(sub => sub.id === subtaskId);
        if (subtaskIndex === -1) return;

        const newIndex = subtaskIndex + direction;
        if (newIndex >= 0 && newIndex < mainTask.subtasks.length) {
            const updatedSubtasks = [...mainTask.subtasks];
            [updatedSubtasks[subtaskIndex], updatedSubtasks[newIndex]] =
            [updatedSubtasks[newIndex], updatedSubtasks[subtaskIndex]];

            // Update the task in Firebase
            await updateTaskInFirebase(mainTaskId, { subtasks: updatedSubtasks });
            // UI update handled by onSnapshot
        }
    }
}
function moveSubtaskUp(mainTaskId, subtaskId) { moveSubtask(mainTaskId, subtaskId, -1); }
function moveSubtaskDown(mainTaskId, subtaskId) { moveSubtask(mainTaskId, subtaskId, 1); }

async function performManualSort() {
    if (!currentUser) return;

    // Sort the local array first
    todos.sort((a, b) => {
        const rankA = PRIORITY_ORDER[a.priorityColor] || PRIORITY_ORDER['none'];
        const rankB = PRIORITY_ORDER[b.priorityColor] || PRIORITY_ORDER['none'];
        if (rankA !== rankB) return rankA - rankB;

        const dateA = a.date ? new Date(a.date).getTime() : Infinity;
        const dateB = b.date ? new Date(b.date).getTime() : Infinity;
        if (dateA !== dateB) return dateA - dateB;

        return (a.order || 0) - (b.order || 0); // Fallback to original order if dates/priorities are same
    });

    // Update the 'order' field in Firebase for each task
    const batch = window.db.batch();
    todos.forEach((task, index) => {
        const taskRef = window.doc(getTasksCollectionRef(currentUser.uid), task.id);
        batch.update(taskRef, { order: index });
    });

    try {
        await batch.commit();
        console.log("Tasks reordered in Firebase.");
        // UI will update via onSnapshot triggered by the batch commit
    } catch (e) {
        console.error("Error reordering tasks:", e);
        alert("Error al reordenar las tareas.");
        // Re-render with current data if batch fails
        renderTodosUI();
    }
}


function enableDarkMode() {
    body.classList.add('dark-mode');
    if (darkModeToggle) {
        darkModeToggle.querySelector('i').className = 'fas fa-sun';
        darkModeToggle.setAttribute('aria-label', 'Alternar a modo claro');
        darkModeToggle.title = 'Alternar a modo claro';
    }
}

function disableDarkMode() {
    body.classList.remove('dark-mode');
    if (darkModeToggle) {
         darkModeToggle.querySelector('i').className = 'fas fa-moon';
         darkModeToggle.setAttribute('aria-label', 'Alternar a modo oscuro');
         darkModeToggle.title = 'Alternar a modo oscuro';
    }
}

async function toggleDarkMode() {
    const isDarkMode = body.classList.contains('dark-mode');
    const newTheme = isDarkMode ? 'light' : 'dark';
    if (newTheme === 'dark') {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
    if (currentUser) {
        await saveThemePreference(newTheme);
    } else {
         // If not logged in, just save to local storage
         localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    }
}

// --- Initialization and Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
    authBox = document.getElementById('authBox');
    btnGoogle = document.getElementById('btnGoogle');
    authStatus = document.getElementById('authStatus');
    app = document.getElementById('app'); // The main app container div
    logoutButton = document.getElementById('logoutButton');

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

    // exportDataButton = document.getElementById('export-data-button'); // Not used with Firebase
    // importDataButton = document.getElementById('import-data-button'); // Not used with Firebase
    // importFileInput = document.getElementById('import-file-input'); // Not used with Firebase

    welcomeSection = document.getElementById('welcome-section');
    // startAppButton = document.getElementById('start-app-button'); // Not used with auth
    installInstructionsSection = document.getElementById('install-instructions-section');

    // Load theme preference from local storage immediately for quick UI update
    loadThemePreference();


    // --- Event Listeners ---
    if (btnGoogle) btnGoogle.addEventListener('click', signInWithGoogle);
    if (logoutButton) logoutButton.addEventListener('click', signOutUser);

    if (addTodoButton) addTodoButton.addEventListener('click', addTodo);
    if (todoInput) todoInput.addEventListener('keypress', (e) => { if (e.key==='Enter'){ e.preventDefault(); addTodo();}});
    if (reorderButton) reorderButton.addEventListener('click', performManualSort);
    if (darkModeToggle) darkModeToggle.addEventListener('click', toggleDarkMode);

    // if (startAppButton) { // Not used with auth
    //     startAppButton.addEventListener('click', showAppInterface);
    // }

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
        // Quick notes saving is handled by input event and Firebase
        quickNotesArea.addEventListener('input', saveQuickNotesToFirebase);
        clearNotesButton.addEventListener('click', () => {
            quickNotesArea.value = '';
            saveQuickNotesToFirebase(); // Save empty notes to Firebase
            quickNotesArea.focus();
        });
    }

    // No longer need export/import buttons with Firebase sync
    // if (exportDataButton) {
    //     exportDataButton.addEventListener('click', exportAllData);
    // }
    // if (importDataButton && importFileInput) {
    //     importDataButton.addEventListener('click', () => importFileInput.click());
    //     importFileInput.addEventListener('change', importAllData);
    // }


    // --- Firebase Auth State Listener ---
    window.onAuthStateChanged(window.auth, async (user) => {
        currentUser = user;
        if (user) {
            // User is signed in
            authStatus.textContent = `Sesión iniciada como ${user.displayName || user.email}`;
            showAppInterface();
            setupTasksListener(user.uid); // Start listening for tasks
            await loadQuickNotesFromFirebase(); // Load quick notes
            await loadMedalDataFromFirebase(); // Load medal data
            await loadThemePreferenceFromFirebase(); // Load theme preference from Firebase

        } else {
            // User is signed out
            authStatus.textContent = 'Inicia sesión para guardar tus tareas.';
            hideAppInterface();
            if (unsubscribeTasks) {
                unsubscribeTasks(); // Stop listening for tasks
                unsubscribeTasks = null;
            }
            todos = []; // Clear local tasks
            renderTodosUI(); // Clear UI
            displayMedalCount(0); // Reset medal count display
            if (quickNotesArea) quickNotesArea.value = ''; // Clear quick notes UI
            // Theme preference remains based on local storage until login
        }
    });

});
