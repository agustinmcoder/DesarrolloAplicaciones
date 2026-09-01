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

// Vista de detalle de una tarea. Todavia no usamos React Navigation
// (eso llega en el Modulo 5), asi que HomeScreen simplemente deja
// de renderizar la lista y muestra esto en su lugar.
export default function TaskDetail({ task, onBack }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>‹ Volver</Text>
      </TouchableOpacity>

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
        <Text style={styles.status}>
          {task.completed ? 'Completada' : 'Pendiente'}
        </Text>
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
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
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
  status: {
    fontSize: 15,
    color: colors.secondary,
    fontWeight: '600',
  },
});
