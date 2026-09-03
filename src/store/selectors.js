// Selectores chicos para no repetir la logica de filtrado/busqueda
// en cada pantalla que necesita leer del slice de tareas.

export const selectFilter = (state) => state.tasks.filter;

export const selectFilteredTasks = (state) => {
  const { items, filter } = state.tasks;

  if (filter === 'pending') {
    return items.filter((task) => !task.completed);
  }

  if (filter === 'completed') {
    return items.filter((task) => task.completed);
  }

  return items;
};

export const selectTaskById = (taskId) => (state) =>
  state.tasks.items.find((task) => task.id === taskId);
