const eatSound = new Audio('/sounds/draw.mp3');
const looseSound = new Audio('/sounds/lose.mp3');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;

// Initialize snake and food
let snake = [{ x: 10 * box, y: 10 * box }];
let direction = 'RIGHT';
let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
};

// Initialize scores
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

// Update the score display
function updateScore() {
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('highScore');
    scoreElement.textContent = `Score: ${score}`;
    highScoreElement.textContent = `High Score: ${highScore}`;
}

// Create a game-over overlay
function showGameOver() {
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

    const message = document.createElement('p');
    message.textContent = 'Game Over!';
    message.style.marginBottom = '20px';

    const tryAgainButton = document.createElement('button');
    tryAgainButton.textContent = 'Try Again';
    tryAgainButton.style.padding = '10px 20px';
    tryAgainButton.style.fontSize = '1rem';
    tryAgainButton.style.cursor = 'pointer';
    tryAgainButton.style.border = 'none';
    tryAgainButton.style.borderRadius = '5px';
    tryAgainButton.style.background = 'linear-gradient(135deg, #ff6f61, #ffbd44)';
    tryAgainButton.style.color = 'white';
    tryAgainButton.style.margin = '10px';
    tryAgainButton.addEventListener('click', () => {
        location.reload(); // Reload the page to restart the game
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
        window.location.href = '/'; // Redirect to the homepage URL
    });

    overlay.appendChild(message);
    overlay.appendChild(tryAgainButton);
    overlay.appendChild(homeButton);
    document.body.appendChild(overlay);
}

// Draw the game
function drawGame() {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food with gradient effect
    const foodGradient = ctx.createRadialGradient(
        food.x + box / 2, food.y + box / 2, 2,
        food.x + box / 2, food.y + box / 2, box / 2
    );
    foodGradient.addColorStop(0, 'red');
    foodGradient.addColorStop(1, 'darkred');
    ctx.fillStyle = foodGradient;
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, 2 * Math.PI);
    ctx.fill();

    // Draw snake with rounded edges and gradient
    for (let i = 0; i < snake.length; i++) {
        const segment = snake[i];
        const snakeGradient = ctx.createLinearGradient(
            segment.x, segment.y,
            segment.x + box, segment.y + box
        );
        snakeGradient.addColorStop(0, 'lime');
        snakeGradient.addColorStop(1, 'green');

        ctx.fillStyle = snakeGradient;
        ctx.beginPath();
        ctx.roundRect(segment.x, segment.y, box, box, 5); // Add rounded corners
        ctx.fill();
    }

    // Move snake
    const head = { ...snake[0] };
    if (direction === 'UP') head.y -= box;
    if (direction === 'DOWN') head.y += box;
    if (direction === 'LEFT') head.x -= box;
    if (direction === 'RIGHT') head.x += box;

    // Check collision with walls or itself
    if (
        head.x < 0 || head.y < 0 ||
        head.x >= canvas.width || head.y >= canvas.height ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        looseSound.play(); // Play lose sound
        clearInterval(game); // Stop the game loop

        // Update high score if the current score is higher
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
        }

        showGameOver(); // Show game-over overlay
    }

    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        eatSound.play(); // Play eating sound
        score += 10; // Increase score by 10
        updateScore(); // Update score display
        food = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box,
        };
    } else {
        snake.pop();
    }

    snake.unshift(head);
}

// Change snake direction
function changeDirection(event) {
    if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
}

// Extend CanvasRenderingContext2D to support rounded rectangles
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + width, y, x + width, y + height, radius);
    this.arcTo(x + width, y + height, x, y + height, radius);
    this.arcTo(x, y + height, x, y, radius);
    this.arcTo(x, y, x + width, y, radius);
    this.closePath();
};

// Add score display
const scoreContainer = document.createElement('div');
scoreContainer.id = 'scoreContainer';
scoreContainer.style.position = 'fixed';
scoreContainer.style.top = '10px';
scoreContainer.style.left = '10px';
scoreContainer.style.color = 'black';
scoreContainer.style.fontFamily = 'Arial, sans-serif';
scoreContainer.style.fontSize = '1.5rem';
scoreContainer.innerHTML = `
    <div id="score">Score: ${score}</div>
    <div id="highScore">High Score: ${highScore}</div>
`;
document.body.appendChild(scoreContainer);

// Set up game
document.addEventListener('keydown', changeDirection);
updateScore(); // Initial score update
const game = setInterval(drawGame, 200);
