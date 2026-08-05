# TaskFlow

App movil de gestion de tareas, desarrollada con [Expo](https://expo.dev) (React Native).

## Estructura del proyecto

```
taskflow-app/
├── App.js                    # Punto de entrada, renderiza ProfileScreen
├── index.js                   # Registro de la app (generado por Expo)
├── app.json                    # Configuracion de Expo
└── src/
    ├── components/             # Piezas reutilizables de UI
    │   └── ProfileCard.js
    ├── screens/                 # Vistas principales de la app
    │   ├── WelcomeScreen.js
    │   ├── HomeScreen.js
    │   └── ProfileScreen.js
    ├── assets/                  # Imagenes y fuentes locales
    ├── constants/                # Colores y espaciados globales
    │   ├── colors.js
    │   └── spacing.js
    └── services/                 # Conexion a APIs/Firebase (proximos modulos)
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

## Estado actual (Checkpoint 2)

Pantallas visualizadas en el emulador:

- **ProfileScreen**: pantalla renderizada por defecto desde `App.js`. Muestra el componente `ProfileCard` con datos de prueba (nombre, rol e imagen de avatar).
- **HomeScreen**: estructura base de la pantalla de tareas, lista para recibir el listado real en el proximo modulo.
- **WelcomeScreen**: pantalla del Checkpoint 1, se mantiene en `src/screens` sin estar montada en `App.js`.

El componente `ProfileCard` (`src/components/ProfileCard.js`) recibe `name`, `role` e `image` por props, no tiene datos hardcodeados, y sus estilos estan definidos con `StyleSheet.create`.

## Proximos pasos

- **Modulo 3:** formularios para crear tareas
- **Modulo 5:** navegacion entre HomeScreen y ProfileScreen
- **Modulo 6:** estado global de tareas
- **Modulo 7:** conexion con Firebase
- **Modulo 8:** ProfileCard conectado a camara y datos de usuario autenticado
