const fs = require('fs');
const path = require('path');

const EPSILON = 0.2;
const ALPHA = 0.3;
const GAMMA = 0.9;
const EPISODES = 50000;

const qTable = {};

function getState(board) {
  return board.map(v => v || '-').join('');
}

function emptyIndices(board) {
  const res = [];
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) res.push(i);
  }
  return res;
}

function randomMove(board) {
  const empty = emptyIndices(board);
  return empty[Math.floor(Math.random() * empty.length)];
}

function chooseQMove(board) {
  const state = getState(board);
  if (!qTable[state]) qTable[state] = Array(9).fill(0);
  if (Math.random() < EPSILON) return randomMove(board);
  const moves = emptyIndices(board);
  let best = moves[0];
  let bestVal = -Infinity;
  for (const i of moves) {
    const val = qTable[state][i] || 0;
    if (val > bestVal) {
      bestVal = val;
      best = i;
    }
  }
  return best;
}

function makeMove(board, idx, player) {
  board[idx] = player;
}

function checkWin(board, player) {
  const c = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return c.some(combo => combo.every(i => board[i] === player));
}

function updateQ(states, reward) {
  for (let i = states.length - 1; i >= 0; i--) {
    const { state, action } = states[i];
    if (!qTable[state]) qTable[state] = Array(9).fill(0);
    const nextState = states[i+1]?.state;
    const nextMax = nextState ? Math.max(...(qTable[nextState] || Array(9).fill(0))) : 0;
    qTable[state][action] += ALPHA * (reward + GAMMA * nextMax - qTable[state][action]);
    reward *= GAMMA;
  }
}

function playGame() {
  const board = Array(9).fill(null);
  const qPlayer = Math.random() < 0.5 ? 'O' : 'X';
  const rPlayer = qPlayer === 'O' ? 'X' : 'O';
  let currentPlayer = Math.random() < 0.5 ? 'O' : 'X';
  const qStates = [];
  while (true) {
    let idx;
    if (currentPlayer === qPlayer) {
      const state = getState(board);
      idx = chooseQMove(board);
      qStates.push({ state, action: idx });
    } else {
      idx = randomMove(board);
    }
    makeMove(board, idx, currentPlayer);
    if (checkWin(board, currentPlayer)) break;
    if (board.every(Boolean)) {
      currentPlayer = null;
      break;
    }
    currentPlayer = currentPlayer === 'O' ? 'X' : 'O';
  }
  let result;
  if (currentPlayer === qPlayer) result = 'q';
  else if (currentPlayer === rPlayer) result = 'r';
  else result = 'd';
  const reward = result === 'q' ? 1 : result === 'r' ? -1 : 0.5;
  updateQ(qStates, reward);
}

function train() {
  for (let i = 0; i < EPISODES; i++) {
    playGame();
  }
  const outPath = path.join(__dirname, 'pretrained_qtable.json');
  fs.writeFileSync(outPath, JSON.stringify(qTable));
  console.log('Saved qtable to', outPath);
}

train();
