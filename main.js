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
document.querySelectorAll('a, button, .skill-card, .project-card, .engage-card, .gallery-item, .chip').forEach(el => {
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
  { text: '→ anietta · cs · ai safety · art', cls: 'term-output',  delay: 700  },
  { text: '$ cat now.txt',                 cls: 'term-prompt',     delay: 1100 },
  { text: '→ m.sc. ai in society @ tum',   cls: 'term-output-dim', delay: 1500 },
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
const sections = ['hero', 'about', 'cv', 'skills', 'projects', 'engagement', 'gallery', 'contact'];

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

/* =====================================================
   WOMEN IN STEM SPINNER
   ===================================================== */
const WOMEN = [
  { name: 'Katherine Johnson', years: '1918 – 2020', field: 'Mathematics · NASA', photo: 'women/johnson.png',
    text: 'Calculated the flight paths for the first American human spaceflights and the Apollo 11 Moon landing. Awarded the Presidential Medal of Freedom in 2015.' },
  { name: 'Grace Hopper', years: '1906 – 1992', field: 'Computer Science', photo: 'women/hopper.png',
    text: 'Built one of the first compilers and helped create COBOL, making programming closer to human language. Rose to Rear Admiral in the US Navy.' },
  { name: 'Radia Perlman', years: 'born 1951', field: 'Networking', photo: 'women/perlman.png',
    text: 'Invented the Spanning Tree Protocol, which lets large networks run without loops. Often called the "Mother of the Internet".' },
  { name: 'Ada Lovelace', years: '1815 – 1852', field: 'Mathematics', photo: 'women/lovelace.png',
    text: 'Published what is considered the first computer program, written for Babbage\'s Analytical Engine, and foresaw that machines could do more than calculate.' },
  { name: 'Margaret Hamilton', years: 'born 1936', field: 'Software Engineering', photo: 'women/hamilton.png',
    text: 'Led the team that wrote the Apollo flight software at MIT and helped establish "software engineering" as a discipline.' },
  { name: 'Hedy Lamarr', years: '1914 – 2000', field: 'Invention', photo: 'women/lamarr.png',
    text: 'Hollywood star who co-invented frequency hopping, an idea that later fed into technologies like Wi-Fi and Bluetooth.' },
  { name: 'Frances Allen', years: '1932 – 2020', field: 'Compilers', photo: 'women/allen.png',
    text: 'Pioneer of compiler optimization at IBM and the first woman to receive the Turing Award, in 2006.' },
  { name: 'Barbara Liskov', years: 'born 1939', field: 'Programming Languages', photo: 'women/liskov.png',
    text: 'Known for the Liskov substitution principle and data abstraction. Turing Award winner in 2008.' },
  { name: 'Fei-Fei Li', years: 'born 1976', field: 'Artificial Intelligence', photo: 'women/li.png',
    text: 'Created ImageNet, the dataset that sparked the deep learning boom in computer vision, and co-founded Stanford\'s Human-Centered AI Institute.' },
  { name: 'Marie Curie', years: '1867 – 1934', field: 'Physics · Chemistry', photo: 'women/curie.png',
    text: 'First woman to win a Nobel Prize and still the only person to win Nobel Prizes in two different sciences.' },
];

const spinBtn   = document.getElementById('spinner-btn');
const spinCard  = document.getElementById('spinner-card');
const spinPhoto = document.getElementById('spinner-photo');
const spinName  = document.getElementById('spinner-name');
const spinYears = document.getElementById('spinner-years');
const spinField = document.getElementById('spinner-field');
const spinText  = document.getElementById('spinner-text');
let lastIdx = -1;

spinBtn.addEventListener('click', () => {
  spinBtn.disabled = true;
  spinCard.classList.add('shuffling');
  let ticks = 0;
  const shuffle = setInterval(() => {
    spinName.textContent = WOMEN[Math.floor(Math.random() * WOMEN.length)].name;
    if (++ticks > 14) {
      clearInterval(shuffle);
      let idx;
      do { idx = Math.floor(Math.random() * WOMEN.length); } while (idx === lastIdx);
      lastIdx = idx;
      const w = WOMEN[idx];

      spinCard.classList.remove('shuffling');
      spinCard.classList.add('fade');
      setTimeout(() => {
        spinPhoto.style.backgroundImage = `url('${w.photo}')`;
        spinName.textContent  = w.name;
        spinYears.textContent = w.years;
        spinField.textContent = w.field;
        spinText.textContent  = w.text;
        spinCard.classList.remove('fade');
      }, 300);
      setTimeout(() => { spinBtn.disabled = false; }, 600);
    }
  }, 80);
});
