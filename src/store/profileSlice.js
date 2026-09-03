import { createSlice } from '@reduxjs/toolkit';

// Espejo local del documento de perfil del usuario en Firestore
// (coleccion "users"). Por ahora solo guarda el avatar, pero es el
// lugar natural para sumar mas datos de perfil mas adelante.
const initialState = {
  photoURI: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'error'
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    profileLoading(state) {
      state.status = 'loading';
      state.error = null;
    },
    profileReceived(state, action) {
      state.photoURI = action.payload?.photoURI ?? null;
      state.status = 'succeeded';
    },
    profileFailed(state, action) {
      state.status = 'error';
      state.error = action.payload;
    },
    // Se limpia al cerrar sesion para que el proximo usuario que
    // entre en el mismo dispositivo no vea, ni por un instante, el
    // avatar de la cuenta anterior.
    profileCleared(state) {
      state.photoURI = null;
      state.status = 'idle';
      state.error = null;
    },
  },
});

export const { profileLoading, profileReceived, profileFailed, profileCleared } =
  profileSlice.actions;
export default profileSlice.reducer;
