import { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import EmptyState from '../components/EmptyState';
import TaskDetail from '../components/TaskDetail';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';

// Pantalla principal: junta el formulario de carga, la lista de
// tareas y el detalle de la tarea seleccionada. Todavia no hay
// navigator (eso llega en el Modulo 5), asi que el "detalle" es
// solo otro estado que reemplaza el contenido de la pantalla.
export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleAddTask = (task) => {
    setTasks((prev) => [task, ...prev]);
  };

  const handleToggleComplete = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );

    // El detalle abierto tiene que reflejar el cambio tambien,
    // si no queda mostrando el estado viejo hasta volver a entrar.
    setSelectedTask((current) =>
      current && current.id === taskId
        ? { ...current, completed: !current.completed }
        : current
    );
  };

  if (selectedTask) {
    return <TaskDetail task={selectedTask} onBack={() => setSelectedTask(null)} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.content}
        data={tasks}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={<TaskForm onAddTask={handleAddTask} />}
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onPress={() => setSelectedTask(item)}
            onToggleComplete={() => handleToggleComplete(item.id)}
          />
        )}
      />
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
    flexGrow: 1,
  },
});
