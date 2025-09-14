// Language handling functionality
let currentLanguage = localStorage.getItem('language') || 'id';
const translations = {};

// Load language files
async function loadLanguage(lang) {
  // If already loaded, skip
  if (translations[lang]) {
    console.log(`${lang} translations already loaded`);
    return;
  }
  
  try {
    const response = await fetch(`./assets/js/lang/${lang}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    translations[lang] = data;
    console.log(`Successfully loaded ${lang} translations from file`, data);
  } catch (error) {
    console.error(`Error loading language file for ${lang}:`, error);
    
    // Fallback to built-in translations
    if (lang === 'id') {
      translations[lang] = {
        "nav": {
          "home": "Beranda",
          "about": "Tentang Kami",
          "services": "Layanan",
          "projects": "Proyek",
          "blog": "Blog",
          "contact": "Kontak"
        },
        "accessibility": {
          "title": "Opsi Aksesibilitas",
          "dyslexicFont": "Font Disleksia",
          "increaseText": "Perbesar Teks",
          "decreaseText": "Perkecil Teks",
          "highContrast": "Kontras Tinggi",
          "readingGuide": "Panduan Membaca",
          "language": "Bahasa",
          "reset": "Reset"
        }
        // Add other translations as needed
      };
    } else if (lang === 'en') {
      translations[lang] = {
        "nav": {
          "home": "Home",
          "about": "About",
          "services": "Services",
          "projects": "Projects",
          "blog": "Blog",
          "contact": "Contact"
        },
        "accessibility": {
          "title": "Accessibility Options",
          "dyslexicFont": "Dyslexia Font",
          "increaseText": "Increase Text",
          "decreaseText": "Decrease Text",
          "highContrast": "High Contrast",
          "readingGuide": "Reading Guide",
          "language": "Language",
          "reset": "Reset"
        }
        // Add other translations as needed
      };
    }
  }
}

// Apply translations to the page
function applyTranslations(lang) {
  console.log(`Applying translations for language: ${lang}`);
  const t = translations[lang];
  if (!t) {
    console.warn(`Translation file for ${lang} not loaded`);
    return;
  }
  
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    const translation = getNestedTranslation(t, key);
    if (translation) {
      if (element.tagName === 'INPUT' && element.type === 'placeholder') {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    }
  });
}

// Helper function to get nested translations
function getNestedTranslation(obj, path) {
  return path.split('.').reduce((p, c) => p && p[c], obj);
}

// Initialize language system
async function initLanguage() {
  const languageSelect = document.getElementById('language-select');
  if (!languageSelect) {
    console.error('Language select element not found!');
    return;
  }

  // Set initial selected value
  languageSelect.value = currentLanguage;
  
  // Load current language
  await loadLanguage(currentLanguage);
  applyTranslations(currentLanguage);

  // Add change event listener
  languageSelect.addEventListener('change', async function() {
    console.log('Language change detected:', this.value);
    currentLanguage = this.value;
    localStorage.setItem('language', currentLanguage);
    
    await loadLanguage(currentLanguage);
    applyTranslations(currentLanguage);
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initLanguage);
