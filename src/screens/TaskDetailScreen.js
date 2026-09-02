import { useRoute } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import TaskDetail from '../components/TaskDetail';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { useTasks } from '../context/TasksContext';

// Recibe el id de la tarea por route.params y busca los datos
// completos en el TasksContext. Solo viajamos el id (y el titulo,
// como respaldo) por el parametro; el resto se resuelve aca.
export default function TaskDetailScreen() {
  const route = useRoute();
  const { taskId } = route.params;
  const { getTaskById, toggleComplete } = useTasks();
  const task = getTaskById(taskId);

  if (!task) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Esta tarea ya no existe.</Text>
      </View>
    );
  }

  return <TaskDetail task={task} onToggleComplete={() => toggleComplete(task.id)} />;
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  notFoundText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
