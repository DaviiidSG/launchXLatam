'use strict';

//* Reproducción y pausa de música de fondo

const music = document.getElementById('audio'),
  playBtn = document.getElementById('music-icon');

function changeMusicIcon() {
  if (music.paused) {
    playBtn.setAttribute('icon', 'carbon:play-filled-alt');
  } else {
    playBtn.setAttribute('icon', 'carbon:pause-filled');
  }
}

function playMusic() {
  music.paused ? music.play() : music.pause();
  changeMusicIcon();
}

playBtn.addEventListener('click', playMusic);

//* Control de volumen

const volController = document.getElementById('music-vol');

music.volume = volController.value;

volController.oninput = function() {
  music.volume = volController.value;
}

//* Encendido de pokedex

let pokedexIsOn = false;
const powerBtn = document.getElementById('left-circle-button'),
  powerIcon = document.getElementById('power-icon'),
  blueBrightnessOut = document.getElementById('big-circle-border-inside'),
  blueBrightnessIn = document.getElementById('big-circle-fill'),
  screenReflections = document.getElementsByClassName('reflection'),
  leftScreen = document.getElementById('screen'),
  rightScreen = document.getElementById('info-container'),
  pokeImg = document.getElementById('pokemon-img'),
  pokeNameInput = document.getElementById('search-pokemon');

function turnOnPokedex() {
  pokedexIsOn = true;
  blueBrightnessOut.style.boxShadow = 'var(--circle-outside-brightness)';
  blueBrightnessIn.style.backgroundColor = 'var(--big-circle-color)';
  powerIcon.setAttribute('style', 'color: var(--power-on-button)');
  leftScreen.style.backgroundColor = 'var(--screen-on)';
  rightScreen.style.backgroundColor = 'var(--screen-on)';
  pokeNameInput.removeAttribute('disabled');
  for (let reflection of screenReflections) {
    reflection.style.backgroundColor = 'transparent';
  }
  setTimeout(function() {
    pokeImg.style.display = 'block';
  }, 200);
  music.play();
  changeMusicIcon();
}

function clearDisplay() {
  pokeImg.style.display = 'none';
  pokeImg.setAttribute('src', './assets/img/pokeball.gif');
  loadingText.innerHTML = '';
  pokeNameInput.value = '';
  clearPokemonInfo();
}

function clearPokemonInfo() {
  rightScreen.innerHTML = '';
  weightDisplay.innerHTML = '';
  heightDisplay.innerHTML = '';
}

function turnOffPokedex() {
  pokedexIsOn = false;
  blueBrightnessOut.style.boxShadow = 'var(--circle-outside-shadow)';
  blueBrightnessIn.style.backgroundColor = 'var(--big-circle-inside-shadow)';
  powerIcon.setAttribute('style', 'color: var(--power-off-button)');
  leftScreen.style.backgroundColor = 'var(--screen-background)';
  rightScreen.style.backgroundColor = 'var(--screen-background)';
  pokeNameInput.setAttribute('disabled', '');
  for (let reflection of screenReflections) {
    reflection.style.backgroundColor = 'var(--screen-reflection)';
  }
  clearDisplay();
}

powerBtn.addEventListener('click', () => {
  if (!pokedexIsOn) {
    turnOnPokedex();
  } else {
    turnOffPokedex();
  }
});

//* Buscar Pokemon

let pokemonId = null;
const searchContainer = document.getElementById('search-container'),
  loadingText = document.getElementById('loading-text'),
  rightControl = document.getElementById('right-controller'),
  leftControl = document.getElementById('left-controller'),
  weightDisplay = document.getElementById('weight-display'),
  heightDisplay = document.getElementById('height-display');

function getInputPokemon() {
  if (pokeNameInput.value) {
    const pokeName = pokeNameInput.value.toLowerCase();
    getPokemon(pokeName);
  }
}

function nextPokemon(actualId) {
  getPokemon(actualId + 1);
}

function previousPokemon(actualId) {
  getPokemon(actualId - 1);
}

function loading() {
    pokeImg.setAttribute('src', './assets/img/pikachu-running.gif');
    loadingText.innerHTML = 'Loading...';
    clearPokemonInfo();
}

function capitalize(name) {
  const firstLetter = name[0].toUpperCase();
  const word = firstLetter + name.slice(1);
  return word;
}

function delHyphen(word) {
  if (word.includes('-')) {
    word += ' ';
    let position = 0;
    const wordsArr = [];
    while(true) {
      const findPosition = word.indexOf('-', position);
      wordsArr.push(word.slice(position, findPosition));
      if (findPosition == -1) break;
      position = findPosition + 1;
    }
    let finalWord = '';
    wordsArr.forEach((item) => {
      finalWord += `${capitalize(item)} `
    })
    return finalWord.trim();
  }
  return capitalize(word);
}

function showPokemon(pokemon) {
  const namePokemon = delHyphen(pokemon.name);
  pokeNameInput.value = namePokemon;
  pokemonId = pokemon.id;
  loadingText.innerHTML = `#${pokemonId} - ${namePokemon}`;
  const imgUrl = pokemon.sprites.front_default;
  pokeImg.setAttribute('src', imgUrl);
  !imgUrl ? pokeImg.setAttribute('alt', 'Image unavailable') : pokeImg.setAttribute('alt', 'Pokemon image');
}

function showAbilities(abilities) {
  const abilitiesContainer = document.createElement('div'),
    abilitiesTitle = document.createElement('div'),
    infoContainer = document.createElement('div');
  abilitiesContainer.setAttribute('class', 'display-abilities');
  abilitiesTitle.setAttribute('class', 'info-titles');
  abilitiesTitle.innerHTML = 'Abilities';
  abilities.forEach((item) => {
    const abilitiesText = document.createElement('span');
    abilitiesText.innerHTML = delHyphen(item.ability.name);
    abilitiesContainer.appendChild(abilitiesText);
  });
  infoContainer.appendChild(abilitiesTitle);
  infoContainer.appendChild(abilitiesContainer);
  rightScreen.appendChild(infoContainer);
}

function showTypes(type) {
  const typesContainer = document.createElement('div'),
    typesTitle = document.createElement('div'),
    infoContainer = document.createElement('div');
  typesContainer.setAttribute('class', 'display-types');
  typesTitle.setAttribute('class', 'info-titles');
  typesTitle.innerHTML = 'Types';
  type.forEach((item) => {
    const typesText = document.createElement('span');
    typesText.innerHTML = capitalize(item.type.name);
    switch(item.type.name) {
      case 'normal':
        typesText.setAttribute('class', 'normal');
        break;
      case 'fighting':
        typesText.setAttribute('class', 'fighting');
        break;
      case 'flying':
        typesText.setAttribute('class', 'flying');
        break;
      case 'poison':
        typesText.setAttribute('class', 'poison');
        break;
      case 'ground':
        typesText.setAttribute('class', 'ground');
        break;
      case 'rock':
        typesText.setAttribute('class', 'rock');
        break;
      case 'bug':
        typesText.setAttribute('class', 'bug');
        break;
      case 'ghost':
        typesText.setAttribute('class', 'ghost');
        break;
      case 'steel':
        typesText.setAttribute('class', 'steel');
        break;
      case 'fire':
        typesText.setAttribute('class', 'fire');
        break;
      case 'water':
        typesText.setAttribute('class', 'water');
        break;
      case 'grass':
        typesText.setAttribute('class', 'grass');
        break;
      case 'electric':
        typesText.setAttribute('class', 'electric');
        break;
      case 'psychic':
        typesText.setAttribute('class', 'psychic');
        break;
      case 'ice':
        typesText.setAttribute('class', 'ice');
        break;
      case 'dragon':
        typesText.setAttribute('class', 'dragon');
        break;
      case 'dark':
        typesText.setAttribute('class', 'dark');
        break;
      case 'fairy':
        typesText.setAttribute('class', 'fairy');
        break;
    }
    typesContainer.appendChild(typesText);
  });
  infoContainer.appendChild(typesTitle);
  infoContainer.appendChild(typesContainer);
  rightScreen.appendChild(infoContainer);
}

function showStats(stats) {
  const statsContainer = document.createElement('div'),
    statsTitle = document.createElement('div'),
    infoContainer = document.createElement('div');
  statsContainer.setAttribute('class', 'display-stats');
  statsTitle.setAttribute('class', 'info-titles');
  statsTitle.innerHTML = 'Stats';
  stats.forEach((item) => {
    const template = `<div class="stat"><span>${delHyphen(item.stat.name).toUpperCase()}</span><div class="stats-progress-container"><div class="stats-progress-bar" style="width: ${(item.base_stat * 100) / 200}%"></div></div><span class="stats-value">${item.base_stat}</span></div>`;
    statsContainer.innerHTML += template;
  });
  infoContainer.appendChild(statsTitle);
  infoContainer.appendChild(statsContainer);
  rightScreen.appendChild(infoContainer);
}

function showMoves(movements) {
  const movesContainer = document.createElement('div'),
    movesTitle = document.createElement('div'),
    infoContainer = document.createElement('div');
  movesTitle.setAttribute('class', 'info-titles');
  movesTitle.innerHTML = 'Moves';
  movesContainer.setAttribute('class', 'display-movements');
  movements.forEach((item) => {
    const movesText = document.createElement('span');
    movesText.innerHTML = delHyphen(item.move.name);
    movesContainer.appendChild(movesText);
  });
  infoContainer.appendChild(movesTitle);
  infoContainer.appendChild(movesContainer);
  rightScreen.appendChild(infoContainer);
}

function parseNum(num) {
  return num / 10;
}

function showHeight(height) {
  const parsedHeight = parseNum(height);
  heightDisplay.innerHTML = `Height: ${parsedHeight} m`
}

function showWeight(weight) {
  const parsedWeight = parseNum(weight);
  weightDisplay.innerHTML = `Weight: ${parsedWeight} kg`
}

function showPokemonInfo(pokemon) {
  showAbilities(pokemon.abilities);
  showTypes(pokemon.types);
  showStats(pokemon.stats);
  showMoves(pokemon.moves);
  showWeight(pokemon.weight);
  showHeight(pokemon.height);
}

function getPokemon(pokemonToSearch) {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonToSearch}`;
  loading();
  fetch(url)
    .then((response) => {
      if (response.status != '200') {
        pokeImg.setAttribute('src', './assets/img/error-image.png');
        loadingText.innerHTML = 'Pokemon not found';
      } else {
        return response.json();
      }
    })
    .then((pokemon) => {
      if (pokemon) {
        showPokemon(pokemon);
        showPokemonInfo(pokemon);
      }
    })
}

searchContainer.addEventListener('submit', (event) => {
  event.preventDefault();
  if (pokedexIsOn) getInputPokemon();
});
rightControl.addEventListener('click', () => {
  if (pokemonId < 905 && pokemonId) {
    nextPokemon(pokemonId);
  }
});
leftControl.addEventListener('click', () => {
  if (pokemonId > 1 && pokemonId) {
    previousPokemon(pokemonId);
  }
});