/**
 * Agência BCM Marketing (@bcm.mkt) — app.js
 * Centraliza toda a lógica interativa da Landing Page:
 * - Menu responsivo e estado de rolagem do cabeçalho
 * - Filtro dinâmico de portfólio e Lightbox de cases
 * - Simulador de Diagnóstico integrado ao WhatsApp (5511948978629)
 * - Accordion de Perguntas Frequentes (FAQ)
 * - Animações de revelação ao rolar a página
 */

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '5511948978629';

  /**
   * Inicializa o estado do cabeçalho e menu mobile
   */
  function initHeaderAndMenu() {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    if (header) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 30) {
          header.classList.add('header--scrolled');
        } else {
          header.classList.remove('header--scrolled');
        }
      }, { passive: true });
    }

    if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', function () {
        const isOpen = navMenu.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
      });

      navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          navMenu.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /**
   * Inicializa a filtragem do portfólio por categoria
   */
  function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const caseCards = document.querySelectorAll('.case-card');

    if (!filterButtons.length || !caseCards.length) {
      return;
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const selectedFilter = btn.getAttribute('data-filter') || 'all';

        filterButtons.forEach(function (item) {
          item.classList.remove('active');
          item.setAttribute('aria-selected', 'false');
        });

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        caseCards.forEach(function (card) {
          const category = card.getAttribute('data-category');
          if (selectedFilter === 'all' || category === selectedFilter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  /**
   * Inicializa o Lightbox para visualizar os cases ampliados
   */
  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxSubtitle = document.getElementById('lightbox-subtitle');
    const caseCards = document.querySelectorAll('.case-card');

    if (!lightbox || !lightboxImg || !lightboxTitle || !lightboxSubtitle) {
      return;
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
    }

    caseCards.forEach(function (card) {
      card.addEventListener('click', function () {
        const imgSrc = card.getAttribute('data-img') || '';
        const title = card.getAttribute('data-title') || '';
        const subtitle = card.getAttribute('data-subtitle') || '';

        lightboxImg.src = imgSrc;
        lightboxImg.alt = title;
        lightboxTitle.textContent = title;
        lightboxSubtitle.textContent = subtitle;

        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  }

  /**
   * Inicializa o Simulador de Diagnóstico e envia mensagem estruturada para o WhatsApp
   */
  function initDiagnosticForm() {
    const form = document.getElementById('briefing-form');
    const chips = document.querySelectorAll('#goal-chips .chip');
    let selectedGoal = 'Ser lembrado e posicionar minha marca como premium';

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (item) {
          item.classList.remove('active');
        });
        chip.classList.add('active');
        selectedGoal = chip.getAttribute('data-value') || selectedGoal;
      });
    });

    if (!form) {
      return;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const nameInput = document.getElementById('client-name');
      const segmentSelect = document.getElementById('client-segment');
      const notesInput = document.getElementById('client-notes');

      const clientName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Visitante';
      const segment = segmentSelect && segmentSelect.value ? segmentSelect.value : 'Não informado';
      const notes = notesInput && notesInput.value.trim() ? notesInput.value.trim() : '';

      const messageLines = [
        'Olá, equipe da *Agência BCM*! 👋',
        'Vim pela Landing Page e preenchi o *Diagnóstico Rápido*:',
        '',
        '• *Nome / Empresa:* ' + clientName,
        '• *Segmento:* ' + segment,
        '• *Objetivo Principal:* ' + selectedGoal
      ];

      if (notes) {
        messageLines.push('• *Observações / @:* ' + notes);
      }

      messageLines.push('', 'Podemos conversar sobre como aplicar essa estratégia no meu negócio?');

      const whatsappUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(messageLines.join('\n'));
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  /**
   * Inicializa o Accordion de Perguntas Frequentes (FAQ)
   */
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
      const button = item.querySelector('.faq-item__question');
      const answer = item.querySelector('.faq-item__answer');

      if (!button || !answer) {
        return;
      }

      button.addEventListener('click', function () {
        const isActive = item.classList.contains('active');

        faqItems.forEach(function (otherItem) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-item__question');
          const otherAns = otherItem.querySelector('.faq-item__answer');
          if (otherBtn) {
            otherBtn.setAttribute('aria-expanded', 'false');
          }
          if (otherAns) {
            otherAns.style.maxHeight = '0px';
          }
        });

        if (!isActive) {
          item.classList.add('active');
          button.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /**
   * Inicializa as animações de revelação com IntersectionObserver
   */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /**
   * Atualiza o ano do rodapé automaticamente
   */
  function initFooterYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
      yearSpan.textContent = String(new Date().getFullYear());
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeaderAndMenu();
    initPortfolioFilter();
    initLightbox();
    initDiagnosticForm();
    initFaqAccordion();
    initScrollReveal();
    initFooterYear();
  });
})();

