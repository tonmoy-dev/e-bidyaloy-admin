import { useState } from 'react';
import { useCreatePokemonMutation } from '../services/pokemonApi';

export const PokemonForm = () => {
  const [name, setName] = useState('');
  const [createPokemon, { isLoading }] = useCreatePokemonMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPokemon({ name, url: 'https://example.com' });
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New Pokémon name"
      />
      <button type="submit" disabled={isLoading}>
        Create
      </button>
    </form>
  );
};
