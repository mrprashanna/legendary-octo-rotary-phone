// ── LOADING SCREEN ───────────────────────────────────────────────────────────
document.body.classList.add('loading');
const loader = document.getElementById('loader');
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.classList.remove('loading');
    // Start typing animation after loader fades
    setTimeout(startTyping, 600);
  }, 2000);
});

// ── TYPING ANIMATION ─────────────────────────────────────────────────────────
const taglineEl = document.getElementById('typingTagline');
const taglineText = 'Developer  ·  Creator  ·  Knight of Code';
let charIndex = 0;

function startTyping() {
  if (charIndex < taglineText.length) {
    taglineEl.textContent += taglineText.charAt(charIndex);
    charIndex++;
    setTimeout(startTyping, 55);
  } else {
    // Remove blinking cursor after typing is done
    setTimeout(() => taglineEl.classList.add('done'), 1500);
  }
}

// ── MOBILE MENU ──────────────────────────────────────────────────────────────
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});
// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ── NAV SCROLL ───────────────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', scrollY > 60);
});

// ── REVEAL ON SCROLL ─────────────────────────────────────────────────────────
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── PARALLAX ON ABOUT IMAGE ─────────────────────────────────────────────────
const parallaxImage = document.getElementById('parallaxImage');
if (parallaxImage) {
  window.addEventListener('scroll', () => {
    const rect = parallaxImage.getBoundingClientRect();
    const windowH = window.innerHeight;
    // Only apply when the element is in view
    if (rect.top < windowH && rect.bottom > 0) {
      const progress = (windowH - rect.top) / (windowH + rect.height);
      const offset = (progress - 0.5) * 40; // -20px to +20px
      parallaxImage.style.transform = `translateY(${offset}px)`;
    }
  }, { passive: true });
}

// ── HERO CANVAS — BAT SIGNAL + CITYSCAPE ─────────────────────────────────────
const hc = document.getElementById('bat-canvas');
const hctx = hc.getContext('2d');
function resizeHero() { hc.width = window.innerWidth; hc.height = window.innerHeight; }
resizeHero();
window.addEventListener('resize', resizeHero);

let angle = 0;
const buildings = [];
for (let i = 0; i < 40; i++) {
  buildings.push({
    x: Math.random() * window.innerWidth,
    w: 20 + Math.random() * 60,
    h: 60 + Math.random() * 200,
    lit: Math.random() > .5
  });
}

function drawHero() {
  const W = hc.width, H = hc.height;
  hctx.clearRect(0, 0, W, H);

  // deep sky gradient
  const sky = hctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#020204');
  sky.addColorStop(.6, '#05050a');
  sky.addColorStop(1, '#0a0a0f');
  hctx.fillStyle = sky;
  hctx.fillRect(0, 0, W, H);

  // bat signal beam
  hctx.save();
  hctx.translate(W / 2, 0);
  hctx.rotate(angle);
  const beam = hctx.createLinearGradient(0, 0, 0, H * .7);
  beam.addColorStop(0, 'rgba(255,215,0,.0)');
  beam.addColorStop(.3, 'rgba(255,215,0,.06)');
  beam.addColorStop(1, 'rgba(255,215,0,.0)');
  hctx.beginPath();
  hctx.moveTo(0, 0);
  hctx.lineTo(-H * .18, H * .7);
  hctx.lineTo(H * .18, H * .7);
  hctx.closePath();
  hctx.fillStyle = beam;
  hctx.fill();
  hctx.restore();

  // stars
  hctx.fillStyle = 'rgba(255,255,255,0.5)';
  for (let i = 0; i < 120; i++) {
    const sx = (Math.sin(i * 777) * .5 + .5) * W;
    const sy = (Math.sin(i * 333) * .5 + .5) * H * .55;
    const ss = Math.random() < .01 ? 1.5 : .5;
    hctx.beginPath();
    hctx.arc(sx, sy, ss, 0, Math.PI * 2);
    hctx.fill();
  }

  // city silhouette
  hctx.fillStyle = '#07070c';
  buildings.forEach(b => {
    hctx.fillRect(b.x, H - b.h, b.w, b.h);
    if (b.lit) {
      hctx.fillStyle = 'rgba(255,215,0,.12)';
      for (let wy = H - b.h + 8; wy < H - 8; wy += 14) {
        for (let wx = b.x + 4; wx < b.x + b.w - 4; wx += 10) {
          if (Math.random() > .4) hctx.fillRect(wx, wy, 5, 6);
        }
      }
      hctx.fillStyle = '#07070c';
    }
  });

  angle += .003;
  requestAnimationFrame(drawHero);
}
drawHero();

// ── FLOATING BAT PARTICLES ───────────────────────────────────────────────────
const batSVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 30' width='28' height='14'>
  <path
    d='M30 8 C24 2 12 1 3 5 C9 8 12 12 11 18 C7 16 3 18 1 22 C6 21 11 22 13 26 C16 22 21 20 30 30 C39 20 44 22 47 26 C49 22 54 21 59 22 C57 18 53 16 49 18 C48 12 51 8 57 5 C48 1 36 2 30 8Z'
    fill='%23ffd700' opacity='0.3' />
</svg>`;
const batURL = 'data:image/svg+xml,' + encodeURIComponent(batSVG);
for (let i = 0; i < 12; i++) {
  const el = document.createElement('img');
  el.src = batURL;
  el.className = 'bat-particle';
  el.alt = '';
  const sx = (Math.random() * 110 - 5) + 'vw';
  const ex = (Math.random() * 110 - 5) + 'vw';
  el.style.cssText = `
    --sx:${sx};--ex:${ex};
    --dur:${6 + Math.random() * 10}s;
    --delay:${Math.random() * 12}s;
    --rot:${Math.random() * 40 - 20}deg;
    left:0;
  `;
  document.body.appendChild(el);
}


// ── EASTER EGGS ──────────────────────────────────────────────────────────────
let keyBuffer = "";
const targetKeywords = {
  "batman": () => {
    const konamiFlash = document.getElementById('konamiFlash');
    if (konamiFlash) {
      konamiFlash.classList.remove('active');
      void konamiFlash.offsetWidth; // force reflow
      konamiFlash.classList.add('active');
      setTimeout(() => konamiFlash.classList.remove('active'), 2000);
    }
  },
  "prash": () => {
    const darkOverlay = document.getElementById('darkOverlay');
    if (darkOverlay) darkOverlay.classList.add('active');
  },
  "prashanna": () => {
    const darkOverlay = document.getElementById('darkOverlay');
    if (darkOverlay) darkOverlay.classList.remove('active');
  }
};

document.addEventListener('keydown', (e) => {
  // Ignore modifier keys
  if (e.key.length > 1) return;
  
  keyBuffer += e.key.toLowerCase();
  keyBuffer = keyBuffer.slice(-20); // Keep last 20 keys
  
  for (const word in targetKeywords) {
    if (keyBuffer.endsWith(word)) {
      targetKeywords[word]();
    }
  }
});
