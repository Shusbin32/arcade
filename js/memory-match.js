const matchSound = new Audio('/sounds/win.mp3'); // Sound when all cards match
const looseSound = new Audio('/sounds/matno.mp3'); // Sound when cards don't match

const gameContainer = document.getElementById('game-container');
const messageContainer = document.getElementById('message-container'); // Add a container for messages
const timerContainer = document.getElementById('timer-container'); // Timer display container
const bestTimeContainer = document.getElementById('best-time'); // Best time display container
const cards = [
    '🍎', '🍌', '🍇', '🍓', '🍍', '🍒',
    '🍎', '🍌', '🍇', '🍓', '🍍', '🍒'
];

let flippedCards = [];
let matchedCards = [];
let startTime = 0; // To store the start time
let bestTime = localStorage.getItem('bestTime') || 0; // Get best time from localStorage or set to 0 if not present
let timerInterval;

// Display the best time on the screen in mm:ss format
function displayBestTime() {
    const minutes = Math.floor(bestTime / 60);
    const seconds = bestTime % 60;
    bestTimeContainer.textContent = `Best Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
    const shuffledCards = shuffle(cards);
    shuffledCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;
        cardElement.dataset.value = card;
        cardElement.innerHTML = '<div class="front"></div><div class="back">' + card + '</div>';
        cardElement.addEventListener('click', flipCard);
        gameContainer.appendChild(cardElement);
    });

    startTime = Date.now(); // Start the timer when the board is created
    timerInterval = setInterval(updateTimer, 1000); // Update the timer every second
}

function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    timerContainer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function flipCard(event) {
    const card = event.currentTarget;
    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
        matchedCards.push(card1, card2);
        flippedCards = [];
        matchSound.play(); // Play win sound when cards match

        if (matchedCards.length === cards.length) {
            const timeTaken = Math.floor((Date.now() - startTime) / 1000); // Calculate time taken in seconds
            if (timeTaken < bestTime || bestTime === 0) {
                bestTime = timeTaken;
                localStorage.setItem('bestTime', bestTime); // Save new best time to localStorage
            }

            clearInterval(timerInterval); // Stop the timer
            const minutes = Math.floor(timeTaken / 60);
            const seconds = timeTaken % 60;

            setTimeout(() => {
                messageContainer.innerHTML = `<p>You Win!</p><p>Time: ${minutes}:${seconds.toString().padStart(2, '0')}</p><button onclick="resetGame()">Play Again</button>`;
                displayBestTime(); // Display best time after the game ends
            }, 500);
        }
    } else {
        looseSound.play(); // Play loose sound when cards don't match
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function resetGame() {
    // Reset the game logic and board
    gameContainer.innerHTML = ''; // Clear the board
    matchedCards = []; // Reset matched cards
    flippedCards = []; // Reset flipped cards
    messageContainer.innerHTML = ''; // Clear any messages
    createBoard(); // Recreate the board
    displayBestTime(); // Display the best time
    timerContainer.textContent = '00:00'; // Reset the timer display
}

createBoard();
displayBestTime(); // Initially display the best time
