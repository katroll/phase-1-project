document.addEventListener("DOMContentLoaded", init);

function init() {
  initSearchBar();
  loadSearchHist();
}

function initSearchBar() {
  const searchForm = document.querySelector("#search-form");

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    getDefinition(searchForm.querySelector("#word-search").value);
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
        postSearchHistory(wordInfo);
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

function postSearchHistory(wordInfo) {
  fetch('http://localhost:3000/words', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(wordInfo)
  })
  .then(resp => resp.json())
  .then(wordInfo => addSearchHist(wordInfo))

}

function loadSearchHist() {
  const searchList = document.querySelector("#search-hist-list");
  const clearBtn = document.querySelector("#clear-hist-btn");

  fetch('http://localhost:3000/words') 
  .then(resp => resp.json())
  .then(words => {
    words.forEach( (word) => {
      addSearchHist(word);
    }
    )}
  );
}

function clearHist() {
  fetch('http://localhost:3000/words', {
    method: 'DELETE'
  }) 
  
}

// const getPicture = (wordInfo) => {
//   fetch(
//     `https://www.brandonfowler.me/gimgapi/?q=${wordInfo[0].word}&num=10&size=&color=&reuse=&type=&time=&format=read/1/`
//   )
//     .then((res) => res.json())
//     .then((img) => console.log(img));
// };

