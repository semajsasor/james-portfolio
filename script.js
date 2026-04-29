// James Francis O. Rosas - Portfolio JS

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Cursor glow
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && !prefersReducedMotion) {
  document.addEventListener('mousemove', (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
} else if (cursorGlow) {
  cursorGlow.style.display = 'none';
}

// Navbar scroll and mobile menu
const navbar = document.getElementById('navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinksWrap = document.getElementById('navLinks');
const navLinks = document.querySelectorAll('.nav-link');
const hireMeButton = document.getElementById('hireMeButton');
const hireModal = document.getElementById('hireModal');
const hireModalClose = document.getElementById('hireModalClose');
const hireModalX = document.getElementById('hireModalX');
let previouslyFocusedElement = null;

function updateNavbarState() {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 32);
  }
}

updateNavbarState();
window.addEventListener('scroll', updateNavbarState, { passive: true });

function closeMobileNav() {
  document.body.classList.remove('nav-open');
  if (navToggle) {
    navToggle.setAttribute('aria-expanded', 'false');
  }
}

if (navToggle && navLinksWrap) {
  navToggle.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinksWrap.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      closeMobileNav();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMobileNav();
    }
  });
}

function openHireModal() {
  if (!hireModal) return;
  closeMobileNav();
  previouslyFocusedElement = document.activeElement;
  hireModal.classList.add('open');
  hireModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  window.setTimeout(() => {
    const firstAction = hireModal.querySelector('a, button');
    if (firstAction) firstAction.focus();
  }, 0);
}

function closeHireModal() {
  if (!hireModal) return;
  hireModal.classList.remove('open');
  hireModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
    previouslyFocusedElement.focus();
  }
}

if (hireMeButton && hireModal) {
  hireMeButton.addEventListener('click', openHireModal);
  [hireModalClose, hireModalX].forEach((button) => {
    if (button) button.addEventListener('click', closeHireModal);
  });

  hireModal.addEventListener('click', (event) => {
    if (event.target === hireModal) {
      closeHireModal();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeHireModal();
  }
});

// Particle Canvas
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas || prefersReducedMotion) {
    if (canvas) canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let width;
  let height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const particleCount = window.innerWidth < 700 ? 46 : 82;
    particles = Array.from({ length: particleCount }, () => new Particle());
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.r = Math.random() * 1.2 + 0.35;
      this.vx = (Math.random() - 0.5) * 0.22;
      this.vy = (Math.random() - 0.5) * 0.22;
      this.a = Math.random() * 0.32 + 0.08;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${this.a})`;
      ctx.fill();
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 92) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.055 * (1 - distance / 92)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });
    drawConnections();
    requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  animate();
})();

// Scroll Reveal
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        window.setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 45);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('visible'));
}

// Counter animation
const counters = document.querySelectorAll('.stat-num');
if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = Number(el.dataset.target);
        let current = 0;
        const step = Math.max(target / 36, 1);
        const timer = window.setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target;
            window.clearInterval(timer);
          } else {
            el.textContent = Math.floor(current);
          }
        }, 28);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach((counter) => {
    counter.textContent = counter.dataset.target;
  });
}

// Skill bar animation
const skillFills = document.querySelectorAll('.skill-fill');
if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width;
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.28 });

  skillFills.forEach((fill) => skillObserver.observe(fill));
} else {
  skillFills.forEach((fill) => {
    fill.style.width = fill.dataset.width;
  });
}

// Active nav link highlighting
const sections = Array.from(document.querySelectorAll('section[id]'));
let pendingActiveHash = '';
let activeScrollTimer;

function getNavbarOffset() {
  if (!navbar) return 0;
  const navbarBox = navbar.getBoundingClientRect();
  return navbarBox.height + navbarBox.top + 24;
}

function setActiveNavLink(hash) {
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === hash);
  });
}

function getActiveSectionId() {
  const navAwarePosition = window.scrollY + getNavbarOffset() + 4;
  const pageBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

  if (pageBottom && sections.length) {
    return sections[sections.length - 1].id;
  }

  return sections.reduce((activeId, section) => {
    if (navAwarePosition >= section.offsetTop) {
      return section.id;
    }
    return activeId;
  }, sections[0]?.id || '');
}

function updateActiveNavLink() {
  if (pendingActiveHash) {
    setActiveNavLink(pendingActiveHash);
    window.clearTimeout(activeScrollTimer);
    activeScrollTimer = window.setTimeout(() => {
      pendingActiveHash = '';
      updateActiveNavLink();
    }, 180);
    return;
  }

  const activeSectionId = getActiveSectionId();
  setActiveNavLink(activeSectionId ? `#${activeSectionId}` : '');
}

if (window.location.hash && document.getElementById(window.location.hash.slice(1))) {
  setActiveNavLink(window.location.hash);
} else {
  updateActiveNavLink();
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });
window.addEventListener('resize', updateActiveNavLink, { passive: true });
window.addEventListener('hashchange', () => {
  if (window.location.hash && document.getElementById(window.location.hash.slice(1))) {
    setActiveNavLink(window.location.hash);
  } else {
    updateActiveNavLink();
  }
});

// Smooth hash navigation
document.addEventListener('click', (event) => {
  const anchor = event.target.closest('a[href^="#"]');
  if (!anchor) return;

  const hash = anchor.getAttribute('href');
  if (!hash || hash === '#') return;

  const target = document.getElementById(hash.slice(1));
  if (!target) return;

  event.preventDefault();
  closeMobileNav();
  pendingActiveHash = hash;
  setActiveNavLink(hash);
  window.clearTimeout(activeScrollTimer);
  activeScrollTimer = window.setTimeout(() => {
    pendingActiveHash = '';
    updateActiveNavLink();
  }, prefersReducedMotion ? 0 : 700);
  const targetTop = target.getBoundingClientRect().top + window.scrollY - getNavbarOffset();
  window.scrollTo({ top: Math.max(targetTop, 0), behavior: prefersReducedMotion ? 'auto' : 'smooth' });

  if (history.pushState) {
    history.pushState(null, '', hash);
  }
});
