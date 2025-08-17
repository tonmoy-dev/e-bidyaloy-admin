import { baseApi } from "../../../core/services/baseApi";



export interface Pokemon {
  name: string;
  url: string;
}

export const pokemonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPokemons: builder.query<{ results: Pokemon[] }, number>({
      query: (limit = 10) => `pokemon?limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
            ...result.results.map(({ name }) => ({ type: 'Pokemon' as const, id: name })),
            { type: 'Pokemon', id: 'LIST' },
          ]
          : [{ type: 'Pokemon', id: 'LIST' }],
    }),
    getPokemonByName: builder.query<any, string>({
      query: (name) => `pokemon/${name}`,
      providesTags: (_result, _error, name) => [{ type: 'Pokemon', id: name }],
    }),

    // Mocked mutation examples (PokéAPI is read-only)
    createPokemon: builder.mutation<Pokemon, Partial<Pokemon>>({
      query: (newPokemon) => ({
        url: 'pokemon',
        method: 'POST',
        body: newPokemon,
      }),
      invalidatesTags: [{ type: 'Pokemon', id: 'LIST' }],
    }),
    updatePokemon: builder.mutation<Pokemon, { name: string; data: Partial<Pokemon> }>({
      query: ({ name, data }) => ({
        url: `pokemon/${name}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_res, _err, { name }) => [{ type: 'Pokemon', id: name }],
    }),
    deletePokemon: builder.mutation<{ success: boolean; id: string }, string>({
      query: (name) => ({
        url: `pokemon/${name}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, name) => [{ type: 'Pokemon', id: name }],
    }),
  }),
});

export const {
  useGetPokemonsQuery,
  useGetPokemonByNameQuery,
  useCreatePokemonMutation,
  useUpdatePokemonMutation,
  useDeletePokemonMutation,
} = pokemonApi;
