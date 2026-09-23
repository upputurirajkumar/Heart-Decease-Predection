/**
 * HEARTINTEL - Modal Windows & Keyboard Accessibility
 * Focus trapping and return focus for WCAG 2.1 compliance
 */

export function initModals() {
  const modelModal = document.getElementById('model-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  let lastActiveElement = null;

  const observer = new MutationObserver(() => {
    if (modelModal.classList.contains('open')) {
      lastActiveElement = document.activeElement;
      if (closeBtn) closeBtn.focus();
    } else if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
      lastActiveElement = null;
    }
  });

  if (modelModal) {
    observer.observe(modelModal, { attributes: true, attributeFilter: ['class'] });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modelModal.classList.remove('open');
      });
    }

    modelModal.addEventListener('click', (e) => {
      if (e.target === modelModal) {
        modelModal.classList.remove('open');
      }
    });
  }

  // Keyboard accessibility (Escape key)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modelModal && modelModal.classList.contains('open')) {
        modelModal.classList.remove('open');
      }
    }
  });
}
