# TaskFlow

App movil de gestion de tareas, desarrollada con [Expo](https://expo.dev) (React Native).

## Estructura del proyecto

```
taskflow-app/
├── App.js                       # Punto de entrada: Provider de Redux + AppNavigator
├── index.js                      # Registro de la app (generado por Expo)
├── app.json                       # Configuracion de Expo
└── src/
    ├── components/                # Piezas reutilizables de UI
    │   ├── ProfileCard.js
    │   ├── TaskForm.js             # Formulario de carga (titulo, descripcion, categoria)
    │   ├── TaskItem.js             # Fila de la lista de tareas
    │   ├── TaskDetail.js           # Contenido del detalle de una tarea
    │   └── EmptyState.js           # Mensaje para cuando no hay tareas cargadas
    ├── screens/                    # Vistas conectadas al navigator
    │   ├── WelcomeScreen.js
    │   ├── TaskListScreen.js       # Lista de tareas + filtros (ruta inicial del stack)
    │   ├── TaskDetailScreen.js     # Detalle de una tarea (recibe taskId por params)
    │   ├── TaskFormScreen.js       # Pantalla de "Nueva tarea"
    │   └── ProfileScreen.js
    ├── navigation/
    │   └── AppNavigator.js         # Tabs + Stack anidado, ver seccion de abajo
    ├── store/                      # Estado global (Redux Toolkit)
    │   ├── store.js                 # configureStore
    │   ├── taskSlice.js             # createSlice: items + filter, reducers y actions
    │   └── selectors.js             # Selectores (tareas filtradas, tarea por id)
    ├── assets/                     # Imagenes y fuentes locales
    ├── constants/                   # Colores y espaciados globales
    │   ├── colors.js
    │   └── spacing.js
    └── services/                    # Conexion a APIs/Firebase (proximos modulos)
```

## Requisitos previos

- [Node.js](https://nodejs.org/) (LTS recomendado)
- [Expo Go](https://expo.dev/go) instalado en tu celular (Android/iOS), o un emulador configurado

## Como ejecutarlo localmente

1. Clona el repositorio:

   ```bash
   git clone <url-del-repo>
   cd taskflow-app
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:

   ```bash
   npx expo start
   ```

4. Escanea el codigo QR con la app **Expo Go** (Android/iOS) o presiona `a` / `i` en la terminal para abrir en un emulador Android/iOS.

## Navegacion (Checkpoint 5)

La app usa [React Navigation](https://reactnavigation.org/) con dos navegadores anidados, armados en `src/navigation/AppNavigator.js`:

- **Bottom Tabs** (`createBottomTabNavigator`): es la raiz de la app, con dos pestañas — **Tareas** y **Perfil** — cada una con su icono de `@expo/vector-icons`.
- **Native Stack** (`createNativeStackNavigator`): vive *dentro* de la pestaña "Tareas" y agrupa las tres pantallas del flujo de tareas:
  1. `TaskList` (ruta inicial) → lista las tareas con `FlatList`, o muestra `EmptyState` si esta vacia.
  2. `TaskDetail` → se abre con `navigation.navigate('TaskDetail', { taskId, title })` al tocar una tarea. Recibe el `taskId` por `route.params` y busca el resto de los datos en el `TasksContext`.
  3. `TaskForm` → se abre desde el boton "+ Nueva" del header de `TaskList`. Al guardar, ejecuta `navigation.navigate('TaskList')` para volver automaticamente al listado.

La pestaña "Perfil" no tiene stack propio porque, por ahora, es una sola pantalla.

## Estado global con Redux Toolkit (Checkpoint 6)

Las tareas dejaron de vivir en un `useState` o un Context local: ahora viven en un store de Redux, armado con [`@reduxjs/toolkit`](https://redux-toolkit.js.org/) y conectado a las pantallas con [`react-redux`](https://react-redux.js.org/).

- **`src/store/taskSlice.js`**: `createSlice` con el estado `{ items, filter }` y cuatro reducers:
  - `addTask` — usa el callback `prepare` para generar el `id` (con `nanoid`), `completed: false` y `createdAt` a partir de lo que manda el formulario (`title`, `description`, `category`).
  - `toggleTaskStatus` — busca la tarea por `id` y invierte su `completed`.
  - `deleteTask` — la saca del arreglo.
  - `setFilter` — guarda el filtro activo (`all` / `pending` / `completed`).
- **`src/store/store.js`**: `configureStore` con el slice de tareas montado en `state.tasks`.
- **`src/store/selectors.js`**: `selectFilteredTasks`, `selectFilter` y `selectTaskById` para no repetir la logica de filtrado en cada pantalla.

`App.js` envuelve todo con `<Provider store={store}>`. Desde ahi:

- `TaskListScreen` lee las tareas ya filtradas con `useSelector(selectFilteredTasks)`, muestra los chips de filtro (que despachan `setFilter`) y despacha `toggleTaskStatus` al tocar el circulo de cada item.
- `TaskFormScreen` reemplaza el guardado local por `dispatch(addTask(...))` y recien despues navega de vuelta a `TaskList`.
- `TaskDetailScreen` resuelve la tarea con `useSelector(selectTaskById(taskId))` y despacha `toggleTaskStatus` desde el boton de completar — como lee del mismo store que la lista, el cambio se ve reflejado al volver atras sin pasar nada por `route.params`.

Como el filtro tambien vive en el store (no en un estado local de `TaskListScreen`), se mantiene aunque el usuario salte a la pestaña "Perfil" y vuelva.

## Estado actual (Checkpoint 6)

- Navegacion por pestañas (Tareas / Perfil) con un Stack Navigator anidado para el flujo de tareas.
- Estado global de tareas con Redux Toolkit: `addTask`, `toggleTaskStatus`, `deleteTask` y `setFilter` conectados a la UI via `useSelector`/`useDispatch`.
- Filtro de tareas (Todas / Pendientes / Completadas) persistente entre navegaciones.
- Paso de parametros (`taskId`, `title`) al entrar al detalle de una tarea, y sincronizacion inmediata con la lista al marcarla como completada.
- Redireccion programatica desde el formulario de creacion de vuelta a la lista.
- Headers con titulos coherentes por pantalla (`Mis tareas`, `Detalle de tarea`, `Nueva tarea`).
- Estado vacio y validaciones del formulario de los checkpoints anteriores, ahora alimentados por el store en lugar de estado local.

## Proximos pasos

- **Modulo 7:** conexion con Firebase (persistencia real + `createAsyncThunk` + Stack de autenticacion)
- **Modulo 8:** ProfileCard conectado a camara y datos de usuario autenticado, pulido de transiciones
