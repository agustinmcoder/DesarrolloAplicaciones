import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import TaskForm from '../components/TaskForm';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { addTask } from '../store/taskSlice';

// Pantalla de carga de tareas. El formulario en si es el mismo
// componente de checkpoints anteriores; lo unico que cambia es que
// ahora, en vez de guardar en un estado local o un Context, hace
// dispatch de addTask contra el store global.
export default function TaskFormScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleAddTask = (task) => {
    dispatch(addTask(task));
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
