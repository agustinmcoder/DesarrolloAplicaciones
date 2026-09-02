import { createContext, useContext, useState } from 'react';

const TasksContext = createContext(null);

// Estado compartido de tareas. Vive en Context porque ahora hay
// tres pantallas distintas (lista, detalle y formulario) que
// necesitan leer/escribir el mismo arreglo. En el Modulo 6 esto
// se reemplaza por el store de Redux sin tocar las pantallas.
export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => {
    setTasks((prev) => [task, ...prev]);
  };

  const toggleComplete = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getTaskById = (taskId) => tasks.find((task) => task.id === taskId);

  return (
    <TasksContext.Provider value={{ tasks, addTask, toggleComplete, getTaskById }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks debe usarse dentro de un TasksProvider');
  }
  return context;
}
