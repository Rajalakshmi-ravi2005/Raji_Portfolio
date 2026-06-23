// Cursor-follow ambient glow.
// Tracks pointer position and updates CSS vars consumed by .cursor-glow's
// radial-gradient. Only active when the pointer is over a dark-background
// section (.hero, .skills, .internships, .contact, .page-hero, .play-card,
// .compare-card area) — light "paper" sections never show the glow, so it
// never smudges the cream backgrounds.
document.addEventListener('DOMContentLoaded', () => {
  const glow = document.querySelector('.cursor-glow');
  if (!glow) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(max-width: 760px)').matches;
  if (prefersReduced || isTouch) return;

  let rafId = null;
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;

  function isOverDarkSection(x, y) {
    const el = document.elementFromPoint(x, y);
    if (!el) return false;
    return !!el.closest('.hero, .skills, .internships, .contact, .page-hero, .page-links, .nav');
  }

  window.addEventListener('pointermove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (isOverDarkSection(targetX, targetY)) {
      glow.classList.add('active');
    } else {
      glow.classList.remove('active');
    }
    if (!rafId) {
      rafId = requestAnimationFrame(updateGlow);
    }
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    glow.classList.remove('active');
  });

  function updateGlow() {
    glow.style.setProperty('--gx', targetX + 'px');
    glow.style.setProperty('--gy', targetY + 'px');
    rafId = null;
  }
});
