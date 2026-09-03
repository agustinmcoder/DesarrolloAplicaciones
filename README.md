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
    ├── hooks/                      # Logica de Firebase/Redux reutilizable
    │   ├── useAuth.js               # Lee la sesion del store (user, authChecked)
    │   ├── useAuthListener.js       # Conecta onAuthStateChanged con Redux
    │   ├── useTasks.js              # Suscripcion a Firestore + filtro + CRUD de tareas
    │   └── useProfile.js            # Suscripcion al perfil + elegir/guardar avatar
    ├── store/                      # Estado global (Redux Toolkit)
    │   ├── store.js                 # configureStore
    │   ├── authSlice.js             # Sesion del usuario (user, authChecked)
    │   ├── profileSlice.js          # Espejo local del documento de perfil (avatar)
    │   ├── taskSlice.js             # Espejo local de la coleccion "tasks" de Firestore
    │   └── selectors.js             # Selectores (tareas filtradas, tarea por id, sesion, perfil)
    ├── assets/                     # Imagenes y fuentes locales
    ├── constants/                   # Colores y espaciados globales
    │   ├── colors.js
    │   └── spacing.js
    └── services/                    # Firebase (Auth + Firestore)
        ├── firebaseConfig.js         # initializeApp/Auth/Firestore desde variables de entorno
        ├── authService.js            # createAccount, signIn, logOut, mapAuthError
        ├── taskService.js            # CRUD de tareas en Firestore (subscribeToUserTasks, createTask, ...)
        └── profileService.js         # Lectura/escritura del documento de perfil (avatar)
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
  
  El listener de `onAuthStateChanged` vive en un solo lugar (encapsulado en el hook `useAuthListener`, usado desde `AppNavigator`) y despacha `setSession`; ninguna pantalla navega "a mano" al loguearse o desloguearse, simplemente cambia el usuario en el store y el navigator reacciona solo.
- **`TaskListScreen`** consume el hook `useTasks` (ver mas abajo) para leer la lista ya filtrada y disparar el cambio de estado de una tarea.
- **`TaskFormScreen`** llama a `useTasks().addTask(task)` y solo navega de vuelta a la lista si la escritura no tira error; si falla, se lo muestra al usuario con `Alert.alert` y lo deja reintentar sin perder lo que ya habia tipeado.
- **`ProfileScreen`** muestra el email de la cuenta logueada, el avatar (ver seccion de perfil mas abajo) y tiene el boton de "Cerrar sesion" (con confirmacion) que llama a `authService.logOut()`.

## Hooks personalizados

Para no repetir "suscribirse a Firestore + despachar a Redux + dar de baja al desmontar" en cada pantalla, esa logica quedo encapsulada en `src/hooks/`:

- **`useAuth()`** — lee `user` y `authChecked` del store. Lo usan `AppNavigator` (para elegir el stack) y cualquier pantalla que necesite saber quien esta logueado (`ProfileScreen`, `useTasks`, `useProfile`).
- **`useAuthListener()`** — efecto de una sola linea de uso (`useAuthListener()` en `AppNavigator`) que conecta `onAuthStateChanged` con `dispatch(setSession(...))`. Antes esto era un `useEffect` suelto adentro de `AppNavigator`; sacarlo a un hook lo hace testeable/reutilizable aparte y deja a `AppNavigator` enfocado solo en decidir que stack mostrar.
- **`useTasks()`** — concentra la suscripcion a `subscribeToUserTasks`, el filtro activo y las operaciones de escritura (`addTask`, `toggleComplete`, `deleteTask`). `TaskListScreen` y `TaskFormScreen` lo consumen sin saber que hay Firestore ni Redux detras.
- **`useProfile()`** — concentra la suscripcion al documento de perfil y todo el flujo de `pickAndSavePhoto` (permisos, `ImagePicker`, compresion con `ImageManipulator`, guardado en Firestore). `ProfileScreen` solo llama a esa funcion y muestra un spinner mientras `updating` es `true`.

La regla que se siguio: **las pantallas no importan nada de `firebase/*` directamente** (salvo `TaskDetailScreen`, que llama a `setTaskCompleted` sin pasar por `useTasks` a proposito — ver nota abajo). Todo lo que toca la red pasa por un `service` o por un hook que envuelve a ese service.

> **Por que `TaskDetailScreen` no usa `useTasks`:** `useTasks` devuelve la lista ya *filtrada* (Todas/Pendientes/Completadas). Si el detalle tomara la tarea de ahi, marcarla como completada mientras el filtro activo es "Pendientes" la haria desaparecer de esa lista y el detalle se quedaria sin datos a mitad de la pantalla. Por eso el detalle resuelve la tarea con `selectTaskById` (que mira `state.tasks.items` sin filtrar) y llama a `setTaskCompleted` directo.

## Perfil y avatar con `expo-image-picker`

- **`src/services/profileService.js`**: `subscribeToUserProfile(userId, onChange, onError)` (`onSnapshot` sobre `users/{uid}`) y `updateUserPhoto(userId, photoURI)` (`setDoc` con `merge: true`).
- **`src/hooks/useProfile.js`**: expone `{ photoURI, updating, pickAndSavePhoto }`. `pickAndSavePhoto`:
  1. Pide permiso de galeria con `ImagePicker.requestMediaLibraryPermissionsAsync()`; si lo rechazan, avisa con un `Alert` y no sigue.
  2. Abre el selector con `ImagePicker.launchImageLibraryAsync`. Si el usuario cancela (`result.canceled`), corta ahi sin tocar nada — no es un error.
  3. Redimensiona y comprime la foto elegida con `expo-image-manipulator` (300x300, calidad 0.5) y la convierte a base64.
  4. Guarda esa imagen como *data URI* (`data:image/jpeg;base64,...`) directo en el documento `users/{uid}` de Firestore.
- **Por que base64 en Firestore y no Firebase Storage**: subir a Storage hubiera significado depender del plan de facturacion "Blaze" del proyecto solo para guardar un avatar chico. Al comprimir la imagen antes (paso 3) entra comoda dentro del limite de 1MB por documento de Firestore, así que se evita esa dependencia sin resignar que la foto persista en la nube y se sincronice entre dispositivos.
- El avatar se ve reflejado al toque en `ProfileCard` porque `photoURI` sale de Redux (`profileSlice`), que a su vez lo recibe del listener de Firestore — el mismo patron que las tareas.

### Como se probaron los flujos

- **Registro**: se creo una cuenta nueva desde `RegisterScreen` con un email de prueba; la app paso sola al stack privado (sin tocar nada de navegacion) y el usuario aparecio en Firebase Console → Authentication → Users.
- **Persistencia de sesion**: con la cuenta logueada, se cerro la app por completo (no solo background) y se volvio a abrir — entro directo a la lista de tareas, sin pedir login de nuevo.
- **Login con error**: se probo con una contraseña incorrecta y con un email inexistente; en ambos casos `LoginScreen` mostro el mensaje "Email o contraseña incorrectos." en lugar de romper o quedarse colgado.
- **Alta de tarea**: se creo una tarea desde `TaskFormScreen` y se verifico que aparece (a) en la lista de la app al instante y (b) como documento nuevo en Firebase Console → Firestore → coleccion `tasks`, con el `userId` de la cuenta usada.
- **Completar tarea**: se marco una tarea como completada desde el detalle, se volvio a la lista y el cambio ya estaba reflejado (via el listener), y el documento en Firestore quedo con `completed: true`.
- **Separacion por usuario**: se registro una segunda cuenta y se verifico que arranca sin ver ninguna tarea de la primera cuenta (la query filtra por `userId`, y `firestore.rules` lo refuerza a nivel de base de datos).
- **Cambiar avatar**: desde Perfil, se eligio una foto de la galeria; se vio actualizada al toque en la app y como campo `photoURI` en Firebase Console → Firestore → coleccion `users` → documento con el `uid` de la cuenta.
- **Cancelar el selector de fotos**: se abrio la galeria y se volvio atras sin elegir ninguna imagen — la app sigue funcionando igual que antes, sin errores ni cambios de estado (se verifica el chequeo de `result.canceled` en `useProfile`).
- **Permiso de fotos rechazado**: se probo negando el permiso de galeria la primera vez que la pide — la app muestra un `Alert` explicando por que lo necesita, en vez de trabarse o cerrarse.
- **Sin conexion**: se activo el modo avion con la app abierta y se intento crear una tarea; Firestore devuelve el error de red y `TaskFormScreen` lo muestra con `Alert.alert` en lugar de crashear. Al recuperar la conexion, el listener de `useTasks` vuelve a sincronizar solo.
- **Navegacion rapida**: se toco varias tareas y las pestañas Tareas/Perfil seguido, sin dejar tiempo a que cada pantalla termine de renderizar — no se observaron crashes ni warnings de "cant perform a React state update on an unmounted component" (los `useEffect` de los hooks se dan de baja de su suscripcion al desmontarse).

## Estado final del proyecto

- Registro e inicio de sesion contra Firebase Auth, con mensajes de error legibles.
- Persistencia de sesion entre reinicios de la app (`AsyncStorage` + `onAuthStateChanged`).
- Navegacion protegida: sin sesion solo se puede ver Login/Register; con sesion, el Tab + Stack de tareas de siempre.
- Tareas persistidas en Firestore, separadas por usuario (`userId` + reglas de seguridad en `firestore.rules`).
- Lista de tareas en tiempo real via `onSnapshot`, con filtro (Todas / Pendientes / Completadas) que vive en Redux.
- Avatar de perfil elegido desde la galeria (`expo-image-picker` + `expo-image-manipulator`), persistido en Firestore y sincronizado en tiempo real.
- Toda la logica de Firebase/Redux organizada en hooks personalizados (`useAuth`, `useAuthListener`, `useTasks`, `useProfile`) en vez de repetida pantalla por pantalla.
- `SafeAreaProvider`/`SafeAreaView` en las pantallas sin header nativo (Login, Register, Perfil) para que el contenido no quede debajo del notch o la barra de estado.
- Cerrar sesion desde la pantalla de Perfil.

## Posibles mejoras a futuro

Fuera del alcance de este programa, pero serian los siguientes pasos naturales:

- Migrar el avatar de base64-en-Firestore a Firebase Storage cuando el proyecto tenga plan Blaze, para no cargar cada carga de perfil con el peso de la imagen completa.
- Cache de imagenes/offline-first mas robusto (por ejemplo con `redux-persist` o una libreria de sincronizacion offline de Firestore mas explicita).
- Tests automatizados (Jest + React Native Testing Library) para los hooks (`useTasks`, `useProfile`) y los reducers.
- Preparar la app para las tiendas (App Store/Play Store): iconos y splash finales, `eas build` con perfiles de produccion, políticas de privacidad.

- **Modulo 8 (Final):** camara/galeria con `expo-image-picker` para la foto de perfil, subida a Firebase Storage, pulido de UX y transiciones, preparacion de una build de prueba.
