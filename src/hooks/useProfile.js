import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { subscribeToUserProfile, updateUserPhoto } from '../services/profileService';
import { selectProfilePhoto, selectProfileStatus } from '../store/selectors';
import { profileCleared, profileFailed, profileLoading, profileReceived } from '../store/profileSlice';
import { useAuth } from './useAuth';

// Achicamos y comprimimos la foto antes de mandarla a Firestore:
// evita fotos de varios MB (la camara de cualquier celular actual
// las saca mucho mas grandes que esto) y nos mantiene comodos debajo
// del limite de 1MB por documento.
const AVATAR_SIZE = 300;
const AVATAR_QUALITY = 0.5;

// Concentra todo lo necesario para el avatar de perfil: la
// suscripcion al documento en Firestore y el flujo completo de
// "elegir una foto de la galeria y guardarla". La pantalla de
// Perfil no necesita saber nada de permisos, ImagePicker ni
// Firestore, solo llama a pickAndSavePhoto.
export function useProfile() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const photoURI = useSelector(selectProfilePhoto);
  const status = useSelector(selectProfileStatus);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch(profileCleared());
      return undefined;
    }

    dispatch(profileLoading());

    const unsubscribe = subscribeToUserProfile(
      user.uid,
      (profile) => dispatch(profileReceived(profile)),
      (error) => dispatch(profileFailed(error.message))
    );

    return unsubscribe;
  }, [dispatch, user]);

  const pickAndSavePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Falta permiso',
        'Necesitamos acceso a tus fotos para poder cambiar el avatar.'
      );
      return;
    }

    let result;
    try {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir la galeria. Intenta de nuevo.');
      return;
    }

    // El usuario cerro el selector sin elegir nada: no es un error,
    // simplemente no hay nada que guardar.
    if (result.canceled || !result.assets?.length) {
      return;
    }

    setUpdating(true);
    try {
      const manipulated = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: AVATAR_SIZE, height: AVATAR_SIZE } }],
        { compress: AVATAR_QUALITY, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );

      const dataUri = `data:image/jpeg;base64,${manipulated.base64}`;
      await updateUserPhoto(user.uid, dataUri);
      // No hace falta despachar nada a mano: subscribeToUserProfile
      // recibe el cambio apenas Firestore lo confirma.
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la foto. Intenta de nuevo.');
    } finally {
      setUpdating(false);
    }
  };

  return { photoURI, status, updating, pickAndSavePhoto };
}
