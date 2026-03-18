/* =====================================================
   PORTFOLIO — main.js
   ===================================================== */

const PALETTE = ['#D16014', '#939F5C', '#BBCE8A', '#E2F9B8', '#313715'];

/* =====================================================
   1. CUSTOM CURSOR + LAGGING RING
   ===================================================== */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function ringTick() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(ringTick);
})();

// Cursor grows on interactive elements
document.querySelectorAll('a, button, .skill-card, .project-card, .gallery-item, .chip').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '40px';
    cursor.style.height = '40px';
    cursor.style.background = 'var(--olive)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '14px';
    cursor.style.height = '14px';
    cursor.style.background = 'var(--choco)';
  });
});

/* =====================================================
   2. COLOUR CURSOR TRAIL
   ===================================================== */
let lastTrailTime = 0;

document.addEventListener('mousemove', e => {
  const now = Date.now();
  if (now - lastTrailTime < 35) return; // throttle: one dot per 35ms
  lastTrailTime = now;

  const dot = document.createElement('div');
  dot.className = 'trail-dot';
  const size = 5 + Math.random() * 7;
  dot.style.cssText = [
    `width: ${size}px`,
    `height: ${size}px`,
    `left: ${e.clientX}px`,
    `top: ${e.clientY}px`,
    `background: ${PALETTE[Math.floor(Math.random() * PALETTE.length)]}`,
    `opacity: 0.75`,
  ].join(';');

  document.body.appendChild(dot);

  // Fade and remove
  requestAnimationFrame(() => {
    dot.style.opacity = '0';
    setTimeout(() => dot.remove(), 500);
  });
});

/* =====================================================
   3. READING PROGRESS BAR
   ===================================================== */
const progressBar = document.getElementById('progress-bar');

window.addEventListener('scroll', () => {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = Math.min(pct, 100).toFixed(1) + '%';
});

/* =====================================================
   4. DARK / LIGHT MODE TOGGLE
   ===================================================== */
const themeToggle = document.getElementById('theme-toggle');
const toggleIcon  = themeToggle.querySelector('.toggle-icon');
const toggleLabel = themeToggle.querySelector('.toggle-label');

// Restore saved preference on load
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  toggleIcon.textContent  = '☀';
  toggleLabel.textContent = 'light mode';
}

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  toggleIcon.textContent  = isDark ? '☀' : '☾';
  toggleLabel.textContent = isDark ? 'light mode' : 'dark mode';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

/* =====================================================
   5. TYPING TERMINAL (hero intro)
   ===================================================== */
const terminalLines = [
  { text: '$ whoami',                      cls: 'term-prompt',     delay: 300  },
  { text: '→ your_name · cs · creative',   cls: 'term-output',     delay: 700  },
  { text: '$ cat skills.txt',              cls: 'term-prompt',     delay: 1100 },
  { text: '→ ml · design · music · art',   cls: 'term-output-dim', delay: 1500 },
  { text: '$ ./portfolio.sh',              cls: 'term-prompt',     delay: 1900 },
];

terminalLines.forEach(({ text, cls, delay }) => {
  setTimeout(() => {
    const line = document.createElement('div');
    line.className = `term-line ${cls}`;
    line.textContent = text;
    document.getElementById('terminal-lines').appendChild(line);
    // Trigger fade-in on next frame
    requestAnimationFrame(() => requestAnimationFrame(() => line.classList.add('visible')));
  }, delay);
});

// Show blinking cursor after last line
setTimeout(() => {
  const cursorLine = document.createElement('div');
  cursorLine.className = 'term-line term-prompt visible';
  cursorLine.innerHTML = '$ <span class="term-cursor-blink"></span>';
  document.getElementById('terminal-lines').appendChild(cursorLine);
}, 2100);

/* =====================================================
   6. CONFETTI ON FORM SUBMIT
   ===================================================== */
const submitBtn = document.querySelector('.form-submit');

submitBtn.addEventListener('click', () => {
  const rect   = submitBtn.getBoundingClientRect();
  const originX = rect.left + rect.width  / 2;
  const originY = rect.top  + rect.height / 2;
  const count  = 40;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';

    const angle  = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const dist   = 80 + Math.random() * 120;
    const tx     = Math.round(Math.cos(angle) * dist);
    const ty     = Math.round(Math.sin(angle) * dist - 60); // bias upward
    const rotate = Math.round(Math.random() * 720 - 360);
    const dur    = (0.7 + Math.random() * 0.5).toFixed(2);
    const color  = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const size   = 6 + Math.round(Math.random() * 6);

    particle.style.cssText = [
      `left: ${originX}px`,
      `top: ${originY}px`,
      `width: ${size}px`,
      `height: ${size}px`,
      `background: ${color}`,
      `--tx: ${tx}px`,
      `--ty: ${ty}px`,
      `--tr: ${rotate}deg`,
      `--dur: ${dur}s`,
      `animation-delay: ${(Math.random() * 0.15).toFixed(2)}s`,
    ].join(';');

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), (parseFloat(dur) + 0.2) * 1000);
  }
});

/* =====================================================
   SCROLL REVEAL
   ===================================================== */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* =====================================================
   ACTIVE SECTION TRACKING (side nav dots)
   ===================================================== */
const sections = ['hero', 'about', 'cv', 'skills', 'projects', 'gallery', 'contact'];

function setActive(id) {
  document.querySelectorAll('.sidenav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.section === id);
  });
  document.querySelectorAll('.sidenav-dot').forEach(d => {
    d.classList.toggle('active', d.dataset.dot === id);
  });
}

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActive(entry.target.id);
  });
}, { threshold: 0.35 });

sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

/* =====================================================
   HERO PARALLAX
   ===================================================== */
const heroRight = document.querySelector('.hero-right');

window.addEventListener('scroll', () => {
  const s = window.scrollY;
  if (heroRight && s < window.innerHeight) {
    heroRight.style.transform = `translateY(${s * 0.15}px)`;
  }
});

/* =====================================================
   LOGO SCRAMBLE
   ===================================================== */
const logo     = document.querySelector('.sidenav-logo');
const origText = logo.textContent;
const scrambleChars = '!@#$%^&*()_+-=0123456789';

logo.addEventListener('mouseenter', () => {
  let i = 0;
  const interval = setInterval(() => {
    logo.textContent = origText
      .split('')
      .map((char, idx) => idx < i ? char : scrambleChars[Math.floor(Math.random() * scrambleChars.length)])
      .join('');
    if (++i > origText.length) {
      clearInterval(interval);
      logo.textContent = origText;
    }
  }, 40);
});
