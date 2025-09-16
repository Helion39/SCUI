// Centralized Accessibility Injection Script
// This script dynamically injects accessibility toolbar HTML and functionality

(function() {
  'use strict';
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
  
  function initAccessibility() {
    // Inject accessibility HTML structure
    injectAccessibilityHTML();
    
    // Initialize accessibility functionality
    initAccessibilityFeatures();
  }
  
  function injectAccessibilityHTML() {
    // Create accessibility toolbar
    const toolbar = document.createElement('div');
    toolbar.id = 'accessibility-toolbar';
    toolbar.className = 'accessibility-toolbar';
    toolbar.innerHTML = `
      <button id="accessibility-toggle" class="accessibility-toggle" aria-label="Toggle Accessibility Options">
        <i class="bi bi-universal-access"></i>
      </button>
    `;
    
    // Create accessibility overlay
    const overlay = document.createElement('div');
    overlay.id = 'accessibility-overlay';
    overlay.className = 'accessibility-overlay';
    
    // Create accessibility panel
    const panel = document.createElement('div');
    panel.id = 'accessibility-panel';
    panel.className = 'accessibility-panel';
    panel.innerHTML = `
      <button id="accessibility-close" class="accessibility-close" aria-label="Close Accessibility Panel">
        <i class="bi bi-x"></i>
      </button>
      <h4 data-translate="accessibility.title">Accessibility Options</h4>
      <div class="accessibility-controls">
        <button id="dyslexic-font" class="btn btn-sm btn-outline-primary" data-translate="accessibility.dyslexicFont">Dyslexia Font</button>
        <button id="increase-text" class="btn btn-sm btn-outline-primary" data-translate="accessibility.increaseText">A+</button>
        <button id="decrease-text" class="btn btn-sm btn-outline-primary" data-translate="accessibility.decreaseText">A-</button>
        <button id="high-contrast" class="btn btn-sm btn-outline-primary" data-translate="accessibility.highContrast">High Contrast</button>
        <button id="reading-guide" class="btn btn-sm btn-outline-primary" data-translate="accessibility.readingGuide">Reading Guide</button>
        
        <!-- Language Selector -->
        <div class="language-selector">
          <label for="language-select" class="language-label" data-translate="accessibility.language">Language:</label>
          <select id="language-select" class="language-dropdown">
            <option value="id">Bahasa Indonesia</option>
            <option value="en">English</option>
          </select>
        </div>
        
        <button id="reset-accessibility" class="btn btn-sm btn-outline-secondary" data-translate="accessibility.reset">Reset</button>
      </div>
    `;
    
    // Inject elements into the page
    document.body.appendChild(toolbar);
    document.body.appendChild(overlay);
    document.body.appendChild(panel);
  }
  
  function initAccessibilityFeatures() {
    // Get elements
    const accessibilityToggle = document.getElementById('accessibility-toggle');
    const accessibilityPanel = document.getElementById('accessibility-panel');
    const accessibilityOverlay = document.getElementById('accessibility-overlay');
    const accessibilityClose = document.getElementById('accessibility-close');
    const dyslexicFontBtn = document.getElementById('dyslexic-font');
    const increaseTextBtn = document.getElementById('increase-text');
    const decreaseTextBtn = document.getElementById('decrease-text');
    const highContrastBtn = document.getElementById('high-contrast');
    const readingGuideBtn = document.getElementById('reading-guide');
    const resetBtn = document.getElementById('reset-accessibility');
    const languageSelect = document.getElementById('language-select');
    
    let textSize = 100;
    let currentLanguage = localStorage.getItem('language') || 'id';
    
    // Language switching functionality
    const translations = {};
    
    // Load language files
    async function loadLanguage(lang) {
      if (translations[lang]) {
        return translations[lang];
      }
      
      try {
        const response = await fetch(`assets/js/lang/${lang}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load language file: ${lang}`);
        }
        const data = await response.json();
        translations[lang] = data;
        return data;
      } catch (error) {
        console.error('Error loading language:', error);
        // Fallback to Indonesian if error
        if (lang !== 'id') {
          return loadLanguage('id');
        }
        return {};
      }
    }
    
    // Helper function to get nested translation
    function getNestedTranslation(obj, path) {
      return path.split('.').reduce((current, key) => current && current[key], obj);
    }
    
    // Update page content with translations
    async function updatePageContent(lang) {
      const t = await loadLanguage(lang);
      
      // Update elements with data-translate attributes
      document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = getNestedTranslation(t, key);
        if (translation) {
          if (element.tagName === 'INPUT' && element.type === 'submit') {
            element.value = translation;
          } else if (key === 'hero.title') {
            // Use innerHTML for hero title to allow HTML tags like <br>
            element.innerHTML = translation;
          } else {
            element.textContent = translation;
          }
        }
      });
    }
    
    // Initialize language
    if (languageSelect) {
      languageSelect.value = currentLanguage;
      updatePageContent(currentLanguage);
      
      languageSelect.addEventListener('change', function() {
        currentLanguage = this.value;
        localStorage.setItem('language', currentLanguage);
        updatePageContent(currentLanguage);
      });
    }
    
    // Accessibility features
    if (accessibilityToggle && accessibilityPanel && accessibilityOverlay) {
      // Toggle accessibility sidebar
      accessibilityToggle.addEventListener('click', function() {
        accessibilityPanel.classList.add('show');
        accessibilityOverlay.classList.add('show');
      });
      
      // Close accessibility sidebar
      function closeSidebar() {
        accessibilityPanel.classList.remove('show');
        accessibilityOverlay.classList.remove('show');
      }
      
      if (accessibilityClose) accessibilityClose.addEventListener('click', closeSidebar);
      accessibilityOverlay.addEventListener('click', closeSidebar);
      
      // Close on Escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && accessibilityPanel.classList.contains('show')) {
          closeSidebar();
        }
      });
    }
    
    // Dyslexic font toggle
    if (dyslexicFontBtn) {
      dyslexicFontBtn.addEventListener('click', function() {
        document.body.classList.toggle('dyslexic-font');
        this.classList.toggle('active');
        localStorage.setItem('dyslexic-font', document.body.classList.contains('dyslexic-font'));
      });
    }
    
    // Text size controls
    if (increaseTextBtn) {
      increaseTextBtn.addEventListener('click', function() {
        if (textSize < 150) {
          textSize += 10;
          if (textSize !== 100) {
            document.documentElement.style.setProperty('--content-text-size', textSize);
            document.body.classList.add('custom-text-sizing');
          } else {
            document.documentElement.style.removeProperty('--content-text-size');
            document.body.classList.remove('custom-text-sizing');
          }
          localStorage.setItem('text-size', textSize);
        }
      });
    }
    
    if (decreaseTextBtn) {
      decreaseTextBtn.addEventListener('click', function() {
        if (textSize > 80) {
          textSize -= 10;
          if (textSize !== 100) {
            document.documentElement.style.setProperty('--content-text-size', textSize);
            document.body.classList.add('custom-text-sizing');
          } else {
            document.documentElement.style.removeProperty('--content-text-size');
            document.body.classList.remove('custom-text-sizing');
          }
          localStorage.setItem('text-size', textSize);
        }
      });
    }
    
    // High contrast toggle
    if (highContrastBtn) {
      highContrastBtn.addEventListener('click', function() {
        document.body.classList.toggle('high-contrast');
        this.classList.toggle('active');
        localStorage.setItem('high-contrast', document.body.classList.contains('high-contrast'));
      });
    }
    
    // Reading guide
    let readingGuide;
    if (readingGuideBtn) {
      readingGuideBtn.addEventListener('click', function() {
        if (!readingGuide) {
          readingGuide = document.createElement('div');
          readingGuide.className = 'reading-guide';
          document.body.appendChild(readingGuide);
        }
        
        readingGuide.classList.toggle('active');
        this.classList.toggle('active');
        
        if (readingGuide.classList.contains('active')) {
          document.addEventListener('mousemove', updateReadingGuide);
        } else {
          document.removeEventListener('mousemove', updateReadingGuide);
        }
        
        localStorage.setItem('reading-guide', readingGuide.classList.contains('active'));
      });
    }
    
    function updateReadingGuide(e) {
      if (readingGuide && readingGuide.classList.contains('active')) {
        readingGuide.style.top = e.clientY + 'px';
      }
    }
    
    // Reset all accessibility features
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        document.body.classList.remove('dyslexic-font', 'high-contrast', 'custom-text-sizing');
        document.documentElement.style.removeProperty('--content-text-size');
        textSize = 100;
        
        // Reset reading guide
        if (readingGuide) {
          readingGuide.classList.remove('active');
          document.removeEventListener('mousemove', updateReadingGuide);
        }
        
        // Reset button states
        document.querySelectorAll('.accessibility-controls .btn').forEach(btn => {
          btn.classList.remove('active');
        });
        
        // Clear localStorage
        localStorage.removeItem('dyslexic-font');
        localStorage.removeItem('text-size');
        localStorage.removeItem('high-contrast');
        localStorage.removeItem('reading-guide');
      });
    }
    
    // Load saved accessibility preferences
    if (localStorage.getItem('dyslexic-font') === 'true') {
      document.body.classList.add('dyslexic-font');
      if (dyslexicFontBtn) dyslexicFontBtn.classList.add('active');
    }
    
    if (localStorage.getItem('high-contrast') === 'true') {
      document.body.classList.add('high-contrast');
      if (highContrastBtn) highContrastBtn.classList.add('active');
    }
    
    if (localStorage.getItem('reading-guide') === 'true') {
      if (!readingGuide) {
        readingGuide = document.createElement('div');
        readingGuide.className = 'reading-guide';
        document.body.appendChild(readingGuide);
      }
      readingGuide.classList.add('active');
      if (readingGuideBtn) readingGuideBtn.classList.add('active');
      document.addEventListener('mousemove', updateReadingGuide);
    }
    
    const savedTextSize = localStorage.getItem('text-size');
    if (savedTextSize) {
      textSize = parseInt(savedTextSize);
      if (textSize !== 100) {
        document.documentElement.style.setProperty('--content-text-size', textSize);
        document.body.classList.add('custom-text-sizing');
      }
    }
  }
})();