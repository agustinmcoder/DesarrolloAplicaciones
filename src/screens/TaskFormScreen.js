import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import TaskForm from '../components/TaskForm';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { createTask } from '../services/taskService';
import { selectCurrentUser } from '../store/selectors';

// Pantalla de carga de tareas. El formulario en si es el mismo
// componente de checkpoints anteriores; lo nuevo es que "guardar"
// ahora escribe directo en Firestore con el uid del usuario activo,
// en lugar de despachar una accion local de Redux.
export default function TaskFormScreen() {
  const navigation = useNavigation();
  const user = useSelector(selectCurrentUser);

  const handleAddTask = async (task) => {
    try {
      await createTask(user.uid, task);
      // El listener de TaskListScreen va a recibir la tarea nueva
      // apenas Firestore confirme la escritura, asi que alcanza con
      // volver a la lista.
      navigation.navigate('TaskList');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la tarea. Intenta de nuevo.');
      // Relanzamos para que TaskForm sepa que el guardado fallo y no
      // muestre el Alert de exito ni limpie el formulario.
      throw error;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TaskForm onAddTask={handleAddTask} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
