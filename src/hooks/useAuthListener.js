import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { auth } from '../services/firebaseConfig';
import { setSession } from '../store/authSlice';

// Conecta el listener de Firebase Auth con Redux. Se usa una sola
// vez, en AppNavigator: onAuthStateChanged dispara al arrancar con
// la sesion guardada (o null si no habia ninguna) y de nuevo en cada
// login/logout, asi que alcanza para decidir que stack mostrar sin
// leer nada de AsyncStorage a mano.
export function useAuthListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      dispatch(
        setSession(
          firebaseUser ? { uid: firebaseUser.uid, email: firebaseUser.email } : null
        )
      );
    });

    return unsubscribe;
  }, [dispatch]);
}
