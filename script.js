const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = [...document.querySelectorAll('.site-nav a')];

menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

navLinks.forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const sections = [...document.querySelectorAll('main section[id]')];
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => navObserver.observe(section));

const cards = [...document.querySelectorAll('.interest-card')];
const interestField = document.querySelector('#interestField');
const formHeading = document.querySelector('#formHeading');
const platformWrap = document.querySelector('#platformWrap');

function selectInterest(type, button) {
  cards.forEach(card => card.classList.toggle('active', card === button));
  interestField.value = type;
  const headings = {
    'Beta Testing': 'Apply for Beta Testing',
    'Early Access': 'Join Early Access',
    'Collaboration': 'Collaborate on Breaking Point',
    'Sponsorship': 'Contact Us About Sponsorship',
    'Press / Creator': 'Press & Creator Inquiry',
    'General Inquiry': 'Contact Breaking Point'
  };
  formHeading.textContent = headings[type] || 'Get Involved';
  platformWrap.style.display = ['Beta Testing', 'Early Access'].includes(type) ? 'flex' : 'none';
}

cards.forEach(card => card.addEventListener('click', () => selectInterest(card.dataset.type, card)));

const progress = document.querySelector('.climb-progress');
const marker = document.querySelector('.climb-marker');
function updateScrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
  progress.style.height = `${pct}%`;
  marker.style.bottom = `${pct}%`;
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

const heroBg = document.querySelector('.hero-bg');
if (heroBg && matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelector('.hero').addEventListener('pointermove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 12;
    const y = (e.clientY / window.innerHeight - 0.5) * 8;
    heroBg.style.transform = `scale(1.05) translate(${x * -0.18}px, ${y * -0.18}px)`;
  });
}

const canvas = document.querySelector('#embers');
const ctx = canvas.getContext('2d');
let embers = [];
let rafId;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(innerWidth * dpr);
  canvas.height = Math.floor(innerHeight * dpr);
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function makeEmber() {
  return {
    x: Math.random() * innerWidth,
    y: innerHeight + Math.random() * 120,
    r: Math.random() * 1.8 + 0.4,
    speed: Math.random() * 0.5 + 0.18,
    drift: (Math.random() - 0.5) * 0.35,
    alpha: Math.random() * 0.55 + 0.15
  };
}

function animateEmbers() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  while (embers.length < Math.min(60, Math.floor(innerWidth / 22))) embers.push(makeEmber());
  embers.forEach(e => {
    e.y -= e.speed;
    e.x += e.drift;
    if (e.y < -20) Object.assign(e, makeEmber());
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(226,154,85,${e.alpha})`;
    ctx.fill();
  });
  rafId = requestAnimationFrame(animateEmbers);
}

if (!reduceMotion) {
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  animateEmbers();
}

window.addEventListener('beforeunload', () => cancelAnimationFrame(rafId));
