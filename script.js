let currentPlayer = 'X';
let nextBoardIndex = null; // Keeps track of the next board index
const cells = document.querySelectorAll('.cell');
const boardState = Array(9).fill(null).map(() => Array(9).fill(''));
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
        alert(`Player ${currentPlayer} wins board ${boardIndex}`);
        allowedBoards[boardIndex] = false;
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

// Determine if a move is allowed
function isMoveAllowed(boardIndex, cellIndex) {
    if (boardState[boardIndex][cellIndex] !== '') return false; // Cell is not empty

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