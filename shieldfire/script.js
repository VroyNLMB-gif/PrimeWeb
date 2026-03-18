/* =============================================
   SHIELDFIRE PROTECTION – SITE JAVASCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ─── STICKY HEADER ────────────────────────
  const header = document.getElementById('header');
  if (header && !header.classList.contains('scrolled')) {
    const onScroll = () => {
      if (window.scrollY > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ─── MOBILE MENU ─────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── SCROLL REVEAL ANIMATIONS ─────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  // ─── ANIMATED COUNTERS ────────────────────
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    let countersDone = false;
    const animateCounters = () => {
      if (countersDone) return;
      countersDone = true;
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const start = performance.now();
        const step = (timestamp) => {
          const elapsed = timestamp - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.floor(eased * target).toLocaleString();
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            counter.textContent = target.toLocaleString();
          }
        };
        requestAnimationFrame(step);
      });
    };
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    counters.forEach(c => counterObserver.observe(c));
  }

  // ─── TESTIMONIALS SLIDER ──────────────────
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  if (track && prevBtn && nextBtn) {
    let currentSlide = 0;
    const cards = track.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;

    const getVisibleCount = () => {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 992) return 2;
      return 3;
    };

    const updateSlider = () => {
      const visibleCount = getVisibleCount();
      const maxSlide = Math.max(0, totalCards - visibleCount);
      if (currentSlide > maxSlide) currentSlide = maxSlide;
      const cardWidth = cards[0].offsetWidth + 24; // includes gap
      track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    };

    nextBtn.addEventListener('click', () => {
      const visibleCount = getVisibleCount();
      const maxSlide = Math.max(0, totalCards - visibleCount);
      if (currentSlide < maxSlide) {
        currentSlide++;
        updateSlider();
      }
    });

    prevBtn.addEventListener('click', () => {
      if (currentSlide > 0) {
        currentSlide--;
        updateSlider();
      }
    });

    window.addEventListener('resize', updateSlider);

    // Auto-advance every 5 seconds
    let autoSlide = setInterval(() => {
      const visibleCount = getVisibleCount();
      const maxSlide = Math.max(0, totalCards - visibleCount);
      currentSlide = currentSlide < maxSlide ? currentSlide + 1 : 0;
      updateSlider();
    }, 5000);

    // Pause auto-advance on hover
    track.addEventListener('mouseenter', () => clearInterval(autoSlide));
    track.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => {
        const visibleCount = getVisibleCount();
        const maxSlide = Math.max(0, totalCards - visibleCount);
        currentSlide = currentSlide < maxSlide ? currentSlide + 1 : 0;
        updateSlider();
      }, 5000);
    });
  }

  // ─── FORM HANDLING ────────────────────────
  const forms = document.querySelectorAll('#contactForm, #quoteForm');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '✓ Sent Successfully!';
      submitBtn.style.background = '#2E7D32';
      submitBtn.disabled = true;
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        form.reset();
      }, 3000);
    });
  });

  // ─── SMOOTH SCROLL FOR ANCHOR LINKS ───────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
