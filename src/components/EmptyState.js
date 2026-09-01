import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';

// Se muestra en lugar de la lista cuando todavia no hay tareas
// cargadas, para que la pantalla nunca quede en blanco.
export default function EmptyState() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🗒️</Text>
      <Text style={styles.text}>
        ¡No tienes tareas pendientes! Empieza por crear una arriba.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  icon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  text: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
