/**
 * Custom Hero Carousel
 * Lightweight carousel implementation for hero section
 */

class HeroCarousel {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      console.warn('Hero carousel container not found');
      return;
    }

    this.slides = this.container.querySelectorAll('.hero-slide');
    this.prevBtn = this.container.querySelector('.hero-prev');
    this.nextBtn = this.container.querySelector('.hero-next');
    this.indicators = this.container.querySelectorAll('.hero-indicator');
    
    this.currentSlide = 0;
    this.isTransitioning = false;
    this.autoplayInterval = null;
    this.autoplayDelay = 5000; // 5 seconds
    
    this.init();
  }

  init() {
    if (this.slides.length === 0) return;

    // Set first slide as active
    this.showSlide(0);
    
    // Bind event listeners
    this.bindEvents();
    
    // Start autoplay
    this.startAutoplay();
    
    // Pause autoplay on hover
    this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
    this.container.addEventListener('mouseleave', () => this.startAutoplay());
    
    // Pause autoplay when page is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAutoplay();
      } else {
        this.startAutoplay();
      }
    });
  }

  bindEvents() {
    // Navigation buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }

    // Indicators
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.prevSlide();
      } else if (e.key === 'ArrowRight') {
        this.nextSlide();
      }
    });

    // Touch/swipe support
    this.addTouchSupport();
  }

  showSlide(index) {
    if (this.isTransitioning || index === this.currentSlide) return;
    
    this.isTransitioning = true;
    
    // Remove active class from current slide and indicator
    this.slides[this.currentSlide]?.classList.remove('active');
    this.indicators[this.currentSlide]?.classList.remove('active');
    
    // Update current slide index
    this.currentSlide = index;
    
    // Add active class to new slide and indicator
    this.slides[this.currentSlide]?.classList.add('active');
    this.indicators[this.currentSlide]?.classList.add('active');
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      this.isTransitioning = false;
    }, 800); // Match CSS transition duration
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }

  goToSlide(index) {
    if (index >= 0 && index < this.slides.length) {
      this.showSlide(index);
      this.restartAutoplay();
    }
  }

  startAutoplay() {
    this.pauseAutoplay(); // Clear any existing interval
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoplayDelay);
  }

  pauseAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  restartAutoplay() {
    this.startAutoplay();
  }

  addTouchSupport() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    const minSwipeDistance = 50;

    this.container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      // Check if horizontal swipe is more significant than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          this.prevSlide(); // Swipe right
        } else {
          this.nextSlide(); // Swipe left
        }
      }
    }, { passive: true });
  }

  // Public methods for external control
  destroy() {
    this.pauseAutoplay();
    // Remove event listeners if needed
  }

  setAutoplayDelay(delay) {
    this.autoplayDelay = delay;
    if (this.autoplayInterval) {
      this.restartAutoplay();
    }
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const heroCarousel = new HeroCarousel('.custom-hero');
  
  // Make it globally accessible if needed
  window.heroCarousel = heroCarousel;
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeroCarousel;
}