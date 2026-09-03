import { createSlice } from '@reduxjs/toolkit';

// No guardamos el objeto de Firebase User completo en Redux (no es
// serializable y trae metodos innecesarios): solo lo que la UI
// necesita para mostrar/filtrar cosas.
const initialState = {
  user: null, // { uid, email } | null
  authChecked: false, // true recien despues del primer onAuthStateChanged
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Se despacha una sola vez desde el listener de onAuthStateChanged
    // en AppNavigator, tanto si hay usuario como si no lo hay.
    setSession(state, action) {
      state.user = action.payload;
      state.authChecked = true;
    },
  },
});

export const { setSession } = authSlice.actions;
export default authSlice.reducer;
