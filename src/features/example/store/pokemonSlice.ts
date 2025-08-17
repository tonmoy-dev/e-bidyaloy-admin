import { createSlice, type PayloadAction, } from '@reduxjs/toolkit';

interface PokemonState {
  selectedPokemon: string | null;
}

const initialState: PokemonState = {
  selectedPokemon: null,
};

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    selectPokemon: (state, action: PayloadAction<string | null>) => {
      state.selectedPokemon = action.payload;
    },
  },
});

export const { selectPokemon } = pokemonSlice.actions;
export default pokemonSlice.reducer;
