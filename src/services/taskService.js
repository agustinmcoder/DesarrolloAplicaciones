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
      const tasks = snapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();
        return {
          id: docSnapshot.id,
          ...data,
          // Un Timestamp de Firestore no es serializable (Redux se
          // queja fuerte de esto), asi que lo convertimos a numero
          // de una vez aca, antes de que llegue al store. Mientras
          // el servidor no confirmo el serverTimestamp todavia,
          // createdAt llega en null por un instante.
          createdAt: data.createdAt?.toMillis?.() ?? null,
        };
      });

      tasks.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

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
