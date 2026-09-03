import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import ProfileCard from '../components/ProfileCard';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { logOut } from '../services/authService';
import { selectCurrentUser } from '../store/selectors';

// Pantalla de perfil. El nombre/imagen siguen siendo de prueba (eso
// llega en el Modulo 8 con la foto de perfil real), pero el email y
// el cierre de sesion ya salen del usuario autenticado.
export default function ProfileScreen() {
  const user = useSelector(selectCurrentUser);

  const handleLogOut = () => {
    Alert.alert('Cerrar sesion', '¿Seguro que queres salir de tu cuenta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesion',
        style: 'destructive',
        onPress: () => logOut(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <ProfileCard
        name={user?.email ?? 'Usuario de TaskFlow'}
        role="Desarrollador de TaskFlow"
        image="https://i.pravatar.cc/150?img=12"
      />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut} activeOpacity={0.8}>
        <Text style={styles.logoutButtonText}>Cerrar sesion</Text>
      </TouchableOpacity>
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
  logoutButton: {
    marginTop: spacing.xl,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.danger,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: '600',
  },
});
