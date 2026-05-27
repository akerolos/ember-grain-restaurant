/**
 * Ember & Grain — main.js
 * Pure Vanilla JS · IIFE Architecture · No Dependencies
 *
 * Modules:
 *   1. Header Scroll Behavior
 *   2. Hamburger / Mobile Menu
 *   3. Menu Tab Switching
 *   4. Testimonials Slider
 *   5. Reservation Form Validation
 *   6. Utility: Footer Year
 */

(function () {
  'use strict';

  /* ============================================================
     CONSTANTS & STATE
     ============================================================ */

  const SELECTORS = {
    header:       '#site-header',
    burgerBtn:    '#burger-btn',
    mobileNav:    '#main-nav',
    overlay:      '#mobile-overlay',
    navLinks:     '#main-nav .nav-link',

    tabBtns:      '.tab-btn',
    menuPanels:   '.menu-panel',

    sliderTrack:  '#testimonials-track',
    sliderPrev:   '#slider-prev',
    sliderNext:   '#slider-next',
    sliderDots:   '#slider-dots',
    testimonials: '.testimonial-card',

    reservationForm: '#reservation-form',
    formFields:   '#form-fields',
    formSuccess:  '#form-success',
    submitBtn:    '#submit-btn',
    btnText:      '#submit-btn .btn-text',
    btnLoader:    '#submit-btn .btn-loader',

    footerYear:   '#footer-year',
  };

  /* ============================================================
     MODULE 1: HEADER — Scroll-activated sticky style
     ============================================================ */

  const headerModule = (function () {
    let header;
    const SCROLL_THRESHOLD = 60;

    function onScroll() {
      if (window.scrollY > SCROLL_THRESHOLD) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    function init() {
      header = document.querySelector(SELECTORS.header);
      if (!header) return;

      // Throttle scroll for performance
      let ticking = false;
      window.addEventListener('scroll', function () {
        if (!ticking) {
          requestAnimationFrame(function () {
            onScroll();
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });

      // Run once on load
      onScroll();
    }

    return { init };
  })();


  /* ============================================================
     MODULE 2: HAMBURGER / MOBILE MENU
     ============================================================ */

  const menuToggleModule = (function () {
    let burgerBtn, mobileNav, overlay, isOpen;

    function openMenu() {
      isOpen = true;
      burgerBtn.classList.add('open');
      burgerBtn.setAttribute('aria-expanded', 'true');
      mobileNav.classList.add('nav-open');
      overlay.style.display = 'block';

      // Force reflow before adding visible class for CSS transition
      overlay.getBoundingClientRect();
      overlay.classList.add('visible');
      overlay.setAttribute('aria-hidden', 'false');

      document.body.style.overflow = 'hidden';

      // Trap focus in nav: move focus to first link
      const firstLink = mobileNav.querySelector('a, button');
      if (firstLink) {
        setTimeout(function () { firstLink.focus(); }, 50);
      }
    }

    function closeMenu() {
      isOpen = false;
      burgerBtn.classList.remove('open');
      burgerBtn.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('nav-open');
      overlay.classList.remove('visible');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      // Hide overlay after transition
      overlay.addEventListener('transitionend', function onEnd() {
        if (!isOpen) overlay.style.display = 'none';
        overlay.removeEventListener('transitionend', onEnd);
      });

      burgerBtn.focus();
    }

    function toggle() {
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    function handleKeydown(e) {
      if (!isOpen) return;

      // Close on Escape
      if (e.key === 'Escape') {
        closeMenu();
      }

      // Trap Tab focus within nav
      if (e.key === 'Tab') {
        const focusable = Array.from(
          mobileNav.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
        ).filter(function (el) {
          return !el.disabled && el.offsetParent !== null;
        });

        const first = focusable[0];
        const last  = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    function init() {
      burgerBtn = document.querySelector(SELECTORS.burgerBtn);
      mobileNav = document.querySelector(SELECTORS.mobileNav);
      overlay   = document.querySelector(SELECTORS.overlay);

      if (!burgerBtn || !mobileNav || !overlay) return;

      isOpen = false;

      burgerBtn.addEventListener('click', toggle);
      overlay.addEventListener('click', closeMenu);
      document.addEventListener('keydown', handleKeydown);

      // Close menu when a nav link is clicked
      const navLinks = document.querySelectorAll(SELECTORS.navLinks);
      navLinks.forEach(function (link) {
        link.addEventListener('click', closeMenu);
      });

      // Close menu on window resize beyond mobile breakpoint
      const mediaQuery = window.matchMedia('(min-width: 768px)');
      mediaQuery.addEventListener('change', function (e) {
        if (e.matches && isOpen) closeMenu();
      });
    }

    return { init };
  })();


  /* ============================================================
     MODULE 3: MENU TAB SWITCHING
     ============================================================ */

  const tabsModule = (function () {

    function switchTab(targetTab) {
      const allBtns   = document.querySelectorAll(SELECTORS.tabBtns);
      const allPanels = document.querySelectorAll(SELECTORS.menuPanels);

      // Deactivate all
      allBtns.forEach(function (btn) {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('tabindex', '-1');
      });

      allPanels.forEach(function (panel) {
        panel.classList.remove('active');
        panel.hidden = true;
      });

      // Activate target
      const activeBtn = document.querySelector('[data-tab="' + targetTab + '"]');
      const activePanel = document.getElementById('panel-' + targetTab);

      if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-selected', 'true');
        activeBtn.setAttribute('tabindex', '0');
        activeBtn.focus();
      }

      if (activePanel) {
        activePanel.classList.add('active');
        activePanel.hidden = false;
      }
    }

    function handleKeyboardNav(e, currentBtn) {
      const allBtns = Array.from(document.querySelectorAll(SELECTORS.tabBtns));
      const currentIndex = allBtns.indexOf(currentBtn);
      let newIndex = -1;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        newIndex = (currentIndex + 1) % allBtns.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        newIndex = (currentIndex - 1 + allBtns.length) % allBtns.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        newIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        newIndex = allBtns.length - 1;
      }

      if (newIndex >= 0) {
        const targetTab = allBtns[newIndex].dataset.tab;
        switchTab(targetTab);
      }
    }

    function init() {
      const tabBtns = document.querySelectorAll(SELECTORS.tabBtns);
      if (!tabBtns.length) return;

      tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          switchTab(btn.dataset.tab);
        });

        btn.addEventListener('keydown', function (e) {
          handleKeyboardNav(e, btn);
        });
      });
    }

    return { init };
  })();


  /* ============================================================
     MODULE 4: TESTIMONIALS SLIDER
     ============================================================ */

  const sliderModule = (function () {
    let track, prevBtn, nextBtn, dotsContainer;
    let cards, currentIndex, totalCards;
    let autoPlayInterval;
    const AUTO_PLAY_DELAY = 5000;

    function goToSlide(index) {
      // Clamp index
      index = Math.max(0, Math.min(index, totalCards - 1));
      currentIndex = index;

      // Move track
      track.style.transform = 'translateX(-' + (index * 100) + '%)';

      // Update dots
      const dots = dotsContainer.querySelectorAll('.slider-dot');
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });

      // Update button states
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === totalCards - 1;

      // Update aria-live content for screen readers
      cards.forEach(function (card, i) {
        card.setAttribute('aria-hidden', i !== index ? 'true' : 'false');
      });
    }

    function prev() {
      goToSlide(currentIndex - 1);
      resetAutoPlay();
    }

    function next() {
      const nextIndex = currentIndex < totalCards - 1 ? currentIndex + 1 : 0;
      goToSlide(nextIndex);
      resetAutoPlay();
    }

    function buildDots() {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalCards; i++) {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
        dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
        dot.setAttribute('role', 'listitem');

        (function (idx) {
          dot.addEventListener('click', function () {
            goToSlide(idx);
            resetAutoPlay();
          });
        })(i);

        dotsContainer.appendChild(dot);
      }
    }

    function startAutoPlay() {
      autoPlayInterval = setInterval(function () {
        const nextIndex = currentIndex < totalCards - 1 ? currentIndex + 1 : 0;
        goToSlide(nextIndex);
      }, AUTO_PLAY_DELAY);
    }

    function stopAutoPlay() {
      clearInterval(autoPlayInterval);
    }

    function resetAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    function handleSwipe() {
      let startX = 0;
      let isDragging = false;

      track.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
        isDragging = true;
      }, { passive: true });

      track.addEventListener('touchend', function (e) {
        if (!isDragging) return;
        const deltaX = e.changedTouches[0].clientX - startX;
        const SWIPE_THRESHOLD = 50;

        if (deltaX < -SWIPE_THRESHOLD) {
          next();
        } else if (deltaX > SWIPE_THRESHOLD) {
          prev();
        }
        isDragging = false;
      }, { passive: true });
    }

    function handleKeyboard(e) {
      // Only respond if slider is in viewport
      const rect = track.getBoundingClientRect();
      const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inViewport) return;

      if (e.key === 'ArrowRight') {
        next();
      } else if (e.key === 'ArrowLeft') {
        prev();
      }
    }

    function pauseOnHover() {
      const section = document.querySelector('.testimonials-slider');
      if (!section) return;

      section.addEventListener('mouseenter', stopAutoPlay);
      section.addEventListener('mouseleave', startAutoPlay);
      section.addEventListener('focusin', stopAutoPlay);
      section.addEventListener('focusout', startAutoPlay);
    }

    function init() {
      track        = document.querySelector(SELECTORS.sliderTrack);
      prevBtn      = document.querySelector(SELECTORS.sliderPrev);
      nextBtn      = document.querySelector(SELECTORS.sliderNext);
      dotsContainer = document.querySelector(SELECTORS.sliderDots);

      if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

      cards      = Array.from(track.querySelectorAll('.testimonial-card'));
      totalCards = cards.length;
      currentIndex = 0;

      if (totalCards === 0) return;

      buildDots();
      goToSlide(0);
      handleSwipe();
      pauseOnHover();
      startAutoPlay();

      prevBtn.addEventListener('click', prev);
      nextBtn.addEventListener('click', next);
      document.addEventListener('keydown', handleKeyboard);
    }

    return { init };
  })();


  /* ============================================================
     MODULE 5: RESERVATION FORM VALIDATION
     ============================================================ */

  const formModule = (function () {

    // Validation rules per field
    const VALIDATORS = {
      'guest-name': {
        required: true,
        minLength: 2,
        maxLength: 80,
        errorMessages: {
          required:  'Please enter your full name.',
          minLength: 'Name must be at least 2 characters.',
          maxLength: 'Name cannot exceed 80 characters.',
        },
      },
      'guest-email': {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        errorMessages: {
          required: 'Please enter your email address.',
          pattern:  'Please enter a valid email address.',
        },
      },
      'res-date': {
        required: true,
        futureDate: true,
        errorMessages: {
          required:    'Please select a reservation date.',
          futureDate:  'Please choose a date in the future.',
        },
      },
      'res-time': {
        required: true,
        errorMessages: {
          required: 'Please select a reservation time.',
        },
      },
      'party-size': {
        required: true,
        errorMessages: {
          required: 'Please select your party size.',
        },
      },
      'guest-phone': {
        required: false,
        pattern: /^[\d\s\(\)\-\+]{7,20}$/,
        errorMessages: {
          pattern: 'Please enter a valid phone number.',
        },
      },
    };

    /**
     * Validates a single field.
     * @param {HTMLElement} field
     * @returns {string} error message or empty string if valid
     */
    function validateField(field) {
      const id    = field.id;
      const rules = VALIDATORS[id];
      const value = field.value.trim();

      if (!rules) return '';

      // Required
      if (rules.required && !value) {
        return rules.errorMessages.required;
      }

      // Skip further checks if empty and not required
      if (!value) return '';

      // Min length
      if (rules.minLength && value.length < rules.minLength) {
        return rules.errorMessages.minLength;
      }

      // Max length
      if (rules.maxLength && value.length > rules.maxLength) {
        return rules.errorMessages.maxLength;
      }

      // Pattern
      if (rules.pattern && !rules.pattern.test(value)) {
        return rules.errorMessages.pattern;
      }

      // Future date
      if (rules.futureDate) {
        const selected  = new Date(value);
        const today     = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) {
          return rules.errorMessages.futureDate;
        }
      }

      return '';
    }

    /**
     * Shows or clears an error for a field.
     */
    function setFieldError(field, message) {
      const errorEl = document.getElementById(field.id + '-error');

      if (message) {
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        if (errorEl) errorEl.textContent = message;
      } else {
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
        if (errorEl) errorEl.textContent = '';
      }
    }

    /**
     * Validates all fields and returns true if form is valid.
     */
    function validateAll(form) {
      let isValid   = true;
      let firstError = null;

      const fields = form.querySelectorAll('.form-input');
      fields.forEach(function (field) {
        const error = validateField(field);
        setFieldError(field, error);

        if (error && !firstError) {
          firstError = field;
          isValid = false;
        }
      });

      // Scroll to first error
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }

      return isValid;
    }

    /**
     * Simulates a network request.
     */
    function simulateSubmit() {
      return new Promise(function (resolve) {
        setTimeout(resolve, 2200);
      });
    }

    /**
     * Shows loading state.
     */
    function setLoading(isLoading) {
      const submitBtn = document.querySelector(SELECTORS.submitBtn);
      const btnText   = document.querySelector(SELECTORS.btnText);
      const btnLoader = document.querySelector(SELECTORS.btnLoader);

      if (!submitBtn || !btnText || !btnLoader) return;

      if (isLoading) {
        submitBtn.disabled   = true;
        btnText.hidden       = true;
        btnLoader.hidden     = false;
      } else {
        submitBtn.disabled   = false;
        btnText.hidden       = false;
        btnLoader.hidden     = true;
      }
    }

    /**
     * Shows the success state.
     */
    function showSuccess() {
      const formFields  = document.querySelector(SELECTORS.formFields);
      const formSuccess = document.querySelector(SELECTORS.formSuccess);

      if (!formFields || !formSuccess) return;

      formFields.hidden  = true;
      formSuccess.hidden = false;
      formSuccess.focus();

      // Scroll to confirmation
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /**
     * Inline validation on blur.
     */
    function attachInlineValidation(form) {
      const fields = form.querySelectorAll('.form-input');
      fields.forEach(function (field) {
        // Validate on blur
        field.addEventListener('blur', function () {
          const error = validateField(field);
          setFieldError(field, error);
        });

        // Clear error on input
        field.addEventListener('input', function () {
          if (field.classList.contains('error')) {
            const error = validateField(field);
            setFieldError(field, error);
          }
        });
      });
    }

    /**
     * Sets minimum date to today for the date input.
     */
    function setMinDate() {
      const dateInput = document.getElementById('res-date');
      if (!dateInput) return;

      const today = new Date();
      const year  = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day   = String(today.getDate()).padStart(2, '0');
      dateInput.min = year + '-' + month + '-' + day;
    }

    function init() {
      const form = document.querySelector(SELECTORS.reservationForm);
      if (!form) return;

      setMinDate();
      attachInlineValidation(form);

      form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const isValid = validateAll(form);
        if (!isValid) return;

        setLoading(true);

        try {
          await simulateSubmit();
          showSuccess();
        } catch (err) {
          console.error('Reservation submission error:', err);
          setLoading(false);

          // Show a generic error
          const submitBtn = document.querySelector(SELECTORS.submitBtn);
          if (submitBtn) {
            submitBtn.insertAdjacentHTML(
              'afterend',
              '<p class="form-error" style="margin-top:0.5rem;text-align:center;">Something went wrong. Please try again.</p>'
            );
          }
        }
      });
    }

    return { init };
  })();


  /* ============================================================
     MODULE 6: UTILITY — Footer Year & Smooth Scroll polish
     ============================================================ */

  const utilsModule = (function () {

    function updateFooterYear() {
      const el = document.querySelector(SELECTORS.footerYear);
      if (el) el.textContent = new Date().getFullYear();
    }

    /**
     * Adds active class to nav link when its section is in view.
     */
    function initScrollSpy() {
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll(SELECTORS.navLinks);
      if (!sections.length || !navLinks.length) return;

      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              navLinks.forEach(function (link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + entry.target.id) {
                  link.classList.add('active');
                }
              });
            }
          });
        },
        {
          rootMargin: '-40% 0px -55% 0px',
          threshold: 0,
        }
      );

      sections.forEach(function (section) {
        observer.observe(section);
      });
    }

    /**
     * Fade-in cards as they scroll into view using IntersectionObserver.
     */
    function initCardReveal() {
      const cards = document.querySelectorAll('.menu-card, .story-pillars li');
      if (!cards.length || !('IntersectionObserver' in window)) return;

      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry, i) {
            if (entry.isIntersecting) {
              entry.target.style.animationDelay = (i * 60) + 'ms';
              entry.target.classList.add('reveal');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      // Add base styles via JS (avoids FOUC if CSS hasn't loaded)
      const style = document.createElement('style');
      style.textContent = [
        '.menu-card, .story-pillars li {',
        '  opacity: 0;',
        '  transform: translateY(16px);',
        '  transition: opacity 0.5s ease, transform 0.5s ease;',
        '}',
        '.menu-card.reveal, .story-pillars li.reveal {',
        '  opacity: 1;',
        '  transform: translateY(0);',
        '}',
      ].join('\n');
      document.head.appendChild(style);

      cards.forEach(function (card) {
        observer.observe(card);
      });
    }

    function init() {
      updateFooterYear();
      initScrollSpy();
      initCardReveal();
    }

    return { init };
  })();


  /* ============================================================
     BOOTSTRAP — Run all modules on DOMContentLoaded
     ============================================================ */

  function bootstrap() {
    headerModule.init();
    menuToggleModule.init();
    tabsModule.init();
    sliderModule.init();
    formModule.init();
    utilsModule.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    // DOM already parsed (script at bottom of body)
    bootstrap();
  }

})();
