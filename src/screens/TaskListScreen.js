import { useLayoutEffect } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EmptyState from '../components/EmptyState';
import TaskItem from '../components/TaskItem';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { useTasks } from '../hooks/useTasks';

const FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'completed', label: 'Completadas' },
];

// Lista principal de tareas. Toda la logica de Firestore/Redux vive
// en useTasks; esta pantalla solo se encarga de la presentacion y
// de la navegacion al detalle.
export default function TaskListScreen() {
  const navigation = useNavigation();
  const { tasks, filter, status, setFilter, toggleComplete } = useTasks();

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

  const handleToggleComplete = async (task) => {
    try {
      await toggleComplete(task);
      // No hace falta actualizar nada a mano: useTasks esta
      // suscripto a Firestore y va a traer el cambio solo.
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la tarea. Intenta de nuevo.');
    }
  };

  if (status === 'loading' && tasks.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={tasks}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.filterRow}>
          {FILTERS.map((item) => {
            const selected = item.key === filter;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.filterChip, selected && styles.filterChipSelected]}
                onPress={() => setFilter(item.key)}
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
          onToggleComplete={() => handleToggleComplete(item)}
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
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: colors.textOnPrimary,
  },
});
