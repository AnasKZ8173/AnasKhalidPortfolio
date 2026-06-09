/* ============================================================
   ANAS KHALID PORTFOLIO — script.js
   ============================================================ */

/* ========================
   EMAILJS CONFIGURATION
   ▸ Replace with your actual EmailJS credentials:
     1. Sign up at https://www.emailjs.com
     2. Create a service (Gmail/Outlook etc.) → copy SERVICE_ID
     3. Create an email template → copy TEMPLATE_ID
     4. Copy your PUBLIC_KEY from Account > API Keys
======================== */
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xyz789'
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g. 'A1b2C3d4E5f6G7h8'

// Initialize EmailJS
(function () {
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
})();


/* ========================
   NAVBAR SCROLL
======================== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });


/* ========================
   MOBILE MENU
======================== */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');
const overlay     = document.getElementById('mobile-overlay');

function openMobile() {
  mobileMenu.classList.add('open');
  overlay.classList.add('open');
  hamburger.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMobile() {
  mobileMenu.classList.remove('open');
  overlay.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeMobile() : openMobile();
});
if (mobileClose) mobileClose.addEventListener('click', closeMobile);


/* ========================
   CUSTOM CURSOR (desktop only)
======================== */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

if (dot && ring && window.innerWidth > 640) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  // Enlarge ring on interactive elements
  document.addEventListener('mouseenter', e => {
    if (e.target && e.target.matches &&
      e.target.matches('a, button, .service-card, .timeline-card, .edu-card, .info-item, .skill-category, .contact-link, .footer-social')
    ) {
      ring.style.width        = '50px';
      ring.style.height       = '50px';
      ring.style.borderColor  = 'rgba(123,47,255,0.8)';
    }
  }, true);

  document.addEventListener('mouseleave', e => {
    if (e.target && e.target.matches &&
      e.target.matches('a, button, .service-card, .timeline-card, .edu-card, .info-item, .skill-category, .contact-link, .footer-social')
    ) {
      ring.style.width        = '36px';
      ring.style.height       = '36px';
      ring.style.borderColor  = 'rgba(0,212,255,0.5)';
    }
  }, true);

  function animateCursor() {
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}


/* ========================
   CURSOR TRAIL CANVAS
======================== */
const tc = document.getElementById('cursor-trail-canvas');
if (tc && window.innerWidth > 640) {
  const tctx  = tc.getContext('2d');
  const trail = [];

  function resizeTrail() {
    tc.width  = window.innerWidth;
    tc.height = window.innerHeight;
  }
  resizeTrail();
  window.addEventListener('resize', resizeTrail, { passive: true });

  document.addEventListener('mousemove', e => {
    trail.push({ x: e.clientX, y: e.clientY, life: 1 });
    if (trail.length > 30) trail.shift();
  }, { passive: true });

  function drawTrail() {
    tctx.clearRect(0, 0, tc.width, tc.height);
    for (let i = 0; i < trail.length; i++) {
      const t = trail[i];
      t.life -= 0.04;
      if (t.life <= 0) continue;
      const r = i / trail.length;
      tctx.beginPath();
      tctx.arc(t.x, t.y, r * 3, 0, Math.PI * 2);
      tctx.fillStyle = `rgba(0,212,255,${t.life * 0.22 * r})`;
      tctx.fill();
    }
    requestAnimationFrame(drawTrail);
  }
  drawTrail();
}


/* ========================
   PARTICLE SYSTEM
======================== */
(function () {
  const pc   = document.getElementById('particles-canvas');
  if (!pc) return;
  const pctx = pc.getContext('2d');
  let W, H;
  const PARTICLE_COUNT = window.innerWidth < 640 ? 50 : 120;
  const particles = [];

  function resizePC() {
    W = pc.width  = window.innerWidth;
    H = pc.height = window.innerHeight;
  }
  resizePC();
  window.addEventListener('resize', resizePC, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.r     = Math.random() * 1.2 + 0.3;
      this.vx    = (Math.random() - 0.5) * 0.28;
      this.vy    = (Math.random() - 0.5) * 0.28;
      this.alpha = Math.random() * 0.45 + 0.08;
      this.color = Math.random() > 0.5 ? '0,212,255' : '123,47,255';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      pctx.beginPath();
      pctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      pctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      pctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function animateParticles() {
    pctx.clearRect(0, 0, W, H);
    for (const p of particles) { p.update(); p.draw(); }

    // Connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          pctx.beginPath();
          pctx.strokeStyle = `rgba(0,212,255,${(1 - dist / 110) * 0.055})`;
          pctx.lineWidth   = 0.5;
          pctx.moveTo(particles[i].x, particles[i].y);
          pctx.lineTo(particles[j].x, particles[j].y);
          pctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
})();


/* ========================
   TYPING ANIMATION
======================== */
(function () {
  const roles    = ['Web Developer', 'UI/UX Designer', 'Laravel Expert', 'CodeIgniter Dev', 'System Builder'];
  let ri = 0, ci = 0, deleting = false;
  const el = document.getElementById('typing-text');
  if (!el) return;

  function typeLoop() {
    const word = roles[ri];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) {
        deleting = true;
        setTimeout(typeLoop, 1900);
        return;
      }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
        setTimeout(typeLoop, 400);
        return;
      }
    }
    setTimeout(typeLoop, deleting ? 55 : 85);
  }
  typeLoop();
})();


/* ========================
   SCROLL REVEAL
======================== */
(function () {
  const reveals  = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target); // fire once
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
})();


/* ========================
   SKILL BAR ANIMATION
======================== */
(function () {
  const categories = document.querySelectorAll('.skill-category');
  if (!categories.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.pct + '%';
        });
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.25 });

  categories.forEach(c => observer.observe(c));
})();


/* ========================
   3D TILT — SERVICE CARDS
======================== */
(function () {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `translateY(-5px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ========================
   TOAST NOTIFICATION
======================== */
function showToast(message, type = 'success') {
  const toast   = document.getElementById('toast');
  const toastMsg= document.getElementById('toast-msg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;

  const icon = toast.querySelector('.toast-icon');
  if (icon) {
    icon.className = type === 'success'
      ? 'fa-solid fa-circle-check toast-icon'
      : 'fa-solid fa-circle-exclamation toast-icon';
  }

  toast.classList.toggle('toast-error', type === 'error');
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}


/* ========================
   CONTACT FORM — EMAILJS
======================== */
(function () {
  const form    = document.getElementById('contact-form');
  const formBtn = document.getElementById('form-btn');
  const btnText = document.getElementById('btn-text');
  const btnLoad = document.getElementById('btn-loading');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Basic validation
    const name    = document.getElementById('from_name');
    const email   = document.getElementById('from_email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');

    if (!name.value.trim() || !email.value.trim() || !subject.value.trim() || !message.value.trim()) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    // UI: loading state
    formBtn.disabled     = true;
    btnText.style.display = 'none';
    btnLoad.style.display = 'flex';

    // Check if EmailJS is available and properly configured
    if (typeof emailjs === 'undefined') {
      simulateSend();
      return;
    }
    if (
      EMAILJS_SERVICE_ID  === 'YOUR_SERVICE_ID' ||
      EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' ||
      EMAILJS_PUBLIC_KEY  === 'YOUR_PUBLIC_KEY'
    ) {
      console.warn('EmailJS not configured. Simulating send. Update credentials in script.js.');
      simulateSend();
      return;
    }

    // Send via EmailJS
    const templateParams = {
      from_name : name.value.trim(),
      from_email: email.value.trim(),
      subject   : subject.value.trim(),
      message   : message.value.trim(),
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(() => {
        showToast('Message sent successfully! I\'ll reply within 24 hours.', 'success');
        form.reset();
      })
      .catch(err => {
        console.error('EmailJS error:', err);
        showToast('Failed to send message. Please try again or email me directly.', 'error');
      })
      .finally(() => {
        resetBtn();
      });
  });

  function simulateSend() {
    setTimeout(() => {
      showToast('Message sent! (EmailJS not configured yet — see script.js)', 'success');
      form.reset();
      resetBtn();
    }, 1400);
  }

  function resetBtn() {
    formBtn.disabled      = false;
    btnText.style.display = 'flex';
    btnLoad.style.display = 'none';
  }
})();