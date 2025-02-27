document.getElementById('fetch-button').addEventListener('click', fetchPokemon);
document.getElementById('fetch-type-button').addEventListener('click', fetchPokemonByType);
document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
document.getElementById('fetch-all-button').addEventListener('click', fetchAllPokemon);
document.getElementById('filter-button').addEventListener('click', filterPokemon);
document.getElementById('sort-button').addEventListener('click', sortPokemon);

let favorites = [];
let searchHistory = [];
let allPokemons = []; // Store all fetched Pokémon for filtering and sorting

async function fetchPokemon() {
    const input = document.getElementById('pokemon-input').value;
    const url = `https://pokeapi.co/api/v2/pokemon/${input.toLowerCase()}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Pokémon not found');
        }
        const data = await response.json();
        displayPokemon(data);
        addToSearchHistory(input);
    } catch (error) {
        console.error(error);
        document.getElementById('pokemon-data').innerText = error.message;
    }
}

async function fetchPokemonByType() {
    const type = document.getElementById('type-select').value;
    if (!type) {
        alert('Please select a Pokémon type.');
        return;
    }

    const url = `https://pokeapi.co/api/v2/type/${type}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Type not found');
        }
        const data = await response.json();
        displayPokemonsByType(data.pokemon);
    } catch (error) {
        console.error(error);
        document.getElementById('pokemon-data').innerText = error.message;
    }
}

async function fetchAllPokemon() {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=1000`; // Fetching a large number of Pokémon

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch Pokémon');
        }
        const data = await response.json();
        allPokemons = data.results; // Store all Pokémon for filtering and sorting
        displayAllPokemon(allPokemons);
    } catch (error) {
        console.error(error);
        document.getElementById('all-pokemon-images').innerText = error.message;
    }
}

function filterPokemon() {
    const ability = document.getElementById('ability-select').value;
    if (!ability) {
        alert('Please select an ability to filter.');
        return;
    }

    // Fetch Pokémon with the selected ability
    const filteredPokemons = allPokemons.filter(pokemon => {
        // Logic to check if the Pokémon has the selected ability
        // This requires additional API calls to get abilities for each Pokémon
        return true; // Placeholder for actual filtering logic
    });

    displayAllPokemon(filteredPokemons);
}

function sortPokemon() {
    const sortBy = document.getElementById('sort-select').value;
    let sortedPokemons;

    if (sortBy === 'name') {
        sortedPokemons = [...allPokemons].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'height') {
        sortedPokemons = [...allPokemons].sort((a, b) => a.height - b.height);
    } else if (sortBy === 'weight') {
        sortedPokemons = [...allPokemons].sort((a, b) => a.weight - b.weight);
    }

    displayAllPokemon(sortedPokemons);
}

function displayPokemon(data) {
    const pokemonDataDiv = document.getElementById('pokemon-data');
    pokemonDataDiv.innerHTML = `
        <h2>${data.name}</h2>
        <img src="${data.sprites.front_default}" alt="${data.name}">
        <p>Height: ${data.height}</p>
        <p>Weight: ${data.weight}</p>
        <button onclick="addToFavorites('${data.name}')">Add to Favorites</button>
    `;
}

function displayPokemonsByType(pokemons) {
    const pokemonDataDiv = document.getElementById('pokemon-data');
    pokemonDataDiv.innerHTML = '<h2>Pokémon of Selected Type:</h2>';
    pokemons.forEach(pokemon => {
        pokemonDataDiv.innerHTML += `<p>${pokemon.pokemon.name}</p>`;
    });
}

function displayAllPokemon(pokemons) {
    const allPokemonImagesDiv = document.getElementById('all-pokemon-images');
    allPokemonImagesDiv.innerHTML = '<h2>All Pokémon:</h2>';
    pokemons.forEach(pokemon => {
        const pokemonId = pokemon.url.split('/')[6]; // Extracting Pokémon ID from the URL
        const imageUrl = `https://pokeapi.co/media/sprites/pokemon/${pokemonId}.png`; // Constructing the image URL
        allPokemonImagesDiv.innerHTML += `<img src="${imageUrl}" alt="${pokemon.name}" style="width: 100px; height: 100px; margin: 5px; display: inline-block;">`;
    });
}

function addToFavorites(pokemonName) {
    if (!favorites.includes(pokemonName)) {
        favorites.push(pokemonName);
        updateFavoritesDisplay();
    } else {
        alert(`${pokemonName} is already in your favorites.`);
    }
}

function updateFavoritesDisplay() {
    const favoritesDiv = document.getElementById('favorites');
    favoritesDiv.innerHTML = '<h2>Your Favorites:</h2>';
    favorites.forEach(favorite => {
        favoritesDiv.innerHTML += `<p>${favorite}</p>`;
    });
}

function addToSearchHistory(searchTerm) {
    if (!searchHistory.includes(searchTerm)) {
        searchHistory.push(searchTerm);
        updateSearchHistoryDisplay();
    }
}

function updateSearchHistoryDisplay() {
    const searchHistoryDiv = document.getElementById('search-history');
    searchHistoryDiv.innerHTML = '<h2>Search History:</h2>';
    searchHistory.forEach(term => {
        searchHistoryDiv.innerHTML += `<p>${term}</p>`;
    });
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}
