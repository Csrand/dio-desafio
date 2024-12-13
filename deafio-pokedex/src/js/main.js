const pokemonList = document.getElementById("pokemonList");
const searchInput = document.getElementById("searchInput");
const pokemonModal = document.getElementById("pokemonModal");
const closeModalButton = document.querySelector(".close-modal");
const modalBody = document.querySelector(".modal-body");

const maxRecords = 251;
const limit = 151;
let offset = 0;
let allPokemonData = [];

function fetchPokemonData(url) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao buscar dados de Pokémon");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Erro ao buscar dados de Pokémon:", error);
    });
}

function fetchPokemonDetails(pokemonId) {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
  return fetchPokemonData(url).then((pokemonData) => {
    if (!pokemonData) return;

    return fetchPokemonData(pokemonData.species.url).then((speciesData) => {
      return fetchPokemonData(speciesData.evolution_chain.url).then(
        (evolutionChainData) => {
          return { pokemonData, evolutionChainData };
        }
      );
    });
  });
}

function convertPokemonToLi(pokemon) {
  const types = pokemon.types.map((type) => type.type.name).join(", ");

  return `
        <li class="pokemon ${types}" data-pokemon-id="${pokemon.id}">
            <span class="number">#${pokemon.id}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail" onclick="openPokemonModal(${pokemon.id})">
                <ol class="types">
                    ${pokemon.types
                      .map(
                        (type) =>
                          `<li class="type ${type.type.name}">${type.type.name}</li>`
                      )
                      .join("")}
                </ol>

                <img src="${pokemon.sprites.front_default}" alt="${
    pokemon.name
  }">
            </div>
        </li>
    `;
}

function loadPokemonItems(offset, limit) {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  fetchPokemonData(url)
    .then((response) => {
      if (!response) return;
      const pokemons = response.results;
      const pokemonDataPromises = pokemons.map((pokemon) =>
        fetchPokemonDetails(getPokemonIdFromUrl(pokemon.url))
      );
      return Promise.all(pokemonDataPromises);
    })
    .then((pokemonData) => {
      allPokemonData = allPokemonData.concat(pokemonData);
      displayPokemonList();
    });
}

function getPokemonIdFromUrl(url) {
  const parts = url.split("/");
  return parseInt(parts[parts.length - 2]);
}

function displayPokemonList(searchTerm = "") {
  const filteredPokemon = allPokemonData.filter((pokemonData) =>
    pokemonData.pokemonData.name
      .toLowerCase()
      .startsWith(searchTerm.toLowerCase())
  );
  const newHtml = filteredPokemon
    .map((pokemonData) => convertPokemonToLi(pokemonData.pokemonData))
    .join("");
  pokemonList.innerHTML = newHtml;
}

function searchPokemon() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  displayPokemonList(searchTerm);
}

function openPokemonModal(pokemonId) {
  const pokemonData = allPokemonData.find(
    (data) => data.pokemonData.id === pokemonId
  );

  if (!pokemonData) return;

  const modalContent = document.querySelector(".modal-content");
  modalContent.className = "modal-content";
  modalContent.classList.add(
    `pokemon-type-${pokemonData.pokemonData.types[0].type.name}`
  );

  modalBody.innerHTML = "";

  const pokemonContainer = document.createElement("div");
  pokemonContainer.classList.add("pokemon-container");

  const pokemonName = document.createElement("h3");
  pokemonName.textContent = pokemonData.pokemonData.name;
  pokemonContainer.appendChild(pokemonName);

  const pokemonImage = document.createElement("img");
  pokemonImage.src = pokemonData.pokemonData.sprites.front_default;
  pokemonImage.alt = pokemonData.pokemonData.name;
  pokemonImage.classList.add("pokemon-image");
  pokemonContainer.appendChild(pokemonImage);

  modalBody.appendChild(pokemonContainer);

  const pokemonInfoPanel = document.createElement("div");
  pokemonInfoPanel.classList.add("pokemon-info");

  const pokemonTypes = document.createElement("p");
  pokemonTypes.innerHTML = `<strong>Type:</strong> <br> ${pokemonData.pokemonData.types
    .map((type) => type.type.name)
    .join("<br> ")}`;

  const pokemonWeight = document.createElement("p");
  pokemonWeight.innerHTML = `<strong>Height:</strong> <br> ${
    pokemonData.pokemonData.weight / 10
  } <br>kg`;

  const pokemonHeight = document.createElement("p");
  pokemonHeight.innerHTML = `<strong>Weight:</strong> <br> ${
    pokemonData.pokemonData.height / 10
  } <br>m`;

  pokemonInfoPanel.appendChild(pokemonTypes);
  pokemonInfoPanel.appendChild(pokemonWeight);
  pokemonInfoPanel.appendChild(pokemonHeight);

  modalBody.appendChild(pokemonInfoPanel);

  modalBody.innerHTML += `<h4>Stats</h4>`;
  modalBody.innerHTML += `<ul class="stats-list">`;
  pokemonData.pokemonData.stats.forEach((stat) => {
    modalBody.innerHTML += `
            <li>
                <span class="stat-name">${stat.stat.name}</span>:
                <span class="stat-value">${stat.base_stat}</span>
            </li>
        `;
  });
  modalBody.innerHTML += `</ul>`;

  modalBody.innerHTML += `<h4>Evolutions</h4>`;
  displayEvolutions(pokemonData.evolutionChainData.chain);

  pokemonModal.style.display = "flex";
}

pokemonModal.style.display = "none";

function displayEvolutions(evolutionChain) {
  if (!evolutionChain) return;

  const speciesUrl = evolutionChain.species.url;

  fetchPokemonData(speciesUrl)
    .then((speciesData) => {
      const pokemonName = speciesData.name;
      const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonIdFromUrl(
        speciesUrl
      )}.png`;
      modalBody.innerHTML += `
                <div class="evolution">
                    <span class="evolution-name">${pokemonName}</span>
                    <img src="${imageUrl}" alt="${pokemonName}" class="evolution-image">
                </div>
            `;
    })
    .catch((error) => {
      console.error("Erro ao buscar detalhes do Pokémon:", error);
    });

  if (evolutionChain.evolves_to && evolutionChain.evolves_to.length > 0) {
    evolutionChain.evolves_to.forEach((evolution) => {
      displayEvolutions(evolution);
    });
  }
}

function closePokemonModal() {
  pokemonModal.style.display = "none";
}

closeModalButton.addEventListener("click", closePokemonModal);

window.addEventListener("click", (event) => {
  if (event.target === pokemonModal) {
    closePokemonModal();
  }
});

loadPokemonItems(offset, limit);

window.addEventListener("scroll", () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = window.scrollY;

  if (scrolled >= scrollable) {
    offset += limit;
    if (offset < maxRecords) {
      loadPokemonItems(offset, limit);
    }
  }
});

searchInput.addEventListener("input", searchPokemon);
