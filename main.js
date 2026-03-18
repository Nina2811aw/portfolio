/* =====================================================
   PORTFOLIO — main.js
   ===================================================== */

/* ── CUSTOM CURSOR ──────────────────────────────────── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

// Lagging ring animation
(function tick() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(tick);
})();

// Cursor grow on interactive elements
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

/* ── SCROLL REVEAL ──────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── ACTIVE SECTION TRACKING (side nav) ─────────────── */
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

/* ── HERO PARALLAX ──────────────────────────────────── */
const heroRight = document.querySelector('.hero-right');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (heroRight && scrollY < window.innerHeight) {
    heroRight.style.transform = `translateY(${scrollY * 0.15}px)`;
  }
});

/* ── LOGO SCRAMBLE (side nav) ───────────────────────── */
const logo     = document.querySelector('.sidenav-logo');
const origText = logo.textContent;
const chars    = '!@#$%^&*()_+-=0123456789';

logo.addEventListener('mouseenter', () => {
  let i = 0;
  const interval = setInterval(() => {
    logo.textContent = origText
      .split('')
      .map((char, idx) => idx < i ? char : chars[Math.floor(Math.random() * chars.length)])
      .join('');

    if (++i > origText.length) {
      clearInterval(interval);
      logo.textContent = origText;
    }
  }, 40);
});
