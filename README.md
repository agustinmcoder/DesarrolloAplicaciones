# TaskFlow

App movil de gestion de tareas, desarrollada con [Expo](https://expo.dev) (React Native).

## Estructura del proyecto

```
taskflow-app/
├── App.js                       # Punto de entrada: TasksProvider + AppNavigator
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
    │   ├── TaskListScreen.js       # Lista de tareas (ruta inicial del stack)
    │   ├── TaskDetailScreen.js     # Detalle de una tarea (recibe taskId por params)
    │   ├── TaskFormScreen.js       # Pantalla de "Nueva tarea"
    │   └── ProfileScreen.js
    ├── navigation/
    │   └── AppNavigator.js         # Tabs + Stack anidado, ver seccion de abajo
    ├── context/
    │   └── TasksContext.js         # Estado compartido de tareas (interino a Redux)
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

### Por que Context y no props

Antes, `HomeScreen` mantenia el arreglo de tareas en un solo `useState` porque formulario, lista y detalle eran la misma pantalla. Al separar cada uno en su propia ruta del stack, ya no pueden compartir estado por props (son pantallas distintas, no componentes hijos entre si). Para no anticipar Redux (Modulo 6) armamos un `TasksContext` chico (`src/context/TasksContext.js`) que expone `tasks`, `addTask`, `toggleComplete` y `getTaskById` a cualquier pantalla envuelta en `TasksProvider`. Cuando llegue Redux, esta es la unica pieza que se reemplaza — las pantallas ya consumen los datos a traves de un hook (`useTasks`), no de un padre comun.

## Estado actual (Checkpoint 5)

- Navegacion por pestañas (Tareas / Perfil) con un Stack Navigator anidado para el flujo de tareas.
- Paso de parametros (`taskId`, `title`) al entrar al detalle de una tarea.
- Redireccion programatica desde el formulario de creacion de vuelta a la lista.
- Headers con titulos coherentes por pantalla (`Mis tareas`, `Detalle de tarea`, `Nueva tarea`).
- Estado vacio, validaciones del formulario y marcado de completada de los checkpoints anteriores, ahora repartidos entre pantallas en lugar de vivir en una sola.

## Proximos pasos

- **Modulo 6:** reemplazar `TasksContext` por Redux Toolkit
- **Modulo 7:** conexion con Firebase (persistencia real + Stack de autenticacion)
- **Modulo 8:** ProfileCard conectado a camara y datos de usuario autenticado, pulido de transiciones
