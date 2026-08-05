import { StyleSheet, Text, View } from 'react-native';
import ProfileCard from '../components/ProfileCard';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';

// Pantalla de perfil. Renderiza el ProfileCard con datos de
// prueba; en el Modulo 8 estos datos vendran de Firebase.
export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <ProfileCard
        name="Agustin"
        role="Desarrollador de TaskFlow"
        image="https://i.pravatar.cc/150?img=12"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.lg,
  },
});
