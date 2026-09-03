import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from './firebaseConfig';

// Wrappers finitos sobre Firebase Auth. Las pantallas de Login y
// Register llaman a estas funciones y se encargan ellas mismas de
// traducir los errores a mensajes legibles (ver mapAuthError).
export function createAccount(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logOut() {
  return signOut(auth);
}

// Firebase tira codigos tipo "auth/invalid-credential"; los mapeamos
// a algo que tenga sentido mostrarle a un usuario real.
const ERROR_MESSAGES = {
  'auth/invalid-email': 'El email no tiene un formato valido.',
  'auth/missing-password': 'Ingresa una contraseña.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/email-already-in-use': 'Ya existe una cuenta con ese email.',
  'auth/invalid-credential': 'Email o contraseña incorrectos.',
  'auth/user-not-found': 'Email o contraseña incorrectos.',
  'auth/wrong-password': 'Email o contraseña incorrectos.',
  'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos e intenta de nuevo.',
  'auth/network-request-failed': 'No hay conexion a internet.',
};

export function mapAuthError(error) {
  return ERROR_MESSAGES[error?.code] || 'Ocurrio un error inesperado. Intenta de nuevo.';
}
