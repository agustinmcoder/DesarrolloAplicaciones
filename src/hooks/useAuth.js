import { useSelector } from 'react-redux';
import { selectAuthChecked, selectCurrentUser } from '../store/selectors';

// Lectura del estado de sesion. Separado en su propio hook para que
// las pantallas no tengan que saber que la sesion vive en Redux ni
// como se llaman los selectores puntuales.
export function useAuth() {
  const user = useSelector(selectCurrentUser);
  const authChecked = useSelector(selectAuthChecked);

  return { user, authChecked, isLoggedIn: Boolean(user) };
}
