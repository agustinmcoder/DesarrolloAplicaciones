# TaskFlow

App móvil de gestión de tareas, desarrollada con [Expo](https://expo.dev) (React Native).

Este repositorio corresponde al **Checkpoint 1: Estructura Base** del proyecto final. Sienta las bases (proyecto Expo inicializado, arquitectura de carpetas y pantalla de bienvenida) sobre las que se construirán los próximos módulos: pantallas de tareas, formularios, navegación y conexión con Firebase.

## Estructura del proyecto

```
taskflow-app/
├── App.js                 # Punto de entrada, renderiza WelcomeScreen
├── index.js                # Registro de la app (generado por Expo)
├── app.json                 # Configuración de Expo
└── src/
    ├── components/          # Piezas reutilizables de UI
    ├── screens/              # Vistas principales de la app
    │   └── WelcomeScreen.js
    ├── assets/               # Imágenes y fuentes locales
    ├── theme/                # Colores y estilos globales
    │   ├── colors.js
    │   └── spacing.js
    └── services/             # Lógica de conexión a APIs/Firebase (próximos módulos)
```

## Requisitos previos

- [Node.js](https://nodejs.org/) (LTS recomendado)
- [Expo Go](https://expo.dev/go) instalado en tu celular (Android/iOS), o un emulador configurado

## Cómo ejecutarlo localmente

1. Cloná el repositorio:

   ```bash
   git clone <url-del-repo>
   cd taskflow-app
   ```

2. Instalá las dependencias:

   ```bash
   npm install
   ```

3. Iniciá el servidor de desarrollo:

   ```bash
   npx expo start
   ```

4. Escaneá el código QR con la app **Expo Go** (Android/iOS) o presioná `a` / `i` en la terminal para abrir en un emulador Android/iOS.

## Estado actual (Checkpoint 1)

- [x] Proyecto Expo inicializado con plantilla Blank
- [x] Estructura de carpetas `src/` (`components`, `screens`, `assets`, `theme`, `services`)
- [x] `App.js` renderiza una pantalla de bienvenida con `View`, `Text` y `StyleSheet`

## Próximos pasos

- **Módulo 2:** pantallas de lista de tareas y detalle
- **Módulos 3-4:** formularios y renderizado dinámico de listas
- **Módulo 5:** navegación entre pantallas
- **Módulo 6:** estado global de tareas
- **Módulo 7:** conexión con Firebase
