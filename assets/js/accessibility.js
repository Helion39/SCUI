document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // --- Element Selectors ---
  const accessibilityToggleBtn = document.getElementById('accessibility-toggle-btn');
  const accessibilityPanel = document.getElementById('accessibility-panel');
  const accessibilityCloseBtn = document.getElementById('accessibility-close-btn');

  const dyslexiaToggleBtn = document.getElementById('dyslexia-toggle');
  const increaseTextBtn = document.getElementById('increase-text');
  const decreaseTextBtn = document.getElementById('decrease-text');
  const contrastToggleBtn = document.getElementById('contrast-toggle');
  const readingGuideToggleBtn = document.getElementById('reading-guide-toggle');
  const languageToggleBtn = document.getElementById('language-toggle');

  // --- State Variables & localStorage ---
  const SETTINGS_KEY = 'accessibilitySettings';
  let settings = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {
    dyslexiaFont: false,
    highContrast: false,
    textSize: 100, // Percentage
    readingGuide: false
  };

  // --- Panel Logic ---
  if (accessibilityToggleBtn && accessibilityPanel && accessibilityCloseBtn) {
    accessibilityToggleBtn.addEventListener('click', () => {
      accessibilityPanel.classList.add('show');
    });

    accessibilityCloseBtn.addEventListener('click', () => {
      accessibilityPanel.classList.remove('show');
    });
  }

  // --- Save Settings Function ---
  function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  // --- Apply Settings Functions ---
  function applyDyslexiaFont() {
    body.classList.toggle('dyslexic-font', settings.dyslexiaFont);
    dyslexiaToggleBtn.classList.toggle('active', settings.dyslexiaFont);
  }

  function applyHighContrast() {
    body.classList.toggle('high-contrast', settings.highContrast);
    contrastToggleBtn.classList.toggle('active', settings.highContrast);
  }

  function applyTextSize() {
    body.classList.add('custom-text-sizing');
    body.style.setProperty('--content-text-size', `${settings.textSize}%`);
    // No active state for these buttons
  }

  function resetTextSize() {
     body.classList.remove('custom-text-sizing');
     body.style.removeProperty('--content-text-size');
  }

  // --- Reading Guide ---
  let readingGuideEl = null;
  function applyReadingGuide() {
    readingGuideToggleBtn.classList.toggle('active', settings.readingGuide);
    if (settings.readingGuide) {
      if (!readingGuideEl) {
        readingGuideEl = document.createElement('div');
        readingGuideEl.classList.add('reading-guide');
        body.appendChild(readingGuideEl);

        window.addEventListener('mousemove', (e) => {
          if (readingGuideEl && settings.readingGuide) {
            readingGuideEl.style.top = `${e.clientY}px`;
          }
        });
      }
      readingGuideEl.classList.add('active');
    } else {
      if (readingGuideEl) {
        readingGuideEl.classList.remove('active');
      }
    }
  }

  // --- Event Listeners for Controls ---
  dyslexiaToggleBtn.addEventListener('click', () => {
    settings.dyslexiaFont = !settings.dyslexiaFont;
    applyDyslexiaFont();
    saveSettings();
  });

  contrastToggleBtn.addEventListener('click', () => {
    settings.highContrast = !settings.highContrast;
    applyHighContrast();
    saveSettings();
  });

  increaseTextBtn.addEventListener('click', () => {
    if (settings.textSize < 150) { // Set a max size
      settings.textSize += 10;
      applyTextSize();
      saveSettings();
    }
  });

  decreaseTextBtn.addEventListener('click', () => {
    if (settings.textSize > 80) { // Set a min size
      settings.textSize -= 10;
      applyTextSize();
      saveSettings();
    }
  });

  readingGuideToggleBtn.addEventListener('click', () => {
    settings.readingGuide = !settings.readingGuide;
    applyReadingGuide();
    saveSettings();
  });

  languageToggleBtn.addEventListener('click', () => {
    alert('The language switch feature is not yet implemented.');
  });

  // --- Initial Load ---
  function applyAllSettings() {
    applyDyslexiaFont();
    applyHighContrast();
    if (settings.textSize !== 100) {
        applyTextSize();
    }
    applyReadingGuide();
  }

  applyAllSettings();
});
