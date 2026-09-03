import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './taskSlice';

// Store central de la app. Por ahora solo tiene el slice de
// tareas; cuando llegue el Modulo 7 (Firebase) probablemente se
// sume un slice de auth al lado de este.
export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
});
