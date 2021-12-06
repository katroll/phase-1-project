document.addEventListener("DOMContentLoaded", init);

function init() {
  initSearchBar();
  initTheSearchBar();
}

function initSearchBar() {
  const searchForm = document.querySelector("#search-form");

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    getDefinition(searchForm.querySelector("#word-search").value);
    e.target.reset();
  });
}

function initTheSearchBar() {
  const searchForm = document.querySelector('#t-search-form')

  searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      loadSynonyms(searchForm.querySelector('#t-word-search').value);
      e.target.reset();
  });
}

function getDefinition(word) {

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((resp) => resp.json())
    .then((wordInfo) => {
      if (
        wordInfo.message ===
        "Sorry pal, we couldn't find definitions for the word you were looking for."
      ) {
        document.querySelector("#word-def-list").innerHTML = "";
        document.querySelector("#word-value").textContent = wordInfo.message;
      } else {
        newSearch(wordInfo);
        addSearchHist(wordInfo);
      }

    });
}

function newSearch(wordInfo) {
  const wordDefList = document.querySelector("#word-def-list");
  wordDefList.innerHTML = "";

  wordInfo.forEach((word) => loadWord(word));
}

function loadWord(wordInfo) {
  const meaningsArray = wordInfo.meanings;
  const wordValue = document.querySelector("#word-value");
  const wordDefList = document.querySelector("#word-def-list");

  wordValue.textContent = wordInfo.word;

  meaningsArray.forEach((meaning) => {
    const partOfSpeech = document.createElement("h4");
    partOfSpeech.textContent = meaning.partOfSpeech;
    wordDefList.appendChild(partOfSpeech);
    loadDef(meaning);
  });
}

function loadDef(meaning) {
  const wordDefList = document.querySelector("#word-def-list");

  meaning.definitions.forEach((def) => {
    const newDef = document.createElement("li");
    newDef.textContent = def.definition;
    wordDefList.appendChild(newDef);
  });
}

function addSearchHist(wordInfo) {
  const searchList = document.querySelector("#search-hist-list");
  const newWord = document.createElement("li");

  newWord.textContent = wordInfo[0].word;
  newWord.classList.add("history-li");
  newWord.addEventListener("click", (e) => newSearch(wordInfo));
  searchList.appendChild(newWord);
}

function loadSynonyms(word) {
  const wordValue = document.querySelector("#t-word-value");
  const wordSynList = document.querySelector("#synonym-list");

  wordValue.textContent = word;

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
  .then((resp) => resp.json())
  .then((wordInfo) => {
      const synonymsArray = wordInfo[0].meanings[0].definitions[0].synonyms;
      synonymsArray.forEach((synonym) => {
        const eachSynonym = document.createElement("li");
        eachSynonym.textContent = synonym;
        wordSynList.appendChild(eachSynonym);
      });
  })
}