/* =============================================
   Mummy'S BIRTHDAY WEBSITE - JAVASCRIPT
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

// Start Experience via Launch Screen
function startExperience() {
  const launchScreen = document.getElementById('launch-screen');
  
  // Play music
  if (!musicPlaying) {
    bgMusic.play().then(() => {
      musicPlaying = true;
      musicIcon.textContent = '⏸';
      musicBtn.classList.add('playing');
    }).catch(e => console.error("Audio play failed:", e));
  }

  // Hide overlay and allow scrolling
  document.body.classList.remove('no-scroll');
  launchScreen.style.opacity = '0';
  launchScreen.style.visibility = 'hidden';
  setTimeout(() => {
    launchScreen.style.display = 'none';
  }, 800);
}

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

    if (candySelected) {
      const dr = Math.abs(candySelected.r - r);
      const dc = Math.abs(candySelected.c - c);
      if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
        // Clicked adjacent candy — Swap!
        const srcR = candySelected.r, srcC = candySelected.c;
        candySwipeStart = null; candySwipeStartPos = null; candySelected = null;
        attemptSwap(srcR, srcC, r, c);
        return;
      } else if (candySelected.r === r && candySelected.c === c) {
        // Tapped same candy, deselect
        candySwipeStart = null; candySwipeStartPos = null; candySelected = null;
        renderCandy();
        return;
      }
    }

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
  // Calico cat - white base with distinct patches to prevent perfect invisibility
  const bodyColor = '#ffffff'; 
  const orangePatch = '#ff9f43';
  const blackPatch = '#2f3640';
  const outlineColor = '#1e272e';
  
  // Subtle shadow to separate from background
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = cr * 0.15;
  ctx.shadowOffsetY = cr * 0.05;
  
  // Body (oval)
  ctx.beginPath();
  ctx.ellipse(cx, cy + cr * 0.4, cr * 0.7, cr * 0.55, 0, 0, Math.PI * 2);
  ctx.fillStyle = bodyColor;
  ctx.fill();
  ctx.shadowColor = 'transparent'; // only shadow on the base shape
  
  // Body Patches
  ctx.fillStyle = orangePatch;
  ctx.beginPath(); ctx.ellipse(cx - cr * 0.3, cy + cr * 0.3, cr * 0.25, cr * 0.3, -0.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = blackPatch;
  ctx.beginPath(); ctx.ellipse(cx + cr * 0.4, cy + cr * 0.5, cr * 0.2, cr * 0.25, 0.4, 0, Math.PI * 2); ctx.fill();

  ctx.strokeStyle = outlineColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx, cy + cr * 0.4, cr * 0.7, cr * 0.55, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Head
  ctx.shadowColor = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(cx, cy - cr * 0.1, cr * 0.5, cr * 0.48, 0, 0, Math.PI * 2);
  ctx.fillStyle = bodyColor;
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Head patches
  ctx.fillStyle = orangePatch;
  ctx.beginPath(); ctx.ellipse(cx - cr * 0.2, cy - cr * 0.3, cr * 0.18, cr * 0.18, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = blackPatch;
  ctx.beginPath(); ctx.ellipse(cx + cr * 0.25, cy - cr * 0.2, cr * 0.15, cr * 0.18, 0, 0, Math.PI*2); ctx.fill();

  ctx.strokeStyle = outlineColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(cx, cy - cr * 0.1, cr * 0.5, cr * 0.48, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Ears
  ctx.strokeStyle = outlineColor;
  ctx.lineWidth = 1.5;
  // Left ear (orange)
  ctx.fillStyle = orangePatch;
  ctx.beginPath();
  ctx.moveTo(cx - cr * 0.35, cy - cr * 0.45);
  ctx.lineTo(cx - cr * 0.52, cy - cr * 0.9);
  ctx.lineTo(cx - cr * 0.15, cy - cr * 0.5);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  // Right ear (black)
  ctx.fillStyle = blackPatch;
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
  ctx.fillStyle = '#1e272e';
  ctx.beginPath(); ctx.ellipse(cx - cr * 0.18, cy - cr * 0.12, cr * 0.1, cr * 0.12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + cr * 0.18, cy - cr * 0.12, cr * 0.1, cr * 0.12, 0, 0, Math.PI * 2); ctx.fill();
  // Eye shine
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath(); ctx.arc(cx - cr * 0.14, cy - cr * 0.16, cr * 0.04, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + cr * 0.22, cy - cr * 0.16, cr * 0.04, 0, Math.PI * 2); ctx.fill();

  // Nose
  ctx.fillStyle = '#ffb3c6';
  ctx.beginPath(); ctx.arc(cx, cy, cr * 0.07, 0, Math.PI * 2); ctx.fill();

  // Whiskers
  ctx.strokeStyle = outlineColor;
  ctx.lineWidth = 1;
  [[-0.12,-0.35,-0.55,0.02],[-0.12,-0.01,-0.55,0.12],
   [0.12,-0.35, 0.55,0.02],[ 0.12,-0.01, 0.55,0.12]].forEach(([sx,sy,ex,ey]) => {
    ctx.beginPath();
    ctx.moveTo(cx + sx * cr * 2, cy + sy * cr * 2);
    ctx.lineTo(cx + ex * cr * 2, cy + ey * cr * 2);
    ctx.stroke();
  });

  // Tail
  ctx.strokeStyle = outlineColor;
  ctx.lineWidth = cr * 0.22;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx + cr * 0.6, cy + cr * 0.6);
  ctx.quadraticCurveTo(cx + cr * 1.4, cy + cr * 1.1, cx + cr * 0.9, cy + cr * 0.1);
  ctx.stroke();
  
  // Tail color inner
  ctx.strokeStyle = orangePatch;
  ctx.lineWidth = cr * 0.14;
  ctx.beginPath();
  ctx.moveTo(cx + cr * 0.6, cy + cr * 0.6);
  ctx.quadraticCurveTo(cx + cr * 1.4, cy + cr * 1.1, cx + cr * 0.9, cy + cr * 0.1);
  ctx.stroke();

  ctx.restore();
}

// ---- DOODLE SCENES ----
const scenePalettes = [
  ['#81C784', '#AED581', '#FFD54F', '#FF8A65', '#4FC3F7', '#BA68C8', '#F06292'], // Scene 1
  ['#4DD0E1', '#81D4FA', '#90CAF9', '#B39DDB', '#FFCC80', '#F48FB1', '#E6EE9C'], // Scene 2
  ['#AED581', '#DCE775', '#FFF176', '#FFB74D', '#A1887F', '#90A4AE', '#FF8A65'], // Scene 3
  ['#7986CB', '#5C6BC0', '#9FA8DA', '#FFD54F', '#FF8A65', '#F06292', '#E0E0E0'], // Scene 4
  ['#FFB74D', '#FF8A65', '#A1887F', '#DCE775', '#FFD54F', '#FFF176', '#F48FB1'], // Scene 5
  ['#E1BEE7', '#CE93D8', '#BA68C8', '#90CAF9', '#81D4FA', '#FFF59D', '#FFCC80']  // Scene 6
];
let colorIndex = 0;
function colorSetup(ctx, W, H, sceneIdx) {
  ctx.fillStyle = '#fafafa'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#2c3e50';
  ctx.lineWidth = 1.2;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  colorIndex = 0;
}
function nextColor(sceneIdx) {
  const p = scenePalettes[sceneIdx % scenePalettes.length];
  return p[(colorIndex++) % p.length];
}
  ctx.fillStyle = nextColor(currentSceneIdx); ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#111'; ctx.fillStyle = '#111';
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.setLineDash([]);
}

// Shared micro-detail helpers
function doodleHatch(ctx, x, y, w, h, gap=8, angle=Math.PI/4) {
  ctx.save();
  ctx.beginPath(); ctx.rect(x,y,w,h); ctx.clip();
  ctx.lineWidth=0.6; ctx.strokeStyle='#333';
  const diag = Math.sqrt(w*w+h*h);
  for (let d=-diag; d<diag; d+=gap) {
    ctx.beginPath();
    ctx.moveTo(x + d*Math.cos(angle) - diag*Math.sin(angle), y + d*Math.sin(angle) + diag*Math.cos(angle));
    ctx.lineTo(x + d*Math.cos(angle) + diag*Math.sin(angle), y + d*Math.sin(angle) - diag*Math.cos(angle));
    ctx.stroke();
  }
  ctx.restore();
}
function doodleDots(ctx, x, y, w, h, gap=10) {
  ctx.save(); ctx.fillStyle='#333';
  for (let px=x+gap/2; px<x+w; px+=gap)
    for (let py=y+gap/2; py<y+h; py+=gap) {
      ctx.beginPath(); ctx.arc(px,py,1,0,Math.PI*2); ctx.fill();
    }
  ctx.restore();
}
function doodleWavyLine(ctx, x1, y1, x2, y2, amp=8, freq=25) {
  const len = Math.sqrt((x2-x1)**2+(y2-y1)**2);
  const steps = Math.ceil(len/freq);
  ctx.beginPath(); ctx.moveTo(x1, y1);
  for (let i=1; i<=steps; i++) {
    const t = i/steps;
    const mx = x1+(x2-x1)*((i-0.5)/steps), my = y1+(y2-y1)*((i-0.5)/steps);
    const perp = {x:-(y2-y1)/len, y:(x2-x1)/len};
    const wave = amp * Math.sin(i * Math.PI);
    ctx.quadraticCurveTo(mx+perp.x*wave, my+perp.y*wave, x1+(x2-x1)*t, y1+(y2-y1)*t);
  }
  ctx.stroke();
}
function doodleTree(ctx, tx, ty, th, tw) {
  ctx.lineWidth=Math.max(1.5,tw*0.12); ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(tx,ty-th*0.4); ctx.stroke();
  ctx.lineWidth=Math.max(1,tw*0.08);
  ctx.beginPath(); ctx.moveTo(tx,ty-th*0.22); ctx.lineTo(tx-tw,ty-th*0.45); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(tx,ty-th*0.28); ctx.lineTo(tx+tw,ty-th*0.42); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(tx,ty-th*0.35); ctx.lineTo(tx-tw*0.5,ty-th*0.52); ctx.stroke();
  ctx.lineWidth=1.2;
  for (let layer=0; layer<3; layer++) {
    const ly = ty-th*(0.45+layer*0.18), lw = tw*(1-layer*0.25);
    ctx.beginPath(); ctx.moveTo(tx,ly-th*0.2); ctx.lineTo(tx-lw,ly); ctx.lineTo(tx+lw,ly); ctx.closePath(); ctx.stroke();
    // texture
    for (let tx2=tx-lw; tx2<tx+lw; tx2+=lw*0.3) {
      ctx.beginPath(); ctx.arc(tx2+Math.random()*lw*0.2, ly-th*0.06+Math.random()*th*0.08, 2+Math.random()*3, 0, Math.PI*2); ctx.stroke();
    }
  }
}
function doodleBrick(ctx, x, y, w, h, bw=18, bh=10) {
  ctx.save(); ctx.lineWidth=0.8;
  for (let by=y; by<y+h; by+=bh) {
    const offset = Math.floor((by-y)/bh)%2===0 ? 0 : bw/2;
    for (let bx=x-offset; bx<x+w; bx+=bw) {
      const rx=Math.max(x,bx), ry=by, rw=Math.min(x+w,bx+bw)-rx, rh=Math.min(y+h,by+bh)-ry;
      if (rw>0&&rh>0) ctx.strokeRect(rx,ry,rw,rh);
    }
  }
  ctx.restore();
}
function doodleRope(ctx, x1,y1,x2,y2, sag=20) {
  ctx.lineWidth=1.2;
  const mx=(x1+x2)/2, my=(y1+y2)/2+sag;
  ctx.beginPath(); ctx.moveTo(x1,y1); ctx.quadraticCurveTo(mx,my,x2,y2); ctx.stroke();
}
function doodleSmoke(ctx, x, y, r) {
  ctx.lineWidth=0.9;
  for (let s=0; s<5; s++) {
    const sy=y-s*r*0.7, sr=r*(0.5+s*0.15), sx=x+Math.sin(s*1.2)*r*0.4;
    ctx.beginPath(); ctx.arc(sx,sy,sr,0,Math.PI*2); ctx.stroke();
  }
}
function doodleFlower(ctx, fx, fy, fr) {
  ctx.lineWidth=0.9;
  for (let p=0; p<7; p++) {
    const a=(p/7)*Math.PI*2;
    ctx.beginPath(); ctx.ellipse(fx+Math.cos(a)*fr, fy+Math.sin(a)*fr, fr*0.7, fr*0.4, a, 0, Math.PI*2); ctx.stroke();
  }
  ctx.lineWidth=1; ctx.beginPath(); ctx.arc(fx,fy,fr*0.45,0,Math.PI*2); ctx.stroke();
  // petal veins
  for (let p=0; p<7; p++) {
    const a=(p/7)*Math.PI*2;
    ctx.lineWidth=0.4;
    ctx.beginPath(); ctx.moveTo(fx,fy); ctx.lineTo(fx+Math.cos(a)*fr*1.4, fy+Math.sin(a)*fr*1.4); ctx.stroke();
  }
}
function doodlePerson(ctx, x, y, s) {
  ctx.lineWidth=1.3;
  ctx.beginPath(); ctx.arc(x,y-s*0.85,s*0.13,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x,y-s*0.72); ctx.lineTo(x,y-s*0.28); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x-s*0.16,y-s*0.55); ctx.lineTo(x+s*0.16,y-s*0.55); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x,y-s*0.28); ctx.lineTo(x-s*0.14,y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x,y-s*0.28); ctx.lineTo(x+s*0.14,y); ctx.stroke();
}
function doodleBird(ctx, x, y, r) {
  ctx.lineWidth=1.2;
  ctx.beginPath(); ctx.moveTo(x-r,y); ctx.quadraticCurveTo(x-r/2,y-r*0.6,x,y);
  ctx.quadraticCurveTo(x+r/2,y-r*0.6,x+r,y); ctx.stroke();
}
function doodleCloud(ctx, x, y, r) {
  ctx.lineWidth=1.3;
  [[0,0,r],[r*0.65,-r*0.3,r*0.72],[r*1.2,0,r*0.6],[-r*0.5,-r*0.2,r*0.62]].forEach(([dx,dy,cr]) => {
    ctx.beginPath(); ctx.arc(x+dx,y+dy,cr,0,Math.PI*2); ctx.stroke();
  });
}
function doodleWindow(ctx, x, y, w, h) {
  ctx.lineWidth=1.2; ctx.strokeRect(x,y,w,h);
  ctx.beginPath(); ctx.moveTo(x+w/2,y); ctx.lineTo(x+w/2,y+h); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x,y+h/2); ctx.lineTo(x+w,y+h/2); ctx.stroke();
  // sill
  ctx.beginPath(); ctx.moveTo(x-2,y+h); ctx.lineTo(x+w+2,y+h); ctx.stroke();
}
function doodleStars(ctx, cx, cy, r, n=5) {
  ctx.lineWidth=0.8;
  ctx.beginPath();
  for (let i=0;i<n*2;i++) {
    const a=(i/(n*2))*Math.PI*2-Math.PI/2;
    const rad=i%2===0?r:r*0.45;
    if(i===0) ctx.moveTo(cx+Math.cos(a)*rad,cy+Math.sin(a)*rad);
    else ctx.lineTo(cx+Math.cos(a)*rad,cy+Math.sin(a)*rad);
  }
  ctx.closePath(); ctx.stroke();
}
function doodleLantern(ctx, x, y, r) {
  ctx.lineWidth=1;
  ctx.beginPath(); ctx.ellipse(x,y,r*0.6,r,0,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.rect(x-r*0.5,y-r*0.3,r,r*0.6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x,y-r); ctx.lineTo(x,y-r*1.4); ctx.stroke();
  ctx.beginPath(); ctx.arc(x,y,r*0.2,0,Math.PI*2); ctx.stroke();
}
function doodleBalloon(ctx, x, y, r) {
  ctx.lineWidth=1.2;
  ctx.beginPath(); ctx.ellipse(x,y,r,r*1.2,0,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x-r*0.2,y+r*1.2); ctx.lineTo(x+r*0.2,y+r*1.2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x,y+r*1.2); ctx.lineTo(x+r*0.1,y+r*2); ctx.stroke();
  doodleWavyLine(ctx,x+r*0.1,y+r*2,x+r*0.1,y+r*2.8,3,12);
}
function doodleFish(ctx, fx, fy, fr, dir=1) {
  ctx.lineWidth=1.2;
  ctx.beginPath(); ctx.ellipse(fx,fy,fr,fr*0.5,0,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(fx-dir*fr,fy); ctx.lineTo(fx-dir*fr*1.6,fy-fr*0.55); ctx.lineTo(fx-dir*fr*1.6,fy+fr*0.55); ctx.closePath(); ctx.stroke();
  ctx.lineWidth=0.7;
  ctx.beginPath(); ctx.arc(fx+dir*fr*0.5,fy-fr*0.12,fr*0.14,0,Math.PI*2); ctx.stroke();
  for (let sc=0;sc<3;sc++) { ctx.beginPath(); ctx.arc(fx-dir*fr*0.15+sc*dir*fr*0.22,fy,fr*0.28,0,Math.PI,dir<0); ctx.stroke(); }
}

// =================== SCENE 1: PACKED MARKET FESTIVAL ===================
function scene1(ctx, W, H) {
  colorSetup(ctx, W, H, 0);

  // Sky texture - lots of small clouds and birds
  for (let i=0;i<8;i++) doodleCloud(ctx, W*(0.05+i*0.13), H*(0.04+((i*37)%5)*0.03), W*0.055);
  for (let i=0;i<12;i++) doodleBird(ctx, W*(0.05+i*0.09), H*(0.06+(i%3)*0.05), W*0.018);
  // Sun top right with detailed rays
  ctx.lineWidth=1.8; ctx.beginPath(); ctx.arc(W*0.88, H*0.08, W*0.06, 0, Math.PI*2); ctx.stroke();
  for (let i=0;i<16;i++) {
    const a=(i/16)*Math.PI*2;
    ctx.lineWidth=1; ctx.beginPath();
    ctx.moveTo(W*0.88+Math.cos(a)*W*0.075, H*0.08+Math.sin(a)*W*0.075);
    ctx.lineTo(W*0.88+Math.cos(a)*W*(0.095+((i%3)*0.01)), H*0.08+Math.sin(a)*W*(0.095+((i%3)*0.01)));
    ctx.stroke();
  }
  // Face in sun
  ctx.lineWidth=0.8;
  ctx.beginPath(); ctx.arc(W*0.875,H*0.072,W*0.012,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(W*0.893,H*0.072,W*0.012,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(W*0.884,H*0.088,W*0.018,0,Math.PI); ctx.stroke();

  // Ground
  ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(0,H*0.76); ctx.lineTo(W,H*0.76); ctx.stroke();
  doodleHatch(ctx,0,H*0.76,W,H*0.24,12);

  // === LEFT BUILDING with brick detail ===
  ctx.lineWidth=1.5; ctx.strokeRect(0,H*0.12,W*0.22,H*0.64);
  doodleBrick(ctx,0,H*0.12,W*0.22,H*0.64,20,12);
  // 4 windows
  [[W*0.03,H*0.15],[W*0.12,H*0.15],[W*0.03,H*0.3],[W*0.12,H*0.3],
   [W*0.03,H*0.45],[W*0.12,H*0.45],[W*0.03,H*0.6],[W*0.12,H*0.6]].forEach(([wx,wy]) => doodleWindow(ctx,wx,wy,W*0.06,H*0.08));
  // Water tank on roof
  ctx.lineWidth=1.2; ctx.strokeRect(W*0.07,H*0.08,W*0.08,H*0.05);
  ctx.beginPath(); ctx.moveTo(W*0.1,H*0.08); ctx.lineTo(W*0.1,H*0.04); ctx.stroke();
  ctx.beginPath(); ctx.arc(W*0.1,H*0.04,W*0.015,0,Math.PI*2); ctx.stroke();
  // Clothesline
  doodleRope(ctx,W*0.22,H*0.2,W*0.42,H*0.22,15);
  [[W*0.27,H*0.18],[W*0.31,H*0.17],[W*0.35,H*0.185],[W*0.39,H*0.18]].forEach(([cx2,cy2]) => {
    ctx.lineWidth=0.8; ctx.beginPath(); ctx.moveTo(cx2,cy2); ctx.lineTo(cx2,cy2+H*0.06); ctx.stroke();
    ctx.strokeRect(cx2-W*0.015,cy2+H*0.01,W*0.03,H*0.05);
  });

  // === CENTER BUILDING with arch ===
  ctx.lineWidth=1.5; ctx.strokeRect(W*0.22,H*0.18,W*0.28,H*0.58);
  doodleBrick(ctx,W*0.22,H*0.18,W*0.28,H*0.58,18,10);
  // Big arch door
  ctx.lineWidth=1.8;
  ctx.beginPath(); ctx.moveTo(W*0.3,H*0.76); ctx.lineTo(W*0.3,H*0.55); ctx.arc(W*0.36,H*0.55,W*0.06,Math.PI,0); ctx.lineTo(W*0.42,H*0.76); ctx.stroke();
  doodleHatch(ctx,W*0.3,H*0.55,W*0.12,H*0.21,8,-Math.PI/4);
  // windows
  [[W*0.25,H*0.22],[W*0.36,H*0.22],[W*0.25,H*0.36],[W*0.36,H*0.36]].forEach(([wx,wy]) => doodleWindow(ctx,wx,wy,W*0.07,H*0.1));
  // Clock face on building
  ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(W*0.36,H*0.5,W*0.035,0,Math.PI*2); ctx.stroke();
  ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(W*0.36,H*0.5); ctx.lineTo(W*0.36,H*0.47); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.36,H*0.5); ctx.lineTo(W*0.385,H*0.5); ctx.stroke();
  for (let hm=0;hm<12;hm++) { const ha=(hm/12)*Math.PI*2; ctx.beginPath(); ctx.arc(W*0.36+Math.cos(ha)*W*0.029,H*0.5+Math.sin(ha)*W*0.029,1.5,0,Math.PI*2); ctx.fill(); }

  // === RIGHT BUILDING ===
  ctx.lineWidth=1.5; ctx.strokeRect(W*0.72,H*0.15,W*0.28,H*0.61);
  doodleBrick(ctx,W*0.72,H*0.15,W*0.28,H*0.61,20,12);
  [[W*0.75,H*0.19],[W*0.86,H*0.19],[W*0.75,H*0.34],[W*0.86,H*0.34],
   [W*0.75,H*0.49],[W*0.86,H*0.49],[W*0.75,H*0.64],[W*0.86,H*0.64]].forEach(([wx,wy]) => doodleWindow(ctx,wx,wy,W*0.07,H*0.09));
  // Fancy roof
  ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(W*0.72,H*0.15); ctx.lineTo(W*0.86,H*0.05); ctx.lineTo(W,H*0.15); ctx.stroke();
  // Flag
  ctx.lineWidth=1.2; ctx.beginPath(); ctx.moveTo(W*0.86,H*0.05); ctx.lineTo(W*0.86,H*0.0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.86,H*0.0); ctx.lineTo(W*0.95,H*0.025); ctx.lineTo(W*0.86,H*0.05); ctx.stroke();

  // Cobblestone street
  ctx.lineWidth=0.6;
  for (let cy2=H*0.78; cy2<H; cy2+=H*0.04)
    for (let cx2=0; cx2<W; cx2+=W*0.08) {
      ctx.beginPath(); ctx.ellipse(cx2+W*0.04,cy2+H*0.02,W*0.038,H*0.018,0,0,Math.PI*2); ctx.stroke();
    }

  // Street stalls / market
  // Stall 1 (left)
  ctx.lineWidth=1.2;
  ctx.beginPath(); ctx.moveTo(W*0.02,H*0.76); ctx.lineTo(W*0.02,H*0.65); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.2,H*0.76); ctx.lineTo(W*0.2,H*0.65); ctx.stroke();
  doodleWavyLine(ctx,W*0.0,H*0.65,W*0.22,H*0.65,5,15);
  ctx.beginPath(); ctx.moveTo(W*0.0,H*0.65); ctx.lineTo(W*0.11,H*0.6); ctx.lineTo(W*0.22,H*0.65); ctx.stroke();
  // fruits on stall
  [[W*0.04,H*0.71],[W*0.09,H*0.7],[W*0.14,H*0.71],[W*0.19,H*0.72]].forEach(([fx,fy]) => {
    ctx.beginPath(); ctx.arc(fx,fy,W*0.02,0,Math.PI*2); ctx.stroke();
    ctx.lineWidth=0.5; ctx.beginPath(); ctx.moveTo(fx,fy-W*0.02); ctx.lineTo(fx+W*0.01,fy-W*0.035); ctx.stroke();
    ctx.lineWidth=1.2;
  });

  // Stall 2 (right center)
  ctx.lineWidth=1.2;
  ctx.beginPath(); ctx.moveTo(W*0.5,H*0.76); ctx.lineTo(W*0.5,H*0.62); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.7,H*0.76); ctx.lineTo(W*0.7,H*0.62); ctx.stroke();
  // Striped awning
  for (let sx=W*0.5; sx<W*0.7; sx+=W*0.03) {
    ctx.lineWidth=(Math.floor((sx-W*0.5)/(W*0.03))%2===0)?1.5:0.5;
    ctx.beginPath(); ctx.moveTo(sx,H*0.62); ctx.lineTo(sx,H*0.67); ctx.stroke();
  }
  ctx.lineWidth=1.2; ctx.beginPath(); ctx.moveTo(W*0.5,H*0.62); ctx.lineTo(W*0.6,H*0.57); ctx.lineTo(W*0.7,H*0.62); ctx.stroke();
  // Hanging items
  [W*0.53,W*0.58,W*0.63,W*0.68].forEach(hx => {
    ctx.lineWidth=0.8; ctx.beginPath(); ctx.moveTo(hx,H*0.62); ctx.lineTo(hx,H*0.66+H*0.02); ctx.stroke();
    ctx.beginPath(); ctx.arc(hx,H*0.68,W*0.015,0,Math.PI*2); ctx.stroke();
  });

  // People crowd (many)
  [[W*0.45,H*0.76],[W*0.52,H*0.76],[W*0.59,H*0.76],[W*0.66,H*0.76],[W*0.25,H*0.76],[W*0.33,H*0.76]].forEach(([px,py]) => doodlePerson(ctx,px,py,H*0.09));

  // Lamp posts
  [W*0.1,W*0.48,W*0.78].forEach(lx => {
    ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(lx,H*0.76); ctx.lineTo(lx,H*0.45); ctx.stroke();
    ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(lx,H*0.45); ctx.quadraticCurveTo(lx+W*0.04,H*0.41,lx+W*0.07,H*0.43); ctx.stroke();
    doodleLantern(ctx,lx+W*0.07,H*0.43,W*0.022);
  });

  // Pigeons everywhere
  [[W*0.16,H*0.74],[W*0.43,H*0.75],[W*0.8,H*0.74],[W*0.88,H*0.73]].forEach(([px,py]) => {
    ctx.lineWidth=0.9;
    ctx.beginPath(); ctx.ellipse(px,py,7,5,0,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(px+6,py-4,4,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px-5,py-2); ctx.quadraticCurveTo(px,py-7,px+5,py-2); ctx.stroke();
  });

  // Balloons being sold
  [W*0.78,W*0.82,W*0.86].forEach((bx,i) => doodleBalloon(ctx,bx,H*(0.5-i*0.06),W*0.025));

  // Flowers
  [[W*0.47,H*0.74],[W*0.7,H*0.73],[W*0.93,H*0.74]].forEach(([fx,fy]) => doodleFlower(ctx,fx,fy,W*0.022));

  // Smoke from chimney
  doodleSmoke(ctx,W*0.15,H*0.12,W*0.022);
  doodleSmoke(ctx,W*0.82,H*0.15,W*0.02);

  // Cat-shaped weather vane on right building
  ctx.lineWidth=0.9; ctx.beginPath(); ctx.moveTo(W*0.86,H*0.05); ctx.lineTo(W*0.86,H*0.03); ctx.stroke();
  ctx.beginPath(); ctx.arc(W*0.86,H*0.02,W*0.013,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.847,H*0.01); ctx.lineTo(W*0.853,H*0.0); ctx.lineTo(W*0.858,H*0.01); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.862,H*0.01); ctx.lineTo(W*0.868,H*0.0); ctx.lineTo(W*0.873,H*0.01); ctx.stroke();

  // Dense foliage (bushes at base)
  [W*0.44,W*0.56,W*0.68].forEach(bx => {
    ctx.lineWidth=1;
    for (let li=0;li<6;li++) {
      const la=(li/6)*Math.PI;
      ctx.beginPath(); ctx.ellipse(bx+Math.cos(la)*W*0.025,H*0.76+Math.sin(la)*H*0.02-H*0.04,W*0.028,H*0.03,la,0,Math.PI*2); ctx.stroke();
    }
  });
}

// =================== SCENE 2: DENSE UNDERWATER WORLD ===================
function scene2(ctx, W, H) {
  colorSetup(ctx, W, H, 0);

  // Water surface waves (many layers)
  for (let wy=H*0.01; wy<H*0.08; wy+=H*0.016) {
    ctx.lineWidth=wy<H*0.03?1.8:1;
    ctx.beginPath(); ctx.moveTo(0,wy);
    for (let wx=0; wx<W; wx+=18) ctx.quadraticCurveTo(wx+9,wy-(6-wy/H*20),wx+18,wy);
    ctx.stroke();
  }
  // Boat silhouette at surface
  ctx.lineWidth=1.8; ctx.beginPath(); ctx.moveTo(W*0.3,H*0.04); ctx.lineTo(W*0.22,H*0.065); ctx.lineTo(W*0.5,H*0.065); ctx.lineTo(W*0.45,H*0.04); ctx.closePath(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.375,H*0.04); ctx.lineTo(W*0.375,H*0.0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.375,H*0.0); ctx.lineTo(W*0.46,H*0.03); ctx.lineTo(W*0.375,H*0.04); ctx.stroke();
  // Anchor chain
  ctx.setLineDash([4,4]); ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(W*0.36,H*0.065); ctx.lineTo(W*0.38,H*0.35); ctx.stroke();
  ctx.setLineDash([]);
  // Anchor
  ctx.lineWidth=1.2; ctx.beginPath(); ctx.arc(W*0.38,H*0.36,W*0.02,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.38,H*0.38); ctx.lineTo(W*0.38,H*0.43); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.365,H*0.43); ctx.lineTo(W*0.395,H*0.43); ctx.stroke();

  // Seabed layered
  ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(0,H*0.82); ctx.lineTo(W,H*0.82); ctx.stroke();
  doodleHatch(ctx,0,H*0.82,W,H*0.18,10);
  // Sand ripples
  for (let ry=H*0.84; ry<H; ry+=H*0.035) {
    ctx.lineWidth=0.8; ctx.beginPath(); ctx.moveTo(0,ry);
    for (let rx=0; rx<W; rx+=24) ctx.quadraticCurveTo(rx+12,ry-5,rx+24,ry);
    ctx.stroke();
  }

  // 6 columns of seaweed (dense)
  [W*0.08,W*0.18,W*0.38,W*0.55,W*0.7,W*0.88].forEach((sx,si) => {
    const height = H*(0.3+si*0.04);
    ctx.lineWidth=2.5-(si*0.2);
    ctx.beginPath(); ctx.moveTo(sx,H*0.82);
    let cy2=H*0.82;
    while(cy2>H*0.82-height) {
      const wave=(si%2===0?1:-1)*14;
      ctx.quadraticCurveTo(sx+wave,cy2-13,sx-wave,cy2-26); cy2-=26;
    }
    ctx.stroke();
    // leaves
    ctx.lineWidth=1;
    for (let leaf=0; leaf<4; leaf++) {
      const ly=H*0.82-leaf*height/4, ldir=leaf%2===0?1:-1;
      ctx.beginPath(); ctx.ellipse(sx+ldir*W*0.025,ly,W*0.025,H*0.02,ldir*0.5,0,Math.PI*2); ctx.stroke();
    }
  });

  // Many fish of different sizes
  [[W*0.55,H*0.22,W*0.11,1],[W*0.18,H*0.38,-1,W*0.09],[W*0.7,H*0.47,W*0.07,1],
   [W*0.35,H*0.6,-1,W*0.055],[W*0.82,H*0.3,W*0.1,1],[W*0.12,H*0.6,-1,W*0.065],
   [W*0.62,H*0.65,W*0.065,1],[W*0.42,H*0.28,-1,W*0.08],[W*0.78,H*0.55,W*0.05,-1]].forEach(([fx,fy,fd,fr]) => {
    doodleFish(ctx,fx,fy,fr,fd);
  });

  // 3 jellyfish with many tentacles
  [[W*0.14,H*0.16,W*0.065],[W*0.68,H*0.12,W*0.055],[W*0.9,H*0.25,W*0.045]].forEach(([jx,jy,jr]) => {
    ctx.lineWidth=1.5; ctx.beginPath(); ctx.ellipse(jx,jy,jr,jr*0.6,0,Math.PI,0); ctx.stroke();
    // Inner bell lines
    ctx.lineWidth=0.6;
    for (let line=0;line<3;line++) { ctx.beginPath(); ctx.moveTo(jx-jr*(0.6-line*0.3),jy); ctx.quadraticCurveTo(jx-jr*(0.5-line*0.25),jy+jr*0.4,jx-jr*(0.4-line*0.2),jy+jr*0.6); ctx.stroke(); }
    // Many tentacles
    ctx.lineWidth=0.9;
    for (let t=-4;t<=4;t++) {
      const tx=jx+t*jr*0.24;
      ctx.beginPath(); ctx.moveTo(tx,jy);
      let tcy=jy, wdir=t%2===0?1:-1;
      while(tcy<jy+jr*3) { ctx.quadraticCurveTo(tx+wdir*8,tcy+jr*0.4,tx-wdir*8,tcy+jr*0.8); tcy+=jr*0.8; wdir*=-1; }
      ctx.stroke();
    }
  });

  // Starfish (detailed)
  [[W*0.12,H*0.86],[W*0.55,H*0.88],[W*0.82,H*0.85],[W*0.35,H*0.9]].forEach(([sx,sy]) => {
    ctx.lineWidth=1.3;
    for (let a=0;a<5;a++) {
      const ang=(a/5)*Math.PI*2-Math.PI/2, ang2=ang+Math.PI/5;
      ctx.beginPath(); ctx.moveTo(sx,sy);
      ctx.lineTo(sx+Math.cos(ang)*W*0.042,sy+Math.sin(ang)*W*0.042);
      ctx.lineTo(sx+Math.cos(ang2)*W*0.02,sy+Math.sin(ang2)*W*0.02);
      ctx.closePath(); ctx.stroke();
    }
    // texture dots
    ctx.lineWidth=0.5;
    for (let d=0;d<8;d++) { const da=(d/8)*Math.PI*2; ctx.beginPath(); ctx.arc(sx+Math.cos(da)*W*0.022,sy+Math.sin(da)*W*0.022,2,0,Math.PI*2); ctx.stroke(); }
  });

  // Dense coral formations
  [[W*0.05,H*0.82],[W*0.25,H*0.82],[W*0.62,H*0.82],[W*0.78,H*0.82],[W*0.92,H*0.82]].forEach(([cx2,cy2]) => {
    ctx.lineWidth=1.5;
    const h2=H*0.15;
    ctx.beginPath(); ctx.moveTo(cx2,cy2); ctx.lineTo(cx2,cy2-h2*0.55); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx2,cy2-h2*0.25); ctx.lineTo(cx2-h2*0.18,cy2-h2*0.6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx2,cy2-h2*0.25); ctx.lineTo(cx2+h2*0.18,cy2-h2*0.6); ctx.stroke();
    [[0,-0.6],[-.18,-0.6],[.18,-0.6]].forEach(([dx,dy]) => {
      ctx.lineWidth=1;
      ctx.beginPath(); ctx.arc(cx2+dx*h2,cy2+dy*h2,h2*0.09,0,Math.PI*2); ctx.stroke();
      for (let i=0;i<6;i++) {
        const a=(i/6)*Math.PI*2;
        ctx.beginPath(); ctx.moveTo(cx2+dx*h2,cy2+dy*h2);
        ctx.lineTo(cx2+dx*h2+Math.cos(a)*h2*0.09,cy2+dy*h2+Math.sin(a)*h2*0.09); ctx.stroke();
      }
    });
  });

  // Treasure area (full scene)
  ctx.lineWidth=1.5; ctx.strokeRect(W*0.38,H*0.82,W*0.14,H*0.1);
  ctx.beginPath(); ctx.ellipse(W*0.45,H*0.82,W*0.07,H*0.015,0,Math.PI,0); ctx.stroke();
  // Lock
  ctx.beginPath(); ctx.arc(W*0.45,H*0.86,W*0.015,0,Math.PI*2); ctx.stroke();
  ctx.strokeRect(W*0.44,H*0.86,W*0.02,W*0.016);
  // Coins spilling
  for (let ci=0;ci<8;ci++) {
    ctx.beginPath(); ctx.ellipse(W*(0.34+ci*0.02),H*0.9,W*0.01,W*0.007,Math.random()*Math.PI,0,Math.PI*2); ctx.stroke();
  }
  // Gems
  [[W*0.56,H*0.84],[W*0.6,H*0.86],[W*0.58,H*0.9]].forEach(([gx,gy]) => {
    ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(gx,gy-W*0.015); ctx.lineTo(gx-W*0.012,gy); ctx.lineTo(gx,gy+W*0.015); ctx.lineTo(gx+W*0.012,gy); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(gx-W*0.012,gy); ctx.lineTo(gx+W*0.012,gy); ctx.stroke();
  });

  // Bubbles everywhere
  [[W*0.08,H*0.45,7],[W*0.25,H*0.32,5],[W*0.5,H*0.35,9],[W*0.72,H*0.2,6],[W*0.88,H*0.42,8],
   [W*0.35,H*0.58,4],[W*0.9,H*0.28,6],[W*0.62,H*0.52,5],[W*0.18,H*0.7,8]].forEach(([bx,by,br]) => {
    ctx.lineWidth=0.9; ctx.beginPath(); ctx.arc(bx,by,br,0,Math.PI*2); ctx.stroke();
    ctx.lineWidth=0.5; ctx.beginPath(); ctx.arc(bx-br*0.3,by-br*0.3,br*0.35,0,Math.PI*2); ctx.stroke();
  });

  // Submarine (larger, detailed)
  ctx.lineWidth=1.8; ctx.beginPath(); ctx.ellipse(W*0.5,H*0.12,W*0.14,W*0.052,0,0,Math.PI*2); ctx.stroke();
  // Conning tower
  ctx.strokeRect(W*0.46,H*0.06,W*0.05,W*0.055);
  ctx.strokeRect(W*0.47,H*0.04,W*0.015,W*0.022);
  // Portholes
  [W*0.4,W*0.49,W*0.58].forEach(px => { ctx.lineWidth=1; ctx.beginPath(); ctx.arc(px,H*0.12,W*0.016,0,Math.PI*2); ctx.stroke(); ctx.lineWidth=0.5; ctx.beginPath(); ctx.arc(px,H*0.12,W*0.01,0,Math.PI*2); ctx.stroke(); });
  // Propeller
  ctx.lineWidth=1.2; ctx.beginPath(); ctx.moveTo(W*0.64,H*0.12); ctx.lineTo(W*0.68,H*0.12); ctx.stroke();
  for (let pa=0;pa<3;pa++) { const a=(pa/3)*Math.PI*2; ctx.beginPath(); ctx.ellipse(W*0.68,H*0.12,W*0.022,W*0.01,a,0,Math.PI*2); ctx.stroke(); }
  // Torpedo launcher
  ctx.lineWidth=1; ctx.strokeRect(W*0.36,H*0.115,W*0.045,W*0.01);

  // Mermaid silhouette
  ctx.lineWidth=1.3;
  ctx.beginPath(); ctx.arc(W*0.88,H*0.65,W*0.028,0,Math.PI*2); ctx.stroke(); // head
  ctx.beginPath(); ctx.ellipse(W*0.88,H*0.7,W*0.018,W*0.04,0,0,Math.PI*2); ctx.stroke(); // torso
  ctx.beginPath(); ctx.ellipse(W*0.88,H*0.76,W*0.012,W*0.035,-0.2,0,Math.PI*2); ctx.stroke(); // tail
  // tail fin
  ctx.beginPath(); ctx.moveTo(W*0.88,H*0.795); ctx.lineTo(W*0.86,H*0.82); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.88,H*0.795); ctx.lineTo(W*0.9,H*0.82); ctx.stroke();
  // hair flowing
  ctx.lineWidth=1; ctx.setLineDash([3,3]);
  ctx.beginPath(); ctx.moveTo(W*0.88,H*0.63); ctx.quadraticCurveTo(W*0.93,H*0.66,W*0.91,H*0.72); ctx.stroke();
  ctx.setLineDash([]);

  // Octopus tentacles (peeking from bottom corner)
  ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(W*0.05,H*0.98,W*0.04,Math.PI,0); ctx.stroke();
  for (let t=0;t<5;t++) {
    const tx=W*(0.01+t*0.018), ta=(t/5)*Math.PI;
    ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(tx,H*0.98);
    ctx.quadraticCurveTo(tx+Math.cos(ta)*W*0.06,H*0.85,tx+Math.cos(ta)*W*0.08,H*0.78); ctx.stroke();
  }
}

// =================== SCENE 3: ENCHANTED FOREST (DENSE) ===================
function scene3(ctx, W, H) {
  colorSetup(ctx, W, H, 0);

  // Sky — full of stars, moon, bats
  ctx.lineWidth=0.8;
  for (let s=0; s<50; s++) {
    const sx=(s*W*0.019+W*0.02)%W, sy=(s*H*0.021)%( H*0.35);
    doodleStars(ctx,sx,sy,W*0.008+(s%3)*W*0.003,5);
  }
  // Moon with face
  ctx.lineWidth=1.8; ctx.beginPath(); ctx.arc(W*0.82,H*0.1,W*0.07,0,Math.PI*2); ctx.stroke();
  ctx.lineWidth=0.9;
  ctx.beginPath(); ctx.arc(W*0.808,H*0.087,W*0.014,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(W*0.834,H*0.087,W*0.014,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(W*0.821,H*0.108,W*0.022,0,Math.PI); ctx.stroke();
  [[W*0.795,H*0.07,W*0.012],[W*0.84,H*0.115,W*0.009]].forEach(([cx2,cy2,cr2]) => { ctx.beginPath(); ctx.arc(cx2,cy2,cr2,0,Math.PI*2); ctx.stroke(); });

  // Bats
  [[W*0.3,H*0.08],[W*0.5,H*0.05],[W*0.15,H*0.12],[W*0.65,H*0.06],[W*0.42,H*0.14]].forEach(([bx,by]) => {
    ctx.lineWidth=1;
    ctx.beginPath(); ctx.arc(bx,by,W*0.008,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx-W*0.008,by); ctx.bezierCurveTo(bx-W*0.03,by-W*0.02,bx-W*0.045,by,bx-W*0.055,by+W*0.01); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx+W*0.008,by); ctx.bezierCurveTo(bx+W*0.03,by-W*0.02,bx+W*0.045,by,bx+W*0.055,by+W*0.01); ctx.stroke();
  });

  // Ground + roots
  ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(0,H*0.8); ctx.lineTo(W,H*0.8); ctx.stroke();
  doodleHatch(ctx,0,H*0.8,W,H*0.2,14);

  // 9 dense trees filling the width
  [[W*0.04,H*0.8,H*0.52,W*0.07],[W*0.14,H*0.8,H*0.42,W*0.06],[W*0.24,H*0.8,H*0.55,W*0.08],
   [W*0.36,H*0.8,H*0.48,W*0.065],[W*0.5,H*0.8,H*0.58,W*0.09],[W*0.62,H*0.8,H*0.44,W*0.06],
   [W*0.73,H*0.8,H*0.52,W*0.075],[W*0.84,H*0.8,H*0.46,W*0.065],[W*0.93,H*0.8,H*0.38,W*0.055]].forEach(([tx,ty,th,tw]) => {
    doodleTree(ctx,tx,ty,th,tw);
    // Roots spread
    ctx.lineWidth=1.2;
    [[-1,-0.8],[-0.4,-0.3],[0.4,-0.3],[1,-0.8]].forEach(([rdx,rdy]) => {
      ctx.beginPath(); ctx.moveTo(tx,ty); ctx.quadraticCurveTo(tx+rdx*tw,ty+rdy*H*0.04,tx+rdx*tw*1.8,ty+H*0.015); ctx.stroke();
    });
    // Vines hanging from branches
    for (let v=0;v<3;v++) {
      const vx=tx+(v-1)*tw*0.7, vy=ty-th*0.65;
      ctx.lineWidth=0.8; ctx.setLineDash([2,4]);
      ctx.beginPath(); ctx.moveTo(vx,vy); ctx.lineTo(vx+Math.sin(v)*W*0.02,vy+H*0.12); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.ellipse(vx+Math.sin(v)*W*0.02,vy+H*0.12,W*0.012,H*0.015,0.3,0,Math.PI*2); ctx.stroke();
    }
  });

  // Dense mushroom ring
  for (let m=0; m<8; m++) {
    const mx=W*(0.15+m*0.1), my=H*0.8, mr=W*(0.02+m%3*0.008);
    ctx.lineWidth=1.2;
    ctx.strokeRect(mx-mr*0.4,my-mr*1.1,mr*0.8,mr*1.1);
    ctx.beginPath(); ctx.ellipse(mx,my-mr*1.1,mr,mr*0.55,0,Math.PI,0); ctx.stroke();
    for (let sd=0;sd<4;sd++) { const sa=(sd/4)*Math.PI+0.2; ctx.lineWidth=0.5; ctx.beginPath(); ctx.arc(mx+Math.cos(sa)*mr*0.5,my-mr*1.4+Math.sin(sa)*mr*0.2,mr*0.1,0,Math.PI*2); ctx.stroke(); }
  }

  // Owl (detailed)
  ctx.lineWidth=1.5;
  const ox=W*0.45, oy=H*0.45;
  ctx.beginPath(); ctx.ellipse(ox,oy+W*0.04,W*0.038,W*0.055,0,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(ox,oy-W*0.02,W*0.03,W*0.032,0,0,Math.PI*2); ctx.stroke();
  // facial disc
  ctx.lineWidth=0.8; ctx.beginPath(); ctx.ellipse(ox,oy-W*0.02,W*0.026,W*0.028,0,0,Math.PI*2); ctx.stroke();
  // Eyes with pupils
  ctx.lineWidth=1.2; ctx.beginPath(); ctx.arc(ox-W*0.013,oy-W*0.027,W*0.013,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(ox+W*0.013,oy-W*0.027,W*0.013,0,Math.PI*2); ctx.stroke();
  ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(ox-W*0.013,oy-W*0.027,W*0.006,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(ox+W*0.013,oy-W*0.027,W*0.006,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(ox-W*0.01,oy-W*0.03,W*0.003,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(ox+W*0.016,oy-W*0.03,W*0.003,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#111';
  // Beak
  ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(ox,oy-W*0.016); ctx.lineTo(ox-W*0.007,oy); ctx.lineTo(ox+W*0.007,oy); ctx.closePath(); ctx.stroke();
  // Ear tufts
  ctx.beginPath(); ctx.moveTo(ox-W*0.016,oy-W*0.042); ctx.lineTo(ox-W*0.024,oy-W*0.062); ctx.lineTo(ox-W*0.008,oy-W*0.048); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ox+W*0.016,oy-W*0.042); ctx.lineTo(ox+W*0.024,oy-W*0.062); ctx.lineTo(ox+W*0.008,oy-W*0.048); ctx.stroke();
  // Wing feather details
  ctx.lineWidth=0.7;
  for (let f=0;f<5;f++) { ctx.beginPath(); ctx.moveTo(ox-W*0.038+f*W*0.015,oy+W*0.01); ctx.lineTo(ox-W*0.048+f*W*0.015,oy+W*0.065); ctx.stroke(); }
  // Branch
  ctx.lineWidth=2.5; ctx.beginPath(); ctx.moveTo(W*0.33,H*0.48); ctx.lineTo(W*0.6,H*0.46); ctx.stroke();
  // Talons
  ctx.lineWidth=1; [ox-W*0.015,ox+W*0.015].forEach(tx2 => {
    [[-0.02,0],[0,0.02],[0.02,0]].forEach(([dx2,dy2]) => { ctx.beginPath(); ctx.moveTo(tx2,H*0.48); ctx.lineTo(tx2+dx2*W,H*0.48+dy2*H); ctx.stroke(); });
  });

  // Fox (detailed)
  const fx2=W*0.62, fy2=H*0.76;
  ctx.lineWidth=1.4;
  ctx.beginPath(); ctx.ellipse(fx2,fy2,W*0.065,W*0.032,0,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(fx2+W*0.06,fy2-W*0.022,W*0.04,W*0.038,0.3,0,Math.PI*2); ctx.stroke();
  // snout
  ctx.beginPath(); ctx.ellipse(fx2+W*0.095,fy2-W*0.005,W*0.022,W*0.016,0,0,Math.PI*2); ctx.stroke();
  // Eye, nose, mouth
  ctx.lineWidth=0.9; ctx.beginPath(); ctx.arc(fx2+W*0.082,fy2-W*0.025,W*0.008,0,Math.PI*2); ctx.stroke();
  ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(fx2+W*0.082,fy2-W*0.025,W*0.004,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(fx2+W*0.085,fy2-W*0.028,W*0.002,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#fff';
  ctx.strokeStyle='#111';
  // Ears
  ctx.lineWidth=1.2;
  ctx.beginPath(); ctx.moveTo(fx2+W*0.03,fy2-W*0.04); ctx.lineTo(fx2+W*0.015,fy2-W*0.07); ctx.lineTo(fx2+W*0.06,fy2-W*0.052); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(fx2+W*0.065,fy2-W*0.038); ctx.lineTo(fx2+W*0.06,fy2-W*0.072); ctx.lineTo(fx2+W*0.092,fy2-W*0.048); ctx.stroke();
  // Legs
  ctx.lineWidth=1.3;
  [fx2-W*0.045,fx2-W*0.015,fx2+W*0.018,fx2+W*0.048].forEach(lx2 => {
    ctx.beginPath(); ctx.moveTo(lx2,fy2+W*0.025); ctx.lineTo(lx2-W*0.003,fy2+W*0.06); ctx.stroke();
  });
  // Bushy tail
  ctx.lineWidth=2.2; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(fx2-W*0.065,fy2); ctx.quadraticCurveTo(fx2-W*0.11,fy2-W*0.04,fx2-W*0.095,fy2-W*0.09); ctx.stroke();
  ctx.lineWidth=1; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(fx2-W*0.095,fy2-W*0.09); ctx.arc(fx2-W*0.1,fy2-W*0.1,W*0.025,0,Math.PI*2); ctx.stroke();
  ctx.lineCap='round';

  // Spider web (large, detailed)
  const wx2=W*0.9, wy2=H*0.32;
  ctx.lineWidth=0.7;
  for (let r2=W*0.02; r2<=W*0.09; r2+=W*0.017) {
    ctx.beginPath(); ctx.arc(wx2,wy2,r2,0,Math.PI*2); ctx.stroke();
    // Dewdrops
    for (let a=0;a<8;a++) { const ang=(a/8)*Math.PI*2; ctx.lineWidth=0.5; ctx.beginPath(); ctx.arc(wx2+Math.cos(ang)*r2,wy2+Math.sin(ang)*r2,1.5,0,Math.PI*2); ctx.fill(); ctx.lineWidth=0.7; }
  }
  for (let a=0;a<12;a++) { const ang=(a/12)*Math.PI*2; ctx.lineWidth=0.7; ctx.beginPath(); ctx.moveTo(wx2,wy2); ctx.lineTo(wx2+Math.cos(ang)*W*0.09,wy2+Math.sin(ang)*W*0.09); ctx.stroke(); }
  ctx.lineWidth=1.2; ctx.beginPath(); ctx.arc(wx2,wy2,4,0,Math.PI*2); ctx.stroke(); // spider body
  ctx.lineWidth=0.8;
  for (let sl=0;sl<8;sl++) { const sa=(sl/8)*Math.PI*2; ctx.beginPath(); ctx.moveTo(wx2,wy2); ctx.lineTo(wx2+Math.cos(sa)*W*0.022,wy2+Math.sin(sa)*W*0.022); ctx.stroke(); }

  // Fairy lights (string between trees)
  doodleRope(ctx,W*0.04,H*0.5,W*0.25,H*0.52,12);
  doodleRope(ctx,W*0.25,H*0.52,W*0.5,H*0.48,10);
  for (let li=0;li<12;li++) {
    const lx3=W*(0.04+li*0.04), ly3=H*0.5+Math.sin(li*0.5)*H*0.03+H*0.02;
    ctx.lineWidth=0.8; ctx.beginPath(); ctx.moveTo(lx3,ly3-H*0.01); ctx.lineTo(lx3,ly3+H*0.015); ctx.stroke();
    ctx.lineWidth=1; ctx.beginPath(); ctx.arc(lx3,ly3+H*0.015,W*0.01,0,Math.PI*2); ctx.stroke();
  }

  // Fireflies — small double-ring
  [[W*0.32,H*0.55],[W*0.44,H*0.42],[W*0.6,H*0.38],[W*0.2,H*0.62],[W*0.7,H*0.53],[W*0.38,H*0.7],[W*0.8,H*0.65],[W*0.1,H*0.55]].forEach(([ffx,ffy]) => {
    ctx.lineWidth=0.8; ctx.beginPath(); ctx.arc(ffx,ffy,3,0,Math.PI*2); ctx.stroke();
    ctx.lineWidth=0.4; ctx.beginPath(); ctx.arc(ffx,ffy,6,0,Math.PI*2); ctx.stroke();
  });

  // Deer (detailed, right side)
  const dx=W*0.2, dy=H*0.7;
  ctx.lineWidth=1.4;
  ctx.beginPath(); ctx.ellipse(dx,dy,W*0.07,W*0.036,0,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(dx+W*0.06,dy-W*0.024,W*0.04,W*0.045,0.4,0,Math.PI*2); ctx.stroke();
  // legs
  [dx-W*0.05,dx-W*0.015,dx+W*0.02,dx+W*0.055].forEach(lx3 => {
    ctx.beginPath(); ctx.moveTo(lx3,dy+W*0.025); ctx.lineTo(lx3,dy+W*0.06); ctx.stroke();
  });
  // Antlers
  ctx.lineWidth=1.2;
  ctx.beginPath(); ctx.moveTo(dx+W*0.055,dy-W*0.06); ctx.lineTo(dx+W*0.04,dy-W*0.11); ctx.lineTo(dx+W*0.025,dy-W*0.1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(dx+W*0.04,dy-W*0.11); ctx.lineTo(dx+W*0.055,dy-W*0.12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(dx+W*0.07,dy-W*0.06); ctx.lineTo(dx+W*0.085,dy-W*0.11); ctx.lineTo(dx+W*0.1,dy-W*0.1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(dx+W*0.085,dy-W*0.11); ctx.lineTo(dx+W*0.07,dy-W*0.13); ctx.stroke();
  ctx.lineWidth=1; ctx.beginPath(); ctx.arc(dx+W*0.082,dy-W*0.028,W*0.007,0,Math.PI*2); ctx.stroke();

  // Toadstools in circle (fairy ring)
  for (let t=0;t<8;t++) {
    const ta=(t/8)*Math.PI*2, tr=W*0.08;
    const tx3=W*0.35+Math.cos(ta)*tr, ty3=H*0.78;
    ctx.lineWidth=1; ctx.strokeRect(tx3-W*0.01,ty3-W*0.03,W*0.02,W*0.03);
    ctx.beginPath(); ctx.ellipse(tx3,ty3-W*0.03,W*0.018,W*0.01,0,Math.PI,0); ctx.stroke();
  }
}

// =================== SCENE 4: PACKED CITY (DENSE) ===================
function scene4(ctx, W, H) {
  colorSetup(ctx, W, H, 0);

  // Many clouds
  for (let i=0;i<7;i++) doodleCloud(ctx,W*(0.06+i*0.14),H*(0.04+(i%3)*0.03),W*0.062);
  // Flock of birds
  for (let i=0;i<15;i++) doodleBird(ctx,W*(0.02+i*0.07),H*(0.03+(i%4)*0.025),W*0.015);

  // 8 tall buildings — every one different
  const bData = [
    [0,H*0.04,W*0.14,H*0.68,12,10,4,2],
    [W*0.13,H*0.1,W*0.12,H*0.62,10,9,3,2],
    [W*0.24,H*0.06,W*0.11,H*0.66,8,8,3,2],
    [W*0.34,H*0.18,W*0.1,H*0.54,7,8,3,1],
    [W*0.43,H*0.04,W*0.13,H*0.68,9,9,4,2],
    [W*0.55,H*0.12,W*0.11,H*0.6,8,8,3,2],
    [W*0.65,H*0.08,W*0.12,H*0.64,9,9,3,2],
    [W*0.76,H*0.15,W*0.24,H*0.57,12,10,4,2],
  ];
  bData.forEach(([bx,by,bw,bh,wcols,wrows,rw,rh]) => {
    ctx.lineWidth=1.8; ctx.strokeRect(bx,by,bw,bh);
    doodleBrick(ctx,bx,by,bw,bh,Math.round(bw/wcols),Math.round(bh/wrows/4));
    // Windows
    const ww=bw/(wcols+1)*0.7, wh2=bh/(wrows+1)*0.5;
    for (let wr=1;wr<=wrows;wr++) for (let wc=1;wc<=wcols/2;wc++) {
      const wx=bx+bw/((wcols/2)+1)*wc-ww/2, wy=by+bh/(wrows+1)*wr-wh2/2;
      doodleWindow(ctx,wx,wy,ww,wh2);
      // Some have AC units
      if ((wr+wc)%3===0) { ctx.lineWidth=0.7; ctx.strokeRect(wx,wy+wh2,ww,wh2*0.3); }
    }
    // Rooftop details
    ctx.lineWidth=1.2;
    doodleSmoke(ctx,bx+bw*0.25,by,bw*0.06);
    doodleSmoke(ctx,bx+bw*0.75,by,bw*0.05);
    // Water tower
    ctx.strokeRect(bx+bw*0.55,by-bh*0.08,bw*0.2,bh*0.08);
    ctx.beginPath(); ctx.moveTo(bx+bw*0.6,by-bh*0.08); ctx.lineTo(bx+bw*0.7,by-bh*0.08); ctx.stroke();
    // Antennas
    ctx.lineWidth=0.9;
    ctx.beginPath(); ctx.moveTo(bx+bw*0.15,by); ctx.lineTo(bx+bw*0.15,by-bh*0.06); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx+bw*0.15-bw*0.05,by-bh*0.05); ctx.lineTo(bx+bw*0.15+bw*0.05,by-bh*0.05); ctx.stroke();
  });

  // Busy road
  ctx.lineWidth=2.5; ctx.beginPath(); ctx.moveTo(0,H*0.72); ctx.lineTo(W,H*0.72); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0,H*0.92); ctx.lineTo(W,H*0.92); ctx.stroke();
  // Lane dashes
  ctx.lineWidth=1.5; ctx.setLineDash([W*0.04,W*0.02]);
  ctx.beginPath(); ctx.moveTo(0,H*0.81); ctx.lineTo(W,H*0.81); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0,H*0.86); ctx.lineTo(W,H*0.86); ctx.stroke();
  ctx.setLineDash([]);
  // Sidewalks
  ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(0,H*0.7); ctx.lineTo(W,H*0.7); ctx.stroke();
  ctx.lineWidth=0.7;
  for (let tx=W*0.05;tx<W;tx+=W*0.06) { ctx.beginPath(); ctx.moveTo(tx,H*0.7); ctx.lineTo(tx,H*0.72); ctx.stroke(); }
  // Cobblestones pavement
  for (let py=H*0.92; py<H; py+=H*0.025)
    for (let px=0; px<W; px+=W*0.05) {
      ctx.lineWidth=0.6; ctx.beginPath(); ctx.ellipse(px+W*0.025,py+H*0.012,W*0.022,H*0.01,0,0,Math.PI*2); ctx.stroke();
    }

  // 5 Cars on road (very detailed)
  [[W*0.02,H*0.74,W*0.17],[W*0.28,H*0.74,W*0.15],[W*0.55,H*0.76,W*0.16],[W*0.76,H*0.75,W*0.14],
   [W*0.12,H*0.85,W*0.12],[W*0.45,H*0.84,W*0.13],[W*0.72,H*0.85,W*0.15]].forEach(([cx2,cy2,cw]) => {
    ctx.lineWidth=1.5; ctx.strokeRect(cx2,cy2,cw,cw*0.42);
    // Roof
    ctx.beginPath(); ctx.moveTo(cx2+cw*0.12,cy2); ctx.lineTo(cx2+cw*0.22,cy2-cw*0.32); ctx.lineTo(cx2+cw*0.76,cy2-cw*0.32); ctx.lineTo(cx2+cw*0.88,cy2); ctx.stroke();
    // Windows
    ctx.strokeRect(cx2+cw*0.26,cy2-cw*0.29,cw*0.22,cw*0.22); ctx.strokeRect(cx2+cw*0.53,cy2-cw*0.29,cw*0.2,cw*0.22);
    // Wheels
    ctx.lineWidth=1.2;
    [cx2+cw*0.2,cx2+cw*0.8].forEach(wx2 => {
      ctx.beginPath(); ctx.arc(wx2,cy2+cw*0.42,cw*0.12,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.arc(wx2,cy2+cw*0.42,cw*0.07,0,Math.PI*2); ctx.stroke();
    });
    // Headlight/tail
    ctx.lineWidth=0.8; ctx.strokeRect(cx2+cw*0.9,cy2+cw*0.05,cw*0.05,cw*0.08);
    ctx.strokeRect(cx2-cw*0.03,cy2+cw*0.05,cw*0.05,cw*0.08);
  });

  // People crowd (lots)
  for (let pi=0;pi<14;pi++) doodlePerson(ctx,W*(0.04+pi*0.07),H*0.7,H*0.072);

  // Street details
  // Manholes
  [W*0.15,W*0.45,W*0.75].forEach(mx => {
    ctx.lineWidth=1; ctx.beginPath(); ctx.ellipse(mx,H*0.82,W*0.025,W*0.01,0,0,Math.PI*2); ctx.stroke();
    ctx.setLineDash([3,3]); ctx.beginPath(); ctx.arc(mx,H*0.82,W*0.02,0,Math.PI*2); ctx.stroke(); ctx.setLineDash([]);
  });
  // Fire hydrant
  ctx.lineWidth=1.2; ctx.strokeRect(W*0.38,H*0.7,W*0.018,H*0.022);
  ctx.beginPath(); ctx.ellipse(W*0.389,H*0.7,W*0.014,W*0.008,0,Math.PI*2,0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.38,H*0.712); ctx.lineTo(W*0.37,H*0.714); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.398,H*0.712); ctx.lineTo(W*0.408,H*0.714); ctx.stroke();

  // Traffic lights (2)
  [W*0.08,W*0.62].forEach(tlx => {
    ctx.lineWidth=1.5; ctx.strokeRect(tlx,H*0.5,W*0.035,H*0.12);
    [H*0.52,H*0.556,H*0.592].forEach(tly => { ctx.beginPath(); ctx.arc(tlx+W*0.0175,tly,W*0.011,0,Math.PI*2); ctx.stroke(); });
    ctx.lineWidth=1.8; ctx.beginPath(); ctx.moveTo(tlx+W*0.0175,H*0.62); ctx.lineTo(tlx+W*0.0175,H*0.7); ctx.stroke();
  });

  // Subway entrance
  ctx.lineWidth=1.5; ctx.strokeRect(W*0.48,H*0.7,W*0.1,H*0.02);
  ctx.beginPath(); ctx.moveTo(W*0.53,H*0.72); ctx.lineTo(W*0.53,H*0.75); ctx.stroke();
  ctx.beginPath(); ctx.arc(W*0.53,H*0.7,W*0.01,Math.PI,0); ctx.stroke();
  ctx.lineWidth=0.9; ctx.fillStyle='#111';
  ctx.font=`bold ${W*0.018}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('M', W*0.53, H*0.71); ctx.fillStyle='#fff';

  // Shop signs
  ctx.strokeStyle='#111'; ctx.fillStyle='#111';
  ctx.font=`${W*0.019}px sans-serif`; ctx.textAlign='center';
  [[W*0.07,H*0.66,'CAFE'],[W*0.37,H*0.65,'BOOKS'],[W*0.69,H*0.66,'PIZZA']].forEach(([sx,sy,st]) => {
    ctx.lineWidth=1; ctx.strokeRect(sx-W*0.04,sy-H*0.02,W*0.08,H*0.03);
    ctx.fillText(st,sx,sy); ctx.strokeStyle='#111';
  });

  // Pigeons (many)
  for (let pi=0;pi<8;pi++) {
    const px=W*(0.05+pi*0.12), py=H*(0.71+pi%2*0.01);
    ctx.lineWidth=0.9; ctx.beginPath(); ctx.ellipse(px,py,7,5,0,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(px+6,py-4,4,0,Math.PI*2); ctx.stroke();
  }
}

// =================== SCENE 5: COZY LIBRARY / CAFE (PACKED) ===================
function scene5(ctx, W, H) {
  colorSetup(ctx, W, H, 0);

  // Floor & walls
  ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(0,H*0.75); ctx.lineTo(W,H*0.75); ctx.stroke();
  ctx.lineWidth=0.8;
  // Wooden floor planks
  for (let fy=H*0.77;fy<H;fy+=H*0.04) { ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(0,fy); ctx.lineTo(W,fy); ctx.stroke(); }
  for (let fx=0;fx<W;fx+=W*0.14) { ctx.lineWidth=0.6; ctx.beginPath(); ctx.moveTo(fx,H*0.75); ctx.lineTo(fx+(Math.random()>0.5?W*0.06:-W*0.06),H); ctx.stroke(); }
  // Wood grain dots
  doodleDots(ctx,0,H*0.75,W,H*0.25,15);
  // Wainscoting
  ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(0,H*0.38); ctx.lineTo(W,H*0.38); ctx.stroke();
  ctx.lineWidth=0.8;
  for (let wx=W*0.05;wx<W;wx+=W*0.1) { ctx.beginPath(); ctx.moveTo(wx,H*0.38); ctx.lineTo(wx,H*0.75); ctx.stroke(); }
  for (let wy=H*0.44;wy<H*0.75;wy+=H*0.06) { ctx.beginPath(); ctx.moveTo(0,wy); ctx.lineTo(W,wy); ctx.stroke(); }

  // Two large windows
  [[W*0.05,H*0.05],[W*0.55,H*0.05]].forEach(([wx,wy]) => {
    ctx.lineWidth=2.2; ctx.strokeRect(wx,wy,W*0.32,H*0.3);
    ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(wx+W*0.16,wy); ctx.lineTo(wx+W*0.16,wy+H*0.3); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(wx,wy+H*0.15); ctx.lineTo(wx+W*0.32,wy+H*0.15); ctx.stroke();
    // Detailed curtains
    ctx.lineWidth=1;
    for (let fold=0;fold<4;fold++) {
      const fx2=wx+fold*W*0.08;
      ctx.beginPath(); ctx.moveTo(fx2,wy); ctx.quadraticCurveTo(fx2+W*0.04,wy+H*0.06,fx2+W*0.08,wy); ctx.stroke();
    }
    // View through window — outside scene
    ctx.lineWidth=0.7;
    for (let cl=0;cl<3;cl++) doodleCloud(ctx,wx+W*0.04+cl*W*0.1,wy+H*0.04+cl*H*0.02,W*0.04);
    ctx.beginPath(); ctx.moveTo(wx,wy+H*0.22); ctx.lineTo(wx+W*0.32,wy+H*0.22); ctx.stroke();
    // Simple outside buildings
    [W*0.04,W*0.12,W*0.2].forEach(bx2 => { ctx.strokeRect(wx+bx2,wy+H*0.07,W*0.06,H*0.15); });
  });

  // PACKED bookshelf (right wall, full height)
  ctx.lineWidth=2; ctx.strokeRect(W*0.72,H*0.01,W*0.28,H*0.74);
  ctx.lineWidth=1;
  [H*0.15,H*0.28,H*0.42,H*0.55,H*0.65].forEach(sy => { ctx.beginPath(); ctx.moveTo(W*0.72,sy); ctx.lineTo(W,sy); ctx.stroke(); });
  // Books — many, all different heights
  let bookX = W*0.73;
  const shelves = [H*0.01,H*0.15,H*0.28,H*0.42,H*0.55,H*0.65];
  const shelfH = [H*0.14,H*0.13,H*0.14,H*0.13,H*0.1,H*0.09];
  shelves.forEach((sy,si) => {
    let bx2=W*0.73;
    while (bx2 < W-W*0.015) {
      const bw2=W*(0.018+Math.random()*0.012), bh3=shelfH[si]*(0.6+Math.random()*0.35);
      ctx.lineWidth=1; ctx.strokeRect(bx2,sy+shelfH[si]-bh3,bw2,bh3);
      // Book title line
      ctx.lineWidth=0.4; ctx.beginPath(); ctx.moveTo(bx2+bw2*0.3,sy+shelfH[si]-bh3+bh3*0.2); ctx.lineTo(bx2+bw2*0.3,sy+shelfH[si]-bh3*0.1); ctx.stroke();
      // Bookend every 5
      if (Math.round((bx2-W*0.73)/W*100)%5===0) { ctx.lineWidth=1.5; ctx.strokeRect(bx2,sy+shelfH[si]-shelfH[si]*0.8,bw2*0.5,shelfH[si]*0.8); }
      bx2+=bw2+1;
    }
  });
  // Decorative items on shelves
  // Plant on shelf
  ctx.lineWidth=1; ctx.strokeRect(W*0.74,H*0.26,W*0.025,W*0.02);
  for (let l=0;l<4;l++) { const la=(l/4)*Math.PI*2; ctx.beginPath(); ctx.ellipse(W*0.752+Math.cos(la)*W*0.02,H*0.25+Math.sin(la)*W*0.012,W*0.018,W*0.01,la,0,Math.PI*2); ctx.stroke(); }
  // Hourglass
  ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(W*0.88,H*0.52); ctx.lineTo(W*0.9,H*0.52); ctx.lineTo(W*0.886,H*0.55); ctx.lineTo(W*0.9,H*0.58); ctx.lineTo(W*0.88,H*0.58); ctx.lineTo(W*0.894,H*0.55); ctx.closePath(); ctx.stroke();
  ctx.lineWidth=0.6; ctx.setLineDash([1,2]);
  ctx.beginPath(); ctx.moveTo(W*0.886,H*0.55); ctx.lineTo(W*0.886,H*0.58); ctx.stroke(); ctx.setLineDash([]);
  // Globe
  ctx.lineWidth=1.2; ctx.beginPath(); ctx.arc(W*0.95,H*0.41,W*0.02,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(W*0.95,H*0.41,W*0.02,W*0.008,0,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.93,H*0.41); ctx.lineTo(W*0.97,H*0.41); ctx.stroke();

  // Main table (centre)
  ctx.lineWidth=2.2; ctx.beginPath(); ctx.moveTo(W*0.08,H*0.6); ctx.lineTo(W*0.68,H*0.6); ctx.stroke();
  ctx.lineWidth=1.5;
  [W*0.15,W*0.6].forEach(lx => { ctx.beginPath(); ctx.moveTo(lx,H*0.6); ctx.lineTo(lx,H*0.75); ctx.stroke(); });
  ctx.beginPath(); ctx.moveTo(W*0.08,H*0.62); ctx.lineTo(W*0.68,H*0.62); ctx.stroke();

  // Coffee mug (detailed steam)
  ctx.lineWidth=1.5; ctx.strokeRect(W*0.11,H*0.5,W*0.09,H*0.1);
  ctx.beginPath(); ctx.arc(W*0.155,H*0.5,W*0.04,Math.PI,0); ctx.stroke(); // rim arc
  ctx.beginPath(); ctx.moveTo(W*0.2,H*0.56); ctx.quadraticCurveTo(W*0.235,H*0.56,W*0.235,H*0.61); ctx.lineTo(W*0.2,H*0.6); ctx.stroke(); // handle
  // Coffee surface rings
  ctx.lineWidth=0.7;
  ctx.beginPath(); ctx.ellipse(W*0.155,H*0.53,W*0.03,W*0.01,0,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(W*0.155,H*0.53,W*0.015,W*0.005,0,0,Math.PI*2); ctx.stroke();
  // Steam curls
  ctx.lineWidth=0.9;
  [W*0.13,W*0.155,W*0.18].forEach((sx,si) => {
    ctx.beginPath(); ctx.moveTo(sx,H*0.5);
    ctx.bezierCurveTo(sx+W*0.015,H*0.46,sx-W*0.015,H*0.43,sx+W*0.01,H*0.4);
    ctx.bezierCurveTo(sx+W*0.02,H*0.37,sx-W*0.01,H*0.35,sx,H*0.33);
    ctx.stroke();
  });

  // Slice of cake (detailed)
  ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(W*0.35,H*0.5); ctx.lineTo(W*0.27,H*0.6); ctx.lineTo(W*0.47,H*0.6); ctx.closePath(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.27,H*0.53); ctx.lineTo(W*0.47,H*0.53); ctx.stroke(); // layer
  ctx.beginPath(); ctx.moveTo(W*0.29,H*0.545); ctx.lineTo(W*0.46,H*0.545); ctx.stroke();
  // Frosting drips
  ctx.lineWidth=0.9;
  [W*0.3,W*0.34,W*0.38,W*0.42,W*0.46].forEach(dx => {
    ctx.beginPath(); ctx.moveTo(dx,H*0.5); ctx.lineTo(dx+W*0.005,H*0.522); ctx.arc(dx+W*0.005,H*0.527,W*0.006,Math.PI*1.5,Math.PI*0.5); ctx.stroke();
  });
  // Cherry on top
  ctx.lineWidth=1.2; ctx.beginPath(); ctx.arc(W*0.35,H*0.487,W*0.01,0,Math.PI*2); ctx.stroke();
  ctx.lineWidth=0.8; ctx.beginPath(); ctx.moveTo(W*0.35,H*0.477); ctx.lineTo(W*0.36,H*0.465); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.36,H*0.465); ctx.lineTo(W*0.365,H*0.47); ctx.stroke();

  // Open book
  ctx.lineWidth=1.2;
  ctx.beginPath(); ctx.moveTo(W*0.48,H*0.6); ctx.lineTo(W*0.48,H*0.52); ctx.quadraticCurveTo(W*0.4,H*0.51,W*0.38,H*0.6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*0.48,H*0.6); ctx.lineTo(W*0.48,H*0.52); ctx.quadraticCurveTo(W*0.56,H*0.51,W*0.58,H*0.6); ctx.stroke();
  // Text lines
  ctx.lineWidth=0.5;
  for (let tl=0;tl<6;tl++) {
    const ty2=H*0.535+tl*H*0.01;
    ctx.beginPath(); ctx.moveTo(W*0.4,ty2); ctx.lineTo(W*0.472,ty2-tl*H*0.002); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W*0.488,ty2); ctx.lineTo(W*0.555,ty2-tl*H*0.002); ctx.stroke();
  }

  // Two chairs
  [[W*0.17,H*0.71],[W*0.55,H*0.71]].forEach(([cx2,cy2]) => {
    ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(cx2,cy2); ctx.lineTo(cx2+W*0.1,cy2); ctx.stroke(); // seat
    ctx.beginPath(); ctx.moveTo(cx2,cy2-H*0.1); ctx.lineTo(cx2+W*0.1,cy2-H*0.1); ctx.stroke(); // back
    ctx.beginPath(); ctx.moveTo(cx2,cy2); ctx.lineTo(cx2,cy2-H*0.1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx2+W*0.1,cy2); ctx.lineTo(cx2+W*0.1,cy2-H*0.1); ctx.stroke();
    [cx2+W*0.02,cx2+W*0.08].forEach(lx2 => { ctx.beginPath(); ctx.moveTo(lx2,cy2); ctx.lineTo(lx2,H*0.75); ctx.stroke(); });
  });

  // Hanging lights string
  doodleRope(ctx,0,H*0.09,W,H*0.09,12);
  for (let li=0;li<10;li++) {
    const lx=W*(0.05+li*0.1), ly=H*0.09+Math.abs(Math.sin(li*0.7))*H*0.03+H*0.015;
    ctx.lineWidth=0.8; ctx.beginPath(); ctx.moveTo(lx,H*0.09+H*0.02); ctx.lineTo(lx,ly); ctx.stroke();
    doodleLantern(ctx,lx,ly,W*0.018);
  }

  // Clock on wall
  ctx.lineWidth=2; ctx.beginPath(); ctx.arc(W*0.37,H*0.22,W*0.06,0,Math.PI*2); ctx.stroke();
  ctx.lineWidth=1;
  for (let hm=0;hm<12;hm++) {
    const ha=(hm/12)*Math.PI*2, hl=W*0.05;
    ctx.lineWidth=hm%3===0?1.5:0.8;
    ctx.beginPath(); ctx.moveTo(W*0.37+Math.cos(ha)*(hl-W*0.008),H*0.22+Math.sin(ha)*(hl-W*0.008));
    ctx.lineTo(W*0.37+Math.cos(ha)*hl,H*0.22+Math.sin(ha)*hl); ctx.stroke();
  }
  ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(W*0.37,H*0.22); ctx.lineTo(W*0.37,H*0.175); ctx.stroke();
  ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(W*0.37,H*0.22); ctx.lineTo(W*0.40,H*0.226); ctx.stroke();

  // Potted plants (2 large)
  [[W*0.02,H*0.6],[W*0.68,H*0.58]].forEach(([px,py]) => {
    ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(px-W*0.03,py+H*0.1); ctx.lineTo(px-W*0.022,py); ctx.lineTo(px+W*0.022,py); ctx.lineTo(px+W*0.03,py+H*0.1); ctx.closePath(); ctx.stroke();
    doodleHatch(ctx,px-W*0.03,py,W*0.06,H*0.1,8);
    // Leaves (detailed monstera-style)
    for (let l=0;l<7;l++) {
      const la=(l/7)*Math.PI*2-Math.PI/2, lr=W*0.06;
      ctx.lineWidth=1;
      ctx.beginPath(); ctx.ellipse(px+Math.cos(la)*lr,py-W*0.01+Math.sin(la)*lr*0.5,W*0.04,W*0.022,la,0,Math.PI*2); ctx.stroke();
      // Leaf veins
      ctx.lineWidth=0.4;
      const lx2=px+Math.cos(la)*lr, ly2=py-W*0.01+Math.sin(la)*lr*0.5;
      ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(lx2,ly2); ctx.stroke();
    }
  });
}

// =================== SCENE 6: OUTER SPACE (PACKED) ===================
function scene6(ctx, W, H) {
  colorSetup(ctx, W, H, 0);

  // Stars — many sizes, cross sparkles
  for (let s=0; s<80; s++) {
    const sx=(s*W*0.013+W*0.02)%W, sy=(s*H*0.017+H*0.01)%H;
    const ss=[1,1.2,1.8,2.5,3][s%5];
    ctx.lineWidth=0.8; ctx.beginPath(); ctx.arc(sx,sy,ss,0,Math.PI*2); ctx.stroke();
    if(ss>2) doodleStars(ctx,sx,sy,ss*2.5,4);
  }

  // Milky way band — many dotted arcs
  for (let r=0;r<5;r++) {
    ctx.lineWidth=0.4+r*0.1; ctx.setLineDash([2+r,6-r]);
    ctx.beginPath(); ctx.ellipse(W*0.5,H*1.2,W*(0.5+r*0.08),H*(0.8+r*0.06),0.2,Math.PI*1.05,Math.PI*1.95); ctx.stroke();
  }
  ctx.setLineDash([]);

  // Saturn (large, detailed)
  ctx.lineWidth=2.2; ctx.beginPath(); ctx.arc(W*0.74,H*0.17,W*0.09,0,Math.PI*2); ctx.stroke();
  // Bands on planet
  ctx.lineWidth=0.8;
  [-W*0.04,-W*0.015,W*0.015,W*0.04].forEach(dy => {
    ctx.beginPath(); ctx.arc(W*0.74,H*0.17,W*0.09,Math.asin(dy/W*11.1)||0,Math.PI-(Math.asin(dy/W*11.1)||0)); ctx.stroke();
  });
  // Ring system (3 rings)
  [W*0.145,W*0.165,W*0.185].forEach(rx => {
    ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.ellipse(W*0.74,H*0.17,rx,rx*0.25,0.15,0,Math.PI*2); ctx.stroke();
  });
  // Moon orbiting
  ctx.lineWidth=0.8; ctx.setLineDash([3,5]); ctx.beginPath(); ctx.ellipse(W*0.74,H*0.17,W*0.25,W*0.08,0.15,0,Math.PI*2); ctx.stroke(); ctx.setLineDash([]);
  ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(W*0.9,H*0.1,W*0.022,0,Math.PI*2); ctx.stroke();

  // Earth-like planet (left)
  ctx.lineWidth=2; ctx.beginPath(); ctx.arc(W*0.2,H*0.35,W*0.07,0,Math.PI*2); ctx.stroke();
  // Continents (blob shapes)
  ctx.lineWidth=1;
  [[W*0.185,H*0.32,W*0.025,H*0.02],[W*0.215,H*0.36,W*0.03,H*0.025],[W*0.2,H*0.4,W*0.02,H*0.015]].forEach(([bx,by,bw2,bh2]) => {
    ctx.beginPath(); ctx.ellipse(bx,by,bw2,bh2,Math.random(),0,Math.PI*2); ctx.stroke();
  });
  // Orbit ring
  ctx.lineWidth=0.8; ctx.setLineDash([2,4]); ctx.beginPath(); ctx.ellipse(W*0.2,H*0.35,W*0.13,W*0.04,0.3,0,Math.PI*2); ctx.stroke(); ctx.setLineDash([]);
  // Small moon
  ctx.lineWidth=1.2; ctx.beginPath(); ctx.arc(W*0.1,H*0.3,W*0.018,0,Math.PI*2); ctx.stroke();
  ctx.lineWidth=0.6; [[W*0.094,H*0.293,W*0.005],[W*0.107,H*0.307,W*0.004]].forEach(([cx2,cy2,cr2]) => { ctx.beginPath(); ctx.arc(cx2,cy2,cr2,0,Math.PI*2); ctx.stroke(); });

  // Small red planet (mid right)
  ctx.lineWidth=1.8; ctx.beginPath(); ctx.arc(W*0.88,H*0.52,W*0.048,0,Math.PI*2); ctx.stroke();
  // Canyon stripes
  ctx.lineWidth=0.7;
  [H*0.505,H*0.52,H*0.535].forEach(ly => { ctx.beginPath(); ctx.arc(W*0.88,H*0.52,W*0.048,Math.asin((ly-H*0.52)/(W*0.048))||0,Math.PI-(Math.asin((ly-H*0.52)/(W*0.048))||0)); ctx.stroke(); });

  // Moon surface (large, bottom)
  ctx.lineWidth=2.5; ctx.beginPath(); ctx.arc(W*0.5,H*0.9,W*0.2,0,Math.PI*2); ctx.stroke();
  // Detailed craters
  [[W*0.44,H*0.85,W*0.028],[W*0.56,H*0.88,W*0.022],[W*0.48,H*0.92,W*0.016],[W*0.53,H*0.82,W*0.012],[W*0.4,H*0.9,W*0.009]].forEach(([cx2,cy2,cr2]) => {
    ctx.lineWidth=1.2; ctx.beginPath(); ctx.arc(cx2,cy2,cr2,0,Math.PI*2); ctx.stroke();
    ctx.lineWidth=0.6; ctx.beginPath(); ctx.arc(cx2-cr2*0.3,cy2-cr2*0.3,cr2*0.3,0,Math.PI*2); ctx.stroke();
    ctx.lineWidth=0.4; doodleHatch(ctx,cx2-cr2,cy2-cr2,cr2*2,cr2*2,6,Math.PI/3);
  });
  // Rocks on moon
  [[W*0.34,H*0.89],[W*0.62,H*0.91],[W*0.42,H*0.94],[W*0.58,H*0.96]].forEach(([rx,ry]) => {
    ctx.lineWidth=1; ctx.beginPath(); ctx.ellipse(rx,ry,W*0.018,W*0.01,Math.random()*0.5,0,Math.PI*2); ctx.stroke();
  });

  // Rocket ship (detailed)
  ctx.lineWidth=1.8;
  const rx=W*0.5, ry=H*0.25;
  ctx.beginPath(); ctx.moveTo(rx,ry-W*0.1); ctx.lineTo(rx-W*0.035,ry+W*0.02); ctx.lineTo(rx+W*0.035,ry+W*0.02); ctx.closePath(); ctx.stroke();
  ctx.strokeRect(rx-W*0.035,ry+W*0.02,W*0.07,W*0.055);
  // Fins
  ctx.lineWidth=1.2;
  ctx.beginPath(); ctx.moveTo(rx-W*0.035,ry+W*0.055); ctx.lineTo(rx-W*0.065,ry+W*0.12); ctx.lineTo(rx-W*0.02,ry+W*0.075); ctx.closePath(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(rx+W*0.035,ry+W*0.055); ctx.lineTo(rx+W*0.065,ry+W*0.12); ctx.lineTo(rx+W*0.02,ry+W*0.075); ctx.closePath(); ctx.stroke();
  // Porthole
  ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(rx,ry-W*0.015,W*0.02,0,Math.PI*2); ctx.stroke();
  ctx.lineWidth=0.8; ctx.beginPath(); ctx.arc(rx,ry-W*0.015,W*0.013,0,Math.PI*2); ctx.stroke();
  // Rivets
  ctx.lineWidth=0.6;
  [[-W*0.025,W*0.032],[W*0.025,W*0.032],[-W*0.025,W*0.05],[W*0.025,W*0.05]].forEach(([dx,dy]) => { ctx.beginPath(); ctx.arc(rx+dx,ry+dy,2,0,Math.PI*2); ctx.stroke(); });
  // Exhaust flame (jagged)
  ctx.lineWidth=0.9; ctx.setLineDash([2,3]);
  ctx.beginPath(); ctx.moveTo(rx-W*0.02,ry+W*0.075); ctx.lineTo(rx,ry+W*0.16); ctx.lineTo(rx+W*0.02,ry+W*0.075); ctx.stroke();
  ctx.setLineDash([]);

  // Astronaut (full detail)
  const ax=W*0.2, ay=H*0.68;
  ctx.lineWidth=2; ctx.beginPath(); ctx.arc(ax,ay-W*0.06,W*0.048,0,Math.PI*2); ctx.stroke(); // helmet
  ctx.lineWidth=1.5; ctx.beginPath(); ctx.ellipse(ax,ay+W*0.025,W*0.038,W*0.065,0,0,Math.PI*2); ctx.stroke(); // suit
  // Visor
  ctx.lineWidth=1.2; ctx.beginPath(); ctx.arc(ax,ay-W*0.06,W*0.032,Math.PI*0.1,Math.PI*0.9); ctx.stroke();
  // Arms
  ctx.beginPath(); ctx.ellipse(ax-W*0.065,ay,W*0.018,W*0.042,-0.3,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(ax+W*0.065,ay,W*0.018,W*0.042,0.3,0,Math.PI*2); ctx.stroke();
  // Gloves
  ctx.lineWidth=1; ctx.beginPath(); ctx.ellipse(ax-W*0.078,ay+W*0.04,W*0.016,W*0.013,-0.3,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(ax+W*0.078,ay+W*0.04,W*0.016,W*0.013,0.3,0,Math.PI*2); ctx.stroke();
  // Legs
  ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.ellipse(ax-W*0.024,ay+W*0.095,W*0.016,W*0.04,-0.1,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(ax+W*0.024,ay+W*0.095,W*0.016,W*0.04,0.1,0,Math.PI*2); ctx.stroke();
  // Boots
  ctx.lineWidth=1.2;
  ctx.beginPath(); ctx.ellipse(ax-W*0.024,ay+W*0.135,W*0.022,W*0.013,0,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(ax+W*0.024,ay+W*0.135,W*0.022,W*0.013,0,0,Math.PI*2); ctx.stroke();
  // Backpack
  ctx.strokeRect(ax-W*0.048,ay+W*0.04,W*0.018,W*0.05);
  // Badges
  ctx.lineWidth=0.7; ctx.strokeRect(ax-W*0.016,ay,W*0.032,W*0.022);
  // Tether
  ctx.lineWidth=0.9; ctx.setLineDash([3,5]);
  ctx.beginPath(); ctx.moveTo(ax+W*0.045,ay); ctx.quadraticCurveTo(W*0.38,ay-H*0.05,rx-W*0.035,ry+W*0.055); ctx.stroke();
  ctx.setLineDash([]);

  // 3 UFOs
  [[W*0.68,H*0.55],[W*0.38,H*0.45],[W*0.12,H*0.6]].forEach(([ux,uy],ui) => {
    const ur=W*(0.065-ui*0.01);
    ctx.lineWidth=1.8; ctx.beginPath(); ctx.ellipse(ux,uy,ur,ur*0.3,0,0,Math.PI*2); ctx.stroke();
    ctx.lineWidth=1.5; ctx.beginPath(); ctx.ellipse(ux,uy-ur*0.3,ur*0.5,ur*0.5,0,0,Math.PI*2); ctx.stroke();
    // Portholes
    ctx.lineWidth=0.9;
    [-ur*0.28,0,ur*0.28].forEach(dx => { ctx.beginPath(); ctx.arc(ux+dx,uy-ur*0.3,ur*0.1,0,Math.PI*2); ctx.stroke(); });
    // Tractor beam
    ctx.lineWidth=0.8; ctx.setLineDash([4,5]);
    ctx.beginPath(); ctx.moveTo(ux-ur*0.4,uy+ur*0.3); ctx.lineTo(ux-ur*0.8,uy+ur*1.5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ux+ur*0.4,uy+ur*0.3); ctx.lineTo(ux+ur*0.8,uy+ur*1.5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ux,uy+ur*0.3); ctx.lineTo(ux,uy+ur*1.5); ctx.stroke();
    ctx.setLineDash([]);
  });

  // 2 Aliens
  [[W*0.65,H*0.72],[W*0.42,H*0.78]].forEach(([alx,aly]) => {
    const alr=W*0.042;
    ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.ellipse(alx,aly-alr*1.5,alr*1.2,alr,0,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(alx,aly,alr*0.7,alr*1.2,0,0,Math.PI*2); ctx.stroke();
    // Eyes
    ctx.beginPath(); ctx.ellipse(alx-alr*0.38,aly-alr*1.5,alr*0.24,alr*0.32,0,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(alx+alr*0.38,aly-alr*1.5,alr*0.24,alr*0.32,0,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='#111'; ctx.beginPath(); ctx.ellipse(alx-alr*0.38,aly-alr*1.5,alr*0.12,alr*0.16,0,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#fff';
    ctx.beginPath(); ctx.ellipse(alx+alr*0.38,aly-alr*1.5,alr*0.12,alr*0.16,0,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#fff';
    ctx.strokeStyle='#111';
    // Antennae with bobbles
    ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(alx-alr*0.2,aly-alr*2.4); ctx.lineTo(alx-alr*0.55,aly-alr*3.1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(alx+alr*0.2,aly-alr*2.4); ctx.lineTo(alx+alr*0.55,aly-alr*3.1); ctx.stroke();
    ctx.lineWidth=1.3; ctx.beginPath(); ctx.arc(alx-alr*0.55,aly-alr*3.1,alr*0.15,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(alx+alr*0.55,aly-alr*3.1,alr*0.15,0,Math.PI*2); ctx.stroke();
    // Arms & legs
    ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(alx-alr*0.6,aly-alr*0.3); ctx.lineTo(alx-alr*1.3,aly+alr*0.4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(alx+alr*0.6,aly-alr*0.3); ctx.lineTo(alx+alr*1.3,aly+alr*0.4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(alx-alr*0.3,aly+alr*1.1); ctx.lineTo(alx-alr*0.3,aly+alr*2.1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(alx+alr*0.3,aly+alr*1.1); ctx.lineTo(alx+alr*0.3,aly+alr*2.1); ctx.stroke();
    // Feet
    ctx.lineWidth=1; ctx.beginPath(); ctx.ellipse(alx-alr*0.3,aly+alr*2.1,alr*0.22,alr*0.1,0,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(alx+alr*0.3,aly+alr*2.1,alr*0.22,alr*0.1,0,0,Math.PI*2); ctx.stroke();
  });

  // Comets
  [[W*0.06,H*0.09],[W*0.35,H*0.04],[W*0.8,H*0.33]].forEach(([cx2,cy2]) => {
    ctx.lineWidth=1.8; ctx.beginPath(); ctx.arc(cx2,cy2,5,0,Math.PI*2); ctx.stroke();
    ctx.lineWidth=1; ctx.setLineDash([3,5]);
    ctx.beginPath(); ctx.moveTo(cx2-4,cy2); ctx.lineTo(cx2-W*0.1,cy2+H*0.04); ctx.stroke();
    ctx.lineWidth=0.5; ctx.beginPath(); ctx.moveTo(cx2-3,cy2-3); ctx.lineTo(cx2-W*0.08,cy2+H*0.02); ctx.stroke();
    ctx.lineWidth=0.5; ctx.beginPath(); ctx.moveTo(cx2-3,cy2+3); ctx.lineTo(cx2-W*0.08,cy2+H*0.06); ctx.stroke();
    ctx.setLineDash([]);
  });

  // Space debris / asteroids
  [[W*0.32,H*0.62,W*0.022],[W*0.55,H*0.42,W*0.015],[W*0.12,H*0.75,W*0.018]].forEach(([ax2,ay2,ar]) => {
    ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(ax2+ar,ay2); ctx.lineTo(ax2+ar*0.5,ay2+ar); ctx.lineTo(ax2-ar*0.8,ay2+ar*0.6); ctx.lineTo(ax2-ar,ay2-ar*0.2); ctx.lineTo(ax2-ar*0.3,ay2-ar); ctx.lineTo(ax2+ar*0.7,ay2-ar*0.8); ctx.closePath(); ctx.stroke();
    doodleDots(ctx,ax2-ar,ay2-ar,ar*2,ar*2,ar*0.4);
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
