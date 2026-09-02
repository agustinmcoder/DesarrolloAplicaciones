import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../constants/colors';
import ProfileScreen from '../screens/ProfileScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import TaskFormScreen from '../screens/TaskFormScreen';
import TaskListScreen from '../screens/TaskListScreen';

const Tab = createBottomTabNavigator();
const TaskStack = createNativeStackNavigator();

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

export default function AppNavigator() {
  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
}
