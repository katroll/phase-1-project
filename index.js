document.addEventListener("DOMContentLoaded", init);

function init() {
  initSearchBar();
  initThesaurusSearchBar();
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

function initThesaurusSearchBar() {
  const searchForm = document.querySelector("#t-search-form");
  const thesList = document.querySelector("#synonym-list");

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    thesList.innerHTML = "";
    loadSynonyms(searchForm.querySelector("#t-word-search").value);
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
    })
    .catch((error) => error.message);
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
  newWord.addEventListener("click", () => newSearch(wordInfo));
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
        eachSynonym.classList.add("syn-list-item");
        wordSynList.appendChild(eachSynonym);
        console.log(wordInfo);

        eachSynonym.addEventListener("click", () => {
          getDefinition(eachSynonym.textContent);
        });
      });
    });
}

function postSearchHistory(wordInfo) {
  fetch("http://localhost:3000/words/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    params: { _limit: 2 },
    body: JSON.stringify(wordInfo),
  })
    .then((resp) => resp.json())
    .then((wordInfo) => addSearchHist(wordInfo))
    .catch((error) => error.message);
}

function loadSearchHist() {
  const searchList = document.querySelector("#search-hist-list");
  const clearBtn = document.querySelector("#clear-hist-btn");

  fetch("http://localhost:3000/words")
    .then((resp) => resp.json())
    .then((words) => {
      words.forEach((word) => {
        addSearchHist(word);
      });
      clearBtn.addEventListener("click", () => {
        searchList.innerHTML = "";
        for (let i = 0; i < 20; i++) {
          try {
            clearHist(i);
          } catch {
            console.log("skipped");
          }
        }
      });
    });
}

function clearHist(id) {
  fetch(`http://localhost:3000/words/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}

// const getPicture = (wordInfo) => {
//   fetch(
//     `https://www.brandonfowler.me/gimgapi/?q=dog&num=10&size=&color=&reuse=&type=&time=&format=read/1/`,
//     {}
//   )
//     .then((res) => res.json())
//     .then((img) => console.log(img));
// };

// getPicture();
