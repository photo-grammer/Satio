/* ==========================================================================
   SATIO INTERIOR DESIGN — MAIN JS
   Scroll, cursor, nav, hero parallax, animations, portfolio filter, form
   ========================================================================== */

(function () {
  'use strict';

  // ── DOM references ─────────────────────────────────────────────────────────
  const header     = document.getElementById('siteHeader');
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobileNav');
  const cursor     = document.getElementById('customCursor');
  const ring       = document.getElementById('customCursorRing');
  const progressBar = document.getElementById('scroll-progress-bar');
  const heroSection = document.getElementById('hero');
  const heroImg     = document.getElementById('heroImg');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  // ── Scroll: header, progress bar, parallax ─────────────────────────────────
  let lastScroll = 0;
  let rafPending = false;

  function onScroll () {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      const scrollY = window.scrollY;

      // Header scroll state
      if (scrollY > 60) {
        header && header.classList.add('scrolled');
      } else {
        // Only remove .scrolled if the page's header starts transparent
        if (header && !header.dataset.forceScrolled) {
          header.classList.remove('scrolled');
        }
      }

      // Scroll progress bar
      if (progressBar) {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = total > 0 ? (scrollY / total * 100) + '%' : '0%';
      }

      // Hero parallax
      if (heroSection && heroImg) {
        const heroH = heroSection.offsetHeight;
        if (scrollY < heroH) {
          heroImg.style.transform = `scale(1) translateY(${scrollY * 0.28}px)`;
        }
      }

      // Scroll-reveal elements
      revealElements();

      lastScroll = scrollY;
    });
  }

  // ── Scroll-reveal ─────────────────────────────────────────────────────────
  function revealElements () {
    const items = document.querySelectorAll('.fade-up, .fade-in, .reveal-line');
    const wh = window.innerHeight;
    items.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < wh * 0.9) {
        el.classList.add('visible');
      }
    });
  }

  // ── Hero image load animation ──────────────────────────────────────────────
  if (heroSection) {
    if (heroImg && heroImg.complete) {
      heroSection.classList.add('loaded');
    } else if (heroImg) {
      heroImg.addEventListener('load', () => heroSection.classList.add('loaded'));
    }
  }

  // ── Custom cursor ─────────────────────────────────────────────────────────
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let cursorVisible = false;

  function initCursor () {
    if (!cursor || !ring) return;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!cursorVisible) {
        cursorVisible = true;
        cursor.style.opacity = '1';
        ring.style.opacity = '1';
      }

      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      ring.style.opacity = '0';
      cursorVisible = false;
    });

    // Lag ring for smoothness
    function animateRing () {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover states
    const interactiveEls = document.querySelectorAll('a, button, .gallery-item, .portfolio-item, .service-row, .theme-opt-btn, .theme-trigger, .mosaic-item, .lightbox-nav, .lightbox-close');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width  = '54px';
        ring.style.height = '54px';
        const theme = localStorage.getItem('satio_theme') || 'gold';
        let color = 'rgba(200, 169, 126, 0.7)';
        let bg = 'rgba(200, 169, 126, 0.06)';
        if (theme === 'red') {
          color = 'rgba(220, 38, 38, 0.7)';
          bg = 'rgba(220, 38, 38, 0.06)';
        } else if (theme === 'blue') {
          color = 'rgba(37, 99, 235, 0.7)';
          bg = 'rgba(37, 99, 235, 0.06)';
        } else if (theme === 'yellow') {
          color = 'rgba(217, 119, 6, 0.7)';
          bg = 'rgba(217, 119, 6, 0.06)';
        }
        ring.style.borderColor = color;
        ring.style.background  = bg;
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width  = '34px';
        ring.style.height = '34px';
        const theme = localStorage.getItem('satio_theme') || 'gold';
        let color = 'rgba(200, 169, 126, 0.4)';
        if (theme === 'red') {
          color = 'rgba(220, 38, 38, 0.4)';
        } else if (theme === 'blue') {
          color = 'rgba(37, 99, 235, 0.4)';
        } else if (theme === 'yellow') {
          color = 'rgba(217, 119, 6, 0.4)';
        }
        ring.style.borderColor = color;
        ring.style.background  = 'transparent';
      });
    });
  }

  // ── Mobile nav ─────────────────────────────────────────────────────────────
  function initMobileNav () {
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', toggleMenu);
    hamburger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') toggleMenu();
    });

    function toggleMenu () {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (mobileNav.classList.contains('open') &&
          !mobileNav.contains(e.target) &&
          !hamburger.contains(e.target)) {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ── Hero scroll indicator ──────────────────────────────────────────────────
  const heroScroll = document.getElementById('heroScroll');
  if (heroScroll) {
    heroScroll.addEventListener('click', () => {
      const next = heroSection ? heroSection.nextElementSibling : null;
      if (next) next.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ── Portfolio filter ───────────────────────────────────────────────────────
  function initPortfolioFilter () {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.portfolio-item[data-category]');
    if (!filterBtns.length || !items.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Update active btn
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter items
        items.forEach((item, i) => {
          const match = filter === 'all' || item.dataset.category === filter;
          item.style.transition = `opacity 0.45s ${i * 0.05}s ease, transform 0.45s ${i * 0.05}s ease`;
          if (match) {
            item.style.display = '';
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
              if (item.dataset.category !== filter && filter !== 'all') {
                item.style.display = 'none';
              }
            }, 450);
          }
        });
      });
    });
  }

  // ── Contact form ───────────────────────────────────────────────────────────
  function initContactForm () {
    if (!contactForm || !formSuccess) return;

    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const btn = document.getElementById('submitBtn');
      if (btn) {
        btn.textContent = 'Sending...';
        btn.disabled = true;
      }

      // Simulate async send (no real backend — mailto fallback)
      setTimeout(() => {
        const firstName = document.getElementById('firstName')?.value || '';
        const lastName  = document.getElementById('lastName')?.value || '';
        const email     = document.getElementById('email')?.value || '';
        const phone     = document.getElementById('phone')?.value || '';
        const service   = document.getElementById('service')?.value || 'General Enquiry';
        const message   = document.getElementById('message')?.value || '';

        const subject = encodeURIComponent(`Enquiry: ${service} — ${firstName} ${lastName}`);
        const body = encodeURIComponent(
          `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\n\n${message}`
        );

        window.location.href = `mailto:satiointerior@gmail.com?subject=${subject}&body=${body}`;

        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';
      }, 800);
    });
  }

  // ── Smooth internal link scroll ────────────────────────────────────────────
  function initSmoothLinks () {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ── Subtle page entry animation ────────────────────────────────────────────
  function pageEntry () {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.style.opacity = '1';
      });
    });
  }

  // ── Brand Theme Switcher ───────────────────────────────────────────────────
  function initThemeSwitcher () {
    const defaultTheme = 'gold';
    const themes = {
      gold: {
        logo: 'Logo/Full Logo- Yellow .webp',
        class: ''
      },
      red: {
        logo: 'Logo/Full Logo - Red.webp',
        class: 'theme-red'
      },
      blue: {
        logo: 'Logo/Full Logo Blue.webp',
        class: 'theme-blue'
      },
      yellow: {
        logo: 'Logo/Full Logo- Yellow .webp',
        class: 'theme-yellow'
      }
    };

    const activeTheme = localStorage.getItem('satio_theme') || defaultTheme;

    function applyTheme (themeName) {
      Object.keys(themes).forEach(t => {
        if (themes[t].class) {
          document.body.classList.remove(themes[t].class);
        }
      });
      if (themes[themeName].class) {
        document.body.classList.add(themes[themeName].class);
      }

      const headerLogo = document.querySelector('.header-logo-img');
      const footerLogo = document.querySelector('.footer-logo-img');
      if (headerLogo) headerLogo.src = themes[themeName].logo;
      if (footerLogo) footerLogo.src = themes[themeName].logo;

      document.querySelectorAll('.theme-opt-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === themeName);
      });

      localStorage.setItem('satio_theme', themeName);
    }

    applyTheme(activeTheme);

    const switcher = document.createElement('div');
    switcher.className = 'theme-switcher';
    switcher.id = 'themeSwitcher';
    switcher.innerHTML = `
      <button class="theme-trigger" aria-label="Customize Theme" title="Switch Theme Accent">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/><path d="M12 8A4 4 0 1 0 12 16A4 4 0 1 0 12 8Z" fill="currentColor"/></svg>
      </button>
      <div class="theme-options">
        <button class="theme-opt-btn" data-theme="gold" style="background-color: #c8a97e;" title="Satio Gold"></button>
        <button class="theme-opt-btn" data-theme="red" style="background-color: #dc2626;" title="Terracotta Red"></button>
        <button class="theme-opt-btn" data-theme="blue" style="background-color: #2563eb;" title="Classic Blue"></button>
        <button class="theme-opt-btn" data-theme="yellow" style="background-color: #d97706;" title="Ochre Yellow"></button>
      </div>
    `;

    document.body.appendChild(switcher);

    const trigger = switcher.querySelector('.theme-trigger');
    
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      switcher.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!switcher.contains(e.target)) {
        switcher.classList.remove('open');
      }
    });

    switcher.querySelectorAll('.theme-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        applyTheme(btn.dataset.theme);
        const ring = document.getElementById('customCursorRing');
        if (ring) {
          if (btn.dataset.theme === 'red') {
            ring.style.borderColor = 'rgba(220, 38, 38, 0.4)';
          } else if (btn.dataset.theme === 'blue') {
            ring.style.borderColor = 'rgba(37, 99, 235, 0.4)';
          } else if (btn.dataset.theme === 'yellow') {
            ring.style.borderColor = 'rgba(217, 119, 6, 0.4)';
          } else {
            ring.style.borderColor = 'rgba(200, 169, 126, 0.4)';
          }
        }
      });
    });

    switcher.querySelectorAll('.theme-opt-btn').forEach(btn => {
      if (btn.dataset.theme === activeTheme) {
        btn.classList.add('active');
      }
    });
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  function init () {
    pageEntry();
    initThemeSwitcher();
    initCursor();
    initMobileNav();
    initPortfolioFilter();
    initContactForm();
    initSmoothLinks();

    // Mark hero-less pages as force-scrolled so header stays white
    if (header && header.classList.contains('scrolled')) {
      header.dataset.forceScrolled = '1';
    }

    // Initial reveal check
    revealElements();

    // Listeners
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', revealElements);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
