import { useRoute } from '@react-navigation/native';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import TaskDetail from '../components/TaskDetail';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { setTaskCompleted } from '../services/taskService';
import { selectTaskById } from '../store/selectors';

// Recibe el id de la tarea por route.params y lee los datos
// completos desde el store, que a su vez se mantiene sincronizado
// con Firestore por el listener de TaskListScreen. Marcar como
// completada escribe directo en el documento; el cambio se ve
// reflejado en la lista al volver atras porque ambas pantallas leen
// del mismo listener, no hace falta pasar nada por parametros.
export default function TaskDetailScreen() {
  const route = useRoute();
  const { taskId } = route.params;
  const task = useSelector(selectTaskById(taskId));

  if (!task) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Esta tarea ya no existe.</Text>
      </View>
    );
  }

  const handleToggleComplete = async () => {
    try {
      await setTaskCompleted(task.id, !task.completed);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la tarea. Intenta de nuevo.');
    }
  };

  return <TaskDetail task={task} onToggleComplete={handleToggleComplete} />;
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
