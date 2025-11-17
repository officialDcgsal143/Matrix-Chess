const chess = new Chess();
let board = chessboard-1.0.0('board', { draggable: true, position: 'start', onDrop: handleMove });

let timerMode = 'classic';
let whiteTime = 300, blackTime = 300, globalTime = 600;
let turn = 'w';
let interval;

document.getElementById('timerMode').addEventListener('change', e => timerMode = e.target.value);

function handleMove(source, target) {
  const move = chess.move({from: source, to: target, promotion: 'q'});
  if (!move) return 'snapback'; // illegal move
  turn = (turn === 'w') ? 'b' : 'w';
  updateBoard();
}

function updateBoard() {
  board.position(chess.fen());
  if (chess.game_over()) {
    clearInterval(interval);
    document.getElementById('evalBar').style.display = 'none';
  }
}

function startTimers() {
  clearInterval(interval);
  interval = setInterval(() => {
    if (timerMode === 'classic') {
      if (turn === 'w') whiteTime--; else blackTime--;
    } else {
      globalTime--;
    }
    updateTimerDisplay();
    checkTimeout();
  }, 1000);
}

function updateTimerDisplay() {
  if (timerMode === 'classic') {
    document.getElementById('whiteTimer').textContent = formatTime(whiteTime);
    document.getElementById('blackTimer').textContent = formatTime(blackTime);
  } else {
    document.getElementById('whiteTimer').textContent = formatTime(globalTime);
    document.getElementById('blackTimer').textContent = formatTime(globalTime);
  }
}

function checkTimeout() {
  if ((timerMode==='classic' && (whiteTime<=0||blackTime<=0)) || (timerMode==='global' && globalTime<=0)) {
    clearInterval(interval);
    document.getElementById('evalBar').style.display = 'block';
  }
}

function formatTime(t) { 
  const m = Math.floor(t/60).toString().padStart(2,'0'); 
  const s = (t%60).toString().padStart(2,'0'); 
  return `${m}:${s}`; 
}

function resetGame() {
  chess.reset();
  board.start();
  whiteTime = blackTime = 300;
  globalTime = 600;
  document.getElementById('evalBar').style.display = 'none';
  turn = 'w';
  startTimers();
}

startTimers();
