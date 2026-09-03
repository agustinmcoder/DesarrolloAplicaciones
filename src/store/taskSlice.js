import { createSlice, nanoid } from '@reduxjs/toolkit';

// Un par de tareas de ejemplo para no arrancar con la lista vacia
// en cada reinicio de la app durante las pruebas.
const initialState = {
  items: [
    {
      id: 'seed-1',
      title: 'Revisar entrega de TaskFlow',
      description: 'Repasar el checklist del checkpoint antes de subir el repositorio.',
      category: 'Estudio',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-2',
      title: 'Preparar reunion de equipo',
      description: 'Armar la agenda con los temas pendientes del sprint.',
      category: 'Trabajo',
      completed: true,
      createdAt: new Date().toISOString(),
    },
  ],
  filter: 'all', // 'all' | 'pending' | 'completed'
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // El formulario solo manda title/description/category; el id,
    // el estado inicial de completado y la fecha se resuelven aca
    // via el callback "prepare" de Redux Toolkit.
    addTask: {
      reducer(state, action) {
        state.items.unshift(action.payload);
      },
      prepare({ title, description, category }) {
        return {
          payload: {
            id: nanoid(),
            title,
            description,
            category,
            completed: false,
            createdAt: new Date().toISOString(),
          },
        };
      },
    },
    toggleTaskStatus(state, action) {
      const task = state.items.find((item) => item.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    deleteTask(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
  },
});

export const { addTask, toggleTaskStatus, deleteTask, setFilter } = taskSlice.actions;
export default taskSlice.reducer;
