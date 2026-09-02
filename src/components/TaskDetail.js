import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';

const formatDate = (date) =>
  new Date(date).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

// Vista de detalle de una tarea. Vive dentro del Stack de tareas,
// asi que volver a la lista lo resuelve la flecha nativa del
// header en lugar de un boton propio.
export default function TaskDetail({ task, onToggleComplete }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{task.category}</Text>
        </View>

        <Text style={styles.title}>{task.title}</Text>

        <Text style={styles.label}>Descripcion</Text>
        <Text style={styles.description}>{task.description}</Text>

        <Text style={styles.label}>Creada el</Text>
        <Text style={styles.date}>{formatDate(task.createdAt)}</Text>

        <Text style={styles.label}>Estado</Text>
        <Text style={task.completed ? styles.statusDone : styles.statusPending}>
          {task.completed ? 'Completada' : 'Pendiente'}
        </Text>

        <TouchableOpacity style={styles.toggleButton} onPress={onToggleComplete}>
          <Text style={styles.toggleButtonText}>
            {task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  categoryBadgeText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  date: {
    fontSize: 15,
    color: colors.text,
  },
  statusPending: {
    fontSize: 15,
    color: colors.textMuted,
    fontWeight: '600',
  },
  statusDone: {
    fontSize: 15,
    color: colors.secondary,
    fontWeight: '600',
  },
  toggleButton: {
    marginTop: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
