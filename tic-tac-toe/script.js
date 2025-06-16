const boardEl = document.getElementById('game');
const statusEl = document.getElementById('status');
const qWinsEl = document.getElementById('q-wins');
const rWinsEl = document.getElementById('random-wins');
const drawsEl = document.getElementById('draws');
const playerWinsEl = document.getElementById('player-wins');
const aiWinsPlayerEl = document.getElementById('ai-wins-player');
const playerDrawsEl = document.getElementById('player-draws');
const playAgainBtn = document.getElementById('play-again');
const humanScoreboardEl = document.getElementById('human-scoreboard');
const startBtn = document.getElementById('start-stop');
const exportBtn = document.getElementById('export-btn');
const fileInput = document.getElementById('qtable-file');
const loadBtn = document.getElementById('load-qtable');
const ctx = document.getElementById('chart').getContext('2d');
const playAiBtn = document.getElementById('play-ai');
const tabPlay = document.getElementById('tab-play');
const tabTrain = document.getElementById('tab-train');
const playSection = document.getElementById('play-section');
const trainSection = document.getElementById('train-section');
const toggleSoundBtn = document.getElementById('toggle-sound');

let soundEnabled = true;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioCtx();

function playTone(freq, duration, start = audioCtx.currentTime) {
  if (!soundEnabled) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + duration / 1000);
}

function playTune(notes) {
  if (!soundEnabled) return;
  let time = audioCtx.currentTime;
  notes.forEach(([f, d]) => {
    playTone(f, d, time);
    time += d / 1000;
  });
}

function playWin() {
  playTune([
    [660, 150],
    [880, 150],
    [1047, 300]
  ]);
}

function playLose() {
  playTune([
    [440, 200],
    [330, 200],
    [220, 300]
  ]);
}

function playDraw() {
  playTune([
    [520, 150],
    [440, 150],
    [520, 150]
  ]);
}
function playClick() { playTone(660, 100); }

let board;
let currentPlayer;
let gameOver;
let running = false;
let humanPlaying = false;
let qWins = 0;
let rWins = 0;
let draws = 0;
let playerWins = 0;
let aiWinsPlayer = 0;
let drawsPlayer = 0;
let aiStartsNext = true;
const qTable = {};
// taxa de exploração durante o treinamento
const EPSILON_TRAINING = 0.2;
// pequena exploração ao jogar contra o usuário para variar as jogadas
const EPSILON_PLAY = 0.1;
let epsilon = EPSILON_TRAINING;
const alpha = 0.3;
const gamma = 0.9;
const speedInput = document.getElementById('speed');
let stepDelay = Number(speedInput?.value) || 0;
speedInput?.addEventListener('input', () => {
  stepDelay = Number(speedInput.value) || 0;
});
const speedMultiplierInput = document.getElementById('speed-multiplier');
const speedValueEl = document.getElementById('speed-value');
let speedMultiplier = Number(speedMultiplierInput?.value) || 1;
if (speedValueEl) speedValueEl.textContent = `${speedMultiplier}x`;
speedMultiplierInput?.addEventListener('input', () => {
  speedMultiplier = Number(speedMultiplierInput.value) || 1;
  if (speedValueEl) speedValueEl.textContent = `${speedMultiplier}x`;
});
const fastInput = document.getElementById('fast-mode');
let fastMode = fastInput?.checked || false;
fastInput?.addEventListener('change', () => {
  fastMode = fastInput.checked;
  if (!fastMode) {
    // update board and scoreboard when leaving turbo mode
    renderBoard();
    qWinsEl.textContent = qWins;
    rWinsEl.textContent = rWins;
    drawsEl.textContent = draws;
    chart.update();
    updateQTableInfo();
  }
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
  return new Promise((resolve, reject) => {
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
        resolve();
      } catch (err) {
        console.error('Erro ao carregar Q-Table', err);
        alert('Arquivo de Q-Table inválido');
        reject(err);
      }
    };
    reader.onerror = err => reject(err);
    reader.readAsText(file);
  });
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

const ORIENTATIONS = [
  [0,1,2,3,4,5,6,7,8],
  [6,3,0,7,4,1,8,5,2],
  [8,7,6,5,4,3,2,1,0],
  [2,5,8,1,4,7,0,3,6],
  [2,1,0,5,4,3,8,7,6],
  [6,7,8,3,4,5,0,1,2],
  [0,3,6,1,4,7,2,5,8],
  [8,5,2,7,4,1,6,3,0]
];

function canonicalizeBoard(b) {
  let bestState = null;
  let bestMap = ORIENTATIONS[0];
  for (const map of ORIENTATIONS) {
    const state = map.map(i => b[i] || '-').join('');
    if (bestState === null || state < bestState) {
      bestState = state;
      bestMap = map;
    }
  }
  return { state: bestState, map: bestMap };
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
  const { state, map } = canonicalizeBoard(b);
  if (!qTable[state]) qTable[state] = Array(9).fill(0);
  if (Math.random() < epsilon) return randomMove(b);
  const moves = emptyIndices(b);
  let bestVal = -Infinity;
  let bestMoves = [];
  moves.forEach(i => {
    const canonicalIdx = map.indexOf(i);
    const val = qTable[state][canonicalIdx] || 0;
    if (val > bestVal) {
      bestVal = val;
      bestMoves = [i];
    } else if (val === bestVal) {
      bestMoves.push(i);
    }
  });
  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
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
  if (fastMode && !humanPlaying) return;
  boardEl.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    const mark = board[i];
    cell.textContent = mark || '';
    if (mark) cell.classList.add(mark === 'X' ? 'x' : 'o');
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
  if (!fastMode) chart.update();
}

function updateHumanScore(result) {
  if (result === 'player') playerWins++;
  else if (result === 'ai') aiWinsPlayer++;
  else drawsPlayer++;
  if (playerWinsEl) playerWinsEl.textContent = playerWins;
  if (aiWinsPlayerEl) aiWinsPlayerEl.textContent = aiWinsPlayer;
  if (playerDrawsEl) playerDrawsEl.textContent = drawsPlayer;
}

function updateQ(states, reward) {
  for (let i = states.length - 1; i >= 0; i--) {
    const { state, action } = states[i];
    if (!qTable[state]) qTable[state] = Array(9).fill(0);
    const nextState = i < states.length - 1 ? states[i + 1].state : null;
    const nextMax = nextState && qTable[nextState] ? Math.max(...qTable[nextState]) : 0;
    qTable[state][action] += alpha * (reward + gamma * nextMax - qTable[state][action]);
    reward *= gamma;
  }
  if (!fastMode) updateQTableInfo();
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms / speedMultiplier));
}

function startHumanGame() {
  // usa somente o conhecimento aprendido para desafiar o jogador
  epsilon = EPSILON_PLAY;
  board = Array(9).fill(null);
  gameOver = false;
  humanScoreboardEl.style.display = 'block';
  playAgainBtn.style.display = 'none';
  renderBoard(handleHumanMove);
  if (aiStartsNext) {
    statusEl.textContent = 'Robô pensando...';
    const aiIdx = chooseQMove(board);
    makeMove(aiIdx, 'O');
    renderBoard(handleHumanMove);
    statusEl.textContent = 'Sua vez';
  } else {
    statusEl.textContent = 'Sua vez';
  }
}

async function handleHumanMove(idx) {
  if (gameOver || board[idx]) return;
  playClick();
  makeMove(idx, 'X');
  renderBoard(handleHumanMove);
  if (checkWin('X')) {
    updateHumanScore('player');
    statusEl.textContent = 'Voc\u00ea venceu!';
    playWin();
    gameOver = true;
    playAgainBtn.style.display = 'inline-block';
    aiStartsNext = !aiStartsNext;
    return;
  }
  if (board.every(Boolean)) {
    updateHumanScore('draw');
    statusEl.textContent = 'Empate';
    playDraw();
    gameOver = true;
    playAgainBtn.style.display = 'inline-block';
    aiStartsNext = !aiStartsNext;
    return;
  }
  statusEl.textContent = 'Rob\u00f4 pensando...';
  await delay(stepDelay);
  const aiIdx = chooseQMove(board);
  makeMove(aiIdx, 'O');
  renderBoard(handleHumanMove);
  if (checkWin('O')) {
    updateHumanScore('ai');
    statusEl.textContent = 'Rob\u00f4 venceu!';
    playLose();
    gameOver = true;
    playAgainBtn.style.display = 'inline-block';
    aiStartsNext = !aiStartsNext;
    return;
  }
  if (board.every(Boolean)) {
    updateHumanScore('draw');
    statusEl.textContent = 'Empate';
    playDraw();
    gameOver = true;
    playAgainBtn.style.display = 'inline-block';
    aiStartsNext = !aiStartsNext;
    return;
  }
  statusEl.textContent = 'Sua vez';
}

async function playGame() {
  board = Array(9).fill(null);
  // randomiza quem inicia para treinar a jogar de ambos os lados
  currentPlayer = Math.random() < 0.5 ? 'O' : 'X';
  gameOver = false;
  const qStates = [];
  renderBoard();
  while (!gameOver) {
    let idx;
    if (currentPlayer === 'O') {
      const { state, map } = canonicalizeBoard(board);
      idx = chooseQMove(board);
      const canonicalIdx = map.indexOf(idx);
      qStates.push({ state, action: canonicalIdx });
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
    playAgainBtn.style.display = 'none';
    humanScoreboardEl.style.display = 'none';
  } else {
    // permite ao usuário escolher a Q-Table que será usada na partida
    fileInput.value = '';
    const handler = () => {
      if (fileInput.files.length > 0) {
        loadQTableFromFile(fileInput.files[0])
          .then(() => {
            humanPlaying = true;
            playAiBtn.textContent = 'Sair do Jogo';
            startHumanGame();
          })
          .catch(() => {
            alert('Falha ao carregar Q-Table');
          });
      }
      fileInput.removeEventListener('change', handler);
    };
    fileInput.addEventListener('change', handler, { once: true });
    fileInput.click();
  }
});

playAgainBtn.addEventListener('click', () => {
  if (humanPlaying) {
    startHumanGame();
  }
});

function showPlay() {
  playSection.classList.add('active');
  trainSection.classList.remove('active');
  boardEl.style.display = 'grid';
  statusEl.style.display = 'block';
  if (running) {
    running = false;
    startBtn.textContent = 'Iniciar Treino';
  }
}

function showTrain() {
  trainSection.classList.add('active');
  playSection.classList.remove('active');
  boardEl.style.display = 'grid';
  statusEl.style.display = 'block';
  if (humanPlaying) {
    humanPlaying = false;
    epsilon = EPSILON_TRAINING;
    playAiBtn.textContent = 'Jogar contra Rob\u00f4';
    statusEl.textContent = '';
    renderBoard();
    playAgainBtn.style.display = 'none';
    humanScoreboardEl.style.display = 'none';
  }
}

tabPlay.addEventListener('click', showPlay);
tabTrain.addEventListener('click', showTrain);

toggleSoundBtn.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  toggleSoundBtn.textContent = soundEnabled ? '🔊' : '🔈';
});
