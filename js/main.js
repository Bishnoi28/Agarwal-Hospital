/* ============================================
   AGARWAL HOSPITAL — Main JavaScript
   ============================================ */

(function() {
  'use strict';

  // ---- DOM Ready ----
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initStickyHeader();
    initMobileMenu();
    initSmoothScroll();
    initScrollSpy();
    initRevealAnimations();
    initFAQ();
    initGalleryLightbox();
    initBackToTop();
    initFormValidation();
    initFormDateMin();
  }


  /* ============================================
     STICKY HEADER — glass → solid on scroll
     ============================================ */
  function initStickyHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle('scrolled', window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  /* ============================================
     MOBILE MENU
     ============================================ */
  function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('active');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    menu.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        menu.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }


  /* ============================================
     SMOOTH SCROLL
     ============================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerHeight = document.getElementById('header')?.offsetHeight || 72;
          const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

          window.scrollTo({
            top: top,
            behavior: 'smooth'
          });

          // Update URL hash without jumping
          history.pushState(null, null, targetId);
        }
      });
    });
  }


  /* ============================================
     SCROLL SPY — active nav highlighting
     ============================================ */
  function initScrollSpy() {
    const navLinks = document.querySelectorAll('.header-nav a');
    const sections = [];

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const section = document.querySelector(href);
      if (section) {
        sections.push({ el: section, link: link });
      }
    });

    if (sections.length === 0) return;

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPos = window.scrollY + 150;

          let currentSection = sections[0];
          for (const section of sections) {
            if (section.el.offsetTop <= scrollPos) {
              currentSection = section;
            }
          }

          navLinks.forEach(l => l.classList.remove('active'));
          if (currentSection) {
            currentSection.link.classList.add('active');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }


  /* ============================================
     REVEAL ANIMATIONS — Intersection Observer
     ============================================ */
  function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0 || !('IntersectionObserver' in window)) {
      // Fallback: make all visible
      reveals.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.02,
      rootMargin: '0px 0px 50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }


  /* ============================================
     FAQ ACCORDION
     ============================================ */
  function initFAQ() {
    // Tab switching
    const faqTabs = document.querySelectorAll('.faq-tab');
    const faqCategories = document.querySelectorAll('.faq-category');

    faqTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.faq;

        // Update tabs
        faqTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // Update panels
        faqCategories.forEach(cat => {
          cat.classList.remove('active');
        });
        const targetPanel = document.getElementById('faq-' + target);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });

    // Accordion expand/collapse
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const item = question.closest('.faq-item');
        const isOpen = item.classList.contains('active');

        // Close siblings within same category
        const parent = item.closest('.faq-category');
        if (parent) {
          parent.querySelectorAll('.faq-item.active').forEach(openItem => {
            if (openItem !== item) {
              openItem.classList.remove('active');
              openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            }
          });
        }

        item.classList.toggle('active', !isOpen);
        question.setAttribute('aria-expanded', !isOpen);
      });
    });
  }


  /* ============================================
     GALLERY LIGHTBOX
     ============================================ */
  function initGalleryLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = lightbox?.querySelector('.lightbox-close');

    if (!lightbox || !lightboxImg) return;

    // Open lightbox
    document.querySelectorAll('[data-lightbox]').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    // Close lightbox
    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    }

    lightboxClose?.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }


  /* ============================================
     BACK TO TOP
     ============================================ */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          btn.classList.toggle('visible', window.scrollY > 500);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ============================================
     FORM VALIDATION
     ============================================ */
  function initFormValidation() {
    const form = document.getElementById('appointmentForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Name validation
      const name = document.getElementById('apt-name');
      const nameError = document.getElementById('apt-name-error');
      if (!name.value.trim()) {
        name.classList.add('error');
        if (nameError) nameError.style.display = 'block';
        isValid = false;
      } else {
        name.classList.remove('error');
        if (nameError) nameError.style.display = 'none';
      }

      // Phone validation
      const phone = document.getElementById('apt-phone');
      const phoneError = document.getElementById('apt-phone-error');
      const phoneVal = phone.value.trim().replace(/[\s\-\+]/g, '');
      if (!phoneVal || phoneVal.length < 10) {
        phone.classList.add('error');
        if (phoneError) phoneError.style.display = 'block';
        isValid = false;
      } else {
        phone.classList.remove('error');
        if (phoneError) phoneError.style.display = 'none';
      }

      if (isValid) {
        // Build WhatsApp message
        const speciality = document.getElementById('apt-speciality')?.value || '';
        const date = document.getElementById('apt-date')?.value || '';
        const time = document.getElementById('apt-time')?.value || '';
        const message = document.getElementById('apt-message')?.value || '';

        const whatsappMsg = encodeURIComponent(
          `Hello, I would like to book an appointment.\n\n` +
          `Name: ${name.value.trim()}\n` +
          `Phone: ${phone.value.trim()}\n` +
          (speciality ? `Speciality: ${speciality}\n` : '') +
          (date ? `Preferred Date: ${date}\n` : '') +
          (time ? `Preferred Time: ${time}\n` : '') +
          (message ? `Message: ${message}\n` : '')
        );

        // Show success feedback
        const submitBtn = form.querySelector('.form-submit .btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending via WhatsApp...';
        submitBtn.style.background = 'var(--whatsapp)';
        submitBtn.style.borderColor = 'var(--whatsapp)';

        setTimeout(() => {
          window.open(`https://wa.me/919460266901?text=${whatsappMsg}`, '_blank');
          submitBtn.textContent = 'Appointment Request Sent!';
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.style.borderColor = '';
            form.reset();
          }, 3000);
        }, 500);
      }
    });

    // Real-time error clearing
    ['apt-name', 'apt-phone'].forEach(id => {
      const input = document.getElementById(id);
      const error = document.getElementById(id + '-error');
      if (input && error) {
        input.addEventListener('input', () => {
          input.classList.remove('error');
          error.style.display = 'none';
        });
      }
    });
  }


  /* ============================================
     FORM DATE MIN
     ============================================ */
  function initFormDateMin() {
    const dateInput = document.getElementById('apt-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }
  }

})();
