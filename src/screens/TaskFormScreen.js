import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TaskForm from '../components/TaskForm';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { useTasks } from '../context/TasksContext';

// Pantalla de carga de tareas. El formulario en si es el mismo
// componente del Modulo 3/4; lo unico nuevo es que ahora, al
// guardar, navega de vuelta a la lista en lugar de solo limpiarse.
export default function TaskFormScreen() {
  const navigation = useNavigation();
  const { addTask } = useTasks();

  const handleAddTask = (task) => {
    addTask(task);
    navigation.navigate('TaskList');
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
