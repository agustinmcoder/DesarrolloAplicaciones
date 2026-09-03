import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tasksReducer from './taskSlice';

// Store central de la app: sesion del usuario y espejo local de
// sus tareas en Firestore.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
  },
});
