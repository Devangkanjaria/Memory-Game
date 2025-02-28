const themes = {
  letters: [
    "A",
    "A",
    "B",
    "B",
    "C",
    "C",
    "D",
    "D",
    "E",
    "E",
    "F",
    "F",
    "G",
    "G",
    "H",
    "H",
  ],
  animals: [
    "🐶",
    "🐶",
    "🐱",
    "🐱",
    "🦊",
    "🦊",
    "🐻",
    "🐻",
    "🐸",
    "🐸",
    "🐼",
    "🐼",
    "🐷",
    "🐷",
    "🦁",
    "🦁",
  ],
  emojis: [
    "😀",
    "😀",
    "😂",
    "😂",
    "😍",
    "😍",
    "😎",
    "😎",
    "😜",
    "😜",
    "😱",
    "😱",
    "🥳",
    "🥳",
    "🤯",
    "🤯",
  ],
};

let flippedCards = [];
let matchedCards = [];
let moves = 0;
let timer = 0;
let timerInterval;
let gridSize = 4;
let currentTheme = "letters";

const gameBoard = document.getElementById("game-board");
const timerDisplay = document.getElementById("timer");
const movesDisplay = document.getElementById("moves");
const resetBtn = document.getElementById("reset-btn");
const difficultySelect = document.getElementById("difficulty");
const themeSelect = document.getElementById("theme");
const bestTimeDisplay = document.getElementById("best-time");
const bestMovesDisplay = document.getElementById("best-moves");

// Load best scores
function loadBestScores() {
  bestTimeDisplay.textContent = localStorage.getItem("bestTime") || "--";
  bestMovesDisplay.textContent = localStorage.getItem("bestMoves") || "--";
}

// Shuffle function
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Create a card element
function createCard(value) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.value = value;
  card.addEventListener("click", flipCard);
  return card;
}

// Initialize game
function initGame() {
  let totalCards = gridSize * gridSize;
  let selectedCards = [...themes[currentTheme]];
  selectedCards = selectedCards.slice(0, totalCards / 2);
  selectedCards = [...selectedCards, ...selectedCards];
  shuffle(selectedCards);

  gameBoard.innerHTML = "";
  gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;

  selectedCards.forEach((value) => {
    const card = createCard(value);
    gameBoard.appendChild(card);
  });

  resetGame();
}

// Flip the card
function flipCard() {
  if (
    flippedCards.length < 2 &&
    !flippedCards.includes(this) &&
    !matchedCards.includes(this.dataset.value)
  ) {
    this.classList.add("flipped");
    this.textContent = this.dataset.value;
    gsap.to(this, { rotationY: 180, duration: 0.3 });

    flippedCards.push(this);

    if (flippedCards.length === 2) {
      moves++;
      movesDisplay.textContent = moves;
      checkForMatch();
    }
  }
}

// Check for match
function checkForMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.value === card2.dataset.value) {
    matchedCards.push(card1.dataset.value);
    flippedCards = [];

    if (matchedCards.length === (gridSize * gridSize) / 2) {
      clearInterval(timerInterval);
      if (
        !localStorage.getItem("bestTime") ||
        timer < localStorage.getItem("bestTime")
      ) {
        localStorage.setItem("bestTime", timer);
      }
      if (
        !localStorage.getItem("bestMoves") ||
        moves < localStorage.getItem("bestMoves")
      ) {
        localStorage.setItem("bestMoves", moves);
      }
      loadBestScores();
      alert(`You won in ${timer} seconds with ${moves} moves!`);
    }
  } else {
    setTimeout(() => {
      flippedCards.forEach((card) => {
        card.classList.remove("flipped");
        card.textContent = "";
      });
      flippedCards = [];
    }, 1000);
  }
}

// Reset game
function resetGame() {
  clearInterval(timerInterval);
  timer = 0;
  moves = 0;
  flippedCards = [];
  matchedCards = [];
  timerInterval = setInterval(() => timer++, 1000);
  initGame();
}

// Event listeners
resetBtn.addEventListener("click", resetGame);
difficultySelect.addEventListener("change", () => {
  gridSize = Number(difficultySelect.value);
  resetGame();
});
themeSelect.addEventListener("change", () => {
  currentTheme = themeSelect.value;
  resetGame();
});

loadBestScores();
resetGame();
