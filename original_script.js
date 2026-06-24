/* =============================================
   SAPNA'S BIRTHDAY WEBSITE - JAVASCRIPT
   ============================================= */

// ===== PARTICLES =====
(function initParticles() {
  const container = document.getElementById('particles-container');
  const colors = ['#ff6b9d','#ffd93d','#9b59b6','#6bcb77','#4d96ff','#ff9843','#c39bd3'];
  const shapes = ['circle','star','heart'];
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 8 + 4;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const dur = Math.random() * 8 + 6;
    const delay = Math.random() * 8;
    p.style.cssText = `width:${size}px;height:${size}px;background:${color};left:${Math.random()*100}%;animation-duration:${dur}s;animation-delay:-${delay}s;`;
    container.appendChild(p);
  }
})();

// ===== CONFETTI =====
(function initConfetti() {
  const c = document.getElementById('confettiContainer');
  const cols = ['#ff6b9d','#ffd93d','#9b59b6','#6bcb77','#4d96ff','#ff9843','#fff'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    const size = Math.random() * 8 + 5;
    const dur = Math.random() * 4 + 3;
    const delay = Math.random() * 6;
    const color = cols[Math.floor(Math.random() * cols.length)];
    p.style.cssText = `left:${Math.random()*100}%;width:${size}px;height:${size}px;background:${color};animation-duration:${dur}s;animation-delay:-${delay}s;border-radius:${Math.random()>0.5?'50%':'2px'};`;
    c.appendChild(p);
  }
})();

// ===== MUSIC =====
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('music-btn');
const musicIcon = document.getElementById('music-icon');
let musicPlaying = false;

function toggleMusic() {
  if (musicPlaying) {
    bgMusic.pause();
    musicIcon.textContent = '🎵';
    musicBtn.classList.remove('playing');
  } else {
    bgMusic.play().catch(() => {});
    musicIcon.textContent = '⏸';
    musicBtn.classList.add('playing');
  }
  musicPlaying = !musicPlaying;
}
// Auto-play on first interaction
document.addEventListener('click', function tryPlay() {
  if (!musicPlaying) {
    bgMusic.play().then(() => {
      musicPlaying = true;
      musicIcon.textContent = '⏸';
      musicBtn.classList.add('playing');
    }).catch(() => {});
  }
  document.removeEventListener('click', tryPlay);
}, { once: true });

// ===== LIGHTBOX =====
const images = ['1.jpeg','2.jpeg','3.jpeg','4.jpeg','5.jpeg','6.jpeg','7.jpeg','8.jpeg','9.jpeg','10.jpeg','11.jpeg'];
let currentLightbox = 0;

function openLightbox(src) {
  currentLightbox = images.indexOf(src);
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
function changeLightbox(dir) {
  currentLightbox = (currentLightbox + dir + images.length) % images.length;
  document.getElementById('lightbox-img').src = images[currentLightbox];
}

// ===== GAME SWITCHER =====
function switchGame(game) {
  document.querySelectorAll('.game-container').forEach(g => g.classList.remove('active-game'));
  document.querySelectorAll('.game-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('game-' + game).classList.add('active-game');
  document.getElementById('tab-' + game).classList.add('active');
}

// ===== WISHES =====
function addWish() {
  const input = document.getElementById('wish-input');
  const text = input.value.trim();
  if (!text) return;
  const emojis = ['🌸','💕','🎂','✨','💖','🌺','🎀','💫','🌷','💝','🎉','🥳'];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  const bubble = document.createElement('div');
  bubble.className = 'wish-bubble';
  bubble.textContent = emoji + ' ' + text;
  document.getElementById('wishes-list').appendChild(bubble);
  input.value = '';
  bubble.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
document.getElementById('wish-input').addEventListener('keydown', e => { if (e.key === 'Enter') addWish(); });

// =============================================
//  CANDY CRUSH CLONE
// =============================================

const CANDY_COLS = 8;
const CANDY_ROWS = 8;
const CANDY_TYPES = 6;
const CANDY_COLORS = ['#ff6b9d','#ffd93d','#6bcb77','#4d96ff','#ff9843','#c39bd3'];
const CANDY_EMOJIS = ['🍒','🍋','🍀','💎','🍊','🍇'];

let candyBoard = [];
let candyScore = 0;
let candyMoves = 30;
let candyLevel = 1;
let candyTarget = 500;
let candySelected = null;
let candyAnimating = false;
let candyCanvas, candyCtx, candyCellSize;

function initCandyGame() {
  candyCanvas = document.getElementById('candy-board');
  candyCtx = candyCanvas.getContext('2d');
  
  // Resize canvas to square based on container
  const wrap = document.getElementById('candy-board-wrap');
  const size = Math.min(wrap.clientWidth - 8, 340);
  candyCanvas.width = size;
  candyCanvas.height = size;
  candyCellSize = size / CANDY_COLS;

  candyScore = 0;
  candyMoves = 30;
  candySelected = null;
  candyAnimating = false;
  
  updateCandyUI();
  generateBoard();
  renderCandy();
  setMsg('candy', '');
  
  candyCanvas.removeEventListener('touchstart', candyTouchStart);
  candyCanvas.removeEventListener('click', candyClick);
  candyCanvas.addEventListener('click', candyClick);
  candyCanvas.addEventListener('touchstart', candyTouchStart, { passive: false });
}

function generateBoard() {
  do {
    candyBoard = [];
    for (let r = 0; r < CANDY_ROWS; r++) {
      candyBoard[r] = [];
      for (let c = 0; c < CANDY_COLS; c++) {
        let t;
        do { t = Math.floor(Math.random() * CANDY_TYPES); }
        while (
          (c >= 2 && candyBoard[r][c-1] === t && candyBoard[r][c-2] === t) ||
          (r >= 2 && candyBoard[r-1][c] === t && candyBoard[r-2][c] === t)
        );
        candyBoard[r][c] = t;
      }
    }
  } while (findCandyMatches().length === 0 && !hasMoves());
}

function hasMoves() {
  for (let r = 0; r < CANDY_ROWS; r++) {
    for (let c = 0; c < CANDY_COLS; c++) {
      if (c < CANDY_COLS - 1) {
        swap(r, c, r, c + 1);
        if (findCandyMatches().length > 0) { swap(r, c, r, c + 1); return true; }
        swap(r, c, r, c + 1);
      }
      if (r < CANDY_ROWS - 1) {
        swap(r, c, r + 1, c);
        if (findCandyMatches().length > 0) { swap(r, c, r + 1, c); return true; }
        swap(r, c, r + 1, c);
      }
    }
  }
  return false;
}

function swap(r1, c1, r2, c2) {
  const tmp = candyBoard[r1][c1];
  candyBoard[r1][c1] = candyBoard[r2][c2];
  candyBoard[r2][c2] = tmp;
}

function findCandyMatches() {
  const matched = new Set();
  // Horizontal
  for (let r = 0; r < CANDY_ROWS; r++) {
    for (let c = 0; c < CANDY_COLS - 2; c++) {
      const t = candyBoard[r][c];
      if (t !== -1 && t === candyBoard[r][c+1] && t === candyBoard[r][c+2]) {
        let end = c + 2;
        while (end + 1 < CANDY_COLS && candyBoard[r][end+1] === t) end++;
        for (let k = c; k <= end; k++) matched.add(`${r},${k}`);
      }
    }
  }
  // Vertical
  for (let c = 0; c < CANDY_COLS; c++) {
    for (let r = 0; r < CANDY_ROWS - 2; r++) {
      const t = candyBoard[r][c];
      if (t !== -1 && t === candyBoard[r+1][c] && t === candyBoard[r+2][c]) {
        let end = r + 2;
        while (end + 1 < CANDY_ROWS && candyBoard[end+1][c] === t) end++;
        for (let k = r; k <= end; k++) matched.add(`${k},${c}`);
      }
    }
  }
  return [...matched].map(s => { const [r,c] = s.split(','); return { r: +r, c: +c }; });
}

function renderCandy(highlight) {
  if (!candyCtx) return;
  const cs = candyCellSize;
  candyCtx.clearRect(0, 0, candyCanvas.width, candyCanvas.height);
  
  // Background grid
  for (let r = 0; r < CANDY_ROWS; r++) {
    for (let c = 0; c < CANDY_COLS; c++) {
      const x = c * cs, y = r * cs;
      candyCtx.fillStyle = (r + c) % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)';
      candyCtx.beginPath();
      candyCtx.roundRect(x + 1, y + 1, cs - 2, cs - 2, 8);
      candyCtx.fill();
    }
  }

  for (let r = 0; r < CANDY_ROWS; r++) {
    for (let c = 0; c < CANDY_COLS; c++) {
      const t = candyBoard[r][c];
      if (t === -1) continue;
      const x = c * cs, y = r * cs;
      const isSelected = candySelected && candySelected.r === r && candySelected.c === c;
      const padding = isSelected ? 3 : 6;

      // Candy body
      const grad = candyCtx.createRadialGradient(x + cs * 0.4, y + cs * 0.35, cs * 0.05, x + cs/2, y + cs/2, cs * 0.45);
      grad.addColorStop(0, lightenColor(CANDY_COLORS[t], 40));
      grad.addColorStop(0.5, CANDY_COLORS[t]);
      grad.addColorStop(1, darkenColor(CANDY_COLORS[t], 30));
      candyCtx.fillStyle = grad;
      candyCtx.beginPath();
      candyCtx.roundRect(x + padding, y + padding, cs - padding * 2, cs - padding * 2, cs * 0.2);
      candyCtx.fill();

      // Shine
      candyCtx.fillStyle = 'rgba(255,255,255,0.3)';
      candyCtx.beginPath();
      candyCtx.ellipse(x + cs * 0.38, y + cs * 0.32, cs * 0.12, cs * 0.07, -0.3, 0, Math.PI * 2);
      candyCtx.fill();

      // Selected ring
      if (isSelected) {
        candyCtx.strokeStyle = '#fff';
        candyCtx.lineWidth = 2.5;
        candyCtx.beginPath();
        candyCtx.roundRect(x + 2, y + 2, cs - 4, cs - 4, cs * 0.22);
        candyCtx.stroke();
      }

      // Emoji
      candyCtx.font = `${cs * 0.36}px serif`;
      candyCtx.textAlign = 'center';
      candyCtx.textBaseline = 'middle';
      candyCtx.fillText(CANDY_EMOJIS[t], x + cs / 2, y + cs / 2 + 1);
    }
  }
}

function lightenColor(hex, amount) {
  const r = Math.min(255, parseInt(hex.slice(1,3),16) + amount);
  const g = Math.min(255, parseInt(hex.slice(3,5),16) + amount);
  const b = Math.min(255, parseInt(hex.slice(5,7),16) + amount);
  return `rgb(${r},${g},${b})`;
}
function darkenColor(hex, amount) {
  const r = Math.max(0, parseInt(hex.slice(1,3),16) - amount);
  const g = Math.max(0, parseInt(hex.slice(3,5),16) - amount);
  const b = Math.max(0, parseInt(hex.slice(5,7),16) - amount);
  return `rgb(${r},${g},${b})`;
}

function candyPosFromEvent(e) {
  const rect = candyCanvas.getBoundingClientRect();
  const scaleX = candyCanvas.width / rect.width;
  const scaleY = candyCanvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;
  return { r: Math.floor(y / candyCellSize), c: Math.floor(x / candyCellSize) };
}

function candyTouchStart(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = candyCanvas.getBoundingClientRect();
  const scaleX = candyCanvas.width / rect.width;
  const scaleY = candyCanvas.height / rect.height;
  const x = (touch.clientX - rect.left) * scaleX;
  const y = (touch.clientY - rect.top) * scaleY;
  handleCandyTap(Math.floor(y / candyCellSize), Math.floor(x / candyCellSize));
}

function candyClick(e) {
  const { r, c } = candyPosFromEvent(e);
  handleCandyTap(r, c);
}

function handleCandyTap(r, c) {
  if (candyAnimating) return;
  if (r < 0 || r >= CANDY_ROWS || c < 0 || c >= CANDY_COLS) return;
  if (candyBoard[r][c] === -1) return;

  if (!candySelected) {
    candySelected = { r, c };
    renderCandy();
    return;
  }

  const dr = Math.abs(r - candySelected.r), dc = Math.abs(c - candySelected.c);
  if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
    const sr = candySelected.r, sc = candySelected.c;
    candySelected = null;
    attemptSwap(sr, sc, r, c);
  } else {
    candySelected = { r, c };
    renderCandy();
  }
}

function attemptSwap(r1, c1, r2, c2) {
  candyAnimating = true;
  swap(r1, c1, r2, c2);
  const matches = findCandyMatches();
  if (matches.length === 0) {
    swap(r1, c1, r2, c2);
    candyAnimating = false;
    setMsg('candy', '❌ No match there!');
    setTimeout(() => setMsg('candy', ''), 1200);
    renderCandy();
    return;
  }
  candyMoves--;
  updateCandyUI();
  processCandyMatches();
}

async function processCandyMatches() {
  while (true) {
    const matches = findCandyMatches();
    if (matches.length === 0) break;
    
    // Flash matched cells
    const matchSet = new Set(matches.map(m => `${m.r},${m.c}`));
    await animateMatches(matchSet);
    
    // Remove matched
    let pts = 0;
    matches.forEach(({ r, c }) => { candyBoard[r][c] = -1; pts += 30; });
    candyScore += pts;
    setMsg('candy', `+${pts} pts! 🎉`);
    updateCandyUI();
    renderCandy();
    
    await sleep(150);
    
    // Drop candies
    dropCandies();
    renderCandy();
    await sleep(200);
    
    // Fill from top
    fillCandy();
    renderCandy();
    await sleep(200);
  }
  
  candyAnimating = false;
  setMsg('candy', '');
  
  if (candyScore >= candyTarget) {
    setMsg('candy', `🏆 Level ${candyLevel} complete!`);
    setTimeout(() => {
      candyLevel++;
      candyMoves = 30 + candyLevel * 2;
      candyTarget = 500 * candyLevel;
      updateCandyUI();
      generateBoard();
      renderCandy();
      setMsg('candy', `🎉 Level ${candyLevel}!`);
    }, 1500);
    return;
  }
  
  if (candyMoves <= 0) {
    if (candyScore < candyTarget) {
      setMsg('candy', `😢 Out of moves! Score: ${candyScore}`);
    }
  }
  
  if (!hasMoves() && candyMoves > 0) {
    setMsg('candy', '🔀 No moves left, reshuffling...');
    await sleep(1000);
    generateBoard();
    renderCandy();
    setMsg('candy', '');
  }
}

function animateMatches(matchSet) {
  return new Promise(resolve => {
    let frame = 0;
    const blink = () => {
      const cs = candyCellSize;
      matchSet.forEach(key => {
        const [r, c] = key.split(',').map(Number);
        const x = c * cs, y = r * cs;
        candyCtx.fillStyle = frame % 2 === 0 ? 'rgba(255,255,255,0.9)' : CANDY_COLORS[candyBoard[r][c]] || '#fff';
        candyCtx.beginPath();
        candyCtx.roundRect(x + 2, y + 2, cs - 4, cs - 4, cs * 0.2);
        candyCtx.fill();
        // Burst particles
        for (let i = 0; i < 4; i++) {
          const angle = (Math.PI * 2 / 4) * i;
          const px = x + cs/2 + Math.cos(angle) * (frame * 3);
          const py = y + cs/2 + Math.sin(angle) * (frame * 3);
          candyCtx.fillStyle = `rgba(255,217,61,${1 - frame/6})`;
          candyCtx.beginPath();
          candyCtx.arc(px, py, 4, 0, Math.PI * 2);
          candyCtx.fill();
        }
      });
      frame++;
      if (frame < 6) requestAnimationFrame(blink);
      else resolve();
    };
    blink();
  });
}

function dropCandies() {
  for (let c = 0; c < CANDY_COLS; c++) {
    let writeRow = CANDY_ROWS - 1;
    for (let r = CANDY_ROWS - 1; r >= 0; r--) {
      if (candyBoard[r][c] !== -1) {
        candyBoard[writeRow][c] = candyBoard[r][c];
        if (writeRow !== r) candyBoard[r][c] = -1;
        writeRow--;
      }
    }
    for (let r = writeRow; r >= 0; r--) candyBoard[r][c] = -1;
  }
}

function fillCandy() {
  for (let r = 0; r < CANDY_ROWS; r++) {
    for (let c = 0; c < CANDY_COLS; c++) {
      if (candyBoard[r][c] === -1) {
        candyBoard[r][c] = Math.floor(Math.random() * CANDY_TYPES);
      }
    }
  }
}

function updateCandyUI() {
  document.getElementById('candy-score').textContent = candyScore;
  document.getElementById('candy-moves').textContent = candyMoves;
  document.getElementById('candy-level').textContent = candyLevel;
  document.getElementById('candy-target').textContent = candyTarget;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function setMsg(game, text) {
  document.getElementById(game + '-msg').textContent = text;
}

// =============================================
//  FIND THE CAT GAME
// =============================================

let catCanvas, catCtx;
let catRound = 1;
let catScoreVal = 0;
let catTimer = 30;
let catTimerInterval = null;
let catHints = 3;
let catFoundThisRound = false;

// Cat position (stored as ratio 0-1 of canvas size)
let catX, catY, catR;
let catHintShown = false;

// Each doodle scene is a complex drawing function
const CAT_SCENES = [scene1, scene2, scene3, scene4, scene5, scene6];
let currentSceneIdx = 0;

function initCatGame() {
  catCanvas = document.getElementById('cat-canvas');
  catCtx = catCanvas.getContext('2d');
  
  const wrap = document.getElementById('cat-canvas-wrap');
  const w = Math.min(wrap.clientWidth - 8, 320);
  catCanvas.width = w;
  catCanvas.height = Math.round(w * 1.3);

  catHints = 3;
  catFoundThisRound = false;
  catHintShown = false;
  document.getElementById('cat-hints-left').textContent = '3 hints left';
  document.getElementById('cat-found-anim').className = 'cat-found-hidden';
  setMsg('cat', '');
  
  startCatRound();
  
  catCanvas.removeEventListener('click', catClick);
  catCanvas.removeEventListener('touchstart', catTouchHandler);
  catCanvas.addEventListener('click', catClick);
  catCanvas.addEventListener('touchstart', catTouchHandler, { passive: false });
}

function startCatRound() {
  clearInterval(catTimerInterval);
  catFoundThisRound = false;
  catHintShown = false;
  catTimer = Math.max(15, 30 - catRound * 2);
  updateCatUI();
  
  currentSceneIdx = (catRound - 1) % CAT_SCENES.length;
  
  // Place cat randomly in canvas (not too close to edges)
  const margin = 0.12;
  catX = margin + Math.random() * (1 - margin * 2);
  catY = margin + Math.random() * (1 - margin * 2);
  catR = 0.055 + Math.random() * 0.02;  // relative radius
  
  drawCatScene();
  startCatTimer();
}

function drawCatScene() {
  const ctx = catCtx;
  const W = catCanvas.width, H = catCanvas.height;
  ctx.clearRect(0, 0, W, H);
  
  // Background
  ctx.fillStyle = '#f5f0e8';
  ctx.fillRect(0, 0, W, H);
  
  // Draw the doodle scene
  CAT_SCENES[currentSceneIdx](ctx, W, H);
  
  // Draw hidden cat (blended into scene)
  const cx = catX * W, cy = catY * H, cr = catR * Math.min(W, H);
  drawHiddenCat(ctx, cx, cy, cr);
}

function drawHiddenCat(ctx, cx, cy, cr) {
  ctx.save();
  // Cat body - drawn to blend with surroundings
  const bodyColor = '#c8a882'; // tan/cream color similar to doodle
  
  // Body (oval)
  ctx.beginPath();
  ctx.ellipse(cx, cy + cr * 0.4, cr * 0.7, cr * 0.55, 0, 0, Math.PI * 2);
  ctx.fillStyle = bodyColor;
  ctx.fill();
  ctx.strokeStyle = '#a0856a';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Head
  ctx.beginPath();
  ctx.ellipse(cx, cy - cr * 0.1, cr * 0.5, cr * 0.48, 0, 0, Math.PI * 2);
  ctx.fillStyle = bodyColor;
  ctx.fill();
  ctx.strokeStyle = '#a0856a';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Ears
  ctx.fillStyle = bodyColor;
  ctx.strokeStyle = '#a0856a';
  ctx.lineWidth = 1;
  // Left ear
  ctx.beginPath();
  ctx.moveTo(cx - cr * 0.35, cy - cr * 0.45);
  ctx.lineTo(cx - cr * 0.52, cy - cr * 0.9);
  ctx.lineTo(cx - cr * 0.15, cy - cr * 0.5);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Right ear
  ctx.beginPath();
  ctx.moveTo(cx + cr * 0.35, cy - cr * 0.45);
  ctx.lineTo(cx + cr * 0.52, cy - cr * 0.9);
  ctx.lineTo(cx + cr * 0.15, cy - cr * 0.5);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Inner ears (pink)
  ctx.fillStyle = '#ffb3c6';
  ctx.beginPath();
  ctx.moveTo(cx - cr * 0.36, cy - cr * 0.52);
  ctx.lineTo(cx - cr * 0.46, cy - cr * 0.75);
  ctx.lineTo(cx - cr * 0.2, cy - cr * 0.55);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + cr * 0.36, cy - cr * 0.52);
  ctx.lineTo(cx + cr * 0.46, cy - cr * 0.75);
  ctx.lineTo(cx + cr * 0.2, cy - cr * 0.55);
  ctx.closePath(); ctx.fill();

  // Eyes
  ctx.fillStyle = '#5a3825';
  ctx.beginPath(); ctx.ellipse(cx - cr * 0.18, cy - cr * 0.12, cr * 0.1, cr * 0.12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + cr * 0.18, cy - cr * 0.12, cr * 0.1, cr * 0.12, 0, 0, Math.PI * 2); ctx.fill();
  // Eye shine
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.beginPath(); ctx.arc(cx - cr * 0.14, cy - cr * 0.16, cr * 0.04, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + cr * 0.22, cy - cr * 0.16, cr * 0.04, 0, Math.PI * 2); ctx.fill();

  // Nose
  ctx.fillStyle = '#ffb3c6';
  ctx.beginPath(); ctx.arc(cx, cy, cr * 0.07, 0, Math.PI * 2); ctx.fill();

  // Whiskers
  ctx.strokeStyle = '#a0856a';
  ctx.lineWidth = 0.8;
  [[-0.12,-0.35,-0.55,0.02],[-0.12,-0.01,-0.55,0.12],
   [0.12,-0.35, 0.55,0.02],[ 0.12,-0.01, 0.55,0.12]].forEach(([sx,sy,ex,ey]) => {
    ctx.beginPath();
    ctx.moveTo(cx + sx * cr * 2, cy + sy * cr * 2);
    ctx.lineTo(cx + ex * cr * 2, cy + ey * cr * 2);
    ctx.stroke();
  });

  // Tail
  ctx.strokeStyle = '#a0856a';
  ctx.lineWidth = cr * 0.18;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx + cr * 0.6, cy + cr * 0.6);
  ctx.quadraticCurveTo(cx + cr * 1.4, cy + cr * 1.1, cx + cr * 0.9, cy + cr * 0.1);
  ctx.stroke();

  ctx.restore();
}

// ---- DOODLE SCENES ----
function scene1(ctx, W, H) {
  // Garden scene with flowers, butterflies, birds
  ctx.strokeStyle = '#8B7355';
  ctx.lineWidth = 1.5;
  
  // Ground
  ctx.fillStyle = '#c8e6c9'; ctx.fillRect(0, H*0.75, W, H*0.25);
  ctx.fillStyle = '#4caf50';
  for (let x = 0; x < W; x += 12) {
    ctx.beginPath();
    ctx.moveTo(x, H*0.75);
    ctx.quadraticCurveTo(x+4, H*0.72, x+8, H*0.75);
    ctx.fillStyle = '#4caf50';
    ctx.fill();
  }

  // Big tree
  ctx.fillStyle = '#795548';
  ctx.fillRect(W*0.1, H*0.35, W*0.06, H*0.4);
  ctx.fillStyle = '#66bb6a';
  ctx.beginPath(); ctx.arc(W*0.13, H*0.28, W*0.13, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#81c784';
  ctx.beginPath(); ctx.arc(W*0.08, H*0.3, W*0.08, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(W*0.18, H*0.26, W*0.07, 0, Math.PI*2); ctx.fill();

  // Flowers
  const flowers = [
    [W*0.35, H*0.72], [W*0.5, H*0.68], [W*0.65, H*0.72],
    [W*0.78, H*0.70], [W*0.88, H*0.73], [W*0.28, H*0.74]
  ];
  const fColors = ['#ff6b9d','#ffd93d','#ff9843','#9b59b6','#4d96ff','#ff6b9d'];
  flowers.forEach(([fx, fy], i) => {
    ctx.strokeStyle = '#4caf50'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx, fy + H*0.06); ctx.stroke();
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2;
      const px = fx + Math.cos(a) * W * 0.03;
      const py = fy + Math.sin(a) * W * 0.03;
      ctx.fillStyle = fColors[i];
      ctx.beginPath(); ctx.ellipse(px, py, W*0.018, W*0.012, a, 0, Math.PI*2); ctx.fill();
    }
    ctx.fillStyle = '#ffd93d';
    ctx.beginPath(); ctx.arc(fx, fy, W*0.018, 0, Math.PI*2); ctx.fill();
  });

  // Butterflies
  drawButterfly(ctx, W*0.55, H*0.2, W*0.04);
  drawButterfly(ctx, W*0.8, H*0.15, W*0.03);
  drawButterfly(ctx, W*0.35, H*0.4, W*0.025);

  // Birds
  drawBird(ctx, W*0.6, H*0.1, W*0.03);
  drawBird(ctx, W*0.72, H*0.08, W*0.025);

  // Sun
  ctx.fillStyle = '#ffd93d';
  ctx.beginPath(); ctx.arc(W*0.85, H*0.1, W*0.07, 0, Math.PI*2); ctx.fill();
  for (let i = 0; i < 8; i++) {
    const a = (i/8)*Math.PI*2;
    ctx.strokeStyle = '#ffd93d'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W*0.85 + Math.cos(a)*W*0.09, H*0.1 + Math.sin(a)*W*0.09);
    ctx.lineTo(W*0.85 + Math.cos(a)*W*0.12, H*0.1 + Math.sin(a)*W*0.12);
    ctx.stroke();
  }

  // Clouds
  drawCloud(ctx, W*0.2, H*0.08, W*0.12);
  drawCloud(ctx, W*0.5, H*0.06, W*0.1);

  // House
  ctx.fillStyle = '#ef9a9a'; ctx.fillRect(W*0.62, H*0.52, W*0.2, H*0.23);
  ctx.fillStyle = '#8B7355';
  ctx.beginPath(); ctx.moveTo(W*0.6, H*0.52); ctx.lineTo(W*0.72, H*0.38); ctx.lineTo(W*0.84, H*0.52); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#64b5f6'; ctx.fillRect(W*0.67, H*0.56, W*0.07, W*0.07);
  ctx.fillStyle = '#795548'; ctx.fillRect(W*0.69, H*0.65, W*0.06, H*0.1);
  ctx.fillStyle = '#ffd93d'; ctx.beginPath(); ctx.arc(W*0.735, H*0.7, 3, 0, Math.PI*2); ctx.fill();

  // Mushrooms
  drawMushroom(ctx, W*0.42, H*0.73, W*0.03);
  drawMushroom(ctx, W*0.92, H*0.72, W*0.025);
}

function scene2(ctx, W, H) {
  // Underwater scene
  ctx.fillStyle = '#1a237e'; ctx.fillRect(0, 0, W, H);
  
  // Water gradient overlay
  const wg = ctx.createLinearGradient(0,0,0,H);
  wg.addColorStop(0, 'rgba(100,181,246,0.4)');
  wg.addColorStop(1, 'rgba(13,71,161,0.6)');
  ctx.fillStyle = wg; ctx.fillRect(0,0,W,H);

  // Bubbles
  for (let i = 0; i < 20; i++) {
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(Math.random()*W, Math.random()*H, 3+Math.random()*8, 0, Math.PI*2);
    ctx.stroke();
  }

  // Seabed
  ctx.fillStyle = '#e8c97a'; ctx.fillRect(0, H*0.8, W, H*0.2);
  // Wavy seabed
  ctx.fillStyle = '#d4a843';
  ctx.beginPath(); ctx.moveTo(0, H*0.78);
  for (let x = 0; x <= W; x += 20) ctx.quadraticCurveTo(x+10, H*0.76, x+20, H*0.78);
  ctx.lineTo(W,H); ctx.lineTo(0,H); ctx.closePath(); ctx.fill();

  // Corals
  drawCoral(ctx, W*0.1, H*0.78, '#ef5350', H*0.15);
  drawCoral(ctx, W*0.25, H*0.8, '#ff9800', H*0.12);
  drawCoral(ctx, W*0.75, H*0.79, '#ab47bc', H*0.14);
  drawCoral(ctx, W*0.88, H*0.78, '#26c6da', H*0.13);

  // Seaweed
  for (let sx of [W*0.35, W*0.5, W*0.62]) {
    ctx.strokeStyle = '#66bb6a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(sx, H*0.8);
    for (let y = H*0.8; y > H*0.45; y -= 20) {
      const wave = Math.sin((H*0.8-y)*0.1)*15;
      ctx.quadraticCurveTo(sx+wave, y-10, sx-wave, y-20);
    }
    ctx.stroke();
  }

  // Fish
  drawFish(ctx, W*0.55, H*0.25, W*0.09, '#ff9843', 1);
  drawFish(ctx, W*0.2, H*0.4, W*0.07, '#ff6b9d', -1);
  drawFish(ctx, W*0.7, H*0.5, W*0.06, '#ffd93d', 1);
  drawFish(ctx, W*0.4, H*0.6, W*0.05, '#9b59b6', -1);
  drawFish(ctx, W*0.85, H*0.3, W*0.08, '#4d96ff', 1);

  // Jellyfish
  drawJellyfish(ctx, W*0.15, H*0.2, W*0.06);
  drawJellyfish(ctx, W*0.75, H*0.15, W*0.05);

  // Starfish
  drawStarfish(ctx, W*0.15, H*0.85, W*0.04);
  drawStarfish(ctx, W*0.6, H*0.87, W*0.035);
  drawStarfish(ctx, W*0.88, H*0.86, W*0.04);

  // Treasure chest
  ctx.fillStyle = '#8B6914'; ctx.fillRect(W*0.4, H*0.82, W*0.12, H*0.08);
  ctx.strokeStyle = '#5D4037'; ctx.lineWidth = 1.5;
  ctx.strokeRect(W*0.4, H*0.82, W*0.12, H*0.08);
  ctx.fillStyle = '#ffd93d'; ctx.fillRect(W*0.44, H*0.85, W*0.04, H*0.025);
}

function scene3(ctx, W, H) {
  // Forest / enchanted woods
  ctx.fillStyle = '#1b5e20'; ctx.fillRect(0,0,W,H);
  const fg = ctx.createLinearGradient(0,0,0,H);
  fg.addColorStop(0,'rgba(46,125,50,0.7)');
  fg.addColorStop(1,'rgba(27,94,32,0.9)');
  ctx.fillStyle=fg; ctx.fillRect(0,0,W,H);

  // Moon
  ctx.fillStyle = '#fff9c4';
  ctx.beginPath(); ctx.arc(W*0.8, H*0.1, W*0.07, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#f0e68c'; ctx.lineWidth = 0;
  for (let s = 0; s < 15; s++) {
    const sx = Math.random()*W, sy = Math.random()*(H*0.5);
    ctx.beginPath(); ctx.arc(sx, sy, 1+Math.random()*2, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,'+( 0.4+Math.random()*0.6)+')';
    ctx.fill();
  }

  // Trees
  const treePositions = [0.05,0.15,0.25,0.35,0.55,0.65,0.78,0.88,0.95];
  treePositions.forEach((tx, i) => {
    const th = H*(0.35 + (i%3)*0.1);
    ctx.fillStyle = '#4e342e';
    ctx.fillRect(W*tx - 5, H - th - H*0.05, 10, th + H*0.05);
    ctx.fillStyle = i%2===0 ? '#2e7d32' : '#388e3c';
    ctx.beginPath(); ctx.arc(W*tx, H-th, W*0.08, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#43a047';
    ctx.beginPath(); ctx.arc(W*(tx-0.02), H-th-W*0.04, W*0.06, 0, Math.PI*2); ctx.fill();
  });

  // Mushrooms on ground
  ctx.fillStyle = '#795548'; ctx.fillRect(0, H*0.85, W, H*0.15);
  drawMushroom(ctx, W*0.3, H*0.85, W*0.045, '#ef5350');
  drawMushroom(ctx, W*0.5, H*0.86, W*0.04, '#ff9800');
  drawMushroom(ctx, W*0.7, H*0.84, W*0.05, '#9b59b6');

  // Fireflies
  for (let f = 0; f < 12; f++) {
    ctx.fillStyle = `rgba(255,235,59,${0.4+Math.random()*0.6})`;
    ctx.beginPath(); ctx.arc(Math.random()*W, H*0.2+Math.random()*H*0.6, 2+Math.random()*3, 0, Math.PI*2); ctx.fill();
  }

  // Owl
  drawOwl(ctx, W*0.45, H*0.38, W*0.05);

  // Fox
  drawFox(ctx, W*0.6, H*0.77, W*0.06);

  // Deer silhouette
  drawDeer(ctx, W*0.2, H*0.7, W*0.07);

  // Fairy
  drawFairy(ctx, W*0.72, H*0.22, W*0.04);
}

function scene4(ctx, W, H) {
  // Busy city street scene
  ctx.fillStyle = '#90a4ae'; ctx.fillRect(0,0,W,H*0.65);
  ctx.fillStyle = '#607d8b'; ctx.fillRect(0,H*0.65,W,H*0.35);

  // Road
  ctx.fillStyle = '#455a64'; ctx.fillRect(0, H*0.7, W, H*0.18);
  ctx.fillStyle = '#ffd93d';
  for (let x = 0; x < W; x += W*0.12) {
    ctx.fillRect(x, H*0.786, W*0.07, H*0.012);
  }

  // Buildings
  const buildings = [
    [0, H*0.05, W*0.18, H*0.7, '#78909c'],
    [W*0.17, H*0.15, W*0.15, H*0.6, '#546e7a'],
    [W*0.31, H*0.08, W*0.13, H*0.67, '#90a4ae'],
    [W*0.43, H*0.2, W*0.12, H*0.55, '#607d8b'],
    [W*0.54, H*0.05, W*0.16, H*0.7, '#78909c'],
    [W*0.69, H*0.12, W*0.14, H*0.63, '#546e7a'],
    [W*0.82, H*0.18, W*0.18, H*0.57, '#90a4ae'],
  ];
  buildings.forEach(([bx,by,bw,bh,bc]) => {
    ctx.fillStyle = bc; ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, bw, bh);
    // Windows
    for (let wy = by + bh*0.08; wy < H*0.65; wy += bh*0.1) {
      for (let wx = bx + bw*0.1; wx < bx+bw-bw*0.1; wx += bw*0.3) {
        ctx.fillStyle = Math.random()>0.3 ? '#ffd93d' : '#37474f';
        ctx.fillRect(wx, wy, bw*0.2, bh*0.06);
      }
    }
  });

  // Street lamps
  [W*0.15, W*0.4, W*0.65, W*0.88].forEach(lx => {
    ctx.strokeStyle = '#37474f'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(lx, H*0.88); ctx.lineTo(lx, H*0.6); ctx.stroke();
    ctx.fillStyle = '#ffd93d';
    ctx.beginPath(); ctx.arc(lx, H*0.6, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(255,217,61,0.15)';
    ctx.beginPath(); ctx.arc(lx, H*0.6, 18, 0, Math.PI*2); ctx.fill();
  });

  // Cars
  drawCar(ctx, W*0.05, H*0.72, W*0.15, '#ef5350', 1);
  drawCar(ctx, W*0.5, H*0.73, W*0.14, '#4d96ff', 1);
  drawCar(ctx, W*0.75, H*0.72, W*0.13, '#ffd93d', -1);

  // People
  drawPerson(ctx, W*0.28, H*0.67, H*0.06);
  drawPerson(ctx, W*0.42, H*0.67, H*0.065);
  drawPerson(ctx, W*0.6, H*0.67, H*0.06);

  // Signs
  ctx.fillStyle = '#ff6b9d'; ctx.fillRect(W*0.35, H*0.3, W*0.1, H*0.04);
  ctx.fillStyle = '#fff'; ctx.font = `${W*0.022}px Poppins,sans-serif`;
  ctx.textAlign = 'center'; ctx.fillText('SALE!', W*0.4, H*0.325);

  // Pigeons on road
  for (let pi = 0; pi < 5; pi++) {
    const px = W*(0.1 + pi*0.18), py = H*0.69;
    ctx.fillStyle = '#90a4ae';
    ctx.beginPath(); ctx.ellipse(px, py, 6, 4, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(px+5, py-3, 3, 0, Math.PI*2); ctx.fill();
  }
}

function scene5(ctx, W, H) {
  // Cozy cafe / bakery interior
  ctx.fillStyle = '#fbe9e7'; ctx.fillRect(0,0,W,H);

  // Walls / floor
  ctx.fillStyle = '#efebe9'; ctx.fillRect(0, 0, W, H*0.75);
  ctx.fillStyle = '#bcaaa4'; ctx.fillRect(0, H*0.75, W, H*0.25);
  // Floor tiles
  ctx.strokeStyle = '#a1887f'; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += W*0.15) ctx.beginPath(), ctx.moveTo(x,H*0.75), ctx.lineTo(x,H), ctx.stroke();
  for (let y = H*0.75; y < H; y += H*0.06) ctx.beginPath(), ctx.moveTo(0,y), ctx.lineTo(W,y), ctx.stroke();

  // Windows
  ctx.fillStyle = '#b3e5fc';
  ctx.fillRect(W*0.1, H*0.05, W*0.3, H*0.25);
  ctx.fillRect(W*0.6, H*0.05, W*0.3, H*0.25);
  ctx.strokeStyle = '#8d6e63'; ctx.lineWidth = 3;
  ctx.strokeRect(W*0.1, H*0.05, W*0.3, H*0.25);
  ctx.strokeRect(W*0.6, H*0.05, W*0.3, H*0.25);
  // Window cross
  ctx.beginPath(); ctx.moveTo(W*0.25,H*0.05); ctx.lineTo(W*0.25,H*0.3); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.1,H*0.175); ctx.lineTo(W*0.4,H*0.175); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.75,H*0.05); ctx.lineTo(W*0.75,H*0.3); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.6,H*0.175); ctx.lineTo(W*0.9,H*0.175); ctx.stroke();

  // Curtains
  ctx.fillStyle = 'rgba(255,107,157,0.4)';
  ctx.beginPath(); ctx.moveTo(W*0.1,H*0.05); ctx.quadraticCurveTo(W*0.16,H*0.15,W*0.22,H*0.05); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(W*0.28,H*0.05); ctx.quadraticCurveTo(W*0.35,H*0.15,W*0.4,H*0.05); ctx.closePath(); ctx.fill();

  // Bookshelf
  ctx.fillStyle = '#8d6e63'; ctx.fillRect(W*0.73, H*0.35, W*0.22, H*0.35);
  const bookColors = ['#ef5350','#4d96ff','#ffd93d','#66bb6a','#9b59b6','#ff9843','#ff6b9d','#4d96ff','#ffd93d'];
  bookColors.forEach((bc, i) => {
    ctx.fillStyle = bc;
    ctx.fillRect(W*0.74 + i*(W*0.02+2), H*0.37, W*0.02, H*0.25);
    ctx.strokeStyle = darkenColor(bc, 30); ctx.lineWidth = 0.5;
    ctx.strokeRect(W*0.74 + i*(W*0.02+2), H*0.37, W*0.02, H*0.25);
  });

  // Table with coffee and cake
  ctx.fillStyle = '#a1887f'; ctx.fillRect(W*0.2, H*0.6, W*0.45, H*0.04);
  ctx.fillStyle = '#8d6e63'; ctx.fillRect(W*0.3, H*0.64, W*0.05, H*0.12);
  ctx.fillRect(W*0.45, H*0.64, W*0.05, H*0.12);
  // Cups
  ctx.fillStyle = '#fff'; ctx.fillRect(W*0.24, H*0.54, W*0.07, H*0.07);
  ctx.strokeStyle = '#8d6e63'; ctx.lineWidth = 1.5; ctx.strokeRect(W*0.24, H*0.54, W*0.07, H*0.07);
  ctx.fillStyle = '#6d4c41'; ctx.fillRect(W*0.25, H*0.55, W*0.05, H*0.04);
  // Cake
  ctx.fillStyle = '#ffcc80'; ctx.fillRect(W*0.48, H*0.52, W*0.1, H*0.09);
  ctx.fillStyle = '#ff6b9d'; ctx.fillRect(W*0.48, H*0.52, W*0.1, H*0.02);
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(W*0.53,H*0.495,4,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#ffd93d'; ctx.fillRect(W*0.525,H*0.46,2,H*0.04);

  // Plants
  drawPlant(ctx, W*0.05, H*0.62, W*0.07);
  drawPlant(ctx, W*0.88, H*0.6, W*0.06);
  
  // Hanging lights
  for (let lx = W*0.1; lx < W; lx += W*0.2) {
    ctx.strokeStyle = '#8d6e63'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, H*0.12); ctx.stroke();
    ctx.fillStyle = '#ffd93d';
    ctx.beginPath(); ctx.arc(lx, H*0.12, 5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(255,217,61,0.2)';
    ctx.beginPath(); ctx.arc(lx, H*0.12, 14, 0, Math.PI*2); ctx.fill();
  }
}

function scene6(ctx, W, H) {
  // Space scene
  ctx.fillStyle = '#0d0520'; ctx.fillRect(0,0,W,H);
  // Stars
  for (let s = 0; s < 80; s++) {
    const sx = Math.random()*W, sy = Math.random()*H;
    const ss = Math.random()*2.5;
    ctx.fillStyle = `rgba(255,255,255,${0.3+Math.random()*0.7})`;
    ctx.beginPath(); ctx.arc(sx,sy,ss,0,Math.PI*2); ctx.fill();
  }
  // Nebula
  const nb = ctx.createRadialGradient(W*0.3,H*0.3,0,W*0.3,H*0.3,W*0.4);
  nb.addColorStop(0,'rgba(155,89,182,0.3)');
  nb.addColorStop(0.5,'rgba(255,107,157,0.15)');
  nb.addColorStop(1,'transparent');
  ctx.fillStyle=nb; ctx.fillRect(0,0,W,H);

  // Planets
  drawPlanet(ctx, W*0.75, H*0.18, W*0.1, '#4d96ff');
  drawPlanet(ctx, W*0.2, H*0.35, W*0.06, '#ff9843');
  drawPlanet(ctx, W*0.85, H*0.55, W*0.05, '#9b59b6');

  // Rocket
  drawRocket(ctx, W*0.5, H*0.25, W*0.06);

  // Astronaut
  drawAstronaut(ctx, W*0.2, H*0.7, W*0.09);

  // Aliens
  drawAlien(ctx, W*0.65, H*0.6, W*0.055, '#6bcb77');
  drawAlien(ctx, W*0.45, H*0.8, W*0.045, '#ff9843');

  // Moon (large)
  ctx.fillStyle = '#e0e0e0';
  ctx.beginPath(); ctx.arc(W*0.5, H*0.88, W*0.18, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#bdbdbd';
  [[-0.04,-0.02],[0.05,0.03],[-0.02,0.05],[0.03,-0.04],[-0.06,0.02]].forEach(([dx,dy]) => {
    ctx.beginPath(); ctx.arc(W*0.5+dx*W, H*0.88+dy*W, W*0.02+Math.random()*W*0.01, 0, Math.PI*2); ctx.fill();
  });

  // Comets
  for (let cm = 0; cm < 3; cm++) {
    const cx2 = W*(0.1+cm*0.3), cy2 = H*(0.05+cm*0.08);
    const grad = ctx.createLinearGradient(cx2-W*0.08,cy2,cx2,cy2);
    grad.addColorStop(0,'rgba(255,255,255,0)');
    grad.addColorStop(1,'rgba(255,255,255,0.8)');
    ctx.strokeStyle = grad; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx2-W*0.08,cy2); ctx.lineTo(cx2,cy2); ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.9)';
    ctx.beginPath(); ctx.arc(cx2,cy2,2,0,Math.PI*2); ctx.fill();
  }
}

// ---- HELPER DRAWING FUNCTIONS ----
function drawButterfly(ctx, x, y, r) {
  ['#ff6b9d','#ffd93d'].forEach((c,i) => {
    ctx.fillStyle = c; ctx.globalAlpha = 0.8;
    ctx.beginPath();
    const sx = i===0 ? -1 : 1;
    ctx.ellipse(x + sx*r, y, r*1.2, r*0.7, i===0 ? -0.5 : 0.5, 0, Math.PI*2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  ctx.strokeStyle = '#333'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(x, y-r*0.8); ctx.lineTo(x, y+r*0.8); ctx.stroke();
}
function drawBird(ctx, x, y, r) {
  ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5; ctx.beginPath();
  ctx.moveTo(x-r, y); ctx.quadraticCurveTo(x-r/2, y-r*0.5, x, y);
  ctx.quadraticCurveTo(x+r/2, y-r*0.5, x+r, y);
  ctx.stroke();
}
function drawCloud(ctx, x, y, r) {
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  [[0,0,r],[r*0.6,-r*0.3,r*0.7],[r*1.1,0,r*0.6],[-r*0.5,-r*0.2,r*0.6]].forEach(([dx,dy,cr]) => {
    ctx.beginPath(); ctx.arc(x+dx, y+dy, cr, 0, Math.PI*2); ctx.fill();
  });
}
function drawMushroom(ctx, x, y, r, color='#ef5350') {
  ctx.fillStyle = '#d7ccc8'; ctx.fillRect(x-r*0.5, y-r*1.2, r, r*1.2);
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(x, y-r*1.2, r, r*0.7, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#fff';
  [[0,-r*0.4],[r*0.35,-r*0.15],[-r*0.35,-r*0.15]].forEach(([dx,dy]) => {
    ctx.beginPath(); ctx.arc(x+dx, y-r*1.2+dy, r*0.18, 0, Math.PI*2); ctx.fill();
  });
}
function drawCoral(ctx, x, y, color, h) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x-h*0.15,y-h*0.5); ctx.lineTo(x,y-h*0.4); ctx.lineTo(x+h*0.15,y-h*0.5); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(x-h*0.15, y-h*0.5, h*0.08, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x+h*0.15, y-h*0.5, h*0.08, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x, y-h, h*0.09, 0, Math.PI*2); ctx.fill();
}
function drawFish(ctx, x, y, r, color, dir) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(x, y, r, r*0.5, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x-dir*r, y); ctx.lineTo(x-dir*r*1.5, y-r*0.5); ctx.lineTo(x-dir*r*1.5, y+r*0.5); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x+dir*r*0.5, y-r*0.1, r*0.15, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(x+dir*r*0.5, y-r*0.1, r*0.07, 0, Math.PI*2); ctx.fill();
}
function drawJellyfish(ctx, x, y, r) {
  ctx.fillStyle = 'rgba(156,39,176,0.5)';
  ctx.beginPath(); ctx.ellipse(x, y, r, r*0.6, 0, Math.PI, 0); ctx.fill();
  ctx.strokeStyle = 'rgba(156,39,176,0.4)'; ctx.lineWidth = 1.5;
  for (let t = 0; t < 5; t++) {
    const tx = x + (t-2)*r*0.4;
    ctx.beginPath(); ctx.moveTo(tx, y); ctx.quadraticCurveTo(tx+r*0.2, y+r*1.2, tx, y+r*2); ctx.stroke();
  }
}
function drawStarfish(ctx, x, y, r) {
  ctx.fillStyle = '#ff9843';
  for (let a = 0; a < 5; a++) {
    const ang = (a/5)*Math.PI*2 - Math.PI/2;
    ctx.beginPath(); ctx.ellipse(x+Math.cos(ang)*r, y+Math.sin(ang)*r, r*0.35, r*0.15, ang, 0, Math.PI*2); ctx.fill();
  }
  ctx.beginPath(); ctx.arc(x,y,r*0.3,0,Math.PI*2); ctx.fill();
}
function drawOwl(ctx, x, y, r) {
  ctx.fillStyle = '#795548'; ctx.beginPath(); ctx.ellipse(x, y, r, r*1.3, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x, y-r*1.2, r*0.8, r*0.8, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#d7ccc8';
  ctx.beginPath(); ctx.ellipse(x-r*0.3, y-r*1.2, r*0.3, r*0.35, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x+r*0.3, y-r*1.2, r*0.3, r*0.35, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#ffb300'; ctx.beginPath(); ctx.arc(x-r*0.3, y-r*1.2, r*0.18, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x+r*0.3, y-r*1.2, r*0.18, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(x-r*0.3, y-r*1.2, r*0.08, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x+r*0.3, y-r*1.2, r*0.08, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#ff9800';
  ctx.beginPath(); ctx.moveTo(x, y-r*1.1); ctx.lineTo(x-r*0.15, y-r*1.35); ctx.lineTo(x+r*0.15, y-r*1.35); ctx.closePath(); ctx.fill();
  // Wings as triangle-ish
  ctx.fillStyle = '#6d4c41';
  ctx.beginPath(); ctx.moveTo(x-r, y); ctx.lineTo(x-r*1.6, y+r*0.8); ctx.lineTo(x-r*0.2, y+r*0.5); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x+r, y); ctx.lineTo(x+r*1.6, y+r*0.8); ctx.lineTo(x+r*0.2, y+r*0.5); ctx.closePath(); ctx.fill();
}
function drawFox(ctx, x, y, r) {
  ctx.fillStyle = '#ff9843';
  ctx.beginPath(); ctx.ellipse(x, y, r*1.2, r*0.6, 0, 0, Math.PI*2); ctx.fill(); // body
  ctx.beginPath(); ctx.ellipse(x+r, y-r*0.3, r*0.7, r*0.6, 0.3, 0, Math.PI*2); ctx.fill(); // head
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(x+r*1.4, y-r*0.1, r*0.25, r*0.2, 0, 0, Math.PI*2); ctx.fill(); // muzzle
  // Ears
  ctx.fillStyle = '#ff9843';
  ctx.beginPath(); ctx.moveTo(x+r*0.7, y-r*0.7); ctx.lineTo(x+r*0.5, y-r*1.3); ctx.lineTo(x+r*1.1, y-r*0.8); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x+r*1.1, y-r*0.6); ctx.lineTo(x+r*1.0, y-r*1.2); ctx.lineTo(x+r*1.5, y-r*0.7); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(x+r*1.35, y-r*0.35, r*0.08, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#ff7043'; ctx.lineWidth = r*0.25; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(x-r*1.1, y); ctx.quadraticCurveTo(x-r*1.5, y-r*0.5, x-r*1.3, y-r*1.1); ctx.stroke();
}
function drawDeer(ctx, x, y, r) {
  ctx.fillStyle = '#795548';
  ctx.beginPath(); ctx.ellipse(x, y, r*1.1, r*0.6, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x+r*0.8, y-r*0.5, r*0.5, r*0.6, 0.3, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#795548'; ctx.lineWidth = r*0.25;
  [[x-r*0.5, y+r*0.5],[x-r*0.1,y+r*0.5],[x+r*0.3,y+r*0.5],[x+r*0.7,y+r*0.5]].forEach(([lx,ly]) => {
    ctx.beginPath(); ctx.moveTo(lx,ly); ctx.lineTo(lx,ly+r*0.7); ctx.stroke();
  });
  ctx.strokeStyle = '#6d4c41'; ctx.lineWidth = r*0.12;
  ctx.beginPath(); ctx.moveTo(x+r*0.9,y-r*0.9); ctx.lineTo(x+r*0.7,y-r*1.4); ctx.lineTo(x+r*0.5,y-r*1.6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x+r*1.0,y-r*0.85); ctx.lineTo(x+r*1.2,y-r*1.4); ctx.lineTo(x+r*1.4,y-r*1.6); ctx.stroke();
}
function drawFairy(ctx, x, y, r) {
  ctx.fillStyle = '#ffe0b2';
  ctx.beginPath(); ctx.arc(x, y, r*0.5, 0, Math.PI*2); ctx.fill(); // head
  ctx.beginPath(); ctx.ellipse(x, y+r*0.9, r*0.35, r*0.5, 0, 0, Math.PI*2); ctx.fill(); // body
  // Wings
  ctx.fillStyle = 'rgba(255,107,157,0.35)';
  ctx.beginPath(); ctx.ellipse(x-r*0.8, y+r*0.4, r*0.7, r*0.4, -0.4, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x+r*0.8, y+r*0.4, r*0.7, r*0.4, 0.4, 0, Math.PI*2); ctx.fill();
  // Wand sparkle
  ctx.strokeStyle = '#ffd93d'; ctx.lineWidth = r*0.15;
  ctx.beginPath(); ctx.moveTo(x+r*0.3, y+r*0.5); ctx.lineTo(x+r*1.0, y+r*1.2); ctx.stroke();
  ctx.fillStyle = '#ffd93d';
  ctx.beginPath(); ctx.arc(x+r*1.0, y+r*1.2, r*0.2, 0, Math.PI*2); ctx.fill();
  for (let sp = 0; sp < 5; sp++) {
    const sa = (sp/5)*Math.PI*2; const sr = r*0.1;
    ctx.beginPath(); ctx.arc(x+r+Math.cos(sa)*r*0.4, y+r*1.2+Math.sin(sa)*r*0.4, r*0.06, 0, Math.PI*2); ctx.fill();
  }
}
function drawCar(ctx, x, y, w, color, dir) {
  const h = w*0.5;
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, 6); ctx.fill();
  ctx.fillStyle = lightenColor(color.replace(/^#/,'#'), 20);
  ctx.beginPath(); ctx.roundRect(x+w*0.15, y-h*0.5, w*0.65, h*0.55, 4); ctx.fill();
  ctx.fillStyle = '#b3e5fc';
  ctx.fillRect(x+w*0.18, y-h*0.45, w*0.25, h*0.4);
  ctx.fillRect(x+w*0.5, y-h*0.45, w*0.25, h*0.4);
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x+w*0.2, y+h*0.9, h*0.35, 0, Math.PI*2); ctx.fill(); ctx.fillStyle='#555';ctx.beginPath(); ctx.arc(x+w*0.2, y+h*0.9, h*0.2, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x+w*0.8, y+h*0.9, h*0.35, 0, Math.PI*2); ctx.fill(); ctx.fillStyle='#555'; ctx.beginPath(); ctx.arc(x+w*0.8, y+h*0.9, h*0.2, 0, Math.PI*2); ctx.fill();
}
function drawPerson(ctx, x, y, h) {
  ctx.fillStyle = '#ffe0b2'; ctx.beginPath(); ctx.arc(x, y-h*0.85, h*0.12, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#333'; ctx.lineWidth = h*0.06;
  ctx.beginPath(); ctx.moveTo(x, y-h*0.73); ctx.lineTo(x, y-h*0.3); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x-h*0.15, y-h*0.6); ctx.lineTo(x+h*0.15, y-h*0.6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y-h*0.3); ctx.lineTo(x-h*0.12, y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y-h*0.3); ctx.lineTo(x+h*0.12, y); ctx.stroke();
}
function drawPlant(ctx, x, y, r) {
  ctx.fillStyle = '#795548'; ctx.fillRect(x-r*0.3, y, r*0.6, r*0.8);
  ctx.strokeStyle = '#795548'; ctx.lineWidth = r*0.15; ctx.fillStyle = '#66bb6a';
  for (let i = 0; i < 5; i++) {
    const a = (i/5)*Math.PI*2;
    ctx.beginPath(); ctx.ellipse(x+Math.cos(a)*r*0.6, y-r*0.1+Math.sin(a)*r*0.4, r*0.4, r*0.25, a, 0, Math.PI*2); ctx.fill();
  }
}
function drawPlanet(ctx, x, y, r, color) {
  const g = ctx.createRadialGradient(x-r*0.3, y-r*0.3, r*0.1, x, y, r);
  g.addColorStop(0, lightenColor(color.replace('#','#'), 40));
  g.addColorStop(1, darkenColor(color.replace('#','#'), 20));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  // Ring (for some)
  if (Math.random() > 0.5) {
    ctx.strokeStyle = `${color}88`; ctx.lineWidth = r*0.15;
    ctx.beginPath(); ctx.ellipse(x, y, r*1.6, r*0.3, 0.3, 0, Math.PI*2); ctx.stroke();
  }
}
function drawRocket(ctx, x, y, r) {
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.moveTo(x, y-r*1.5); ctx.lineTo(x-r*0.5, y+r*0.5); ctx.lineTo(x+r*0.5, y+r*0.5); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ef5350'; ctx.fillRect(x-r*0.5, y+r*0.3, r, r*0.5);
  ctx.fillStyle = '#ff9843';
  ctx.beginPath(); ctx.moveTo(x-r*0.5, y+r*0.8); ctx.lineTo(x-r*0.8, y+r*1.4); ctx.lineTo(x, y+r*0.8); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x+r*0.5, y+r*0.8); ctx.lineTo(x+r*0.8, y+r*1.4); ctx.lineTo(x, y+r*0.8); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#b3e5fc'; ctx.beginPath(); ctx.ellipse(x, y-r*0.5, r*0.25, r*0.25, 0, 0, Math.PI*2); ctx.fill();
}
function drawAstronaut(ctx, x, y, r) {
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y-r*0.5, r*0.55, 0, Math.PI*2); ctx.fill(); // helmet
  ctx.beginPath(); ctx.ellipse(x, y+r*0.3, r*0.6, r*0.8, 0, 0, Math.PI*2); ctx.fill(); // suit
  ctx.fillStyle = '#b3e5fc'; ctx.beginPath(); ctx.arc(x, y-r*0.5, r*0.3, 0, Math.PI*2); ctx.fill(); // visor
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(x-r*0.8, y+r*0.2, r*0.2, r*0.5, -0.3, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x+r*0.8, y+r*0.2, r*0.2, r*0.5, 0.3, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x-r*0.3, y+r*1.0, r*0.18, r*0.45, -0.1, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x+r*0.3, y+r*1.0, r*0.18, r*0.45, 0.1, 0, Math.PI*2); ctx.fill();
}
function drawAlien(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(x, y, r*0.6, r*0.8, 0, 0, Math.PI*2); ctx.fill(); // body
  ctx.beginPath(); ctx.ellipse(x, y-r*0.8, r*0.8, r*0.65, 0, 0, Math.PI*2); ctx.fill(); // head
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath(); ctx.ellipse(x-r*0.3, y-r*0.8, r*0.22, r*0.3, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x+r*0.3, y-r*0.8, r*0.22, r*0.3, 0, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = r*0.12;
  ctx.beginPath(); ctx.moveTo(x-r*0.3, y-r*0.1); ctx.lineTo(x-r*0.8, y+r*0.4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x+r*0.3, y-r*0.1); ctx.lineTo(x+r*0.8, y+r*0.4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x-r*0.25, y+r*0.6); ctx.lineTo(x-r*0.25, y+r*1.1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x+r*0.25, y+r*0.6); ctx.lineTo(x+r*0.25, y+r*1.1); ctx.stroke();
  // Antennae
  ctx.lineWidth = r*0.1;
  ctx.beginPath(); ctx.moveTo(x-r*0.2, y-r*1.4); ctx.lineTo(x-r*0.5, y-r*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x+r*0.2, y-r*1.4); ctx.lineTo(x+r*0.5, y-r*2); ctx.stroke();
  ctx.fillStyle = '#ffd93d';
  ctx.beginPath(); ctx.arc(x-r*0.5, y-r*2, r*0.12, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x+r*0.5, y-r*2, r*0.12, 0, Math.PI*2); ctx.fill();
}

// ---- CAT CLICK HANDLER ----
function catTouchHandler(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = catCanvas.getBoundingClientRect();
  const scaleX = catCanvas.width / rect.width;
  const scaleY = catCanvas.height / rect.height;
  const x = (touch.clientX - rect.left) * scaleX;
  const y = (touch.clientY - rect.top) * scaleY;
  handleCatTap(x, y);
}

function catClick(e) {
  const rect = catCanvas.getBoundingClientRect();
  const scaleX = catCanvas.width / rect.width;
  const scaleY = catCanvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;
  handleCatTap(x, y);
}

function handleCatTap(x, y) {
  if (catFoundThisRound) return;
  
  const W = catCanvas.width, H = catCanvas.height;
  const cx = catX * W, cy = catY * H;
  const cr = catR * Math.min(W, H) * 1.3; // slightly generous hit area
  
  const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
  
  if (dist <= cr) {
    catFoundThisRound = true;
    clearInterval(catTimerInterval);
    
    // Score based on time remaining
    const pts = Math.max(50, catTimer * 10 + (4 - catRound) * 50);
    catScoreVal += pts;
    
    // Show found animation
    document.getElementById('cat-found-anim').className = 'cat-found-show';
    setTimeout(() => {
      document.getElementById('cat-found-anim').className = 'cat-found-hidden';
    }, 1500);
    
    // Draw highlight
    catCtx.save();
    catCtx.strokeStyle = '#ffd93d';
    catCtx.lineWidth = 4;
    catCtx.setLineDash([8, 4]);
    catCtx.beginPath();
    catCtx.arc(cx, cy, cr * 1.1, 0, Math.PI * 2);
    catCtx.stroke();
    catCtx.restore();
    
    setMsg('cat', `🎉 Found it! +${pts} pts!`);
    updateCatUI();
    
    // Next round after delay
    setTimeout(() => {
      catRound++;
      updateCatUI();
      startCatRound();
    }, 2000);
    
  } else {
    // Wrong tap - show ripple on canvas
    catCtx.save();
    catCtx.strokeStyle = 'rgba(255,107,157,0.6)';
    catCtx.lineWidth = 2;
    catCtx.beginPath();
    catCtx.arc(x, y, 18, 0, Math.PI * 2);
    catCtx.stroke();
    catCtx.restore();
    setMsg('cat', '❌ Not there! Keep looking...');
    setTimeout(() => { if (!catFoundThisRound) setMsg('cat', ''); }, 1000);
  }
}

function startCatTimer() {
  clearInterval(catTimerInterval);
  catTimerInterval = setInterval(() => {
    catTimer--;
    document.getElementById('cat-timer').textContent = catTimer;
    if (catTimer <= 0) {
      clearInterval(catTimerInterval);
      if (!catFoundThisRound) {
        // Reveal cat
        const W = catCanvas.width, H = catCanvas.height;
        catCtx.save();
        catCtx.strokeStyle = '#ff6b9d';
        catCtx.lineWidth = 4;
        catCtx.setLineDash([8,4]);
        catCtx.beginPath();
        catCtx.arc(catX * W, catY * H, catR * Math.min(W,H) * 1.3, 0, Math.PI*2);
        catCtx.stroke();
        catCtx.restore();
        setMsg('cat', '⏰ Time\'s up! The cat was here! 🐱');
        catFoundThisRound = true;
        setTimeout(() => {
          catRound++;
          updateCatUI();
          startCatRound();
        }, 2500);
      }
    }
  }, 1000);
}

function useCatHint() {
  if (catHints <= 0 || catFoundThisRound) return;
  catHints--;
  catHintShown = true;
  document.getElementById('cat-hints-left').textContent = catHints + (catHints === 1 ? ' hint left' : ' hints left');
  
  if (catHints === 0) document.getElementById('cat-hint-btn').disabled = true;
  
  // Draw hint circle
  const W = catCanvas.width, H = catCanvas.height;
  const cx = catX * W, cy = catY * H;
  const hr = catR * Math.min(W, H) * 3.5;
  
  catCtx.save();
  catCtx.strokeStyle = 'rgba(255,217,61,0.7)';
  catCtx.lineWidth = 3;
  catCtx.setLineDash([10, 6]);
  catCtx.beginPath();
  catCtx.arc(cx, cy, hr, 0, Math.PI * 2);
  catCtx.stroke();
  catCtx.restore();
  
  setMsg('cat', '💡 The cat is somewhere inside this circle!');
  setTimeout(() => { if (!catFoundThisRound) setMsg('cat', ''); }, 2500);
}

function updateCatUI() {
  document.getElementById('cat-round').textContent = catRound;
  document.getElementById('cat-score').textContent = catScoreVal;
  document.getElementById('cat-timer').textContent = catTimer;
}

// ===== INIT ON LOAD =====
window.addEventListener('load', () => {
  initCandyGame();
  initCatGame();
});

window.addEventListener('resize', () => {
  // Reinit canvases on resize if active
  if (document.getElementById('game-candy').classList.contains('active-game')) {
    const saved = { score: candyScore, moves: candyMoves, level: candyLevel, target: candyTarget, board: JSON.parse(JSON.stringify(candyBoard)) };
    initCandyGame();
    candyScore = saved.score;
    candyMoves = saved.moves;
    candyLevel = saved.level;
    candyTarget = saved.target;
    candyBoard = saved.board;
    updateCandyUI();
    renderCandy();
  }
  if (document.getElementById('game-cat').classList.contains('active-game')) {
    const savedRound = catRound;
    const savedScore = catScoreVal;
    clearInterval(catTimerInterval);
    initCatGame();
    catRound = savedRound;
    catScoreVal = savedScore;
  }
});

