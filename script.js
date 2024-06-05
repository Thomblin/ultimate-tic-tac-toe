let currentPlayer = 'X';
const cells = document.querySelectorAll('.cell');
const boardState = Array(9).fill(null).map(() => Array(9).fill(''));

document.addEventListener('DOMContentLoaded', () => {
    initializeBoards();
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
    const boardIndex = cell.dataset.boardIndex;
    const cellIndex = cell.dataset.cellIndex;

    if (boardState[boardIndex][cellIndex] !== '') return;

    cell.textContent = currentPlayer;
    boardState[boardIndex][cellIndex] = currentPlayer;
    if (checkWin(boardIndex)) {
        alert(`Player ${currentPlayer} wins board ${boardIndex}`);
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
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