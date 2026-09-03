import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../services/firebaseConfig';
import { setSession } from '../store/authSlice';
import { selectAuthChecked, selectCurrentUser } from '../store/selectors';
import { colors } from '../constants/colors';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import TaskFormScreen from '../screens/TaskFormScreen';
import TaskListScreen from '../screens/TaskListScreen';

const Tab = createBottomTabNavigator();
const TaskStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const stackScreenOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: 'bold' },
  contentStyle: { backgroundColor: colors.background },
};

// Stack de la seccion de tareas: lista -> detalle y lista ->
// formulario. Se anida entero dentro de la tab "Tareas" para que
// el usuario pueda "entrar" en el flujo sin perder las pestañas.
function TaskStackNavigator() {
  return (
    <TaskStack.Navigator initialRouteName="TaskList" screenOptions={stackScreenOptions}>
      <TaskStack.Screen
        name="TaskList"
        component={TaskListScreen}
        options={{ title: 'Mis tareas' }}
      />
      <TaskStack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{ title: 'Detalle de tarea' }}
      />
      <TaskStack.Screen
        name="TaskForm"
        component={TaskFormScreen}
        options={{ title: 'Nueva tarea', presentation: 'modal' }}
      />
    </TaskStack.Navigator>
  );
}

const TAB_ICONS = {
  Tareas: 'list',
  Perfil: 'person',
};

// Stack privado: solo se monta si hay un usuario logueado.
function PrivateNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={TAB_ICONS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Tareas" component={TaskStackNavigator} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Stack publico: Login/Register, para cuando todavia no hay sesion.
function PublicNavigator() {
  return (
    <AuthStack.Navigator initialRouteName="Login" screenOptions={stackScreenOptions}>
      <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
}

function SessionLoading() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

export default function AppNavigator() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const authChecked = useSelector(selectAuthChecked);

  useEffect(() => {
    // onAuthStateChanged dispara una vez al arrancar con la sesion
    // guardada (o null si no habia ninguna) y de nuevo cada vez que
    // el usuario hace login/logout. Con eso alcanza para decidir que
    // stack mostrar; no hace falta leer nada de AsyncStorage a mano.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      dispatch(
        setSession(
          firebaseUser ? { uid: firebaseUser.uid, email: firebaseUser.email } : null
        )
      );
    });

    return unsubscribe;
  }, [dispatch]);

  if (!authChecked) {
    return <SessionLoading />;
  }

  return (
    <NavigationContainer>{user ? <PrivateNavigator /> : <PublicNavigator />}</NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
