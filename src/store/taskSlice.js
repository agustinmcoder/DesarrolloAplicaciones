import { createSlice } from '@reduxjs/toolkit';

// Las tareas ya no nacen en el store: nacen en Firestore. Este
// slice ahora es solo un espejo local de la coleccion "tasks" del
// usuario activo, mantenido al dia por el listener de
// subscribeToUserTasks (ver taskService.js y TaskListScreen).
const initialState = {
  items: [],
  filter: 'all', // 'all' | 'pending' | 'completed'
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'error'
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    tasksLoading(state) {
      state.status = 'loading';
      state.error = null;
    },
    tasksReceived(state, action) {
      state.items = action.payload;
      state.status = 'succeeded';
    },
    tasksFailed(state, action) {
      state.status = 'error';
      state.error = action.payload;
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
    // Se limpia al cerrar sesion para que un segundo usuario en el
    // mismo dispositivo no llegue a ver, ni por un instante, las
    // tareas del usuario anterior.
    tasksCleared(state) {
      state.items = [];
      state.status = 'idle';
    },
  },
});

export const { tasksLoading, tasksReceived, tasksFailed, setFilter, tasksCleared } =
  taskSlice.actions;
export default taskSlice.reducer;
