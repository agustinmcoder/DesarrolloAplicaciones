import { TasksProvider } from './src/context/TasksContext';
import AppNavigator from './src/navigation/AppNavigator';

// Punto de entrada de la app. AppNavigator concentra la navegacion
// (tabs + stack de tareas) y TasksProvider expone el arreglo de
// tareas a cualquier pantalla que lo necesite, sin pasar props a
// mano de componente en componente.
export default function App() {
  return (
    <TasksProvider>
      <AppNavigator />
    </TasksProvider>
  );
}
