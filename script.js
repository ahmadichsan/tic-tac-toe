const board = document.getElementById('board');
const turnIndicator = document.getElementById('turn-indicator');
const currentPlayerEl = document.getElementById('current-player');
let currentPlayer = 'X';
let boardState = Array(9).fill(null);
let gameActive = true;

// Create and render the board tiles
function createTile(index) {
    const tile = document.createElement('div');
    tile.classList.add('tile', 'w-20', 'h-20', 'flex', 'items-center', 'justify-center', 'border', 'border-gray-400', 'text-3xl', 'font-bold', 'rounded-full');
    tile.setAttribute('data-index', index);

    // Apply hover class based on the current player if the tile is empty
    if (boardState[index] === null && gameActive) {
        tile.classList.add(currentPlayer === 'X' ? 'hover-x' : 'hover-o');
    }

    tile.addEventListener('click', () => handleTileClick(index));
    board.appendChild(tile);
    return tile;
}

// Handle the tile click by the current player
function handleTileClick(index) {
    if (!gameActive || boardState[index] !== null) return;

    boardState[index] = currentPlayer;
    renderBoard();
    checkWinner();

    // Switch the turn to the other player if the game is still active
    if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateTurnIndicator();
        renderBoard(); // Re-render to update hover classes for the new turn
    }
}

// Render the board with the current state
function renderBoard() {
    board.innerHTML = ''; // Clear the board before re-rendering
    boardState.forEach((value, index) => {
        const tile = createTile(index);
        if (value) {
            tile.textContent = value;
            tile.style.color = value === 'X' ? 'red' : '#00e5ff';
            tile.classList.add('disabled');
        }

        // Set cursor to default if the game is not active
        if (!gameActive) {
            tile.classList.add('disabled');
            tile.style.cursor = 'default';
        }
    });
}

function fireWorkConfetti() {
    var duration = 5 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
}

function schoolPrideConfetti() {
    var end = Date.now() + (5 * 1000);

    // go Buckeyes!
    var colors = ['#bb0000', '#ffffff'];

    (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

function launchConfetti() {
    schoolPrideConfetti();
    fireWorkConfetti();
}

// Update the turn indicator display
function updateTurnIndicator() {
    currentPlayerEl.textContent = currentPlayer;
    currentPlayerEl.style.color = currentPlayer === 'X' ? 'red' : '#00e5ff'; // Use bright cyan for better contrast
    currentPlayerEl.style.fontWeight = 'bold';
    turnIndicator.textContent = `Current turn: `;
    turnIndicator.appendChild(currentPlayerEl);
}

// Check for a winner or a draw
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            gameActive = false;
            const winner = boardState[a];

            // Create a styled winner element
            const winnerEl = document.createElement('span');
            winnerEl.textContent = winner;
            winnerEl.style.color = winner === 'X' ? 'red' : '#00e5ff'; // Bright cyan for better contrast
            winnerEl.style.fontWeight = 'bold';

            // Highlight winning combination
            combo.forEach(index => {
                const tile = document.querySelector(`.tile[data-index='${index}']`);
                if (tile) {
                    tile.classList.add('highlight');
                }
            });

            // Update the turnIndicator to show the winner with the colored element
            turnIndicator.textContent = 'Winner: ';
            turnIndicator.appendChild(winnerEl);

            // Launch confetti animation
            launchConfetti();

            return; // Exit the function after highlighting and showing the winner
        }
    }

    // Check for a draw
    if (!boardState.includes(null)) {
        gameActive = false;
        turnIndicator.textContent = 'Draw!';
        turnIndicator.style.color = '#ffffff'; // Set color for draw text to white
    }
}

// Restart the game to initial state
function restartGame() {
    boardState = Array(9).fill(null);
    gameActive = true;
    currentPlayer = 'X';
    updateTurnIndicator(); // Ensure the turn indicator is updated
    renderBoard();
}

// Initialize the board on page load
boardState.forEach((_, index) => createTile(index));
