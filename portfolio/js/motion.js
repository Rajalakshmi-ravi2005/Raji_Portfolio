document.addEventListener('DOMContentLoaded', () => {

  // Scroll progress bar
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Subtle parallax on hero glow orbs (desktop only, reduced-motion safe)
  if (!prefersReduced && window.innerWidth > 760) {
    const orbs = document.querySelectorAll('.hero .glow-orb');
    if (orbs.length) {
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        orbs.forEach((orb, i) => {
          const speed = i === 0 ? 0.15 : 0.1;
          orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
      }, { passive: true });
    }

    // Subtle tilt on hero terminal following cursor
    const terminal = document.querySelector('.hero-terminal');
    if (terminal) {
      const heroEl = document.querySelector('.hero');
      heroEl.addEventListener('mousemove', (e) => {
        const rect = terminal.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;
        const tiltX = (-dy * 6).toFixed(2);
        const tiltY = (dx * 6).toFixed(2);
        terminal.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      });
      heroEl.addEventListener('mouseleave', () => {
        terminal.style.transform = '';
      });
    }
  }
});
