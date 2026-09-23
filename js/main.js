/**
 * HEARTINTEL - Main Application Bootstrap
 * Coordinates all ES modules and lifecycle hooks
 */

import { initTheme } from './theme.js';
import { initECGCanvas, initMetricsObserver } from './animation.js';
import { initFormHandler } from './formHandler.js';
import { initPatientIntelligence } from './patientIntelligence.js';
import { initModelIntelligence } from './modelIntelligence.js';
import { initModelEvaluation } from './modelEvaluation.js';
import { initDataExplorer } from './dataExplorer.js';
import { initHospitalInsights } from './hospitalInsights.js';
import { initMethodology } from './methodology.js';
import { initEthicalSection } from './ethicalSection.js';
import { initModals } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
  // Core Visuals & System
  initTheme();
  initECGCanvas();
  initMetricsObserver();
  initModals();

  // Functional Modules
  initFormHandler();
  initPatientIntelligence();
  initModelIntelligence();
  initModelEvaluation();
  initDataExplorer();
  initHospitalInsights();
  initMethodology();
  initEthicalSection();

  // Navigation Handlers
  initNavigationSpy();
  initMobileNav();
});

function initNavigationSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
          const sectionTop = section.offsetTop - 140;
          const sectionHeight = section.offsetHeight;
          if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
          }
        });

        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');
  const closeBtn = document.getElementById('mobile-nav-close');
  const backdrop = document.getElementById('mobile-nav-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, #mobile-screen-cta');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
      toggleBtn.focus();
    }
  });
}
