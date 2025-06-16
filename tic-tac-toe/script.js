const boardEl = document.getElementById('game');
const statusEl = document.getElementById('status');
const qWinsEl = document.getElementById('q-wins');
const rWinsEl = document.getElementById('random-wins');
const drawsEl = document.getElementById('draws');
const startBtn = document.getElementById('start-stop');
const exportBtn = document.getElementById('export-btn');
const fileInput = document.getElementById('qtable-file');
const loadBtn = document.getElementById('load-qtable');
const ctx = document.getElementById('chart').getContext('2d');
const playAiBtn = document.getElementById('play-ai');

let board;
let currentPlayer;
let gameOver;
let running = false;
let humanPlaying = false;
let qWins = 0;
let rWins = 0;
let draws = 0;
const qTable = {};
// taxa de exploração durante o treinamento
const EPSILON_TRAINING = 0.2;
// exploração desligada ao jogar contra o usuário
const EPSILON_PLAY = 0;
let epsilon = EPSILON_TRAINING;
const alpha = 0.3;
const gamma = 0.9;
const speedInput = document.getElementById('speed');
let stepDelay = Number(speedInput?.value) || 0;
speedInput?.addEventListener('input', () => {
  stepDelay = Number(speedInput.value) || 0;
});

function updateQTableInfo() {
  const infoEl = document.getElementById('qtable-info');
  if (!infoEl) return;
  const states = Object.keys(qTable);
  let totalValues = 0;
  let sum = 0;
  let min = Infinity;
  let max = -Infinity;
  states.forEach(s => {
    qTable[s].forEach(v => {
      totalValues++;
      sum += v;
      if (v < min) min = v;
      if (v > max) max = v;
    });
  });
  const avg = totalValues ? sum / totalValues : 0;
  infoEl.textContent = `Estados: ${states.length}\nValores: ${totalValues}\nMédia: ${avg.toFixed(2)}\nMin: ${min === Infinity ? 0 : min.toFixed(2)}\nMax: ${max === -Infinity ? 0 : max.toFixed(2)}`;
}

function loadQTableFromFile(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      Object.assign(qTable, data);
      const qDisplay = document.getElementById('qtable-display');
      if (qDisplay) {
        qDisplay.textContent = JSON.stringify(qTable, null, 2);
      }
      updateQTableInfo();
    } catch (err) {
      console.error('Erro ao carregar Q-Table', err);
      alert('Arquivo de Q-Table inválido');
    }
  };
  reader.readAsText(file);
}

function exportQTable() {
  const dataStr = 'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(qTable));
  const dl = document.createElement('a');
  dl.setAttribute('href', dataStr);
  dl.setAttribute('download', 'qtable.json');
  dl.click();
}

const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      { label: 'Robo ML', data: [], borderColor: 'blue', fill: false },
      { label: 'Robo Aleatório', data: [], borderColor: 'red', fill: false }
    ]
  },
  options: {
    animation: false,
    scales: { y: { beginAtZero: true } }
  }
});

function getState(b) {
  return b.map(v => v || '-').join('');
}

function emptyIndices(b) {
  const res = [];
  for (let i = 0; i < b.length; i++) if (!b[i]) res.push(i);
  return res;
}

function randomMove(b) {
  const empty = emptyIndices(b);
  return empty[Math.floor(Math.random() * empty.length)];
}

function chooseQMove(b) {
  const state = getState(b);
  if (!qTable[state]) qTable[state] = Array(9).fill(0);
  if (Math.random() < epsilon) return randomMove(b);
  const moves = emptyIndices(b);
  let best = moves[0];
  let bestVal = -Infinity;
  moves.forEach(i => {
    const val = qTable[state][i] || 0;
    if (val > bestVal) { bestVal = val; best = i; }
  });
  return best;
}

function makeMove(idx, player) {
  board[idx] = player;
}

function checkWin(player) {
  const c = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return c.some(combo => combo.every(i => board[i] === player));
}

function renderBoard(onClick) {
  boardEl.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = board[i] || '';
    if (onClick) cell.addEventListener('click', () => onClick(i));
    boardEl.appendChild(cell);
  }
}

function updateScore(result) {
  if (result === 'q') qWins++;
  else if (result === 'r') rWins++;
  else draws++;
  qWinsEl.textContent = qWins;
  rWinsEl.textContent = rWins;
  drawsEl.textContent = draws;
  chart.data.labels.push(chart.data.labels.length + 1);
  chart.data.datasets[0].data.push(qWins);
  chart.data.datasets[1].data.push(rWins);
  chart.update();
}

function updateQ(states, reward) {
  for (let i = states.length - 1; i >= 0; i--) {
    const { state, action } = states[i];
    if (!qTable[state]) qTable[state] = Array(9).fill(0);
    const nextMax = i < states.length - 1 ? Math.max(...qTable[states[i+1].state]) : 0;
    qTable[state][action] += alpha * (reward + gamma * nextMax - qTable[state][action]);
    reward *= gamma;
  }
  updateQTableInfo();
}

function delay(ms) { return new Promise(res => setTimeout(res, ms)); }

function startHumanGame() {
  // usa somente o conhecimento aprendido para desafiar o jogador
  epsilon = EPSILON_PLAY;
  board = Array(9).fill(null);
  gameOver = false;
  // o agente foi treinado iniciando as partidas, entao ele faz a primeira jogada
  const aiIdx = chooseQMove(board);
  makeMove(aiIdx, 'O');
  renderBoard(handleHumanMove);
  statusEl.textContent = 'Sua vez';
}

async function handleHumanMove(idx) {
  if (gameOver || board[idx]) return;
  makeMove(idx, 'X');
  renderBoard(handleHumanMove);
  if (checkWin('X')) {
    statusEl.textContent = 'Voc\u00ea venceu!';
    gameOver = true;
    humanPlaying = false;
    playAiBtn.textContent = 'Jogar contra Rob\u00f4';
    return;
  }
  if (board.every(Boolean)) {
    statusEl.textContent = 'Empate';
    gameOver = true;
    humanPlaying = false;
    playAiBtn.textContent = 'Jogar contra Rob\u00f4';
    return;
  }
  statusEl.textContent = 'Rob\u00f4 pensando...';
  await delay(stepDelay);
  const aiIdx = chooseQMove(board);
  makeMove(aiIdx, 'O');
  renderBoard(handleHumanMove);
  if (checkWin('O')) {
    statusEl.textContent = 'Rob\u00f4 venceu!';
    gameOver = true;
    humanPlaying = false;
    playAiBtn.textContent = 'Jogar contra Rob\u00f4';
    return;
  }
  if (board.every(Boolean)) {
    statusEl.textContent = 'Empate';
    gameOver = true;
    humanPlaying = false;
    playAiBtn.textContent = 'Jogar contra Rob\u00f4';
    return;
  }
  statusEl.textContent = 'Sua vez';
}

async function playGame() {
  board = Array(9).fill(null);
  currentPlayer = 'O';
  gameOver = false;
  const qStates = [];
  renderBoard();
  while (!gameOver) {
    let idx;
    if (currentPlayer === 'O') {
      const state = getState(board);
      idx = chooseQMove(board);
      qStates.push({ state, action: idx });
      makeMove(idx, 'O');
    } else {
      idx = randomMove(board);
      makeMove(idx, 'X');
    }
    renderBoard();
    if (checkWin(currentPlayer)) {
      gameOver = true;
      break;
    }
    if (board.every(Boolean)) {
      gameOver = true;
      currentPlayer = null;
      break;
    }
    currentPlayer = currentPlayer === 'O' ? 'X' : 'O';
    await delay(stepDelay);
  }
  let result;
  if (checkWin('O')) result = 'q';
  else if (checkWin('X')) result = 'r';
  else result = 'd';
  const reward = result === 'q' ? 1 : result === 'r' ? -1 : 0.5;
  updateQ(qStates, reward);
  updateScore(result);
  await delay(stepDelay);
}

async function trainingLoop() {
  while (running) {
    await playGame();
  }
}

startBtn.addEventListener('click', () => {
  running = !running;
  startBtn.textContent = running ? 'Pausar' : 'Iniciar Treino';
  if (running) {
    // volta a explorar para continuar o aprendizado
    epsilon = EPSILON_TRAINING;
    trainingLoop();
  }
});

exportBtn.addEventListener('click', exportQTable);
loadBtn.addEventListener('click', () => {
  if (fileInput.files.length > 0) {
    loadQTableFromFile(fileInput.files[0]);
  }
});

playAiBtn.addEventListener('click', () => {
  if (running) {
    alert('Pausar o treino antes de jogar.');
    return;
  }
  if (humanPlaying) {
    humanPlaying = false;
    // volta à taxa de exploração usada no treinamento
    epsilon = EPSILON_TRAINING;
    playAiBtn.textContent = 'Jogar contra Rob\u00f4';
    statusEl.textContent = '';
    renderBoard();
  } else {
    // permite ao usuário escolher a Q-Table que será usada na partida
    fileInput.value = '';
    const handler = () => {
      if (fileInput.files.length > 0) {
        loadQTableFromFile(fileInput.files[0]);
        humanPlaying = true;
        playAiBtn.textContent = 'Sair do Jogo';
        startHumanGame();
      }
      fileInput.removeEventListener('change', handler);
    };
    fileInput.addEventListener('change', handler, { once: true });
    fileInput.click();
  }
});

renderBoard();
