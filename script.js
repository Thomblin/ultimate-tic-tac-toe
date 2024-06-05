let currentPlayer = 'X';
let nextBoardIndex = null; // Keeps track of the next board index
const cells = document.querySelectorAll('.cell');
const boardState = Array(9).fill(null).map(() => Array(9).fill(''));
const boardWinners = Array(9).fill(null); // Track overall board winners
const allowedBoards = Array(9).fill(true); // Track if board can be selected

document.addEventListener('DOMContentLoaded', () => {
    initializeBoards();
    highlightAllowedBoards();
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
            setTimeout(() => alert(`Player ${currentPlayer} wins the game!`), 10); // 10ms delay to allow DOM update
            return;
        }
    }

    const nextBoardRow = Math.floor(cellIndex / 3);
    const nextBoardCol = cellIndex % 3;
    nextBoardIndex = nextBoardRow * 3 + nextBoardCol;

    if (!allowedBoards[nextBoardIndex] || isBoardFull(nextBoardIndex)) {
        nextBoardIndex = null; // Allow any board if the intended next board is not allowed or is full
    }

    highlightAllowedBoards();

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Mark a board as won by the current player
function markBoardAsWon(boardIndex) {
    const board = document.getElementById(`board-${boardIndex}`);
    board.innerHTML = `<div class="winner">${currentPlayer}</div>`;
    allowedBoards[boardIndex] = false;
}

// Determine if a move is allowed
function isMoveAllowed(boardIndex, cellIndex) {
    if (boardState[boardIndex][cellIndex] !== '') return false; // Cell is not empty
    if (boardWinners[boardIndex]) return false; // Board already won

    if (nextBoardIndex === null) return true; // First move or no restriction

    return boardIndex === nextBoardIndex && allowedBoards[nextBoardIndex];
}

// Highlight the allowed boards
function highlightAllowedBoards() {
    const boardContainers = document.querySelectorAll('.board-container');
    boardContainers.forEach((board, index) => {
        if (nextBoardIndex === index) {
            board.style.borderColor = 'red';
        } else if (nextBoardIndex === null && allowedBoards[index]) {
            board.style.borderColor = 'red';
        } else {
            board.style.borderColor = 'black';
        }
    });
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