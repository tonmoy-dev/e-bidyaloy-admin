import { useAppSelector } from "../../../shared/hooks/useAppSelector";
import { useGetPokemonByNameQuery } from "../services/pokemonApi";

export const PokemonDetail = () => {
  const selectedPokemon = useAppSelector(
    (state) => state?.pokemon?.selectedPokemon
  );
  const { data, isLoading } = useGetPokemonByNameQuery(selectedPokemon!, {
    skip: !selectedPokemon,
  });

  if (!selectedPokemon) return <p>Select a Pokémon</p>;
  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>{data.name}</h2>
      <img src={data.sprites.front_default} alt={data.name} />
      <p>Height: {data.height}</p>
      <p>Weight: {data.weight}</p>
    </div>
  );
};
