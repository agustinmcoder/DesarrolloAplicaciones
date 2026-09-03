import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Las credenciales viven en variables de entorno (ver .env.example)
// para no commitear las claves del proyecto de Firebase. Expo las
// inyecta automaticamente por llevar el prefijo EXPO_PUBLIC_.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// getApps()/getApp() evitan el error "app already initialized" que
// tira Firebase con el fast refresh de Expo en desarrollo.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// initializeAuth (en vez de getAuth) es lo que permite indicarle a
// Firebase que persista la sesion en AsyncStorage. Sin esto, la app
// pediria login de nuevo cada vez que se reinicia en el celular.
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export default app;
