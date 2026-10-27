// NAV SCROLL EFFECT
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.style.background = 'rgba(5, 8, 16, 0.98)';
  } else {
    nav.style.background = 'rgba(5, 8, 16, 0.9)';
  }
});

// HAMBURGER MENU
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// SCROLL REVEAL + STAGGER
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.section, .stats-bar').forEach(el => el.classList.add('reveal'));

document.querySelectorAll('.cap-grid, .projects-list, .why-grid, .roles-list').forEach(group => {
  Array.from(group.children).forEach((card, i) => {
    card.classList.add('reveal');
    card.style.transitionDelay = `${Math.min(i, 6) * 90}ms`;
  });
});

document.querySelectorAll('.founder-grid, form').forEach(el => el.classList.add('reveal'));

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
reveals.forEach(el => observer.observe(el));

// HERO PARALLAX
const parallaxEls = document.querySelectorAll('.hero, .page-hero');
if (parallaxEls.length && !prefersReducedMotion) {
  let parallaxTicking = false;
  const applyParallax = () => {
    const offset = Math.min(window.scrollY * 0.3, 220);
    parallaxEls.forEach(el => {
      el.style.backgroundPositionY = `${offset}px`;
    });
    parallaxTicking = false;
  };
  window.addEventListener('scroll', () => {
    if (!parallaxTicking) {
      parallaxTicking = true;
      requestAnimationFrame(applyParallax);
    }
  }, { passive: true });
  applyParallax();
}

// COUNTER ANIMATION (stats bar)
function animateCounter(el) {
  const match = el.textContent.trim().match(/^([\d,]+)(.*)$/);
  if (!match) return;
  const target = parseInt(match[1].replace(/,/g, ''), 10);
  const suffix = match[2];

  if (prefersReducedMotion) {
    el.textContent = target + suffix;
    return;
  }

  const duration = 1200;
  const start = performance.now();
  const tick = now => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(tick);
}

const statNums = document.querySelectorAll('.stat-num');
if (statNums.length) {
  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statObserver.observe(el));
}

// STAR FIELD BACKGROUND
if (!prefersReducedMotion) {
  const canvas = document.createElement('canvas');
  canvas.id = 'starfield';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  let stars = [];
  let w, h, dpr, frame = 0, visible = true;

  function resizeStarfield() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = w < 600 ? 60 : 140;
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.3,
      baseAlpha: Math.random() * 0.5 + 0.3,
      speed: Math.random() * 0.015 + 0.004,
      phase: Math.random() * Math.PI * 2
    }));
  }

  function drawStarfield() {
    if (!visible) return;
    frame++;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#e8eaf0';
    for (const s of stars) {
      const alpha = s.baseAlpha + Math.sin(frame * s.speed + s.phase) * 0.3;
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawStarfield);
  }

  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden;
    if (visible) requestAnimationFrame(drawStarfield);
  });

  window.addEventListener('resize', resizeStarfield, { passive: true });
  resizeStarfield();
  requestAnimationFrame(drawStarfield);
}

// CONTACT FORM - Netlify submission
const contactForm = document.querySelector('form[name="contact"]');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(contactForm)).toString()
    })
      .then(() => {
        btn.textContent = 'Message Sent!';
        contactForm.reset();
      })
      .catch(() => {
        btn.textContent = 'Error - Try Again';
        btn.disabled = false;
      });
  });
}