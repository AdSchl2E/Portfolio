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
    const altElements = document.querySelectorAll('[data-i18n-alt]');

    try {
      const currentTranslations = await loadTranslations(this.currentLanguage);

      // Traduire les éléments textuels
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

      // Traduire les attributs alt des images
      altElements.forEach(element => {
        const key = element.getAttribute('data-i18n-alt');
        const translation = this.getNestedTranslation(currentTranslations, key);

        if (translation) {
          element.alt = translation;
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
      threshold: 0.2,
      rootMargin: '-15% 0px -15% 0px'
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
    const filterContainer = document.getElementById('dynamic-filters');
    const projectCards = document.querySelectorAll('.project-card');
    const noProjectsMessage = document.getElementById('no-projects');

    if (!filterContainer) return;

    // Récupérer toutes les technologies uniques des projets
    const allTechnologies = new Set();

    projectCards.forEach(card => {
      const techTags = card.querySelectorAll('.tech-tag');
      techTags.forEach(tag => {
        const techName = tag.textContent.trim();
        if (techName) {
          allTechnologies.add(techName);
        }
      });
    });

    // Créer les boutons de filtre dynamiquement
    filterContainer.innerHTML = '';

    // Bouton "Toutes"
    const allButton = document.createElement('button');
    allButton.className = 'filter-btn active';
    allButton.setAttribute('data-filter', 'all');
    allButton.setAttribute('data-i18n', 'projects.filter.all');
    allButton.textContent = 'Toutes';
    filterContainer.appendChild(allButton);

    // Boutons pour chaque technologie (triés alphabétiquement)
    const sortedTechnologies = Array.from(allTechnologies).sort();
    sortedTechnologies.forEach(tech => {
      const button = document.createElement('button');
      button.className = 'filter-btn';
      button.setAttribute('data-filter', tech.toLowerCase());
      button.textContent = tech;
      filterContainer.appendChild(button);
    });

    // Ajouter les event listeners aux boutons
    const filterButtons = filterContainer.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');

        // Mettre à jour les boutons actifs
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        let visibleCount = 0;

        // Filtrer les projets
        projectCards.forEach(card => {
          const techTags = card.querySelectorAll('.tech-tag');
          let hasMatchingTech = false;

          if (filter === 'all') {
            hasMatchingTech = true;
          } else {
            techTags.forEach(tag => {
              const techName = tag.textContent.trim().toLowerCase();
              if (techName === filter) {
                hasMatchingTech = true;
              }
            });
          }

          if (hasMatchingTech) {
            card.style.display = 'flex';
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

    // Traduire les boutons après les avoir créés
    this.translatePage();
  }

  initializeContact() {
    const contactForm = document.getElementById('contact-form');
    const toast = document.getElementById('toast');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = {
          name: contactForm.name.value,
          email: contactForm.email.value,
          subject: contactForm.subject.value,
          message: contactForm.message.value,
          _honey: contactForm._honey.value,
          _captcha: false,
          _template: 'table'
        };
        fetch("https://formsubmit.co/ajax/ad.schlee@gmail.com", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData)
        })
          .then(response => response.json())
          .then(data => {
            toast.style.opacity = '1';
            toast.style.pointerEvents = 'auto';
            contactForm.reset();
            setTimeout(() => {
              toast.style.opacity = '0';
              toast.style.pointerEvents = 'none';
            }, 3500);
          })
          .catch((e) => {
            console.error('Error:', e);
            alert('There was an error sending your message. Please try again.');
          });
      });
    }
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
    this.currentGroup = 0;
    this.slides = document.querySelectorAll('.carousel-slide');
    this.track = document.querySelector('.carousel-track');
    this.dotsContainer = document.querySelector('.carousel-dots');
    this.dots = [];
    this.autoSlideInterval = null;
    this.slidesPerView = window.innerWidth > 768 ? 3 : 1;
    this.totalGroups = Math.ceil(this.slides.length / this.slidesPerView);
    this.autoSlideStarted = false;

    // Variables pour le support tactile
    this.startX = 0;
    this.currentX = 0;
    this.isDragging = false;
    this.startTransform = 0;
    this.threshold = 50; // Distance minimale pour déclencher un swipe

    if (this.slides.length > 0 && this.track && this.dotsContainer) {
      this.init();
      this.setupResponsive();
      this.initializeLightbox();
      this.initializeTouchEvents();
    }
  }

  init() {
    this.setupDots();
    this.bindEvents();
    this.goToGroup(0);
    this.startAutoSlide();
  }

  setupResponsive() {
    window.addEventListener('resize', () => {
      const newSlidesPerView = window.innerWidth > 768 ? 3 : 1;
      if (newSlidesPerView !== this.slidesPerView) {
        this.slidesPerView = newSlidesPerView;
        this.totalGroups = Math.ceil(this.slides.length / this.slidesPerView);
        this.dotsContainer.innerHTML = '';
        this.setupDots();
        this.goToGroup(0);
      }
    });
  }

  setupDots() {
    this.dotsContainer.innerHTML = '';
    this.dots = [];
    for (let i = 0; i < this.totalGroups; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      dot.dataset.group = i;
      this.dotsContainer.appendChild(dot);
      this.dots.push(dot);
    }
  }

  bindEvents() {
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goToGroup(index);
        this.resetAutoSlide();
      });
    });
  }

  // Nouvelle méthode pour initialiser les événements tactiles
  initializeTouchEvents() {
    // Événements tactiles
    this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

    // Événements souris pour le desktop (optionnel)
    this.track.addEventListener('mousedown', (e) => this.handleMouseStart(e));
    this.track.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.track.addEventListener('mouseup', (e) => this.handleMouseEnd(e));
    this.track.addEventListener('mouseleave', (e) => this.handleMouseEnd(e));

    // Empêcher la sélection de texte pendant le drag
    this.track.addEventListener('selectstart', (e) => e.preventDefault());
  }

  // Gestion du début du touch/drag
  handleTouchStart(e) {
    this.startX = e.touches[0].clientX;
    this.currentX = this.startX;
    this.isDragging = true;
    this.startTransform = this.getCurrentTransform();
    this.stopAutoSlide();
    
    // Supprimer temporairement la transition pour un mouvement fluide
    this.track.style.transition = 'none';
  }

  handleMouseStart(e) {
    this.startX = e.clientX;
    this.currentX = this.startX;
    this.isDragging = true;
    this.startTransform = this.getCurrentTransform();
    this.stopAutoSlide();
    this.track.style.transition = 'none';
    e.preventDefault(); // Empêcher la sélection de texte
  }

  // Gestion du mouvement
  handleTouchMove(e) {
    if (!this.isDragging) return;
    
    this.currentX = e.touches[0].clientX;
    const diffX = this.currentX - this.startX;
    const newTransform = this.startTransform + (diffX / this.track.offsetWidth) * 100;
    
    // Limiter le mouvement aux bornes du carrousel
    const minTransform = -(this.totalGroups - 1) * (100 / this.slidesPerView) * this.slidesPerView;
    const maxTransform = 0;
    
    const clampedTransform = Math.max(minTransform, Math.min(maxTransform, newTransform));
    this.track.style.transform = `translateX(${clampedTransform}%)`;
    
    // Empêcher le scroll de la page sur mobile
    if (Math.abs(diffX) > 10) {
      e.preventDefault();
    }
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;
    
    this.currentX = e.clientX;
    const diffX = this.currentX - this.startX;
    const newTransform = this.startTransform + (diffX / this.track.offsetWidth) * 100;
    
    const minTransform = -(this.totalGroups - 1) * (100 / this.slidesPerView) * this.slidesPerView;
    const maxTransform = 0;
    
    const clampedTransform = Math.max(minTransform, Math.min(maxTransform, newTransform));
    this.track.style.transform = `translateX(${clampedTransform}%)`;
  }

  // Gestion de la fin du touch/drag
  handleTouchEnd(e) {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    this.track.style.transition = 'transform 0.5s ease';
    
    const diffX = this.currentX - this.startX;
    
    // Déterminer la direction du swipe
    if (Math.abs(diffX) > this.threshold) {
      if (diffX > 0 && this.currentGroup > 0) {
        // Swipe vers la droite - aller au groupe précédent
        this.goToGroup(this.currentGroup - 1);
      } else if (diffX < 0 && this.currentGroup < this.totalGroups - 1) {
        // Swipe vers la gauche - aller au groupe suivant
        this.goToGroup(this.currentGroup + 1);
      } else {
        // Retourner à la position actuelle si on ne peut pas aller plus loin
        this.goToGroup(this.currentGroup);
      }
    } else {
      // Pas assez de mouvement, retourner à la position actuelle
      this.goToGroup(this.currentGroup);
    }
    
    this.resetAutoSlide();
  }

  handleMouseEnd(e) {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    this.track.style.transition = 'transform 0.5s ease';
    
    const diffX = this.currentX - this.startX;
    
    if (Math.abs(diffX) > this.threshold) {
      if (diffX > 0 && this.currentGroup > 0) {
        this.goToGroup(this.currentGroup - 1);
      } else if (diffX < 0 && this.currentGroup < this.totalGroups - 1) {
        this.goToGroup(this.currentGroup + 1);
      } else {
        this.goToGroup(this.currentGroup);
      }
    } else {
      this.goToGroup(this.currentGroup);
    }
    
    this.resetAutoSlide();
  }

  // Méthode utilitaire pour obtenir la valeur de transform actuelle
  getCurrentTransform() {
    const transform = window.getComputedStyle(this.track).transform;
    if (transform === 'none') return 0;
    
    const matrix = new DOMMatrix(transform);
    const translateX = matrix.m41; // valeur en pixels
    return (translateX / this.track.offsetWidth) * 100; // convertir en pourcentage
  }

  goToGroup(groupIndex) {
    this.currentGroup = groupIndex;
    const slideWidth = 100 / this.slidesPerView;
    const translateX = -groupIndex * slideWidth * this.slidesPerView - (groupIndex / this.slidesPerView * 4.5);
    this.track.style.transform = `translateX(${translateX}%)`;

    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === groupIndex);
    });
  }

  nextGroup() {
    this.currentGroup = (this.currentGroup + 1) % this.totalGroups;
    this.goToGroup(this.currentGroup);
  }

  startAutoSlide() {
    if (this.autoSlideStarted) return;
    this.autoSlideStarted = true;
    this.autoSlideInterval = setInterval(() => {
      this.nextGroup();
    }, 5000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
    this.autoSlideStarted = false;
  }

  resetAutoSlide() {
    this.stopAutoSlide();
    // Attendre un peu avant de redémarrer pour éviter les conflits
    setTimeout(() => {
      if (!this.autoSlideStarted) {
        this.startAutoSlide();
      }
    }, 1500);
  }

  initializeLightbox() {
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImage = document.getElementById('lightbox-image');
    this.lightboxCaption = document.getElementById('lightbox-caption');
    this.lightboxClose = document.querySelector('.lightbox-close');
    this.lightboxPrev = document.querySelector('.lightbox-prev');
    this.lightboxNext = document.querySelector('.lightbox-next');
    this.currentImageIndex = 0;

    // Créer un tableau des images avec leurs informations
    this.images = Array.from(this.slides).map((slide, index) => {
      const img = slide.querySelector('img');
      return {
        src: img.src,
        alt: img.alt,
        caption: img.alt || `Photo ${index + 1}`, // Utilisera l'alt traduit
        element: img // Garder une référence pour les mises à jour
      };
    });

    // Ajouter les événements de clic sur les images
    this.slides.forEach((slide, index) => {
      slide.addEventListener('click', () => {
        this.openLightbox(index);
        this.stopAutoSlide(); // Arrêter le carrousel pendant l'affichage lightbox
      });
    });

    // Événements pour fermer le lightbox
    this.lightboxClose.addEventListener('click', () => this.closeLightbox());
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.closeLightbox();
      }
    });

    // Navigation dans le lightbox
    this.lightboxPrev.addEventListener('click', () => this.previousImage());
    this.lightboxNext.addEventListener('click', () => this.nextImage());

    // Contrôles clavier
    document.addEventListener('keydown', (e) => {
      if (this.lightbox.classList.contains('active')) {
        switch (e.key) {
          case 'Escape':
            this.closeLightbox();
            break;
          case 'ArrowLeft':
            this.previousImage();
            break;
          case 'ArrowRight':
            this.nextImage();
            break;
        }
      }
    });
  }

  openLightbox(index) {
    this.currentImageIndex = index;
    this.updateLightboxImage();
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Empêcher le scroll
  }

  closeLightbox() {
    this.lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restaurer le scroll
    this.startAutoSlide(); // Redémarrer le carrousel
  }

  previousImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.updateLightboxImage();
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.updateLightboxImage();
  }

  updateLightboxImage() {
    const currentImage = this.images[this.currentImageIndex];
    this.lightboxImage.src = currentImage.src;
    this.lightboxImage.alt = currentImage.element.alt; // Alt à jour
    this.lightboxCaption.textContent = currentImage.element.alt || currentImage.caption;
  }
}

// Initialiser le carrousel
document.addEventListener('DOMContentLoaded', () => {
  new CarouselManager();
});

export { PortfolioManager };
