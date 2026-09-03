// Selectores chicos para no repetir la logica de filtrado/busqueda
// en cada pantalla que necesita leer del slice de tareas o de auth.

export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthChecked = (state) => state.auth.authChecked;

export const selectProfilePhoto = (state) => state.profile.photoURI;
export const selectProfileStatus = (state) => state.profile.status;

export const selectFilter = (state) => state.tasks.filter;
export const selectTasksStatus = (state) => state.tasks.status;

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
