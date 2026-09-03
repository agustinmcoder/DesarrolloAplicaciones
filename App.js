import { Provider } from 'react-redux';
import { store } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';

// Punto de entrada de la app. AppNavigator concentra la navegacion
// (tabs + stack de tareas) y el Provider de Redux expone el store
// global a cualquier pantalla que necesite leer o modificar tareas.
export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
