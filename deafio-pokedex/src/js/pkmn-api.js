const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;

  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

  return pokemon;
}

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Erro ao carregar os detalhes do Pokémon ${pokemon.name}`
        );
      }
      return response.json();
    })
    .then(convertPokeApiDetailToPokemon);
};

pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao carregar a lista de pokémons");
      }
      return response.json();
    })
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailRequests) => Promise.all(detailRequests))
    .then((pokemonsDetails) => pokemonsDetails);
};

pokeApi.getPokemonsByGeneration = (generation) => {
  let offset = 0;
  let limit = 0;

  switch (generation) {
    case 1:
      offset = 0;
      limit = 151;
      break;
    case 2:
      offset = 151;
      limit = 100;
      break;
    case 3:
      offset = 251;
      limit = 135; // Geração 3 vai de 251 a 386
      break;
    case 4:
      offset = 386;
      limit = 107; // Geração 4 vai de 386 a 493
      break;
    default:
      throw new Error("Geração Não Suportada");
  }

  return pokeApi.getPokemons(offset, limit);
};
