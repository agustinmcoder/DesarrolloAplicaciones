import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, removeTask, setTaskCompleted, subscribeToUserTasks } from '../services/taskService';
import { selectFilter, selectFilteredTasks, selectTasksStatus } from '../store/selectors';
import { setFilter, tasksCleared, tasksFailed, tasksLoading, tasksReceived } from '../store/taskSlice';
import { useAuth } from './useAuth';

// Concentra toda la logica de "tareas del usuario activo": la
// suscripcion en tiempo real a Firestore, el filtro, y las
// operaciones de escritura (crear, completar, borrar). Las pantallas
// solo consumen este hook y no necesitan saber que las tareas viven
// en Firestore ni como se sincronizan con Redux.
export function useTasks() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const tasks = useSelector(selectFilteredTasks);
  const filter = useSelector(selectFilter);
  const status = useSelector(selectTasksStatus);

  useEffect(() => {
    if (!user) {
      dispatch(tasksCleared());
      return undefined;
    }

    dispatch(tasksLoading());

    const unsubscribe = subscribeToUserTasks(
      user.uid,
      (userTasks) => dispatch(tasksReceived(userTasks)),
      (error) => dispatch(tasksFailed(error.message))
    );

    return unsubscribe;
  }, [dispatch, user]);

  const addTask = (task) => createTask(user.uid, task);
  const toggleComplete = (task) => setTaskCompleted(task.id, !task.completed);
  const deleteTask = (task) => removeTask(task.id);

  return {
    tasks,
    filter,
    status,
    setFilter: (value) => dispatch(setFilter(value)),
    addTask,
    toggleComplete,
    deleteTask,
  };
}
