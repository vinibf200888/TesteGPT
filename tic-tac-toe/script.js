const boardElement = document.getElementById('game');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('reset');

let board;
let currentPlayer;
let gameOver;

function init() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  statusElement.textContent = `Vez de ${currentPlayer}`;
  boardElement.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleMove);
    boardElement.appendChild(cell);
  }
}

function handleMove(e) {
  const idx = e.target.dataset.index;
  if (gameOver || board[idx]) return;

  board[idx] = currentPlayer;
  e.target.textContent = currentPlayer;
  if (checkWin()) {
    statusElement.textContent = `Jogador ${currentPlayer} venceu!`;
    gameOver = true;
    return;
  }
  if (board.every(Boolean)) {
    statusElement.textContent = 'Empate!';
    gameOver = true;
    return;
  }
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusElement.textContent = `Vez de ${currentPlayer}`;
}

function checkWin() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(combo => {
    const [a,b,c] = combo;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

resetButton.addEventListener('click', init);

init();
