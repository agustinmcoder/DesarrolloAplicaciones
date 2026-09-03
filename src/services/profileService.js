import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const profileDoc = (userId) => doc(db, 'users', userId);

// Se suscribe al documento de perfil del usuario. Si todavia no
// existe (usuario recien registrado, nunca cambio su foto), el
// snapshot llega igual pero con exists() === false; lo tratamos
// como "sin foto" en vez de un error.
export function subscribeToUserProfile(userId, onChange, onError) {
  return onSnapshot(
    profileDoc(userId),
    (snapshot) => {
      onChange(snapshot.exists() ? snapshot.data() : { photoURI: null });
    },
    onError
  );
}

// Guardamos la imagen como data URI (base64) directo en el
// documento en vez de subirla a Firebase Storage: evita depender
// de un plan de facturacion solo para un avatar chico, y como la
// comprimimos antes con expo-image-manipulator entra comoda dentro
// del limite de 1MB por documento de Firestore.
export function updateUserPhoto(userId, photoURI) {
  return setDoc(profileDoc(userId), { photoURI }, { merge: true });
}
