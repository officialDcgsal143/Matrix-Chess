// Chess & Board Setup
const chess = new Chess();
const board = Chessboard('board', {
  draggable: true,
  position: 'start',
  onDrop: handleMove
});

let whiteTime = 300; // 5 min
let blackTime = 300;
let timerInterval = null;
let currentTimerMode = null; // 'global' or 'classic'

// Timer display elements
const whiteTimerEl = document.getElementById('white-timer');
const blackTimerEl = document.getElementById('black-timer');
const evalBarContainer = document.getElementById('eval-bar-container');
const evalBar = document.getElementById('eval-bar');

// Move handler
function handleMove(source, target) {
  const move = chess.move({ from: source, to: target, promotion: 'q' });
  if (move === null) return 'snapback';

  updateTimers();  
  checkGameOver();
}

// Update board after piece snap
board.onSnapEnd = function() {
  board.position(chess.fen());
}

// Convert seconds to MM:SS
function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Start global timer
document.getElementById('start-global').onclick = () => startTimer('global');
// Start classic timer
document.getElementById('start-classic').onclick = () => startTimer('classic');

function startTimer(mode) {
  if(timerInterval) clearInterval(timerInterval);
  currentTimerMode = mode;

  timerInterval = setInterval(() => {
    if(mode === 'global') {
      whiteTime--; blackTime--;
    } else {
      if(chess.turn() === 'w') whiteTime--; 
      else blackTime--;
    }

    updateTimers();
    checkTimeOut();
  }, 1000);
}

function updateTimers() {
  whiteTimerEl.textContent = formatTime(whiteTime);
  blackTimerEl.textContent = formatTime(blackTime);
}

// Check if time ran out
function checkTimeOut() {
  if(whiteTime <= 0 || blackTime <= 0) {
    clearInterval(timerInterval);
    showEvalBar();
  }
}

// Game over checker
function checkGameOver() {
  if(chess.game_over()) {
    clearInterval(timerInterval);
    alert(chess.in_checkmate() ? `${chess.turn() === 'w' ? 'Black' : 'White'} wins by checkmate!` : 'Draw!');
    // eval bar not shown if game ended normally
  }
}

// Eval bar after timeout
function showEvalBar() {
  evalBarContainer.style.display = 'block';
  // Basic eval: more material = more % green
  const score = evaluatePosition();
  evalBar.style.width = `${Math.min(Math.max(score, 0), 100)}%`;
}

// Simple material evaluation (post-game or timeout)
function evaluatePosition() {
  const values = { p:1, n:3, b:3, r:5, q:9, k:0 };
  let whiteScore = 0, blackScore = 0;
  chess.board().forEach(row => {
    row.forEach(piece => {
      if(piece){
        const val = values[piece.type];
        if(piece.color === 'w') whiteScore += val;
        else blackScore += val;
      }
    });
  });
  return (whiteScore / (whiteScore + blackScore)) * 100;
}
