import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';

// Pantalla principal donde se listaran las tareas.
// Por ahora solo muestra la estructura base; la lista real
// de tareas se agrega en los proximos modulos.
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis tareas</Text>
      <Text style={styles.placeholder}>Todavia no hay tareas cargadas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  placeholder: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
