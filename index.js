document.addEventListener('DOMContentLoaded', init);

function init() {
    initSearchBar();
}

function initSearchBar() {
    const searchForm = document.querySelector('#search-form');

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        getDefinition(searchForm.querySelector('#word-search').value);
        searchForm.reset();
    });
}

function getDefinition(word) {
    const wordDefList = document.querySelector('#word-def-list');

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(resp => resp.json()) 
    .then(wordInfo => {
        wordDefList.innerHTML = '';
        wordInfo.forEach(word => loadWord(word));
    });
}

function loadWord(wordInfo) {
    console.log('word: ', wordInfo)
    
    console.log('meaingsSrray: ', wordInfo.meanings);
    const meaningsArray = wordInfo.meanings;
    
    const wordValue = document.querySelector('#word-value');

    wordValue.textContent = wordInfo.word;

    const wordDefList = document.querySelector('#word-def-list');

    meaningsArray.forEach(meaning => {
        const partOfSpeech = document.createElement('h4');
        partOfSpeech.textContent = meaning.partOfSpeech
        wordDefList.appendChild(partOfSpeech);
        loadDef(meaning);
    });
    
}

function loadDef(meaning) {
    const wordDefList = document.querySelector('#word-def-list');

    meaning.definitions.forEach(def => {
        const newDef = document.createElement('li');
        newDef.textContent = def.definition;
        console.log('def:', newDef)
        wordDefList.appendChild(newDef);

    })
}