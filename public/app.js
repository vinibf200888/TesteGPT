function showTool(id) {
    document.getElementById('menu').style.display = 'none';
    document.querySelectorAll('.tool').forEach(t => t.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

function showMenu() {
    document.querySelectorAll('.tool').forEach(t => t.style.display = 'none');
    document.getElementById('menu').style.display = 'block';
}

// Calculator
let calcExpr = '';
function calcInput(val) {
    calcExpr += val;
    document.getElementById('calc-display').value = calcExpr;
}

function calculate() {
    try {
        calcExpr = eval(calcExpr).toString();
    } catch {
        calcExpr = '';
    }
    document.getElementById('calc-display').value = calcExpr;
}

function calcClear() {
    calcExpr = '';
    document.getElementById('calc-display').value = '';
}

// Timer
let timerInterval = null;
let timerRemaining = 0;

function startTimer() {
    if (timerInterval) return;
    if (timerRemaining === 0) {
        const mins = parseInt(document.getElementById('timer-minutes').value) || 0;
        const secs = parseInt(document.getElementById('timer-seconds').value) || 0;
        timerRemaining = mins * 60 + secs;
    }
    if (timerRemaining <= 0) return;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timerRemaining--;
        updateTimerDisplay();
        if (timerRemaining <= 0) {
            stopTimer();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    stopTimer();
    timerRemaining = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const h = Math.floor(timerRemaining / 3600);
    const m = Math.floor((timerRemaining % 3600) / 60);
    const s = timerRemaining % 60;
    document.getElementById('timer-display').textContent =
        `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

// Stopwatch
let stopwatchInterval = null;
let stopwatchElapsed = 0;

function startStopwatch() {
    if (stopwatchInterval) return;
    stopwatchInterval = setInterval(() => {
        stopwatchElapsed++;
        updateStopwatchDisplay();
    }, 1000);
}

function stopStopwatch() {
    if (stopwatchInterval) {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
    }
}

function resetStopwatch() {
    stopStopwatch();
    stopwatchElapsed = 0;
    updateStopwatchDisplay();
}

function updateStopwatchDisplay() {
    const h = Math.floor(stopwatchElapsed / 3600);
    const m = Math.floor((stopwatchElapsed % 3600) / 60);
    const s = stopwatchElapsed % 60;
    document.getElementById('stopwatch-display').textContent =
        `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}
