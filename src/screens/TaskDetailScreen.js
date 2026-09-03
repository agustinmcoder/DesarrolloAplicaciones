import { useRoute } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import TaskDetail from '../components/TaskDetail';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { selectTaskById } from '../store/selectors';
import { toggleTaskStatus } from '../store/taskSlice';

// Recibe el id de la tarea por route.params y lee los datos
// completos desde el store. Como el item viene del mismo array
// que alimenta la lista, marcar "completada" aca se refleja al
// volver atras sin pasar nada por parametros.
export default function TaskDetailScreen() {
  const route = useRoute();
  const { taskId } = route.params;
  const dispatch = useDispatch();
  const task = useSelector(selectTaskById(taskId));

  if (!task) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Esta tarea ya no existe.</Text>
      </View>
    );
  }

  return (
    <TaskDetail task={task} onToggleComplete={() => dispatch(toggleTaskStatus(task.id))} />
  );
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
