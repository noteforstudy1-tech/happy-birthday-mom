/* =============================================
   SAPNA'S BIRTHDAY WEBSITE - JAVASCRIPT
   ============================================= */

// ===== POLYFILL: roundRect for older browsers =====
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y,     x + w, y + h, r);
    this.arcTo(x + w, y + h, x,     y + h, r);
    this.arcTo(x,     y + h, x,     y,     r);
    this.arcTo(x,     y,     x + w, y,     r);
    this.closePath();
    return this;
  };
}

// ===== COLOR HELPERS (defined first so all functions can use them) =====
function lightenColor(hex, amount) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c=>c+c).join('');
  const r = Math.min(255, parseInt(hex.slice(0,2),16) + amount);
  const g = Math.min(255, parseInt(hex.slice(2,4),16) + amount);
  const b = Math.min(255, parseInt(hex.slice(4,6),16) + amount);
  return `rgb(${r},${g},${b})`;
}
function darkenColor(hex, amount) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c=>c+c).join('');
  const r = Math.max(0, parseInt(hex.slice(0,2),16) - amount);
  const g = Math.max(0, parseInt(hex.slice(2,4),16) - amount);
  const b = Math.max(0, parseInt(hex.slice(4,6),16) - amount);
  return `rgb(${r},${g},${b})`;
}

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

// Swipe tracking
let candySwipeStart = null;
let candySwipeStartPos = null;
const SWIPE_MIN_PX = 18; // minimum drag distance to register

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
  
  // Remove all old listeners and attach swipe/drag listeners
  ['mousedown','mousemove','mouseup','mouseleave',
   'touchstart','touchmove','touchend'].forEach(evt => {
    candyCanvas.removeEventListener(evt, candyEventHandler);
  });
  candyCanvas.addEventListener('mousedown',  candyEventHandler);
  candyCanvas.addEventListener('mousemove',  candyEventHandler);
  candyCanvas.addEventListener('mouseup',    candyEventHandler);
  candyCanvas.addEventListener('mouseleave', candyEventHandler);
  candyCanvas.addEventListener('touchstart', candyEventHandler, { passive: false });
  candyCanvas.addEventListener('touchmove',  candyEventHandler, { passive: false });
  candyCanvas.addEventListener('touchend',   candyEventHandler, { passive: false });
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

// Color helpers moved to top of file

// ---- Unified swipe/drag event handler for Candy Crush ----
function candyGetCanvasXY(e) {
  const rect = candyCanvas.getBoundingClientRect();
  const scaleX = candyCanvas.width / rect.width;
  const scaleY = candyCanvas.height / rect.height;
  let cx, cy;
  if (e.touches && e.touches.length > 0) {
    cx = e.touches[0].clientX; cy = e.touches[0].clientY;
  } else if (e.changedTouches && e.changedTouches.length > 0) {
    cx = e.changedTouches[0].clientX; cy = e.changedTouches[0].clientY;
  } else {
    cx = e.clientX; cy = e.clientY;
  }
  return {
    x: (cx - rect.left) * scaleX,
    y: (cy - rect.top)  * scaleY
  };
}

function candyXYtoRC(x, y) {
  return {
    r: Math.floor(y / candyCellSize),
    c: Math.floor(x / candyCellSize)
  };
}

function candyEventHandler(e) {
  e.preventDefault();
  if (candyAnimating) return;

  const { x, y } = candyGetCanvasXY(e);

  if (e.type === 'mousedown' || e.type === 'touchstart') {
    const { r, c } = candyXYtoRC(x, y);
    if (r < 0 || r >= CANDY_ROWS || c < 0 || c >= CANDY_COLS) return;
    if (candyBoard[r][c] === -1) return;
    candySwipeStart    = { r, c };
    candySwipeStartPos = { x, y };
    candySelected = { r, c };
    renderCandy();

  } else if (e.type === 'mousemove' || e.type === 'touchmove') {
    if (!candySwipeStart || !candySwipeStartPos) return;
    const dx = x - candySwipeStartPos.x;
    const dy = y - candySwipeStartPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < SWIPE_MIN_PX) return;

    // Determine direction
    let dr = 0, dc = 0;
    if (Math.abs(dx) > Math.abs(dy)) {
      dc = dx > 0 ? 1 : -1;
    } else {
      dr = dy > 0 ? 1 : -1;
    }
    const { r, c } = candySwipeStart;
    const r2 = r + dr, c2 = c + dc;
    // Reset swipe to avoid multiple fires
    const srcR = r, srcC = c;
    candySwipeStart = null; candySwipeStartPos = null; candySelected = null;
    if (r2 >= 0 && r2 < CANDY_ROWS && c2 >= 0 && c2 < CANDY_COLS) {
      attemptSwap(srcR, srcC, r2, c2);
    } else {
      renderCandy();
    }

  } else if (e.type === 'mouseup' || e.type === 'touchend' || e.type === 'mouseleave') {
    // If no swipe was far enough, treat as a tap (select/deselect)
    if (candySwipeStart) {
      const dx = x - candySwipeStartPos.x;
      const dy = y - candySwipeStartPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < SWIPE_MIN_PX && e.type !== 'mouseleave') {
        // Short tap: keep selection visible (already set in mousedown)
      } else {
        candySwipeStart = null; candySwipeStartPos = null;
        candySelected = null;
        renderCandy();
      }
    }
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
// ===== BLACK & WHITE DOODLE SCENES (matching real Find The Cat game) =====
// All scenes use white background with black ink strokes only

function bwSetup(ctx, W, H) {
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#111'; ctx.fillStyle = '#111';
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
}

function scene1(ctx, W, H) {
  // B&W Garden / park doodle
  bwSetup(ctx, W, H);
  const S = '#111';

  // Ground line
  ctx.strokeStyle = S; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, H*0.78); ctx.lineTo(W, H*0.78); ctx.stroke();

  // Grass tufts
  for (let gx = 0; gx < W; gx += 14) {
    ctx.lineWidth = 1.2; ctx.strokeStyle = S;
    ctx.beginPath(); ctx.moveTo(gx, H*0.78); ctx.lineTo(gx+4, H*0.72); ctx.lineTo(gx+8, H*0.78); ctx.stroke();
  }

  // Big oak tree (left)
  ctx.lineWidth = 4; ctx.strokeStyle = S;
  ctx.beginPath(); ctx.moveTo(W*0.12, H*0.78); ctx.lineTo(W*0.12, H*0.3); ctx.stroke();
  // Branches
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(W*0.12, H*0.5); ctx.lineTo(W*0.06, H*0.38); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.12, H*0.45); ctx.lineTo(W*0.2, H*0.36); ctx.stroke();
  // Foliage cloud
  ctx.lineWidth = 1.5;
  [[W*0.12,H*0.25,W*0.12],[W*0.06,H*0.28,W*0.08],[W*0.19,H*0.27,W*0.08],[W*0.13,H*0.18,W*0.09]].forEach(([fx,fy,fr]) => {
    ctx.beginPath(); ctx.arc(fx,fy,fr,0,Math.PI*2); ctx.stroke();
  });

  // Flowers scattered
  const fpos = [[W*0.3,H*0.75],[W*0.45,H*0.71],[W*0.6,H*0.76],[W*0.75,H*0.73],[W*0.88,H*0.76],[W*0.22,H*0.77]];
  fpos.forEach(([fx,fy]) => {
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(fx,fy); ctx.lineTo(fx, fy+H*0.04); ctx.stroke(); // stem
    for (let p = 0; p < 6; p++) { // petals
      const a = (p/6)*Math.PI*2;
      ctx.beginPath(); ctx.ellipse(fx+Math.cos(a)*W*0.025, fy+Math.sin(a)*W*0.025, W*0.015, W*0.008, a, 0, Math.PI*2); ctx.stroke();
    }
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.arc(fx,fy,W*0.012,0,Math.PI*2); ctx.stroke(); // center
  });

  // House (right)
  ctx.lineWidth = 1.8;
  ctx.strokeRect(W*0.62, H*0.52, W*0.2, H*0.26); // walls
  ctx.beginPath(); ctx.moveTo(W*0.6, H*0.52); ctx.lineTo(W*0.72, H*0.37); ctx.lineTo(W*0.84, H*0.52); ctx.stroke(); // roof
  ctx.strokeRect(W*0.67, H*0.56, W*0.06, W*0.06); // window
  ctx.beginPath(); ctx.moveTo(W*0.67, H*0.59); ctx.lineTo(W*0.73, H*0.59); ctx.stroke(); // window bar
  ctx.beginPath(); ctx.moveTo(W*0.7, H*0.56); ctx.lineTo(W*0.7, H*0.62); ctx.stroke();
  ctx.strokeRect(W*0.7, H*0.65, W*0.05, H*0.13); // door
  ctx.beginPath(); ctx.arc(W*0.735, H*0.71, 2.5, 0, Math.PI*2); ctx.stroke(); // doorknob

  // Fence
  ctx.lineWidth = 1.2;
  for (let fx = W*0.28; fx < W*0.62; fx += W*0.04) {
    ctx.beginPath(); ctx.moveTo(fx, H*0.78); ctx.lineTo(fx, H*0.7); ctx.lineTo(fx+W*0.015, H*0.68); ctx.lineTo(fx+W*0.03, H*0.7); ctx.lineTo(fx+W*0.03, H*0.78); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(W*0.28, H*0.725); ctx.lineTo(W*0.62, H*0.725); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.28, H*0.755); ctx.lineTo(W*0.62, H*0.755); ctx.stroke();

  // Sun with rays
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(W*0.84, H*0.1, W*0.055, 0, Math.PI*2); ctx.stroke();
  for (let i = 0; i < 10; i++) {
    const a = (i/10)*Math.PI*2;
    ctx.beginPath(); ctx.moveTo(W*0.84+Math.cos(a)*W*0.07, H*0.1+Math.sin(a)*W*0.07); ctx.lineTo(W*0.84+Math.cos(a)*W*0.1, H*0.1+Math.sin(a)*W*0.1); ctx.stroke();
  }

  // Clouds
  [[W*0.22,H*0.1],[W*0.52,H*0.08]].forEach(([cx,cy]) => {
    ctx.lineWidth = 1.5;
    [[0,0,W*0.08],[W*0.06,-W*0.03,W*0.06],[W*0.12,0,W*0.05],[-W*0.04,-W*0.02,W*0.05]].forEach(([dx,dy,cr]) => {
      ctx.beginPath(); ctx.arc(cx+dx,cy+dy,cr,0,Math.PI*2); ctx.stroke();
    });
  });

  // Birds (M shape)
  [[W*0.55,H*0.15],[W*0.65,H*0.12]].forEach(([bx,by]) => {
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(bx-W*0.03,by); ctx.quadraticCurveTo(bx-W*0.015,by-W*0.018,bx,by);
    ctx.quadraticCurveTo(bx+W*0.015,by-W*0.018,bx+W*0.03,by); ctx.stroke();
  });

  // Bench
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(W*0.38,H*0.66); ctx.lineTo(W*0.54,H*0.66); ctx.stroke(); // seat
  ctx.beginPath(); ctx.moveTo(W*0.38,H*0.62); ctx.lineTo(W*0.54,H*0.62); ctx.stroke(); // backrest
  [W*0.4,W*0.52].forEach(lx => { ctx.beginPath(); ctx.moveTo(lx,H*0.62); ctx.lineTo(lx,H*0.72); ctx.stroke(); }); // legs
  [W*0.4,W*0.52].forEach(lx => { ctx.beginPath(); ctx.moveTo(lx,H*0.62); ctx.lineTo(lx,H*0.57); ctx.stroke(); }); // back posts

  // Mushrooms
  [[W*0.42,H*0.77,W*0.025],[W*0.92,H*0.76,W*0.02]].forEach(([mx,my,mr]) => {
    ctx.lineWidth = 1.2;
    ctx.strokeRect(mx-mr*0.4, my-mr*1.1, mr*0.8, mr*1.1);
    ctx.beginPath(); ctx.ellipse(mx, my-mr*1.1, mr, mr*0.6, 0, Math.PI, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(mx, my-mr*1.4, mr*0.18, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(mx-mr*0.35, my-mr*1.25, mr*0.12, 0, Math.PI*2); ctx.stroke();
  });

  // Butterflies (outline only)
  [[W*0.55,H*0.35],[W*0.78,H*0.22]].forEach(([bx,by]) => {
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(bx-W*0.025,by,W*0.03,W*0.018,-0.5,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(bx+W*0.025,by,W*0.03,W*0.018,0.5,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx,by-W*0.02); ctx.lineTo(bx,by+W*0.02); ctx.stroke();
  });
}

function scene2(ctx, W, H) {
  // B&W Underwater scene
  bwSetup(ctx, W, H);

  // Horizon / water surface (wavy lines at top)
  ctx.lineWidth = 1.5;
  for (let wy = H*0.02; wy < H*0.07; wy += H*0.018) {
    ctx.beginPath(); ctx.moveTo(0, wy);
    for (let wx = 0; wx < W; wx += 20) ctx.quadraticCurveTo(wx+10, wy-6, wx+20, wy);
    ctx.stroke();
  }

  // Seabed
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, H*0.82); ctx.lineTo(W, H*0.82); ctx.stroke();
  // Sand ripples
  ctx.lineWidth = 1;
  for (let ry = H*0.84; ry < H; ry += H*0.04) {
    ctx.beginPath(); ctx.moveTo(W*0.05, ry);
    for (let rx = W*0.05; rx < W; rx += 22) ctx.quadraticCurveTo(rx+11, ry-4, rx+22, ry);
    ctx.stroke();
  }

  // Bubbles
  ctx.lineWidth = 1;
  [[W*0.12,H*0.5,8],[W*0.25,H*0.35,5],[W*0.55,H*0.4,10],[W*0.7,H*0.25,6],[W*0.85,H*0.45,7],[W*0.4,H*0.6,4],[W*0.9,H*0.3,9]].forEach(([bx,by,br]) => {
    ctx.beginPath(); ctx.arc(bx,by,br,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(bx-br*0.3, by-br*0.3, br*0.3, 0, Math.PI*2); ctx.stroke(); // shine
  });

  // Seaweed (wiggly lines)
  [W*0.15, W*0.35, W*0.55, W*0.75, W*0.9].forEach((sx, i) => {
    ctx.lineWidth = 2 + i*0.2;
    ctx.beginPath(); ctx.moveTo(sx, H*0.82);
    let y = H*0.82;
    while (y > H*0.35) {
      const wave = (i%2===0?1:-1)*15;
      ctx.quadraticCurveTo(sx+wave, y-12, sx-wave, y-24);
      y -= 24;
    }
    ctx.stroke();
  });

  // Corals
  [[W*0.08,H*0.82,H*0.14],[W*0.28,H*0.82,H*0.1],[W*0.65,H*0.82,H*0.13],[W*0.84,H*0.82,H*0.11]].forEach(([cx,cy,ch]) => {
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx,cy-ch*0.5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,cy-ch*0.2); ctx.lineTo(cx-ch*0.15, cy-ch*0.55); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,cy-ch*0.2); ctx.lineTo(cx+ch*0.15, cy-ch*0.55); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx,cy-ch*0.6,ch*0.07,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx-ch*0.15,cy-ch*0.57,ch*0.06,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx+ch*0.15,cy-ch*0.57,ch*0.06,0,Math.PI*2); ctx.stroke();
  });

  // Fish (outline)
  const fishData = [[W*0.55,H*0.25,W*0.09,1],[W*0.2,H*0.42,W*0.07,-1],[W*0.72,H*0.5,W*0.06,1],[W*0.38,H*0.62,W*0.055,-1],[W*0.85,H*0.32,W*0.08,1]];
  fishData.forEach(([fx,fy,fr,fd]) => {
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.ellipse(fx,fy,fr,fr*0.5,0,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(fx-fd*fr,fy); ctx.lineTo(fx-fd*fr*1.5,fy-fr*0.5); ctx.lineTo(fx-fd*fr*1.5,fy+fr*0.5); ctx.closePath(); ctx.stroke();
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.arc(fx+fd*fr*0.5,fy-fr*0.1,fr*0.13,0,Math.PI*2); ctx.stroke(); // eye
    // Scales
    for (let s = 0; s < 3; s++) {
      ctx.beginPath(); ctx.arc(fx-fd*fr*0.2+s*fd*fr*0.2,fy,fr*0.25,0,Math.PI,fd<0); ctx.stroke();
    }
  });

  // Jellyfish
  [[W*0.15,H*0.18],[W*0.72,H*0.14]].forEach(([jx,jy]) => {
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(jx,jy,W*0.06,W*0.04,0,Math.PI,0); ctx.stroke();
    // Tentacles
    ctx.lineWidth = 1;
    for (let t = -2; t <= 2; t++) {
      ctx.beginPath(); ctx.moveTo(jx+t*W*0.018, jy);
      ctx.quadraticCurveTo(jx+t*W*0.018+8, jy+W*0.05, jx+t*W*0.018, jy+W*0.1);
      ctx.stroke();
    }
  });

  // Starfish
  [[W*0.15,H*0.87],[W*0.58,H*0.88],[W*0.85,H*0.87]].forEach(([sx,sy]) => {
    ctx.lineWidth = 1.2;
    for (let p = 0; p < 5; p++) {
      const a = (p/5)*Math.PI*2-Math.PI/2;
      ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(sx+Math.cos(a)*W*0.04,sy+Math.sin(a)*W*0.04); ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(sx,sy,W*0.01,0,Math.PI*2); ctx.stroke();
  });

  // Treasure chest
  ctx.lineWidth = 1.5;
  ctx.strokeRect(W*0.4, H*0.83, W*0.12, H*0.08);
  ctx.beginPath(); ctx.moveTo(W*0.4, H*0.87); ctx.lineTo(W*0.52, H*0.87); ctx.stroke(); // band
  ctx.strokeRect(W*0.44, H*0.854, W*0.04, H*0.025); // lock
  ctx.strokeRect(W*0.455, H*0.86, W*0.01, W*0.01); // keyhole

  // Submarine (top area)
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.ellipse(W*0.5,H*0.12,W*0.12,W*0.05,0,0,Math.PI*2); ctx.stroke();
  ctx.strokeRect(W*0.46,H*0.07,W*0.04,W*0.04); // conning tower
  ctx.strokeRect(W*0.44,H*0.1,W*0.05,W*0.04); // porthole area
  ctx.beginPath(); ctx.arc(W*0.46,H*0.12,W*0.015,0,Math.PI*2); ctx.stroke(); // porthole
  ctx.beginPath(); ctx.moveTo(W*0.62,H*0.12); ctx.lineTo(W*0.68,H*0.12); ctx.stroke(); // propeller shaft
  ctx.beginPath(); ctx.ellipse(W*0.69,H*0.12,W*0.015,W*0.03,0,0,Math.PI*2); ctx.stroke(); // propeller
  ctx.beginPath(); ctx.moveTo(W*0.69,H*0.09); ctx.lineTo(W*0.69,H*0.15); ctx.stroke(); // blade
}

function scene3(ctx, W, H) {
  // B&W Enchanted forest night
  bwSetup(ctx, W, H);

  // Moon
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(W*0.8, H*0.1, W*0.065, 0, Math.PI*2); ctx.stroke();
  // Moon craters
  ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.arc(W*0.785, H*0.085, W*0.015, 0, Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(W*0.815, H*0.115, W*0.01, 0, Math.PI*2); ctx.stroke();

  // Stars
  ctx.lineWidth = 1;
  [[W*0.1,H*0.06],[W*0.25,H*0.04],[W*0.4,H*0.07],[W*0.55,H*0.03],[W*0.65,H*0.08],[W*0.92,H*0.05],[W*0.05,H*0.15],[W*0.45,H*0.15],[W*0.72,H*0.04]].forEach(([sx,sy]) => {
    const ss = W*0.008;
    ctx.beginPath(); ctx.moveTo(sx-ss,sy); ctx.lineTo(sx+ss,sy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx,sy-ss); ctx.lineTo(sx,sy+ss); ctx.stroke();
  });

  // Ground
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0,H*0.82); ctx.lineTo(W,H*0.82); ctx.stroke();

  // Trees (varied sizes)
  const trees = [[W*0.05,H*0.82,H*0.45],[W*0.15,H*0.82,H*0.38],[W*0.25,H*0.82,H*0.5],[W*0.55,H*0.82,H*0.42],[W*0.65,H*0.82,H*0.48],[W*0.78,H*0.82,H*0.36],[W*0.88,H*0.82,H*0.44],[W*0.95,H*0.82,H*0.32]];
  trees.forEach(([tx,ty,th]) => {
    // Trunk
    ctx.lineWidth = 3.5; ctx.strokeStyle = '#111';
    ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(tx,ty-th*0.4); ctx.stroke();
    // Roots
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(tx-W*0.02,ty+H*0.02); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(tx+W*0.02,ty+H*0.02); ctx.stroke();
    // Branches
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(tx,ty-th*0.25); ctx.lineTo(tx-W*0.04,ty-th*0.4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tx,ty-th*0.3); ctx.lineTo(tx+W*0.04,ty-th*0.45); ctx.stroke();
    // Foliage triangles (pine style)
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(tx,ty-th); ctx.lineTo(tx-W*0.06,ty-th*0.55); ctx.lineTo(tx+W*0.06,ty-th*0.55); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tx,ty-th*0.82); ctx.lineTo(tx-W*0.08,ty-th*0.42); ctx.lineTo(tx+W*0.08,ty-th*0.42); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tx,ty-th*0.62); ctx.lineTo(tx-W*0.1,ty-th*0.28); ctx.lineTo(tx+W*0.1,ty-th*0.28); ctx.closePath(); ctx.stroke();
  });

  // Mushrooms
  [[W*0.32,H*0.82,W*0.04],[W*0.45,H*0.82,W*0.035],[W*0.7,H*0.82,W*0.04]].forEach(([mx,my,mr]) => {
    ctx.lineWidth = 1.3;
    ctx.strokeRect(mx-mr*0.35,my-mr*1.0,mr*0.7,mr*1.0);
    ctx.beginPath(); ctx.ellipse(mx,my-mr*1.0,mr,mr*0.55,0,Math.PI,0); ctx.stroke();
    // Spots
    ctx.beginPath(); ctx.arc(mx,my-mr*1.25,mr*0.13,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(mx+mr*0.35,my-mr*1.1,mr*0.1,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(mx-mr*0.35,my-mr*1.1,mr*0.1,0,Math.PI*2); ctx.stroke();
  });

  // Owl on branch
  ctx.lineWidth = 1.5;
  const ox = W*0.42, oy = H*0.42;
  ctx.beginPath(); ctx.ellipse(ox,oy+W*0.04,W*0.035,W*0.05,0,0,Math.PI*2); ctx.stroke(); // body
  ctx.beginPath(); ctx.ellipse(ox,oy-W*0.02,W*0.028,W*0.03,0,0,Math.PI*2); ctx.stroke(); // head
  ctx.beginPath(); ctx.arc(ox-W*0.012,oy-W*0.025,W*0.012,0,Math.PI*2); ctx.stroke(); // eye L
  ctx.beginPath(); ctx.arc(ox+W*0.012,oy-W*0.025,W*0.012,0,Math.PI*2); ctx.stroke(); // eye R
  ctx.beginPath(); ctx.moveTo(ox,oy-W*0.015); ctx.lineTo(ox-W*0.008,oy); ctx.lineTo(ox+W*0.008,oy); ctx.closePath(); ctx.stroke(); // beak
  // Ear tufts
  ctx.beginPath(); ctx.moveTo(ox-W*0.015,oy-W*0.04); ctx.lineTo(ox-W*0.022,oy-W*0.058); ctx.lineTo(ox-W*0.006,oy-W*0.045); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ox+W*0.015,oy-W*0.04); ctx.lineTo(ox+W*0.022,oy-W*0.058); ctx.lineTo(ox+W*0.006,oy-W*0.045); ctx.stroke();
  // Branch
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(W*0.32,H*0.46); ctx.lineTo(W*0.55,H*0.46); ctx.stroke();

  // Fox
  ctx.lineWidth = 1.3;
  const fx = W*0.58, fy = H*0.78;
  ctx.beginPath(); ctx.ellipse(fx,fy,W*0.06,W*0.03,0,0,Math.PI*2); ctx.stroke(); // body
  ctx.beginPath(); ctx.ellipse(fx+W*0.055,fy-W*0.02,W*0.038,W*0.035,0.3,0,Math.PI*2); ctx.stroke(); // head
  ctx.beginPath(); ctx.arc(fx+W*0.075,fy-W*0.015,W*0.007,0,Math.PI*2); ctx.stroke(); // eye
  ctx.beginPath(); ctx.moveTo(fx+W*0.04,fy-W*0.04); ctx.lineTo(fx+W*0.025,fy-W*0.065); ctx.lineTo(fx+W*0.055,fy-W*0.048); ctx.stroke(); // ear
  ctx.beginPath(); ctx.moveTo(fx+W*0.065,fy-W*0.035); ctx.lineTo(fx+W*0.055,fy-W*0.062); ctx.lineTo(fx+W*0.085,fy-W*0.045); ctx.stroke();
  // Legs
  [fx-W*0.04,fx-W*0.01,fx+W*0.02,fx+W*0.05].forEach(lx => {
    ctx.beginPath(); ctx.moveTo(lx,fy+W*0.025); ctx.lineTo(lx,fy+W*0.055); ctx.stroke();
  });
  // Tail
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(fx-W*0.06,fy); ctx.quadraticCurveTo(fx-W*0.1,fy-W*0.04,fx-W*0.08,fy-W*0.08); ctx.stroke();

  // Fireflies (just tiny circles with glow dots)
  ctx.lineWidth = 0.8;
  [[W*0.35,H*0.55],[W*0.48,H*0.45],[W*0.62,H*0.38],[W*0.18,H*0.6],[W*0.72,H*0.52],[W*0.38,H*0.7],[W*0.82,H*0.65]].forEach(([ffx,ffy]) => {
    ctx.beginPath(); ctx.arc(ffx,ffy,3,0,Math.PI*2); ctx.stroke();
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.arc(ffx,ffy,5,0,Math.PI*2); ctx.stroke();
    ctx.lineWidth = 0.8;
  });

  // Spider web (corner)
  ctx.lineWidth = 0.7;
  const wx = W*0.92, wy = H*0.32;
  for (let r = W*0.02; r <= W*0.07; r += W*0.02) { ctx.beginPath(); ctx.arc(wx,wy,r,0,Math.PI*2); ctx.stroke(); }
  for (let a = 0; a < 8; a++) { const ang=(a/8)*Math.PI*2; ctx.beginPath(); ctx.moveTo(wx,wy); ctx.lineTo(wx+Math.cos(ang)*W*0.07,wy+Math.sin(ang)*W*0.07); ctx.stroke(); }
  ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(wx,wy,3,0,Math.PI*2); ctx.stroke(); // spider
  ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(wx,wy-3); ctx.lineTo(wx,wy-W*0.04); ctx.stroke(); // thread
}

function scene4(ctx, W, H) {
  // B&W Busy city / street
  bwSetup(ctx, W, H);

  // Sky with clouds
  [[W*0.15,H*0.08],[W*0.45,H*0.06],[W*0.72,H*0.1]].forEach(([cx,cy]) => {
    ctx.lineWidth = 1.5;
    [[0,0,W*0.07],[W*0.05,-W*0.025,W*0.055],[W*0.1,0,W*0.045],[-W*0.04,-W*0.02,W*0.045]].forEach(([dx,dy,cr]) => {
      ctx.beginPath(); ctx.arc(cx+dx,cy+dy,cr,0,Math.PI*2); ctx.stroke();
    });
  });

  // Buildings
  const blds = [[0,H*0.06,W*0.17,H*0.64],[W*0.16,H*0.18,W*0.14,H*0.52],[W*0.29,H*0.08,W*0.13,H*0.62],[W*0.41,H*0.22,W*0.12,H*0.48],[W*0.52,H*0.05,W*0.15,H*0.65],[W*0.66,H*0.14,W*0.13,H*0.56],[W*0.78,H*0.2,W*0.22,H*0.5]];
  blds.forEach(([bx,by,bw,bh]) => {
    ctx.lineWidth = 1.5;
    ctx.strokeRect(bx,by,bw,bh);
    // Windows grid
    ctx.lineWidth = 0.7;
    for (let wy = by+bh*0.08; wy < by+bh-bh*0.1; wy += bh*0.12) {
      for (let wx = bx+bw*0.1; wx < bx+bw-bw*0.1; wx += bw*0.32) {
        ctx.strokeRect(wx, wy, bw*0.18, bh*0.07);
        // Some windows with X = lit
        if (Math.random() > 0.4) {
          ctx.beginPath(); ctx.moveTo(wx,wy); ctx.lineTo(wx+bw*0.18,wy+bh*0.07); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(wx+bw*0.18,wy); ctx.lineTo(wx,wy+bh*0.07); ctx.stroke();
        }
      }
    }
    // Roof details
    ctx.lineWidth = 1.2;
    for (let rx = bx+bw*0.15; rx < bx+bw-bw*0.1; rx += bw*0.2) {
      ctx.strokeRect(rx, by-bh*0.05, bw*0.08, bh*0.05); // chimneys
    }
  });

  // Road
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0,H*0.72); ctx.lineTo(W,H*0.72); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0,H*0.9); ctx.lineTo(W,H*0.9); ctx.stroke();
  // Dashes
  ctx.lineWidth = 1.5;
  for (let dx = 0; dx < W; dx += W*0.1) {
    ctx.beginPath(); ctx.moveTo(dx,H*0.81); ctx.lineTo(dx+W*0.06,H*0.81); ctx.stroke();
  }
  // Sidewalk
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0,H*0.7); ctx.lineTo(W,H*0.7); ctx.stroke();
  // Pavement lines
  ctx.lineWidth = 0.7;
  for (let tx = W*0.08; tx < W; tx += W*0.08) { ctx.beginPath(); ctx.moveTo(tx,H*0.7); ctx.lineTo(tx,H*0.72); ctx.stroke(); }

  // Street lamps
  [W*0.12,W*0.38,W*0.62,W*0.85].forEach(lx => {
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(lx,H*0.7); ctx.lineTo(lx,H*0.54); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lx,H*0.54); ctx.quadraticCurveTo(lx+W*0.04,H*0.5,lx+W*0.06,H*0.52); ctx.stroke();
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.arc(lx+W*0.06,H*0.52,4,0,Math.PI*2); ctx.stroke();
  });

  // Cars (outline)
  [[W*0.05,H*0.75,W*0.16],[W*0.48,H*0.75,W*0.15],[W*0.73,H*0.76,W*0.14]].forEach(([cx,cy,cw]) => {
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx,cy,cw,cw*0.45);
    ctx.beginPath(); ctx.moveTo(cx+cw*0.12,cy); ctx.lineTo(cx+cw*0.22,cy-cw*0.35); ctx.lineTo(cx+cw*0.75,cy-cw*0.35); ctx.lineTo(cx+cw*0.88,cy); ctx.closePath(); ctx.stroke(); // roof
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.arc(cx+cw*0.22,cy+cw*0.45,cw*0.12,0,Math.PI*2); ctx.stroke(); // wheel L
    ctx.beginPath(); ctx.arc(cx+cw*0.78,cy+cw*0.45,cw*0.12,0,Math.PI*2); ctx.stroke(); // wheel R
    ctx.strokeRect(cx+cw*0.28,cy-cw*0.32,cw*0.18,cw*0.24); // window
    ctx.strokeRect(cx+cw*0.52,cy-cw*0.32,cw*0.18,cw*0.24);
  });

  // People walking
  [[W*0.28,H*0.68],[W*0.42,H*0.68],[W*0.6,H*0.69]].forEach(([px,py]) => {
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(px,py-H*0.055,H*0.018,0,Math.PI*2); ctx.stroke(); // head
    ctx.beginPath(); ctx.moveTo(px,py-H*0.037); ctx.lineTo(px,py); ctx.stroke(); // body
    ctx.beginPath(); ctx.moveTo(px-W*0.012,py-H*0.02); ctx.lineTo(px+W*0.012,py-H*0.02); ctx.stroke(); // arms
    ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(px-W*0.01,py+H*0.03); ctx.stroke(); // leg L
    ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(px+W*0.01,py+H*0.03); ctx.stroke(); // leg R
  });

  // Signs
  ctx.lineWidth = 1.5;
  ctx.strokeRect(W*0.33,H*0.28,W*0.12,H*0.05);
  ctx.strokeStyle = '#111'; ctx.fillStyle = '#111';
  ctx.font = `bold ${W*0.022}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('SHOP', W*0.39, H*0.305);
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(W*0.39,H*0.28); ctx.lineTo(W*0.39,H*0.22); ctx.stroke();

  // Pigeons
  [[W*0.15,H*0.72],[W*0.35,H*0.73],[W*0.55,H*0.715],[W*0.7,H*0.725],[W*0.88,H*0.72]].forEach(([px,py]) => {
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(px,py,6,4,0,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(px+5,py-3,3,0,Math.PI*2); ctx.stroke();
    // Wing (M)
    ctx.beginPath(); ctx.moveTo(px-4,py-2); ctx.quadraticCurveTo(px,py-6,px+4,py-2); ctx.stroke();
  });

  // Traffic light
  ctx.lineWidth = 1.5;
  ctx.strokeRect(W*0.92,H*0.42,W*0.04,H*0.12);
  [H*0.44,H*0.49,H*0.54].forEach(lcy => { ctx.beginPath(); ctx.arc(W*0.94,lcy,W*0.012,0,Math.PI*2); ctx.stroke(); });
  ctx.beginPath(); ctx.moveTo(W*0.94,H*0.42); ctx.lineTo(W*0.94,H*0.3); ctx.stroke(); // pole
}

function scene5(ctx, W, H) {
  // B&W Cozy cafe / bookshop interior
  bwSetup(ctx, W, H);

  // Walls & floor
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0,H*0.76); ctx.lineTo(W,H*0.76); ctx.stroke(); // floor line
  // Floor tiles
  ctx.lineWidth = 0.8;
  for (let tx = 0; tx < W; tx += W*0.12) { ctx.beginPath(); ctx.moveTo(tx,H*0.76); ctx.lineTo(tx,H); ctx.stroke(); }
  for (let ty = H*0.82; ty < H; ty += H*0.06) { ctx.beginPath(); ctx.moveTo(0,ty); ctx.lineTo(W,ty); ctx.stroke(); }

  // Windows (with cross & curtain)
  [[W*0.08,H*0.04],[W*0.58,H*0.04]].forEach(([wx,wy]) => {
    ctx.lineWidth = 2;
    ctx.strokeRect(wx,wy,W*0.3,H*0.26);
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(wx+W*0.15,wy); ctx.lineTo(wx+W*0.15,wy+H*0.26); ctx.stroke(); // vertical
    ctx.beginPath(); ctx.moveTo(wx,wy+H*0.13); ctx.lineTo(wx+W*0.3,wy+H*0.13); ctx.stroke(); // horizontal
    // Curtain drape
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(wx,wy); ctx.quadraticCurveTo(wx+W*0.07,wy+H*0.06,wx+W*0.15,wy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(wx+W*0.15,wy); ctx.quadraticCurveTo(wx+W*0.22,wy+H*0.06,wx+W*0.3,wy); ctx.stroke();
  });

  // Bookshelf (right wall)
  ctx.lineWidth = 2;
  ctx.strokeRect(W*0.72,H*0.32,W*0.25,H*0.38);
  ctx.lineWidth = 1;
  [H*0.46,H*0.56,H*0.66].forEach(sy => { ctx.beginPath(); ctx.moveTo(W*0.72,sy); ctx.lineTo(W*0.97,sy); ctx.stroke(); }); // shelves
  // Books on each shelf
  [[W*0.74,H*0.34],[W*0.74,H*0.48],[W*0.74,H*0.58]].forEach(([bsx,bsy]) => {
    for (let bi = 0; bi < 8; bi++) {
      const bx = bsx + bi*W*0.027;
      const bh = H*0.08 + (bi%3)*H*0.02;
      ctx.strokeRect(bx, bsy, W*0.023, bh);
      // book lines
      ctx.beginPath(); ctx.moveTo(bx+W*0.008, bsy); ctx.lineTo(bx+W*0.008, bsy+bh); ctx.stroke();
    }
  });

  // Table with coffee items
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(W*0.1,H*0.62); ctx.lineTo(W*0.65,H*0.62); ctx.stroke(); // tabletop
  ctx.beginPath(); ctx.moveTo(W*0.22,H*0.62); ctx.lineTo(W*0.2,H*0.78); ctx.stroke(); // leg L
  ctx.beginPath(); ctx.moveTo(W*0.53,H*0.62); ctx.lineTo(W*0.55,H*0.78); ctx.stroke(); // leg R

  // Coffee mug
  ctx.lineWidth = 1.5;
  ctx.strokeRect(W*0.14,H*0.53,W*0.09,H*0.09);
  ctx.beginPath(); ctx.arc(W*0.185,H*0.53,W*0.04,Math.PI,0); ctx.stroke(); // rim
  ctx.beginPath(); ctx.moveTo(W*0.23,H*0.57); ctx.quadraticCurveTo(W*0.27,H*0.57,W*0.27,H*0.61); ctx.quadraticCurveTo(W*0.27,H*0.62,W*0.23,H*0.62); ctx.stroke(); // handle
  // Steam
  ctx.lineWidth = 0.8;
  [W*0.16,W*0.185,W*0.21].forEach(sx => {
    ctx.beginPath(); ctx.moveTo(sx,H*0.53); ctx.quadraticCurveTo(sx+5,H*0.49,sx-5,H*0.46); ctx.stroke();
  });

  // Cake slice
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(W*0.4,H*0.53); ctx.lineTo(W*0.32,H*0.62); ctx.lineTo(W*0.5,H*0.62); ctx.closePath(); ctx.stroke(); // triangle
  ctx.beginPath(); ctx.moveTo(W*0.32,H*0.55); ctx.lineTo(W*0.5,H*0.55); ctx.stroke(); // layer
  ctx.beginPath(); ctx.moveTo(W*0.34,H*0.56); ctx.lineTo(W*0.49,H*0.56); ctx.stroke(); // frosting drip lines
  ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(W*0.4,H*0.51,3,0,Math.PI*2); ctx.stroke(); // cherry
  ctx.beginPath(); ctx.moveTo(W*0.4,H*0.51); ctx.lineTo(W*0.42,H*0.47); ctx.stroke(); // stem

  // Plant pots
  [[W*0.04,H*0.65],[W*0.68,H*0.63]].forEach(([px,py]) => {
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(px-W*0.025,py+H*0.08); ctx.lineTo(px-W*0.02,py); ctx.lineTo(px+W*0.02,py); ctx.lineTo(px+W*0.025,py+H*0.08); ctx.closePath(); ctx.stroke(); // pot
    // Leaves
    for (let l = 0; l < 5; l++) {
      const la = (l/5)*Math.PI*2-Math.PI/2;
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.ellipse(px+Math.cos(la)*W*0.04,py-W*0.015+Math.sin(la)*W*0.03,W*0.03,W*0.015,la,0,Math.PI*2); ctx.stroke();
    }
    ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(px,py-H*0.04); ctx.stroke(); // main stem
  });

  // Hanging bulbs
  ctx.lineWidth = 1;
  for (let lx = W*0.12; lx < W; lx += W*0.2) {
    ctx.beginPath(); ctx.moveTo(lx,0); ctx.lineTo(lx,H*0.1); ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(lx,H*0.1,W*0.014,0,Math.PI*2); ctx.stroke(); // bulb
    ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.arc(lx,H*0.1,W*0.024,0,Math.PI*2); ctx.stroke(); // glow ring
    ctx.lineWidth = 1;
  }

  // Clock on wall
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(W*0.38,H*0.22,W*0.055,0,Math.PI*2); ctx.stroke();
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(W*0.38,H*0.22); ctx.lineTo(W*0.38,H*0.22-W*0.035); ctx.stroke(); // 12 hand
  ctx.beginPath(); ctx.moveTo(W*0.38,H*0.22); ctx.lineTo(W*0.38+W*0.025,H*0.22+W*0.01); ctx.stroke(); // 3 hand
  // Hour marks
  for (let hm = 0; hm < 12; hm++) {
    const ha = (hm/12)*Math.PI*2; const hr = W*0.045;
    ctx.beginPath(); ctx.arc(W*0.38+Math.cos(ha)*hr, H*0.22+Math.sin(ha)*hr,1.5,0,Math.PI*2); ctx.fill();
  }
}

function scene6(ctx, W, H) {
  // B&W Space / cosmos doodle
  bwSetup(ctx, W, H);

  // Stars (various sizes)
  ctx.lineWidth = 0.7;
  for (let s = 0; s < 60; s++) {
    const sx = (s*W*0.017+W*0.03)%W, sy = (s*H*0.023+H*0.04)%H;
    const ss = [1,1.5,2,2.5,3][s%5];
    ctx.beginPath(); ctx.arc(sx,sy,ss,0,Math.PI*2); ctx.stroke();
    if (ss > 2) { // cross sparkle
      ctx.beginPath(); ctx.moveTo(sx-ss*1.8,sy); ctx.lineTo(sx+ss*1.8,sy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sx,sy-ss*1.8); ctx.lineTo(sx,sy+ss*1.8); ctx.stroke();
    }
  }

  // Milky way band (dotted arcs)
  ctx.lineWidth = 0.5;
  ctx.setLineDash([2,6]);
  ctx.beginPath(); ctx.ellipse(W*0.5,H*1.1,W*0.6,H*0.9,0.3,Math.PI*1.1,Math.PI*1.9); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(W*0.5,H*1.1,W*0.7,H*0.95,0.3,Math.PI*1.1,Math.PI*1.9); ctx.stroke();
  ctx.setLineDash([]);

  // Large Moon
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(W*0.5, H*0.84, W*0.17, 0, Math.PI*2); ctx.stroke();
  // Craters
  ctx.lineWidth = 1;
  [[W*0.44,H*0.8,W*0.025],[W*0.56,H*0.87,W*0.02],[W*0.46,H*0.89,W*0.015],[W*0.54,H*0.8,W*0.012]].forEach(([cx,cy,cr]) => {
    ctx.beginPath(); ctx.arc(cx,cy,cr,0,Math.PI*2); ctx.stroke();
  });

  // Saturn-like planet
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(W*0.76,H*0.18,W*0.08,0,Math.PI*2); ctx.stroke();
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.ellipse(W*0.76,H*0.18,W*0.14,W*0.028,0.2,0,Math.PI*2); ctx.stroke(); // ring
  // Surface lines
  ctx.lineWidth = 0.8;
  [H*0.15,H*0.18,H*0.21].forEach(ly => {
    ctx.beginPath(); ctx.arc(W*0.76,H*0.18,W*0.08,Math.asin((ly-H*0.18)/W*12.5)||0,Math.PI-(Math.asin((ly-H*0.18)/W*12.5)||0)); ctx.stroke();
  });

  // Small planet (left)
  ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.arc(W*0.18,H*0.32,W*0.055,0,Math.PI*2); ctx.stroke();
  ctx.lineWidth = 0.8;
  [[W*0.16,H*0.29,W*0.015],[W*0.21,H*0.34,W*0.012]].forEach(([cx,cy,cr]) => { ctx.beginPath(); ctx.arc(cx,cy,cr,0,Math.PI*2); ctx.stroke(); });

  // Another planet (right mid)
  ctx.lineWidth = 1.8;
  ctx.beginPath(); ctx.arc(W*0.88,H*0.52,W*0.045,0,Math.PI*2); ctx.stroke();

  // Rocket
  ctx.lineWidth = 1.8;
  const rx = W*0.5, ry = H*0.25;
  ctx.beginPath(); ctx.moveTo(rx,ry-W*0.08); ctx.lineTo(rx-W*0.03,ry+W*0.02); ctx.lineTo(rx+W*0.03,ry+W*0.02); ctx.closePath(); ctx.stroke(); // body
  ctx.strokeRect(rx-W*0.03,ry+W*0.02,W*0.06,W*0.04); // thruster
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(rx-W*0.03,ry+W*0.05); ctx.lineTo(rx-W*0.05,ry+W*0.1); ctx.lineTo(rx-W*0.01,ry+W*0.06); ctx.closePath(); ctx.stroke(); // fin L
  ctx.beginPath(); ctx.moveTo(rx+W*0.03,ry+W*0.05); ctx.lineTo(rx+W*0.05,ry+W*0.1); ctx.lineTo(rx+W*0.01,ry+W*0.06); ctx.closePath(); ctx.stroke(); // fin R
  ctx.beginPath(); ctx.arc(rx,ry-W*0.02,W*0.016,0,Math.PI*2); ctx.stroke(); // porthole
  // Flame (dotted)
  ctx.lineWidth = 0.8; ctx.setLineDash([2,3]);
  ctx.beginPath(); ctx.moveTo(rx-W*0.015,ry+W*0.06); ctx.lineTo(rx,ry+W*0.14); ctx.lineTo(rx+W*0.015,ry+W*0.06); ctx.stroke();
  ctx.setLineDash([]);

  // Astronaut (floating)
  ctx.lineWidth = 1.5;
  const ax = W*0.22, ay = H*0.68;
  ctx.beginPath(); ctx.arc(ax,ay-W*0.055,W*0.042,0,Math.PI*2); ctx.stroke(); // helmet
  ctx.beginPath(); ctx.ellipse(ax,ay+W*0.02,W*0.035,W*0.06,0,0,Math.PI*2); ctx.stroke(); // suit
  ctx.strokeRect(ax-W*0.04,ay+W*0.08,W*0.015,W*0.04); // backpack
  ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.ellipse(ax-W*0.06,ay,W*0.016,W*0.04,-0.3,0,Math.PI*2); ctx.stroke(); // arm L
  ctx.beginPath(); ctx.ellipse(ax+W*0.06,ay,W*0.016,W*0.04,0.3,0,Math.PI*2); ctx.stroke(); // arm R
  ctx.beginPath(); ctx.ellipse(ax-W*0.025,ay+W*0.085,W*0.014,W*0.04,-0.1,0,Math.PI*2); ctx.stroke(); // leg L
  ctx.beginPath(); ctx.ellipse(ax+W*0.025,ay+W*0.085,W*0.014,W*0.04,0.1,0,Math.PI*2); ctx.stroke(); // leg R
  // Visor
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(ax,ay-W*0.055,W*0.028,Math.PI*0.15,Math.PI*0.85); ctx.stroke();
  // Tether
  ctx.lineWidth = 0.8; ctx.setLineDash([3,4]);
  ctx.beginPath(); ctx.moveTo(ax+W*0.04,ay); ctx.quadraticCurveTo(W*0.38,ay-H*0.06,W*0.47,ry+W*0.06); ctx.stroke();
  ctx.setLineDash([]);

  // UFO
  ctx.lineWidth = 1.8;
  const ux = W*0.7, uy = H*0.55;
  ctx.beginPath(); ctx.ellipse(ux,uy,W*0.09,W*0.03,0,0,Math.PI*2); ctx.stroke(); // saucer body
  ctx.beginPath(); ctx.ellipse(ux,uy-W*0.03,W*0.045,W*0.045,0,0,Math.PI*2); ctx.stroke(); // dome
  ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.arc(ux-W*0.025,uy-W*0.025,W*0.01,0,Math.PI*2); ctx.stroke(); // dome window L
  ctx.beginPath(); ctx.arc(ux+W*0.025,uy-W*0.025,W*0.01,0,Math.PI*2); ctx.stroke(); // dome window R
  // Beam (dotted lines)
  ctx.setLineDash([4,5]);
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(ux-W*0.04,uy+W*0.03); ctx.lineTo(ux-W*0.07,uy+W*0.14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ux+W*0.04,uy+W*0.03); ctx.lineTo(ux+W*0.07,uy+W*0.14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ux,uy+W*0.03); ctx.lineTo(ux,uy+W*0.14); ctx.stroke();
  ctx.setLineDash([]);

  // Comets
  [[W*0.08,H*0.1],[W*0.38,H*0.05],[W*0.82,H*0.35]].forEach(([cx,cy]) => {
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx,cy,4,0,Math.PI*2); ctx.stroke();
    ctx.setLineDash([3,4]); ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(cx-4,cy); ctx.lineTo(cx-W*0.08,cy+H*0.03); ctx.stroke();
    ctx.setLineDash([]);
  });

  // Alien figures (small, outline)
  [[W*0.62,H*0.72],[W*0.42,H*0.78]].forEach(([alx,aly]) => {
    const alr = W*0.04;
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.ellipse(alx,aly-alr*1.5,alr*1.2,alr,0,0,Math.PI*2); ctx.stroke(); // head
    ctx.beginPath(); ctx.ellipse(alx,aly,alr*0.7,alr*1.2,0,0,Math.PI*2); ctx.stroke(); // body
    ctx.beginPath(); ctx.arc(alx-alr*0.35,aly-alr*1.5,alr*0.22,0,Math.PI*2); ctx.stroke(); // eye L
    ctx.beginPath(); ctx.arc(alx+alr*0.35,aly-alr*1.5,alr*0.22,0,Math.PI*2); ctx.stroke(); // eye R
    // Antennae
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(alx-alr*0.2,aly-alr*2.3); ctx.lineTo(alx-alr*0.5,aly-alr*3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(alx+alr*0.2,aly-alr*2.3); ctx.lineTo(alx+alr*0.5,aly-alr*3); ctx.stroke();
    ctx.beginPath(); ctx.arc(alx-alr*0.5,aly-alr*3,alr*0.13,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(alx+alr*0.5,aly-alr*3,alr*0.13,0,Math.PI*2); ctx.stroke();
    // Arms & legs
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(alx-alr*0.5,aly-alr*0.3); ctx.lineTo(alx-alr*1.2,aly+alr*0.3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(alx+alr*0.5,aly-alr*0.3); ctx.lineTo(alx+alr*1.2,aly+alr*0.3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(alx-alr*0.3,aly+alr*1.1); ctx.lineTo(alx-alr*0.3,aly+alr*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(alx+alr*0.3,aly+alr*1.1); ctx.lineTo(alx+alr*0.3,aly+alr*2); ctx.stroke();
  });
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
