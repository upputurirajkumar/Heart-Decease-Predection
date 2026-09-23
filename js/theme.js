/**
 * HEARTINTEL - Theme Management Module
 * Supports dark & light clinical themes and dispatches 'themechange' events
 */

export function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('heartintel-theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('heartintel-theme', next);
      updateThemeIcon(next);

      // Dispatch global event for responsive SVG/Canvas redraws
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
    });
  }
}

function updateThemeIcon(theme) {
  const sunIcon = document.getElementById('theme-sun-icon');
  const moonIcon = document.getElementById('theme-moon-icon');
  if (sunIcon && moonIcon) {
    if (theme === 'light') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }
}
