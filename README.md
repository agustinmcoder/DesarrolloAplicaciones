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
    │   ├── LoginScreen.js          # Stack publico: inicio de sesion
    │   ├── RegisterScreen.js       # Stack publico: alta de cuenta
    │   ├── TaskListScreen.js       # Lista de tareas + filtros (ruta inicial del stack)
    │   ├── TaskDetailScreen.js     # Detalle de una tarea (recibe taskId por params)
    │   ├── TaskFormScreen.js       # Pantalla de "Nueva tarea"
    │   └── ProfileScreen.js        # Datos del usuario logueado + cerrar sesion
    ├── navigation/
    │   └── AppNavigator.js         # Tabs + Stack anidado, ver seccion de abajo
    ├── store/                      # Estado global (Redux Toolkit)
    │   ├── store.js                 # configureStore
    │   ├── authSlice.js             # Sesion del usuario (user, authChecked)
    │   ├── taskSlice.js             # Espejo local de la coleccion "tasks" de Firestore
    │   └── selectors.js             # Selectores (tareas filtradas, tarea por id, sesion)
    ├── assets/                     # Imagenes y fuentes locales
    ├── constants/                   # Colores y espaciados globales
    │   ├── colors.js
    │   └── spacing.js
    └── services/                    # Firebase (Auth + Firestore)
        ├── firebaseConfig.js         # initializeApp/Auth/Firestore desde variables de entorno
        ├── authService.js            # createAccount, signIn, logOut, mapAuthError
        └── taskService.js            # CRUD de tareas en Firestore (subscribeToUserTasks, createTask, ...)
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

## Configuracion de Firebase (Checkpoint 7)

La app necesita un proyecto de Firebase propio con **Authentication** (metodo Email/Password) y **Firestore** habilitados. Pasos:

1. Anda a la [consola de Firebase](https://console.firebase.google.com/) y creá un proyecto nuevo (es gratis).
2. **Authentication** → pestaña *Sign-in method* → habilita el proveedor **Email/Password**.
3. **Firestore Database** → *Create database* → arrancá en modo de prueba (o pegá las reglas de [`firestore.rules`](./firestore.rules) en la pestaña *Rules*, que son las que va a usar la app en producción).
4. **Project settings** (el engranaje) → *General* → en "Your apps" agregá una app **Web** (icono `</>`) → copiá el objeto `firebaseConfig` que te muestra.
5. En la raiz del proyecto, copiá `.env.example` a `.env` y completá cada valor con lo que copiaste en el paso anterior:

   ```bash
   cp .env.example .env
   ```

6. Reiniciá `npx expo start` (las variables de entorno se leen al arrancar el bundler).

El `.env` nunca se sube al repositorio (está en `.gitignore`); cada quien que clone el proyecto arma el suyo con su propio proyecto de Firebase.

### Seguridad: una tarea, un dueño

El filtrado por `userId` en `taskService.subscribeToUserTasks` hace que la lista solo pida las tareas del usuario activo, pero eso por si solo no evita que alguien le pegue directo a la API de Firestore pidiendo la coleccion entera. Por eso [`firestore.rules`](./firestore.rules) exige, a nivel de base de datos, que `request.auth.uid` coincida con el `userId` del documento tanto para leer/editar/borrar como para crear — un usuario autenticado jamas puede tocar un documento que no sea suyo, aunque conozca su ID.

## Estado global con Redux Toolkit (Checkpoint 6, actualizado en el 7)

El store sigue armado con [`@reduxjs/toolkit`](https://redux-toolkit.js.org/) y conectado a las pantallas con [`react-redux`](https://react-redux.js.org/), pero desde el Checkpoint 7 las tareas ya no "nacen" en Redux: nacen en Firestore, y el slice es un espejo local que se mantiene sincronizado por un listener.

- **`src/store/authSlice.js`**: guarda la sesion (`{ user, authChecked }`). `user` es `{ uid, email }` o `null`; `authChecked` distingue "todavia no sabemos si hay sesion" de "sabemos que no hay nadie logueado", para no flashear la pantalla de Login en el arranque.
- **`src/store/taskSlice.js`**: `createSlice` con el estado `{ items, filter, status, error }`.
  - `tasksLoading` / `tasksReceived` / `tasksFailed` — reflejan el ciclo de vida de la suscripcion a Firestore (ver mas abajo).
  - `setFilter` — guarda el filtro activo (`all` / `pending` / `completed`).
  - `tasksCleared` — vacia la lista al cerrar sesion, para que un segundo usuario en el mismo dispositivo no llegue a ver ni por un instante las tareas del anterior.
- **`src/store/store.js`**: `configureStore` con los slices `auth` y `tasks`.
- **`src/store/selectors.js`**: `selectCurrentUser`, `selectAuthChecked`, `selectFilteredTasks`, `selectFilter`, `selectTasksStatus` y `selectTaskById`.

Ya no hay reducers `addTask` / `toggleTaskStatus` que muten `items` a mano: escribir una tarea es responsabilidad de Firestore (`taskService.js`), y Redux solo refleja lo que Firestore confirma.

## Autenticacion y persistencia con Firebase (Checkpoint 7)

- **`src/services/firebaseConfig.js`**: inicializa la app de Firebase con las variables de entorno, `auth` (con persistencia en `AsyncStorage`, para no pedir login de nuevo en cada apertura) y `db` (Firestore).
- **`src/services/authService.js`**: `createAccount`, `signIn`, `logOut` (wrappers de Firebase Auth) y `mapAuthError`, que traduce codigos como `auth/invalid-credential` a mensajes en español para mostrar en pantalla.
- **`src/services/taskService.js`**: todo el CRUD de tareas contra la coleccion `tasks` de Firestore —
  - `subscribeToUserTasks(userId, onChange, onError)` — `onSnapshot` con `where('userId', '==', userId')`, ordenado del lado del cliente por `createdAt` (evita tener que crear un indice compuesto en Firestore).
  - `createTask(userId, { title, description, category })` — `addDoc` con `userId`, `completed: false` y `createdAt: serverTimestamp()`.
  - `setTaskCompleted(taskId, completed)` / `removeTask(taskId)` — `updateDoc` / `deleteDoc` por id.
- **`src/navigation/AppNavigator.js`** ahora decide que stack mostrar segun la sesion:
  - Mientras `authChecked` es `false` (todavia no llego la primera respuesta de `onAuthStateChanged`), muestra un spinner.
  - Sin usuario → `PublicNavigator` (`Login` / `Register`).
  - Con usuario → `PrivateNavigator`, el mismo Tab + Stack de tareas de los checkpoints anteriores.
  
  El listener de `onAuthStateChanged` vive en un solo lugar (`AppNavigator`) y despacha `setSession`; ninguna pantalla navega "a mano" al loguearse o desloguearse, simplemente cambia el usuario en el store y el navigator reacciona solo.
- **`TaskListScreen`** se suscribe a `subscribeToUserTasks` en un `useEffect` (con el `uid` del usuario activo como dependencia) y despacha `tasksReceived` en cada cambio; al desmontarse, se da de baja de la suscripcion. Marcar una tarea como completada llama a `setTaskCompleted` directo — no hay un dispatch manual, el listener ya se encarga de traer el cambio de vuelta.
- **`TaskFormScreen`** llama a `createTask(user.uid, task)` y solo navega de vuelta a la lista si la escritura no tira error; si falla, se lo muestra al usuario con `Alert.alert` y lo deja reintentar sin perder lo que ya habia tipeado.
- **`ProfileScreen`** muestra el email de la cuenta logueada y tiene el boton de "Cerrar sesion" (con confirmacion) que llama a `authService.logOut()`.

### Como se probaron los flujos

- **Registro**: se creo una cuenta nueva desde `RegisterScreen` con un email de prueba; la app paso sola al stack privado (sin tocar nada de navegacion) y el usuario aparecio en Firebase Console → Authentication → Users.
- **Persistencia de sesion**: con la cuenta logueada, se cerro la app por completo (no solo background) y se volvio a abrir — entro directo a la lista de tareas, sin pedir login de nuevo.
- **Login con error**: se probo con una contraseña incorrecta y con un email inexistente; en ambos casos `LoginScreen` mostro el mensaje "Email o contraseña incorrectos." en lugar de romper o quedarse colgado.
- **Alta de tarea**: se creo una tarea desde `TaskFormScreen` y se verifico que aparece (a) en la lista de la app al instante y (b) como documento nuevo en Firebase Console → Firestore → coleccion `tasks`, con el `userId` de la cuenta usada.
- **Completar tarea**: se marco una tarea como completada desde el detalle, se volvio a la lista y el cambio ya estaba reflejado (via el listener), y el documento en Firestore quedo con `completed: true`.
- **Separacion por usuario**: se registro una segunda cuenta y se verifico que arranca sin ver ninguna tarea de la primera cuenta (la query filtra por `userId`, y `firestore.rules` lo refuerza a nivel de base de datos).

## Estado actual (Checkpoint 7)

- Registro e inicio de sesion contra Firebase Auth, con mensajes de error legibles.
- Persistencia de sesion entre reinicios de la app (`AsyncStorage` + `onAuthStateChanged`).
- Navegacion protegida: sin sesion solo se puede ver Login/Register; con sesion, el Tab + Stack de tareas de siempre.
- Tareas persistidas en Firestore, separadas por usuario (`userId` + reglas de seguridad en `firestore.rules`).
- Lista de tareas en tiempo real via `onSnapshot`, con filtro (Todas / Pendientes / Completadas) que sigue viviendo en Redux.
- Cerrar sesion desde la pantalla de Perfil.

## Proximos pasos

- **Modulo 8 (Final):** camara/galeria con `expo-image-picker` para la foto de perfil, subida a Firebase Storage, pulido de UX y transiciones, preparacion de una build de prueba.
