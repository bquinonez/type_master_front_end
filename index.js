
let currentPlayer;




const newForm = document.querySelector(".add-player-form")


 //GET GAMES OBJ
  function getGames(){
    fetch("http://localhost:3000/games")
  .then(r => r.json())
  .then((gamesArr) => {
    gamesArr.forEach(turnJSONtoHTML)
  })
  }

  getGames()

function turnJSONtoHTML(gamesObj){
    let reverseBtn = document.createElement("Button");
    let editBtn = document.createElement("Button");
    let deleteBtn = document.createElement("Button");
    editBtn.innerText = 'Edit', deleteBtn.innerText = 'Delete'; 
    reverseBtn.innerText = 'Reverse';
    editBtn.id = `edit-${gamesObj.id}`
    deleteBtn.id = `delete-${gamesObj.id}`
    
    
    editBtn.addEventListener('click', (e) => editName(e, gamesObj))
    deleteBtn.addEventListener('click', deleteGameInstance)
    reverseBtn.addEventListener("click", (e) => reverseButton(e, gamesObj))

    let playersDiv = document.createElement("div")
    playersDiv.className = "card"
    playersDiv.id = `div-${gamesObj.id}`

    playersDiv.innerText = `${gamesObj.player.name}, ${gamesObj.score}`

    
    let main = document.querySelector('.scores')
    playersDiv.append(editBtn, deleteBtn)
    main.append(playersDiv)
}





newForm.addEventListener("submit", (evt) => {
    evt.preventDefault()

    let currentPlayerName = evt.target.name.value
   

    let thePlayerObj = {
      name: currentPlayerName
    }

    evt.target.reset()

    fetch("http://localhost:3000/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(thePlayerObj)
    })
    .then(r => r.json())
    .then(player => currentPlayer = player)
  })


newForm.addEventListener('submit', init);

// Globals

// Available Levels
const levels = {
  easy: 5,
  medium: 3
};

// To change level
const currentLevel = levels.medium;

let time = currentLevel;
let score = 0;
let isPlaying;
let checkStatusInterval;

// DOM Elements
const wordInput = document.querySelector('#word-input');
//Word being shown
const currentWord = document.querySelector('#current-word');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time');
const message = document.querySelector('#message');
const seconds = document.querySelector('#seconds');

const words = [
  'hat',
  'river',
  'lucky',
  'statue',
  'generate',
  'stubborn',
  'cocktail',
  'runaway',
  'joke',
  'developer',
  'establishment',
  'hero',
  'javascript',
  'nutrition',
  'revolver',
  'echo',
  'siblings',
  'investigate',
  'horrendous',
  'symptom',
  'laughter',
  'magic',
  'master',
  'space',
  'definition'
];

// Initialize Game
function init() {
  // Show number of seconds in UI
  seconds.innerHTML = currentLevel;
  // Load word from array
  showWord(words);
  // Start matching on word input
  wordInput.addEventListener('input', startMatch);
  // Call countdown every second
  setInterval(countdown, 1000);

  // Check game status
  checkStatusInterval = setInterval(checkStatus, 50);
}

// Start match
function startMatch() {
  if (matchWords()) {
    isPlaying = true;
    score++;
    console.log(score)
    time = currentLevel + 1;
    showWord(words);
    wordInput.value = '';
  }

  // If score is -1, display 0
  if (score === -1) {
    scoreDisplay.innerHTML = 0;
  } else {
    scoreDisplay.innerHTML = score;
    
  }
}

// Match currentWord to wordInput
function matchWords() {
  if (wordInput.value === currentWord.innerHTML) {
    message.innerHTML = 'Correct!!!';
    return true;
  } else {
    message.innerHTML = '';
    return false;
  }
}

// Pick & show random word
function showWord(words) {
  // Generate random array index
  const randIndex = Math.floor(Math.random() * words.length);
  // Output random word
  currentWord.innerHTML = words[randIndex];
}

// Countdown timer
function countdown() {
  // Make sure time is not run out
  if (time > 0) {
    // Decrement
    time--;
  } else if (time === 0) {
    // Game is over
    isPlaying = false;
  }
  // Show time
  timeDisplay.innerHTML = time;
}

// Check game status
function checkStatus() {
  if (!isPlaying && time === 0) {
    message.innerHTML = 'Game Over!!!';
  
   gameOver()

  }

}  



function gameOver(){
    console.log(currentPlayer)
    console.log(score)
    
   clearInterval(checkStatusInterval)

   fetch("http://localhost:3000/games", {
       method: "POST",
       headers: {
           "Content-Type": "application/json",
           "Accept": "application/json"
       },
       body: JSON.stringify({
           player_id: currentPlayer.id,
           score: score
       })
     })
     .then(r => r.json())
     .then((game) => {
         console.log(game)
        turnJSONtoHTML(game)})


   
}

function editName(evt, gameObj) {

    let buttonId = evt.target.id.slice(5) 
    let card = document.getElementById(`div-${buttonId}`)
    let textImput = document.createElement("input")
    let submitBtn = document.createElement("button") 
    textImput.id = `input-${buttonId}`
    submitBtn.id = `submit-${buttonId}`, submitBtn.innerText = "confirm"

    submitBtn.addEventListener('click', (pls) => editFetch(pls, gameObj))
    card.append(textImput, submitBtn)
    
}

function editFetch(event, gameObj){
    let input = document.getElementById(`input-${event.target.id.slice(7)}`)
    // debugger
    fetch(`http://localhost:3000/players/${gameObj.player_id}`, {
        method: "PATCH",
        body: JSON.stringify({
            name: input.value
        }),
        headers: {
            'Content-Type': 'Application/json',
            'Accept': 'Application/json'
        }
    })
    .then(r=>r.json())
    .then((player) => {
        let games = document.querySelectorAll('.card')
        games.forEach(game => game.remove())
        getGames()
    })
}


// function reverseButton(e, gameObj){
//     var name = gameObj.player.name
//     var r = reverse(name);
//     // console.log(r)

//     fetch (`http://localhost:3000/players/${gameObj.player_id}`,{
//         method: "PATCH",
//         body: JSON.stringify({
//             name: r
//         }),
//         headers: {
//             'Content-Type': 'Application/json',
//             'Accept': 'Application/json'
//         }
//     })
//     .then(r=>r.json())
//     .then((player) => {
//         let games = document.querySelectorAll('.card')
//         games.forEach(game => game.remove())
//         getGames()
//     } )

    
// }

// function reverse(name){
//     return name.split("").reverse().join("");
// }





function deleteGameInstance(evt) {
    
    let buttonId = evt.target.id.slice(7) 
    
    fetch(`http://localhost:3000/games/${buttonId}`,{
        method: "DELETE"
    })
    .then(r => r.json())
    .then((game) => {
        let deletedGame = document.getElementById(`div-${game.id}`)
        deletedGame.remove()
    })

}



































