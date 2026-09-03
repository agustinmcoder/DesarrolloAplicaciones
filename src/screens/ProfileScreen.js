import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileCard from '../components/ProfileCard';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { logOut } from '../services/authService';

const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?img=12';

// Pantalla de perfil. El avatar sale de Firestore (via useProfile) y
// se actualiza solo en cuanto el usuario elige una foto nueva de la
// galeria; mientras no haya elegido ninguna, se muestra un avatar
// de relleno.
export default function ProfileScreen() {
  const { user } = useAuth();
  const { photoURI, updating, pickAndSavePhoto } = useProfile();

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
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text style={styles.title}>Perfil</Text>
        <ProfileCard
          name={user?.email ?? 'Usuario de TaskFlow'}
          role="Desarrollador de TaskFlow"
          image={photoURI ?? DEFAULT_AVATAR}
        />

        <TouchableOpacity
          style={[styles.photoButton, updating && styles.photoButtonDisabled]}
          onPress={pickAndSavePhoto}
          disabled={updating}
          activeOpacity={0.8}
        >
          {updating ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={styles.photoButtonText}>Cambiar foto de perfil</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut} activeOpacity={0.8}>
          <Text style={styles.logoutButtonText}>Cerrar sesion</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
  photoButton: {
    marginTop: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  photoButtonDisabled: {
    opacity: 0.6,
  },
  photoButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: spacing.md,
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
