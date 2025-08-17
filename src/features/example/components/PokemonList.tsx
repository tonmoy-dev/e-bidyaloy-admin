import { useAppDispatch } from "../../../shared/hooks/useAppDispatch";
import { useGetPokemonsQuery } from "../services/pokemonApi";
import { selectPokemon } from "../store/pokemonSlice";

export const PokemonList = () => {
  const dispatch = useAppDispatch();
  const { data, error, isLoading } = useGetPokemonsQuery(10);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading Pokemons</p>;

  return (
    <ul>
      {data?.results.map((pokemon) => (
        <li key={pokemon.name}>
          <button onClick={() => dispatch(selectPokemon(pokemon.name))}>
            {pokemon.name}
          </button>
        </li>
      ))}
    </ul>
  );
};
