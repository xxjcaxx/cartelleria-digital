/**
 * IES Dr. Lluís Simarro — Centro de Excelencia IA & Big Data
 * App JavaScript — Particle Canvas, Scroll Animations, Counters
 */



/* ═══════════════════════════════════════
   3. PARTICLE / NETWORK CANVAS
═══════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles, animFrame;

  const CONFIG = {
    count:        70,
    maxDist:     150,
    speed:       0.35,
    radius:      2,
    lineOpacity: 0.15,
    nodeColor:   '26, 107, 200',
    lineColor:   '14, 165, 200',
  };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < CONFIG.count; i++) {
      particles.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * CONFIG.speed,
        vy: (Math.random() - 0.5) * CONFIG.speed,
        r:  Math.random() * CONFIG.radius + 1,
        o:  Math.random() * 0.5 + 0.3,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update & draw nodes
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.nodeColor}, ${p.o})`;
      ctx.fill();

      // Draw connecting lines
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.maxDist) {
          const alpha = CONFIG.lineOpacity * (1 - dist / CONFIG.maxDist);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${CONFIG.lineColor}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });

    animFrame = requestAnimationFrame(draw);
  }

  function init() {
    resize();
    createParticles();
    draw();
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animFrame);
    resize();
    createParticles();
    draw();
  }, { passive: true });

  init();
})();

/* ═══════════════════════════════════════
   4. INTERSECTION OBSERVER — REVEAL
═══════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children within same parent
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════
   5. ANIMATED STAT COUNTERS
═══════════════════════════════════════ */
function animateCounter(el, target, duration = 1600) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    // ease-out
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num[data-target]');
const statsSection = document.getElementById('hero');

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      statNums.forEach(el => {
        const target = parseInt(el.dataset.target, 10);
        setTimeout(() => animateCounter(el, target), 400);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

if (statsSection) statsObserver.observe(statsSection);

/* ═══════════════════════════════════════
   6. PROGRESS BAR ANIMATION (Visual Card)
═══════════════════════════════════════ */
const bars = document.querySelectorAll('.vc-bar-fill');
const vcCard = document.querySelector('.visual-card');

if (vcCard) {
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        bars.forEach(bar => {
          const target = bar.style.width;
          bar.style.width = '0%';
          requestAnimationFrame(() => {
            setTimeout(() => { bar.style.width = target; }, 100);
          });
        });
        barObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  barObserver.observe(vcCard);
}

/* ═══════════════════════════════════════
   7. SMOOTH SCROLL WITH OFFSET (NAVBAR)
═══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ═══════════════════════════════════════
   8. PROJECT CARD TILT EFFECT
═══════════════════════════════════════ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top  - rect.height / 2;
    const rotX = (-y / rect.height) * 6;
    const rotY = ( x / rect.width)  * 6;
    card.style.transform = `translateY(-6px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ═══════════════════════════════════════
   9. ACTIVE NAV LINK ON SCROLL
═══════════════════════════════════════ */
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinksList = document.querySelectorAll('.nav-links a');

const activeLinkObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinksList.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => activeLinkObserver.observe(sec));

/* ═══════════════════════════════════════
   10. PILLAR CARD SHIMMER ON HOVER
═══════════════════════════════════════ */
document.querySelectorAll('.pillar-card, .partner-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
});

/* ═══════════════════════════════════════
   11. INIT: Log
═══════════════════════════════════════ */
console.log('%c IES Dr. Lluís Simarro — Centro de Excelencia IA & Big Data ', 
  'background:#050d1a;color:#00e5ff;font-size:13px;padding:6px 12px;border:1px solid #00e5ff;border-radius:4px;font-family:monospace');
console.log('%c DATIA Hub © 2024 · Xàtiva, Valencia ', 
  'background:#050d1a;color:rgba(255,255,255,0.5);font-size:11px;padding:2px 12px;font-family:monospace');
