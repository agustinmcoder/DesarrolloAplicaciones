import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import profileReducer from './profileSlice';
import tasksReducer from './taskSlice';

// Store central de la app: sesion del usuario, su perfil (avatar) y
// un espejo local de sus tareas en Firestore.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    tasks: tasksReducer,
  },
});
