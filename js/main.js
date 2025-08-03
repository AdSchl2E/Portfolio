/*
  JavaScript principal du Portfolio Adam Schlee
  Gestion de la navigation, animations, multilingue et interactions
  Module ES6 avec fonctionnalités avancées
*/

import { getThemePrimaryColor, getThemeTextPrimaryColor } from './themes.js';

// Configuration des langues disponibles
const languageConfig = {
  fr: { code: 'FR', flag: '🇫🇷', name: 'Français' },
  en: { code: 'EN', flag: '🇺🇸', name: 'English' },
  ja: { code: 'JP', flag: '🇯🇵', name: '日本語' },
  de: { code: 'DE', flag: '🇩🇪', name: 'Deutsch' },
  es: { code: 'ES', flag: '🇪🇸', name: 'Español' },
  zh: { code: 'ZH', flag: '🇨🇳', name: '中文' }
};

// Cache pour les traductions chargées
let translationsCache = {};

// Fonction pour charger les traductions depuis les fichiers JSON
async function loadTranslations(lang) {
  if (translationsCache[lang]) {
    return translationsCache[lang];
  }

  try {
    const response = await fetch(`i18n/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${lang}`);
    }
    const translations = await response.json();
    translationsCache[lang] = translations;
    return translations;
  } catch (error) {
    console.warn(`Could not load translations for ${lang}:`, error);
    // Fallback vers le français si la langue demandée n'existe pas
    if (lang !== 'fr') {
      return loadTranslations('fr');
    }
    return {};
  }
}

// Fonction pour obtenir les langues disponibles depuis la configuration
function getAvailableLanguages() {
  return Object.keys(languageConfig);
}

// Fonction pour générer dynamiquement les options de langue dans le HTML
function generateLanguageOptions() {
  const languageDropdown = document.querySelector('.language-dropdown');
  const mobileLanguageDropdown = document.querySelector('.mobile-language-dropdown');
  
  if (languageDropdown) {
    languageDropdown.innerHTML = '';
    Object.entries(languageConfig).forEach(([code, config]) => {
      const option = document.createElement('div');
      option.className = 'language-option';
      option.dataset.lang = code;
      option.innerHTML = `
        <span>${config.flag}</span>
        <span>${config.name}</span>
      `;
      languageDropdown.appendChild(option);
    });
  }

  if (mobileLanguageDropdown) {
    mobileLanguageDropdown.innerHTML = '';
    Object.entries(languageConfig).forEach(([code, config]) => {
      const option = document.createElement('div');
      option.className = 'mobile-language-option';
      option.dataset.lang = code;
      option.innerHTML = `
        <span>${config.flag}</span>
        <span>${config.name}</span>
      `;
      mobileLanguageDropdown.appendChild(option);
    });
  }
}

class PortfolioManager {
  constructor() {
    this.currentLanguage = localStorage.getItem('portfolio-language') || 'fr';
    this.isLoading = true;
    this.init();
  }

  async init() {
    // Générer les options de langue dynamiquement
    generateLanguageOptions();
    
    // Initialiser les autres composants
    await this.initializeLanguage();
    this.initializeNavigation();
    this.initializeScrollEffects();
    this.initializeAnimations();
    this.initializeSkills();
    this.initializeProjects();
    this.initializeContact();
    this.initializeThemeEvents();
  }

  async initializeLanguage() {
    // Vérifier que la langue actuelle est supportée
    if (!getAvailableLanguages().includes(this.currentLanguage)) {
      this.currentLanguage = 'fr'; // Fallback vers français
    }
    
    this.updateLanguageDisplay();
    await this.translatePage();
    this.bindLanguageEvents();
  }

  bindLanguageEvents() {
    const languageBtn = document.querySelector('.language-btn');
    const languageSelector = document.querySelector('.language-selector');

    if (languageBtn) {
      languageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        languageSelector.classList.toggle('active');
      });
    }

    // Gestionnaire pour le bouton mobile de langue
    const mobileLanguageBtn = document.querySelector('.mobile-language-button');
    const mobileLanguageDropdown = document.querySelector('.mobile-language-dropdown');

    if (mobileLanguageBtn && mobileLanguageDropdown) {
      mobileLanguageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileLanguageDropdown.classList.toggle('active');
      });
    }

    // Fermer les dropdowns en cliquant ailleurs
    document.addEventListener('click', () => {
      if (languageSelector) {
        languageSelector.classList.remove('active');
      }
      if (mobileLanguageDropdown) {
        mobileLanguageDropdown.classList.remove('active');
      }
    });

    // Gestionnaires pour les options de langue desktop (générées dynamiquement)
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
      option.addEventListener('click', async (e) => {
        e.stopPropagation();
        const lang = option.dataset.lang;
        await this.setLanguage(lang);
        languageSelector.classList.remove('active');
      });
    });

    // Gestionnaires pour les options de langue mobile (générées dynamiquement)
    const mobileLanguageOptions = document.querySelectorAll('.mobile-language-option');
    mobileLanguageOptions.forEach(option => {
      option.addEventListener('click', async (e) => {
        e.stopPropagation();
        const lang = option.dataset.lang;
        await this.setLanguage(lang);
        mobileLanguageDropdown.classList.remove('active');
      });
    });
  }

  async setLanguage(lang) {
    if (getAvailableLanguages().includes(lang)) {
      this.currentLanguage = lang;
      this.updateLanguageDisplay();
      await this.translatePage();
      localStorage.setItem('portfolio-language', lang);
    }
  }

  updateLanguageDisplay() {
    const currentLangElement = document.getElementById('current-language');
    if (currentLangElement && languageConfig[this.currentLanguage]) {
      currentLangElement.textContent = languageConfig[this.currentLanguage].code;
    }
  }

  async translatePage() {
    const elements = document.querySelectorAll('[data-i18n]');
    
    try {
      const currentTranslations = await loadTranslations(this.currentLanguage);

      elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = this.getNestedTranslation(currentTranslations, key);

        if (translation) {
          if (element.tagName === 'INPUT' && element.type === 'submit') {
            element.value = translation;
          } else {
            element.innerHTML = translation;
          }
        }
      });

      // Mettre à jour la langue du document
      document.documentElement.lang = this.currentLanguage;
    } catch (error) {
      console.error('Error translating page:', error);
    }
  }

  getNestedTranslation(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
  }

  initializeNavigation() {
    this.initializeDesktopNavigation();
    this.initializeMobileNavigation();
    this.initializeScrollSpy();
    this.initializeSmoothScroll();
  }

  initializeDesktopNavigation() {
    const navLinks = document.querySelectorAll('.navbar-desktop .nav-link');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          this.scrollToSection(href.substring(1));
        }
      });
    });
  }

  initializeMobileNavigation() {
    const navItems = document.querySelectorAll('.navbar-mobile .nav-item');

    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const href = item.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          this.scrollToSection(href.substring(1));
        }
      });
    });
  }

  initializeScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-section], .nav-item[data-section]');

    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-20% 0px -20% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;

          // Mettre à jour les liens de navigation actifs
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId ||
              link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  initializeSmoothScroll() {
    // Scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', () => {
        this.scrollToSection('about');
      });
    }
  }

  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const offsetTop = section.offsetTop - 80; // Hauteur de la navbar
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  initializeScrollEffects() {
    // Navbar background on scroll - utilise les variables CSS du thème
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector('.navbar-desktop');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.style.background = 'var(--bg-primary)';
          navbar.style.boxShadow = 'var(--shadow-medium)';
        } else {
          navbar.style.background = 'var(--bg-primary)';
          navbar.style.boxShadow = 'none';
        }
      }
    });

    // Parallax effect pour le hero
    window.addEventListener('scroll', () => {
      const heroBackground = document.querySelector('.hero-background');
      if (heroBackground) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroBackground.style.transform = `translateY(${rate}px)`;
      }
    });
  }

  initializeAnimations() {
    // Observer pour les animations d'apparition
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Appliquer l'animation aux éléments
    const animatedElements = document.querySelectorAll(`
      .education-card, .experience-card, .interest-card,
      .project-card, .skill-item, .contact-item
    `);

    animatedElements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      observer.observe(element);
    });
  }

  initializeSkills() {
    this.initializeSkillsFilter();
    this.initializeSkillsHover();
  }

  initializeSkillsFilter() {
    const filterButtons = document.querySelectorAll('.skills-filter .filter-btn');
    const skillItems = document.querySelectorAll('.skill-item');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');

        // Mettre à jour les boutons actifs
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filtrer les compétences
        skillItems.forEach(item => {
          const category = item.getAttribute('data-category');

          if (filter === 'all' || category === filter) {
            item.classList.remove('hidden');
            item.style.display = 'flex';
          } else {
            item.classList.add('hidden');
            item.style.display = 'none';
          }
        });
      });
    });
  }

  initializeSkillsHover() {
    this.updateSkillIconColors();

    // Écouter les changements de thème
    document.addEventListener('themeChanged', () => {
      this.updateSkillIconColors();
    });
  }

  updateSkillIconColors() {
    const primary = getThemePrimaryColor().replace('#', '');
    const baseColor = getThemeTextPrimaryColor().replace('#', '');

    document.querySelectorAll('.skill-item').forEach(item => {
      const img = item.querySelector('.skill-icon img[data-icon]');
      const skillName = item.querySelector('.skill-name');

      if (!img) return;

      const icon = img.getAttribute('data-icon');

      // Réinitialiser les couleurs par défaut
      this.resetSkillIcon(img, skillName, icon, baseColor);

      // Ajouter les gestionnaires d'événements hover
      item.addEventListener('mouseenter', () => {
        this.updateSkillIcon(img, skillName, icon, primary);
      });

      item.addEventListener('mouseleave', () => {
        this.resetSkillIcon(img, skillName, icon, baseColor);
      });
    });
  }

  updateSkillIcon(img, skillName, icon, color) {
    if (icon === 'java') {
      img.src = `https://img.icons8.com/?size=100&id=2572&format=png&color=${color}`;
    } else if (icon === 'vscode') {
      img.src = `https://img.icons8.com/?size=100&id=yCNobJ80uutx&format=png&color=${color}`;
    } else if (icon === 'powerbi') {
      img.src = `https://img.icons8.com/?size=100&id=FQ9NVJuXbDIv&format=png&color=${color}`;
    } else {
      img.src = `https://cdn.simpleicons.org/${icon}/${color}`;
    }
    skillName.style.color = `#${color}`;
  }

  resetSkillIcon(img, skillName, icon, color) {
    if (icon === 'java') {
      img.src = `https://img.icons8.com/?size=100&id=2572&format=png&color=${color}`;
    } else if (icon === 'vscode') {
      img.src = `https://img.icons8.com/?size=100&id=yCNobJ80uutx&format=png&color=${color}`;
    } else if (icon === 'powerbi') {
      img.src = `https://img.icons8.com/?size=100&id=FQ9NVJuXbDIv&format=png&color=${color}`;
    } else {
      img.src = `https://cdn.simpleicons.org/${icon}/${color}`;
    }
    skillName.style.color = '';
  }

  initializeProjects() {
    // Si on est sur la page projets, initialiser le filtrage
    if (document.querySelector('.projects-page')) {
      this.initializeProjectsFilter();
    }
  }

  initializeProjectsFilter() {
    const filterButtons = document.querySelectorAll('.projects-filters .filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const noProjectsMessage = document.getElementById('no-projects');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');

        // Mettre à jour les boutons actifs
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        let visibleCount = 0;

        // Filtrer les projets
        projectCards.forEach(card => {
          const tags = card.getAttribute('data-tags') || '';

          if (filter === 'all' || tags.includes(filter)) {
            card.style.display = 'block';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        // Afficher le message si aucun projet trouvé
        if (noProjectsMessage) {
          if (visibleCount === 0) {
            noProjectsMessage.style.display = 'block';
          } else {
            noProjectsMessage.style.display = 'none';
          }
        }
      });
    });
  }

  initializeContact() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleContactSubmit(e);
      });
    }
  }

  handleContactSubmit(e) {
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    // Créer le lien mailto
    const subject = encodeURIComponent(data.subject);
    const body = encodeURIComponent(`
Nom: ${data.name}
Email: ${data.email}

Message:
${data.message}
    `);

    const mailtoLink = `mailto:ad.schlee@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  }

  initializeThemeEvents() {
    // Écouter les changements de thème pour mettre à jour les icônes
    document.addEventListener('themeChanged', (e) => {
      // Petit délai pour s'assurer que les variables CSS sont appliquées
      setTimeout(() => {
        this.updateSkillIconColors();
      }, 50);
    });
  }
}

// Fonction globale pour mettre à jour les couleurs des icônes (appelée depuis themes.js)
window.updateSkillIconColors = function () {
  if (window.portfolioManager) {
    window.portfolioManager.updateSkillIconColors();
  }
};

// Initialiser le gestionnaire principal
document.addEventListener('DOMContentLoaded', () => {
  window.portfolioManager = new PortfolioManager();
});

// Gestion des erreurs d'images
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('error', () => {
      // Image de fallback ou placeholder
      if (!img.src.includes('placeholder')) {
        img.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=Image+Non+Disponible';
      }
    });
  });
});

// Gestion du carrousel automatique
class CarouselManager {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.carousel-slide');
    this.dots = document.querySelectorAll('.dot');
    this.autoSlideInterval = null;
    this.slidesPerView = window.innerWidth > 768 ? 3 : 1; // 3 sur desktop, 1 sur mobile
    this.totalGroups = Math.ceil(this.slides.length / this.slidesPerView);

    if (this.slides.length > 0) {
      this.init();
      this.setupResponsive();
    }
  }

  init() {
    this.bindEvents();
    this.startAutoSlide();
  }

  setupResponsive() {
    window.addEventListener('resize', () => {
      const newSlidesPerView = window.innerWidth > 768 ? 3 : 1;
      if (newSlidesPerView !== this.slidesPerView) {
        this.slidesPerView = newSlidesPerView;
        this.totalGroups = Math.ceil(this.slides.length / this.slidesPerView);
        this.currentSlide = 0;
        this.goToSlide(0);
      }
    });
  }

  bindEvents() {
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goToSlide(index);
        this.resetAutoSlide();
      });
    });
  }

  goToSlide(index) {
    this.currentSlide = index;
    const track = document.querySelector('.carousel-track');
    const slideWidth = 100 / this.slidesPerView;
    const translateX = -index * slideWidth * this.slidesPerView;
    track.style.transform = `translateX(${translateX}%)`;

    // Mettre à jour les dots
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalGroups;
    this.goToSlide(this.currentSlide);
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  resetAutoSlide() {
    this.stopAutoSlide();
    this.startAutoSlide();
  }
}

// Initialiser le carrousel
document.addEventListener('DOMContentLoaded', () => {
  new CarouselManager();
});

export { PortfolioManager };
