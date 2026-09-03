import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const tasksCollection = collection(db, 'tasks');

// Se suscribe a las tareas del usuario logueado. Evitamos combinar
// where + orderBy en la query (pediria crear un indice compuesto en
// Firestore) y ordenamos del lado del cliente en su lugar.
export function subscribeToUserTasks(userId, onChange, onError) {
  const tasksQuery = query(tasksCollection, where('userId', '==', userId));

  return onSnapshot(
    tasksQuery,
    (snapshot) => {
      const tasks = snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      }));

      tasks.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() ?? 0;
        const timeB = b.createdAt?.toMillis?.() ?? 0;
        return timeB - timeA;
      });

      onChange(tasks);
    },
    onError
  );
}

export function createTask(userId, { title, description, category }) {
  return addDoc(tasksCollection, {
    userId,
    title,
    description,
    category,
    completed: false,
    createdAt: serverTimestamp(),
  });
}

export function setTaskCompleted(taskId, completed) {
  return updateDoc(doc(db, 'tasks', taskId), { completed });
}

export function removeTask(taskId) {
  return deleteDoc(doc(db, 'tasks', taskId));
}
