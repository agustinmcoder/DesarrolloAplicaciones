import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';

// Punto de entrada de la app. SafeAreaProvider expone los insets de
// pantalla (notch, barra de estado) a cualquier SafeAreaView de la
// app; el Provider de Redux expone el store global; AppNavigator
// concentra la navegacion (tabs + stack de tareas).
export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    </SafeAreaProvider>
  );
}
