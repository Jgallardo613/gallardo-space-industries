// NAV SCROLL EFFECT (frosted glass past hero)
const nav = document.getElementById('nav');
const heroRef = document.querySelector('.hero, .page-hero');
const navScrollThreshold = () => (heroRef ? heroRef.offsetHeight - 80 : 80);
let navTicking = false;
const updateNavState = () => {
  nav.classList.toggle('nav-scrolled', window.scrollY > navScrollThreshold());
  navTicking = false;
};
window.addEventListener('scroll', () => {
  if (!navTicking) {
    navTicking = true;
    requestAnimationFrame(updateNavState);
  }
}, { passive: true });
updateNavState();

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

document.querySelectorAll('.founder-panel, form').forEach(el => el.classList.add('reveal'));

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

// HERO SEQUENTIAL FADE-IN
const heroFadeTargets = document.querySelectorAll('.hero .eyebrow, .hero h1, .hero .hero-sub, .hero .hero-actions, .page-hero .eyebrow, .page-hero h1, .page-hero .hero-sub, .page-hero .hero-actions');
if (heroFadeTargets.length) {
  heroFadeTargets.forEach(el => el.classList.add('hero-fade'));
  if (prefersReducedMotion) {
    heroFadeTargets.forEach(el => el.classList.add('visible'));
  } else {
    heroFadeTargets.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 300);
    });
  }
}

// LOGO 3D TILT
const navLogo = document.querySelector('.nav-logo');
if (navLogo && !prefersReducedMotion) {
  const logoImg = navLogo.querySelector('img');
  const maxTilt = 10;
  navLogo.addEventListener('mousemove', e => {
    const rect = navLogo.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    logoImg.style.transform = `perspective(500px) rotateY(${px * maxTilt * 2}deg) rotateX(${-py * maxTilt * 2}deg) scale(1.04)`;
  });
  navLogo.addEventListener('mouseleave', () => {
    logoImg.style.transform = 'perspective(500px) rotateY(0deg) rotateX(0deg) scale(1)';
  });
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