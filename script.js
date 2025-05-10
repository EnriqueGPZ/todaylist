/* En style.css */

.todo-item .main-task-header {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}

.todo-item .task-body { /* Contenedor del texto de la tarea y los botones de acción */
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 0; /* MUY IMPORTANTE para el text-overflow ellipsis */
    margin-left: 10px; /* Espacio después del checkbox/prioridad */
}

.todo-item .task-body span { /* El texto de la tarea */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 8px; /* Espacio entre el texto y el primer botón de acción */
    flex-shrink: 1; /* Permite que el texto se encoja si es necesario */
}

.task-actions-group { /* El grupo que contiene los botones de acción */
    display: flex;
    align-items: center;
    flex-shrink: 0; /* Evita que el grupo de botones se encoja */
}

.task-actions-group .app-button {
    padding: 6px 8px; /* Reduce el padding para hacerlos un poco más compactos */
    margin-left: 2px;  /* Reduce significativamente el margen entre botones */
    font-size: 0.9em; /* Opcional: reduce tamaño de iconos/fuente */
    line-height: 1;
}

.task-actions-group .app-button:first-child {
    margin-left: 0; /* El primer botón del grupo no necesita margen izquierdo */
}

.task-date-input-real { /* El input de fecha real que está asociado al label del calendario */
    display: none !important; /* Asegura que no ocupe espacio visible */
}
