let currentPlayer = 'X';
let nextBoardIndex = null; // Keeps track of the next board index
let gameWon = false; // Flag to track if the game is complete
const cells = document.querySelectorAll('.cell');
const boardState = Array(9).fill(null).map(() => Array(9).fill(''));
const boardWinners = Array(9).fill(null); // Track overall board status: false for ongoing, 'X', 'O', or 'draw' for completed
const allowedBoards = Array(9).fill(true); // Track if board can be selected

document.addEventListener('DOMContentLoaded', () => {
    initializeBoards();
    highlightAllowedBoards();
    updateCurrentPlayerDisplay();
    document.getElementById('reset-button').addEventListener('click', resetGame);
});

// Initialize boards by adding cells programmatically
function initializeBoards() {
    const boardContainers = document.querySelectorAll('.board-container');
    boardContainers.forEach((board, index) => {
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.boardIndex = index;
            cell.dataset.cellIndex = i;
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
    });
}

// Handle cell click event
function handleCellClick(event) {
    if (gameWon) return; // No actions if game is already won

    const cell = event.target;
    const boardIndex = parseInt(cell.dataset.boardIndex);
    const cellIndex = parseInt(cell.dataset.cellIndex);
    
    if (!isMoveAllowed(boardIndex, cellIndex)) return;

    cell.textContent = currentPlayer;
    boardState[boardIndex][cellIndex] = currentPlayer;

    if (checkWin(boardIndex)) {
        markBoardAsWon(boardIndex);
        boardWinners[boardIndex] = currentPlayer;

        if (checkOverallWin()) {
            gameWon = true;
            setTimeout(() => alert(`Player ${currentPlayer} wins the game!`), 10); // 10ms delay to allow DOM update
            highlightAllowedBoards(); // Clear highlights
            return;
        }
    } else if (isBoardFull(boardIndex)) {
        markBoardAsDrawn(boardIndex);
        boardWinners[boardIndex] = 'draw';
    }

    const nextBoardRow = Math.floor(cellIndex / 3);
    const nextBoardCol = cellIndex % 3;
    nextBoardIndex = nextBoardRow * 3 + nextBoardCol;

    if (!allowedBoards[nextBoardIndex] || boardWinners[nextBoardIndex]) {
        nextBoardIndex = null; // Allow any board if the intended next board is not allowed, won or drawn
    }

    highlightAllowedBoards();

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateCurrentPlayerDisplay();
}

// Mark a board as won by the current player
function markBoardAsWon(boardIndex) {
    const board = document.getElementById(`board-${boardIndex}`);
    board.innerHTML = `<div class="winner">${currentPlayer}</div>`;
    board.classList.add('won-board');
    allowedBoards[boardIndex] = false;
}

// Mark a board as drawn
function markBoardAsDrawn(boardIndex) {
    const board = document.getElementById(`board-${boardIndex}`);
    board.innerHTML = `<div class="winner"></div>`;
    board.classList.add('won-board');
    allowedBoards[boardIndex] = false;
}

// Determine if a move is allowed
function isMoveAllowed(boardIndex, cellIndex) {
    if (boardState[boardIndex][cellIndex] !== '') return false; // Cell is not empty
    if (boardWinners[boardIndex]) return false; // Board already completed

    if (nextBoardIndex === null) return true; // First move or no restriction

    return boardIndex === nextBoardIndex && allowedBoards[nextBoardIndex];
}

// Highlight the allowed boards
function highlightAllowedBoards() {
    const boardContainers = document.querySelectorAll('.board-container');
    if (gameWon) { // No highlights if game is won
        boardContainers.forEach(board => board.style.borderColor = 'black');
        return;
    }

    boardContainers.forEach((board, index) => {
        if (nextBoardIndex === index) {
            board.style.borderColor = '#e64ec0';
        } else if (nextBoardIndex === null && allowedBoards[index]) {
            board.style.borderColor = '#e64ec0';
        } else {
            board.style.borderColor = 'black';
        }
    });
}

// Update the display for the current player
function updateCurrentPlayerDisplay() {
    document.getElementById('current-player').textContent = currentPlayer;
}

// Reset the game to its initial state
function resetGame() {
    currentPlayer = 'X';
    nextBoardIndex = null;
    gameWon = false;
    for (let i = 0; i < 9; i++) {
        boardState[i] = Array(9).fill('');
        boardWinners[i] = null;
        allowedBoards[i] = true;
    }

    const boardContainers = document.querySelectorAll('.board-container');
    boardContainers.forEach((board, index) => {
        board.innerHTML = '';
        board.classList.remove('won-board');
        board.style.borderColor = 'black'; // Reset border color
    });

    initializeBoards();
    highlightAllowedBoards();
    updateCurrentPlayerDisplay();
}

// Check if a board is full
function isBoardFull(boardIndex) {
    return boardState[boardIndex].every(cell => cell !== '');
}

// Check for a win on a given board
function checkWin(boardIndex) {
    const board = boardState[boardIndex];
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    return winConditions.some(condition => {
        return condition.every(index => {
            return board[index] === currentPlayer;
        });
    });
}

// Check for an overall win on the meta-board
function checkOverallWin() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    return winConditions.some(condition => {
        return condition.every(index => {
            return boardWinners[index] === currentPlayer;
        });
    });
}