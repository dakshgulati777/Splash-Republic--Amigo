import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { initWebGL } from './webgl.js';
import './style.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize WebGL Emoji Scene
initWebGL();

// --------------------------------------------------------------------------
// --------------------------------------------------------------------------
// 1. CUSTOM CURSOR & CURSOR TRAIL
// --------------------------------------------------------------------------
const cursor = document.getElementById('custom-cursor');
const cursorRing = document.getElementById('custom-cursor-ring');
let mouseX = -100, mouseY = -100;
let cursorX = -100, cursorY = -100;
let ringX = -100, ringY = -100;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Create Cursor Trail Dots
const trailCount = 10;
const trailDots = [];
for (let i = 0; i < trailCount; i++) {
  const dot = document.createElement('div');
  dot.className = 'cursor-trail-dot';
  const scale = (trailCount - i) / trailCount;
  dot.style.transform = `translate(-50%, -50%) scale(${scale})`;
  dot.style.opacity = `${0.65 * scale}`;
  document.body.appendChild(dot);
  trailDots.push({
    el: dot,
    x: -100,
    y: -100
  });
}

// Cursor animation loop
function tickCursor() {
  cursorX += (mouseX - cursorX) * 0.25;
  cursorY += (mouseY - cursorY) * 0.25;
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;

  if (cursor) {
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
  }
  if (cursorRing) {
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
  }

  // Update trail dots following with delay
  let prevX = mouseX;
  let prevY = mouseY;
  trailDots.forEach((dot) => {
    dot.x += (prevX - dot.x) * 0.32;
    dot.y += (prevY - dot.y) * 0.32;
    if (dot.el) {
      dot.el.style.left = `${dot.x}px`;
      dot.el.style.top = `${dot.y}px`;
    }
    prevX = dot.x;
    prevY = dot.y;
  });

  requestAnimationFrame(tickCursor);
}
tickCursor();

// Cursor Hover Interactions
function initCursorHover() {
  const interactables = document.querySelectorAll('a, button, .ticket-card, .circular-sticker');
  interactables.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      if (cursor && cursorRing) {
        cursor.style.width = '18px';
        cursor.style.height = '18px';
        cursor.style.backgroundColor = '#8c52ff'; // Switch to Lilac on hover
        cursorRing.style.width = '52px';
        cursorRing.style.height = '52px';
        cursorRing.style.borderColor = '#3c5aec';
      }
      trailDots.forEach((dot) => {
        if (dot.el) dot.el.style.backgroundColor = '#3c5aec'; // Switch trail to blue on hover
      });
    });
    item.addEventListener('mouseleave', () => {
      if (cursor && cursorRing) {
        cursor.style.width = '12px';
        cursor.style.height = '12px';
        cursor.style.backgroundColor = '#3c5aec'; // Default Sky Blue
        cursorRing.style.width = '38px';
        cursorRing.style.height = '38px';
        cursorRing.style.borderColor = '#111111';
      }
      trailDots.forEach((dot) => {
        if (dot.el) dot.el.style.backgroundColor = '#8c52ff'; // Default Lilac trail
      });
    });
  });
}

// Click Ripple Effect overlay
window.addEventListener('click', (e) => {
  const ripple = document.createElement('div');
  ripple.className = 'click-ripple';
  ripple.style.left = `${e.clientX}px`;
  ripple.style.top = `${e.clientY}px`;
  document.body.appendChild(ripple);
  
  ripple.addEventListener('animationend', () => {
    ripple.remove();
  });
});

// --------------------------------------------------------------------------
// 2. LOADER ENGINE
// --------------------------------------------------------------------------
const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loader-bar');
const loaderPercent = document.getElementById('loader-percent');

let progress = 0;
const interval = setInterval(() => {
  progress += Math.floor(Math.random() * 8) + 1;
  if (progress >= 100) {
    progress = 100;
    clearInterval(interval);
    
    // Slid loader screen upwards
    gsap.to(loader, {
      yPercent: -100,
      duration: 1.2,
      ease: 'power4.inOut',
      onComplete: () => {
        loader.style.display = 'none';
        animateHeroEntry();
      }
    });
  }
  if (loaderBar) loaderBar.style.width = `${progress}%`;
  if (loaderPercent) loaderPercent.innerText = `${progress.toString().padStart(2, '0')}%`;
}, 45);

// Hero Entry Timelines
function animateHeroEntry() {
  const tl = gsap.timeline();

  // Draw background grid lines
  tl.to('.grid-line', {
    scaleY: 1,
    duration: 1.4,
    stagger: 0.12,
    ease: 'power3.inOut'
  }, 0);
  
  // Navigation blocks drop
  tl.from('.header', {
    y: -50,
    opacity: 0,
    duration: 1.0,
    ease: 'power3.out'
  }, '+=0.2');
  
  // Title texts slide up
  tl.from('.hero-title .title-line', {
    yPercent: 105,
    duration: 1.4,
    stagger: 0.15,
    ease: 'power4.out'
  }, '-=0.7');

  // Subtitle "by Amigo" slides up
  tl.from('.hero-subtitle', {
    y: 30,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out'
  }, '-=1.0');

  // Rotating Badge pop-in
  tl.from('.circular-sticker', {
    scale: 0,
    rotation: -180,
    opacity: 0,
    duration: 1.2,
    ease: 'elastic.out(1, 0.6)'
  }, '-=0.8');

  // Scrolling ticker ribbon entry
  tl.from('.ticker-ribbon', {
    x: '100%',
    opacity: 0,
    rotation: 0,
    duration: 1.4,
    ease: 'power4.out'
  }, '-=1.0');

  // Hero bottom meta footer elements
  tl.from('.hero-meta-top, .hero-footer', {
    opacity: 0,
    y: 20,
    duration: 1.0,
    stagger: 0.1,
    ease: 'power2.out'
  }, '-=1.2');
}

// --------------------------------------------------------------------------
// 3. LENIS SMOOTH SCROLLING
// --------------------------------------------------------------------------
const lenis = new Lenis({
  duration: 1.1,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      lenis.scrollTo(target);
    }
  });
});

// --------------------------------------------------------------------------
// 3.5. MARQUEE VELOCITY SCROLL
// --------------------------------------------------------------------------
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack) {
  const span = tickerTrack.querySelector('span');
  if (span) {
    const clone = span.cloneNode(true);
    tickerTrack.appendChild(clone);
  }

  const tickerTween = gsap.to(tickerTrack, {
    xPercent: -50,
    ease: 'none',
    duration: 25,
    repeat: -1
  });

  let velocityProxy = { speed: 1 };
  
  ScrollTrigger.create({
    onUpdate: (self) => {
      const velocity = Math.abs(self.getVelocity());
      if (velocity > 10) {
        const targetSpeed = gsap.utils.mapRange(0, 3000, 1, 4.5, velocity);
        gsap.to(velocityProxy, {
          speed: targetSpeed,
          duration: 0.15,
          overwrite: 'auto',
          onUpdate: () => {
            tickerTween.timeScale(velocityProxy.speed);
          }
        });
      }
    }
  });

  gsap.ticker.add(() => {
    if (velocityProxy.speed > 1) {
      velocityProxy.speed += (1 - velocityProxy.speed) * 0.04;
      tickerTween.timeScale(velocityProxy.speed);
    }
  });
}

// --------------------------------------------------------------------------
// 4. GSAP SCROLL TIMELINES
// --------------------------------------------------------------------------

// Hero Elements Parallax Scroll
if (document.querySelector('.hero')) {
  gsap.to('.hero-main-title', {
    yPercent: -20,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.to('.scribble-left', {
    yPercent: 35,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.to('.scribble-right', {
    yPercent: -35,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.to('.circular-sticker', {
    yPercent: 50,
    rotation: 240,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.to('.hero-logo-bg', {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
}

// A. Ticket Cards Stagger Entry
gsap.from('.ticket-card', {
  opacity: 0,
  y: 60,
  scale: 0.95,
  duration: 1.0,
  stagger: 0.15,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.tickets-grid',
    start: 'top 85%',
    toggleActions: 'play none none reverse'
  }
});

// A2. Ticket Cards Parallax Scroll (Staggered speeds using wrappers)
document.querySelectorAll('.ticket-card-wrapper').forEach((wrapper) => {
  const yMove = wrapper.style.getPropertyValue('--parallax-y') || '0px';
  const yVal = parseInt(yMove) || 0;
  if (yVal !== 0) {
    gsap.to(wrapper, {
      y: yVal,
      ease: 'none',
      scrollTrigger: {
        trigger: '.tickets-grid',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }
});



// C. Contact Grid Elements Fade-in
gsap.from('.contact-left, .contact-right .contact-group', {
  opacity: 0,
  y: 40,
  duration: 1.0,
  stagger: 0.1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.contact',
    start: 'top 80%',
    toggleActions: 'play none none reverse'
  }
});

// Initialize cursor hover coordinates
initCursorHover();

// --------------------------------------------------------------------------
// 5. 3D PERSPECTIVE TILT HOVER FOR TICKET CARDS
// --------------------------------------------------------------------------
document.querySelectorAll('.ticket-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    // Smooth angle tilt values
    const angleX = (yc - y) / 10;
    const angleY = (x - xc) / 10;
    
    gsap.to(card, {
      rotateX: angleX,
      rotateY: angleY,
      transformPerspective: 1000,
      scale: 1.025,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  });
  
  card.addEventListener('mouseleave', () => {
    // Return smoothly to flat default state
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1.0,
      duration: 0.6,
      ease: 'power3.out',
      overwrite: 'auto'
    });
  });
});
