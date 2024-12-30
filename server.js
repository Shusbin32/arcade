// Import necessary modules
const express = require('express');
const path = require('path');
const app = express();

// Middleware for serving static files
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/sounds', express.static(path.join(__dirname, 'sounds')));
app.use('/games', express.static(path.join(__dirname, 'games')));

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to provide the list of games
app.get('/games', (req, res) => {
  res.json({
    games: [
      { name: 'Tic-Tac-Toe', path: '/games/tic-tac-toe' },
      { name: 'Snake Game', path: '/games/snake' },
      { name: 'Memory Match', path: '/games/memory-match' }
    ]
  });
});

// Route for Tic-Tac-Toe
app.get('/games/tic-tac-toe', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'tic-tac-toe.html'));
});

// Route for Snake Game
app.get('/games/snake', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'snake.html'));
});

// Route for Memory Match
app.get('/games/memory-match', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'memory-match.html'));
});

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
