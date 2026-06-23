// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.nav-burger');
  const nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => obs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // Active nav link highlighting based on current page
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Animated number counters (hero stats + cert summary counts)
  function animateCount(el, target, duration = 1100) {
    const isDecimal = target % 1 !== 0;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = target * eased;
      el.textContent = isDecimal ? current.toFixed(2) : Math.round(current);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = isDecimal ? target.toFixed(2) : target;
    }
    requestAnimationFrame(tick);
  }

  const countEls = document.querySelectorAll('.cs-count[data-target], .num[data-target]');
  if (countEls.length && 'IntersectionObserver' in window) {
    const countObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseFloat(entry.target.dataset.target);
          animateCount(entry.target, target);
          countObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    countEls.forEach(el => countObs.observe(el));
  }

  // Certification summary cards — click to expand filtered detail list
  const summaryCards = document.querySelectorAll('.cert-summary-card');
  const certDetail = document.getElementById('cert-detail');
  const certDetailTitle = document.getElementById('cert-detail-title');
  const certDetailClose = document.querySelector('.cert-detail-close');
  const certCards = document.querySelectorAll('.cert-card');

  const CAT_LABELS = {
    tech: 'Tech & Programming',
    design: 'Design',
    internships: 'Internship Certs',
    webinars: 'Webinars & Workshops'
  };

  function openCertDetail(cat, cardEl) {
    summaryCards.forEach(c => c.classList.toggle('open', c === cardEl));
    summaryCards.forEach(c => c.setAttribute('aria-expanded', c === cardEl ? 'true' : 'false'));
    certCards.forEach(card => card.classList.toggle('hidden', card.dataset.cat !== cat));
    certDetailTitle.textContent = CAT_LABELS[cat] || 'Certifications';
    certDetail.classList.add('open');
    setTimeout(() => {
      certDetail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 150);
  }

  function closeCertDetail() {
    summaryCards.forEach(c => { c.classList.remove('open'); c.setAttribute('aria-expanded', 'false'); });
    certDetail.classList.remove('open');
  }

  if (summaryCards.length) {
    summaryCards.forEach(card => {
      card.addEventListener('click', () => {
        const isOpen = card.classList.contains('open');
        if (isOpen) closeCertDetail();
        else openCertDetail(card.dataset.cat, card);
      });
    });
  }
  if (certDetailClose) {
    certDetailClose.addEventListener('click', closeCertDetail);
  }
});
