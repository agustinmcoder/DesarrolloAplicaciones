import { useLayoutEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EmptyState from '../components/EmptyState';
import TaskItem from '../components/TaskItem';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { useTasks } from '../context/TasksContext';

// Lista principal de tareas. El formulario de carga paso a vivir
// en su propia pantalla (TaskForm); esta se abre desde el boton
// "+ Nueva" del header y al guardar vuelve para aca.
export default function TaskListScreen() {
  const navigation = useNavigation();
  const { tasks, toggleComplete } = useTasks();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('TaskForm')}
          style={styles.addButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.addButtonText}>+ Nueva</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={tasks}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<EmptyState />}
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          onPress={() =>
            navigation.navigate('TaskDetail', { taskId: item.id, title: item.title })
          }
          onToggleComplete={() => toggleComplete(item.id)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  addButton: {
    marginRight: spacing.sm,
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
