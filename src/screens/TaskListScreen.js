import { useLayoutEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import EmptyState from '../components/EmptyState';
import TaskItem from '../components/TaskItem';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { selectFilter, selectFilteredTasks } from '../store/selectors';
import { setFilter, toggleTaskStatus } from '../store/taskSlice';

const FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'completed', label: 'Completadas' },
];

// Lista principal de tareas. El formulario de carga vive en su
// propia pantalla (TaskForm); esta se abre desde el boton
// "+ Nueva" del header y al guardar vuelve para aca. Los datos y
// el filtro activo salen del store de Redux, asi que se mantienen
// sin importar a que pestaña navegue el usuario.
export default function TaskListScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const tasks = useSelector(selectFilteredTasks);
  const activeFilter = useSelector(selectFilter);

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
      ListHeaderComponent={
        <View style={styles.filterRow}>
          {FILTERS.map((item) => {
            const selected = item.key === activeFilter;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.filterChip, selected && styles.filterChipSelected]}
                onPress={() => dispatch(setFilter(item.key))}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selected && styles.filterChipTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      }
      ListEmptyComponent={<EmptyState />}
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          onPress={() =>
            navigation.navigate('TaskDetail', { taskId: item.id, title: item.title })
          }
          onToggleComplete={() => dispatch(toggleTaskStatus(item.id))}
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
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextSelected: {
    color: colors.text,
  },
});
