/*
  Animations et effets visuels pour le Portfolio Adam Schlee
  Gestion des animations on scroll, parallax et effets de transition
  Module ES6 avec IntersectionObserver et RequestAnimationFrame optimisé
*/

class AnimationManager {
    constructor() {
        this.animatedElements = new Set();
        this.scrollPosition = 0;
        this.ticking = false;
        
        this.init();
    }

    init() {
        this.hideAnimatableElements(); // Pré-cacher les éléments
        this.setupScrollObserver();
        this.setupParallaxEffect();
        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('load', () => this.triggerEntryAnimations());
        window.addEventListener('resize', () => this.handleResize());
    }

    handleScroll() {
        this.scrollPosition = window.pageYOffset;
        
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.updateParallax();
                this.updateScrollIndicator();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    // Pré-cacher tous les éléments animables pour éviter le flash
    hideAnimatableElements() {
        const elements = document.querySelectorAll(`
            .section-header,
            .hero-text,
            .hero-avatar,
            .about-text,
            .education-card,
            .experience-card,
            .skill-item,
            .project-card,
            .contact-item
        `);
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
        });
    }

    setupScrollObserver() {
        const observerOptions = {
            threshold: 0.1, // Simplifié - déclenchement plus tôt
            rootMargin: '50px 0px 50px 0px' // Plus de marge pour détecter plus tôt
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observer tous les éléments animables
        document.querySelectorAll(`
            .section-header,
            .hero-text,
            .hero-avatar,
            .about-text,
            .education-card,
            .experience-card,
            .skill-item,
            .project-card,
            .contact-item
        `).forEach(el => {
            this.observer.observe(el);
        });
    }

    animateElement(element) {
        if (this.animatedElements.has(element)) return;
        
        this.animatedElements.add(element);
        
        // Animation ultra-rapide pour les skills
        if (element.classList.contains('skill-item')) {
            element.style.transition = 'all 0.15s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            return;
        }
        
        // Animation rapide et uniforme pour tous les autres éléments
        element.style.transition = 'all 0.3s ease-out';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }

    setupParallaxEffect() {
        this.parallaxElements = document.querySelectorAll('.hero-background, .parallax-element');
    }

    updateParallax() {
        this.parallaxElements.forEach(element => {
            const speed = element.dataset.parallaxSpeed || 0.5;
            const yPos = -(this.scrollPosition * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    updateScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-progress');
        if (scrollIndicator) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollIndicator.style.width = scrolled + '%';
        }
    }

    triggerEntryAnimations() {
        // Animation d'entrée spéciale pour la hero section
        const loader = document.getElementById('loader');
        const heroSection = document.querySelector('.hero-section');
        
        if (loader) {
            setTimeout(() => {
                loader.classList.add('fade-out');                
                setTimeout(() => {
                    loader.style.display = 'none';
                    if (heroSection) {
                        this.triggerHeroAnimation();
                    }
                }, 500);
            }, 1500);
        }
    }

    triggerHeroAnimation() {
        const heroElements = document.querySelectorAll('.hero-text, .hero-avatar');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                this.animateElement(element);
            }, index * 100); // Réduit le délai entre les éléments hero
        });
    }

    handleResize() {
        // Recalculer les positions pour le parallax
        this.scrollPosition = window.pageYOffset;
        this.updateParallax();
    }

    // Méthode pour créer des particules flottantes
    createFloatingParticles() {
        const container = document.querySelector('.hero-background');
        if (!container) return;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 6 + 2}px;
                height: ${Math.random() * 6 + 2}px;
                background: var(--primary-color);
                border-radius: 50%;
                opacity: ${Math.random() * 0.5 + 0.1};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s linear infinite;
                pointer-events: none;
            `;
            container.appendChild(particle);
        }
    }
}

// Styles CSS pour les animations
const animationStyles = `
@keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-30px) rotate(120deg); }
    66% { transform: translateY(30px) rotate(240deg); }
}

.floating-particle {
    z-index: 1;
}

.scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
    z-index: 9999;
    transition: width 0.1s ease;
}
`;

// Injection des styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const animationManager = new AnimationManager();
    
    // Créer la barre de progression du scroll
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    // Créer les particules flottantes
    animationManager.createFloatingParticles();
});

export { AnimationManager };
