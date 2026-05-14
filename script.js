// ── LIVE WATCH CLOCK ──
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const el = document.getElementById('watchTime');
  if (el) el.textContent = `${h}:${m}`;
}
updateClock();
setInterval(updateClock, 10000);

// ── HAMBURGER / MOBILE NAV ──
const hamburger = document.getElementById('hamburgerBtn');
const mobileNav = document.getElementById('mobileNav');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('show');
  hamburger.classList.toggle('open', isOpen);
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('show');
    hamburger.classList.remove('open');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
    mobileNav.classList.remove('show');
    hamburger.classList.remove('open');
  }
});

// ── THEME (dark / light) ──
const THEME_KEY = 'rhythmx-theme';

function getPreferredTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  return 'dark';
}

function applyTheme(theme) {
  const t = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', t);
  const label = document.querySelector('.theme-toggle__label');
  if (label) label.textContent = t === 'light' ? 'Light' : 'Dark';
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch (_) {}
}

function initTheme() {
  let stored = null;
  try {
    stored = localStorage.getItem(THEME_KEY);
  } catch (_) {}
  if (stored === 'light' || stored === 'dark') {
    applyTheme(stored);
  } else {
    applyTheme(getPreferredTheme());
  }
}

function toggleTheme() {
  const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  applyTheme(next);
}

initTheme();

document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
document.getElementById('themeToggleMobile')?.addEventListener('click', () => {
  toggleTheme();
});

// ── TESTIMONIALS SLIDER ──
const track = document.getElementById('sliderTrack');
const cards = track.querySelectorAll('.testi-card');
const dotsContainer = document.getElementById('sliderDots');
let currentSlide = 0;

function getVisible() {
  return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
}

function getMaxSlide() {
  return cards.length - getVisible();
}

// Build dots
function buildDots() {
  dotsContainer.innerHTML = '';
  const max = getMaxSlide();
  for (let i = 0; i <= max; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === currentSlide ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }
}

function goTo(n) {
  const max = getMaxSlide();
  currentSlide = Math.max(0, Math.min(n, max));
  const first = cards[0];
  const target = cards[currentSlide];
  const dx = first && target ? target.offsetLeft - first.offsetLeft : 0;
  track.style.transform = `translateX(${-dx}px)`;
  buildDots();
}

document.getElementById('prevBtn').addEventListener('click', () => goTo(currentSlide - 1));
document.getElementById('nextBtn').addEventListener('click', () => goTo(currentSlide + 1));

// Auto-advance
let autoInterval = setInterval(() => {
  const next = currentSlide >= getMaxSlide() ? 0 : currentSlide + 1;
  goTo(next);
}, 4500);

track.parentElement.parentElement.addEventListener('mouseenter', () => clearInterval(autoInterval));
track.parentElement.parentElement.addEventListener('mouseleave', () => {
  autoInterval = setInterval(() => {
    const next = currentSlide >= getMaxSlide() ? 0 : currentSlide + 1;
    goTo(next);
  }, 4500);
});

window.addEventListener('resize', () => goTo(Math.min(currentSlide, getMaxSlide())));
buildDots();
requestAnimationFrame(() => {
  requestAnimationFrame(() => goTo(Math.min(currentSlide, getMaxSlide())));
});

// ── EMAIL FORM VALIDATION ──
const emailInput = document.getElementById('emailInput');
const signupBtn = document.getElementById('signupBtn');
const formError = document.getElementById('formError');
const formSuccess = document.getElementById('formSuccess');
const signupFormWrap = document.getElementById('signupFormWrap');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

signupBtn.addEventListener('click', () => {
  const val = emailInput.value;
  if (!val.trim()) {
    formError.textContent = 'Email address is required';
    emailInput.classList.add('error');
    formError.classList.add('show');
    return;
  }
  if (!isValidEmail(val)) {
    formError.textContent = 'Please enter a valid email address';
    emailInput.classList.add('error');
    formError.classList.add('show');
    return;
  }
  // Success
  emailInput.classList.remove('error');
  formError.classList.remove('show');
  signupFormWrap.style.display = 'none';
  formSuccess.classList.add('show');
});

emailInput.addEventListener('input', () => {
  emailInput.classList.remove('error');
  formError.classList.remove('show');
});

emailInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') signupBtn.click();
});

// ── SCROLL HEADER TINT ──
window.addEventListener('scroll', () => {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  header.classList.toggle('header--scrolled', window.scrollY > 24);
});

// ── INTERSECTION OBSERVER — fade-in on scroll ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-item, .plan-card, .testi-card, .spec-drawer').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease, background 0.3s';
  observer.observe(el);
});