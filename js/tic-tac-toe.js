const clickSound = new Audio('/sounds/click.mp3');
const winSound = new Audio('/sounds/win.mp3');
const drawSound = new Audio('/sounds/draw.mp3');

const board = document.getElementById('board');
let currentPlayer = 'X';
let gameState = Array(9).fill(null);

// Renders the game board
function renderBoard() {
    board.innerHTML = '';
    gameState.forEach((cell, index) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        cellDiv.textContent = cell;
        cellDiv.addEventListener('click', () => handleMove(index));
        board.appendChild(cellDiv);
    });
}

// Handles player move
function handleMove(index) {
    if (!gameState[index] && currentPlayer === 'X') {
        gameState[index] = 'X';
        clickSound.play(); // Play click sound on move
        renderBoard();
        if (!checkWinner()) {
            currentPlayer = 'O';
            setTimeout(computerMove, 500); // Delay to simulate thinking
        }
    }
}

// Computer move logic
function computerMove() {
    const emptyCells = gameState
        .map((cell, index) => (cell === null ? index : null))
        .filter(index => index !== null);

    if (emptyCells.length > 0) {
        const move = findBestMove();
        gameState[move] = 'O';
        clickSound.play(); // Play click sound for computer move
        renderBoard();
        if (!checkWinner()) {
            currentPlayer = 'X';
        }
    }
}

// Finds the best move for the computer
function findBestMove() {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];

    for (let [a, b, c] of winningCombos) {
        if (gameState[a] === 'O' && gameState[b] === 'O' && !gameState[c]) return c;
        if (gameState[a] === 'O' && gameState[c] === 'O' && !gameState[b]) return b;
        if (gameState[b] === 'O' && gameState[c] === 'O' && !gameState[a]) return a;
        if (gameState[a] === 'X' && gameState[b] === 'X' && !gameState[c]) return c;
        if (gameState[a] === 'X' && gameState[c] === 'X' && !gameState[b]) return b;
        if (gameState[b] === 'X' && gameState[c] === 'X' && !gameState[a]) return a;
    }

    const emptyCells = gameState
        .map((cell, index) => (cell === null ? index : null))
        .filter(index => index !== null);

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Checks for a winner
function checkWinner() {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            winSound.play(); // Play win sound
            const winner = gameState[a];
            if (winner === 'X') {
                showGameOver('You Win!');
            } else {
                showGameOver('You Lose!');
            }
            return true;
        }
    }

    if (!gameState.includes(null)) {
        drawSound.play(); // Play draw sound
        showGameOver(`It's a Draw!`);
        return true;
    }

    return false;
}

// Displays the game-over overlay
function showGameOver(message) {
    const overlay = document.createElement('div');
    overlay.id = 'gameOverOverlay';
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.color = 'white';
    overlay.style.fontFamily = 'Arial, sans-serif';
    overlay.style.fontSize = '2rem';
    overlay.style.zIndex = 1000;

    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.style.marginBottom = '20px';

    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart Game';
    restartButton.style.padding = '10px 20px';
    restartButton.style.fontSize = '1rem';
    restartButton.style.cursor = 'pointer';
    restartButton.style.border = 'none';
    restartButton.style.borderRadius = '5px';
    restartButton.style.background = 'linear-gradient(135deg, #ff6f61, #ffbd44)';
    restartButton.style.color = 'white';
    restartButton.style.margin = '10px';
    restartButton.addEventListener('click', () => {
        overlay.remove();
        resetGame();
    });

    const homeButton = document.createElement('button');
    homeButton.textContent = 'Go to Home Page';
    homeButton.style.padding = '10px 20px';
    homeButton.style.fontSize = '1rem';
    homeButton.style.cursor = 'pointer';
    homeButton.style.border = 'none';
    homeButton.style.borderRadius = '5px';
    homeButton.style.background = 'linear-gradient(135deg, #ff6f61, #ffbd44)';
    homeButton.style.color = 'white';
    homeButton.style.margin = '10px';
    homeButton.addEventListener('click', () => {
        window.location.href = '/'; // Redirect to homepage URL
    });

    overlay.appendChild(messageElement);
    overlay.appendChild(restartButton);
    overlay.appendChild(homeButton);
    document.body.appendChild(overlay);
}

// Resets the game
function resetGame() {
    gameState = Array(9).fill(null);
    currentPlayer = 'X';
    renderBoard();
}

renderBoard();
