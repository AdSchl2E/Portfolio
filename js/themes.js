/**
 * Système de gestion des thèmes - 7 thèmes sélectionnés
 * Thème par défaut: Momiji
 */

// Définition des 7 thèmes sélectionnés
const themes = {
    light: {
        name: 'Light',
        variables: {
            '--primary-color': '#3b82f6',
            '--primary-hover': '#2563eb',
            '--accent-color': '#06b6d4',
            '--bg-primary': '#ffffff',
            '--bg-secondary': '#f8fafc',
            '--bg-tertiary': '#f1f5f9',
            '--text-primary': '#1e293b',
            '--text-secondary': '#475569',
            '--text-muted': '#64748b',
            '--border-color': '#e2e8f0',
            '--shadow-light': '0 1px 3px rgba(0, 0, 0, 0.1)',
            '--shadow-medium': '0 4px 6px rgba(0, 0, 0, 0.1)',
            '--shadow-heavy': '0 10px 25px rgba(0, 0, 0, 0.15)'
        }
    },
    dark: {
        name: 'Dark',
        variables: {
            '--primary-color': '#3b82f6',
            '--primary-hover': '#2563eb',
            '--accent-color': '#06b6d4',
            '--bg-primary': '#0f172a',
            '--bg-secondary': '#1e293b',
            '--bg-tertiary': '#334155',
            '--text-primary': '#f8fafc',
            '--text-secondary': '#cbd5e1',
            '--text-muted': '#94a3b8',
            '--border-color': '#334155',
            '--shadow-light': '0 1px 3px rgba(0, 0, 0, 0.3)',
            '--shadow-medium': '0 4px 6px rgba(0, 0, 0, 0.3)',
            '--shadow-heavy': '0 10px 25px rgba(0, 0, 0, 0.4)'
        }
    },
    momiji: {
        name: 'Momiji',
        variables: {
            '--primary-color': '#dc2626',
            '--primary-hover': '#b91c1c',
            '--accent-color': '#ea580c',
            '--bg-primary': '#fef2f2',
            '--bg-secondary': '#fecaca',
            '--bg-tertiary': '#fca5a5',
            '--text-primary': '#7f1d1d',
            '--text-secondary': '#991b1b',
            '--text-muted': '#b91c1c',
            '--border-color': '#fecaca',
            '--shadow-light': '0 1px 3px rgba(220, 38, 38, 0.1)',
            '--shadow-medium': '0 4px 6px rgba(220, 38, 38, 0.15)',
            '--shadow-heavy': '0 10px 25px rgba(220, 38, 38, 0.2)'
        }
    },
    'dark-momiji': {
        name: 'Dark Momiji',
        variables: {
            '--primary-color': '#dc2626',
            '--primary-hover': '#b91c1c',
            '--accent-color': '#ea580c',
            '--bg-primary': '#1a0f0f',
            '--bg-secondary': '#2d1a1a',
            '--bg-tertiary': '#442626',
            '--text-primary': '#fecaca',
            '--text-secondary': '#fca5a5',
            '--text-muted': '#ef4444',
            '--border-color': '#442626',
            '--shadow-light': '0 1px 3px rgba(220, 38, 38, 0.3)',
            '--shadow-medium': '0 4px 6px rgba(220, 38, 38, 0.3)',
            '--shadow-heavy': '0 10px 25px rgba(220, 38, 38, 0.4)'
        }
    },
    sakura: {
        name: 'Sakura',
        variables: {
            '--primary-color': '#ec4899',
            '--primary-hover': '#db2777',
            '--accent-color': '#f9a8d4',
            '--bg-primary': '#fdf2f8',
            '--bg-secondary': '#fce7f3',
            '--bg-tertiary': '#fbcfe8',
            '--text-primary': '#831843',
            '--text-secondary': '#9d174d',
            '--text-muted': '#be185d',
            '--border-color': '#fce7f3',
            '--shadow-light': '0 1px 3px rgba(236, 72, 153, 0.1)',
            '--shadow-medium': '0 4px 6px rgba(236, 72, 153, 0.15)',
            '--shadow-heavy': '0 10px 25px rgba(236, 72, 153, 0.2)'
        }
    },
    'dark-sakura': {
        name: 'Dark Sakura',
        variables: {
            '--primary-color': '#ec4899',
            '--primary-hover': '#db2777',
            '--accent-color': '#f9a8d4',
            '--bg-primary': '#1a0f17',
            '--bg-secondary': '#2d1a27',
            '--bg-tertiary': '#44263b',
            '--text-primary': '#fce7f3',
            '--text-secondary': '#fbcfe8',
            '--text-muted': '#f472b6',
            '--border-color': '#44263b',
            '--shadow-light': '0 1px 3px rgba(236, 72, 153, 0.3)',
            '--shadow-medium': '0 4px 6px rgba(236, 72, 153, 0.3)',
            '--shadow-heavy': '0 10px 25px rgba(236, 72, 153, 0.4)'
        }
    },
    yuzu: {
        name: 'Yuzu',
        variables: {
            '--primary-color': '#eab308',
            '--primary-hover': '#ca8a04',
            '--accent-color': '#84cc16',
            '--bg-primary': '#fefce8',
            '--bg-secondary': '#fef3c7',
            '--bg-tertiary': '#fde68a',
            '--text-primary': '#713f12',
            '--text-secondary': '#92400e',
            '--text-muted': '#a16207',
            '--border-color': '#fef3c7',
            '--shadow-light': '0 1px 3px rgba(234, 179, 8, 0.1)',
            '--shadow-medium': '0 4px 6px rgba(234, 179, 8, 0.15)',
            '--shadow-heavy': '0 10px 25px rgba(234, 179, 8, 0.2)'
        }
    },
    matcha: {
        name: 'Matcha',
        variables: {
            '--primary-color': '#16a34a',
            '--primary-hover': '#15803d',
            '--accent-color': '#65a30d',
            '--bg-primary': '#f0fdf4',
            '--bg-secondary': '#dcfce7',
            '--bg-tertiary': '#bbf7d0',
            '--text-primary': '#14532d',
            '--text-secondary': '#166534',
            '--text-muted': '#15803d',
            '--border-color': '#dcfce7',
            '--shadow-light': '0 1px 3px rgba(22, 163, 74, 0.1)',
            '--shadow-medium': '0 4px 6px rgba(22, 163, 74, 0.15)',
            '--shadow-heavy': '0 10px 25px rgba(22, 163, 74, 0.2)'
        }
    }
};

// Gestionnaire de thèmes
class ThemeManager {
    constructor() {
        this.currentTheme = 'dark'; // Thème par défaut: dark
        this.init();
    }

    init() {
        // Charger le thème sauvegardé ou utiliser dark par défaut
        const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
        this.createThemeOptions();
        this.applyTheme(savedTheme);
        this.updateThemeUI();
        this.bindEvents();
    }

    createThemeOptions() {
        // Créer les options du dropdown desktop
        const dropdown = document.querySelector('.theme-dropdown');
        if (dropdown) {
            dropdown.innerHTML = '';
            Object.keys(themes).forEach(themeKey => {
                const theme = themes[themeKey];
                const option = document.createElement('div');
                option.className = 'theme-option';
                option.dataset.theme = themeKey;
                option.innerHTML = `
                    <div class="theme-option-icon theme-icon-${themeKey}"></div>
                    <span class="theme-option-name" data-i18n="themes.${themeKey}.name">${theme.name}</span>
                `;
                dropdown.appendChild(option);
            });
        }

        // Créer les options du dropdown mobile
        const mobileDropdown = document.querySelector('.mobile-theme-dropdown');
        if (mobileDropdown) {
            mobileDropdown.innerHTML = '';
            Object.keys(themes).forEach(themeKey => {
                const theme = themes[themeKey];
                const option = document.createElement('div');
                option.className = 'mobile-theme-option';
                option.dataset.theme = themeKey;
                option.innerHTML = `
                    <div class="theme-icon theme-icon-${themeKey}"></div>
                    <span data-i18n="themes.${themeKey}.name">${theme.name}</span>
                `;
                mobileDropdown.appendChild(option);
            });
        }

        // Créer le bouton de thème avec l'icône et chevron
        const themeBtn = document.querySelector('.theme-btn');
        if (themeBtn && !themeBtn.querySelector('.theme-icon')) {
            themeBtn.innerHTML = `
                <i class="theme-icon"></i>
                <i class="uil uil-angle-down"></i>
            `;
        }
    }

    applyTheme(themeName) {
        if (!themes[themeName]) {
            console.warn(`Thème "${themeName}" non trouvé, utilisation de momiji`);
            themeName = 'momiji';
        }

        const theme = themes[themeName];
        const root = document.documentElement;

        // Appliquer les variables CSS
        Object.entries(theme.variables).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        this.currentTheme = themeName;
        localStorage.setItem('portfolio-theme', themeName);

        // Déclencher l'événement de changement de thème
        const themeChangedEvent = new CustomEvent('themeChanged', {
            detail: { 
                theme: themeName,
                themeData: theme 
            }
        });
        document.dispatchEvent(themeChangedEvent);
    }

    updateThemeUI() {
        const currentThemeIcon = document.querySelector('.theme-btn .theme-icon');
        
        if (currentThemeIcon) {
            currentThemeIcon.className = `theme-icon theme-icon-${this.currentTheme}`;
        }

        // Mettre à jour les options du dropdown
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            const themeValue = option.dataset.theme;
            option.classList.toggle('active', themeValue === this.currentTheme);
        });

        // Mettre à jour les options du dropdown mobile
        const mobileThemeOptions = document.querySelectorAll('.mobile-theme-option');
        mobileThemeOptions.forEach(option => {
            const themeValue = option.dataset.theme;
            option.classList.toggle('active', themeValue === this.currentTheme);
        });
    }

    bindEvents() {
        // Toggle dropdown desktop
        const themeBtn = document.querySelector('.theme-btn');
        const themeSelector = document.querySelector('.theme-selector');
        
        if (themeBtn && themeSelector) {
            themeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                themeSelector.classList.toggle('active');
            });
        }

        // Toggle dropdown mobile
        const mobileThemeBtn = document.querySelector('.mobile-theme-button');
        const mobileThemeDropdown = document.querySelector('.mobile-theme-dropdown');
        
        if (mobileThemeBtn && mobileThemeDropdown) {
            mobileThemeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                mobileThemeDropdown.classList.toggle('active');
            });
        }

        // Fermer les dropdowns en cliquant ailleurs
        document.addEventListener('click', () => {
            if (themeSelector) themeSelector.classList.remove('active');
            if (mobileThemeDropdown) mobileThemeDropdown.classList.remove('active');
        });

        // Sélection de thème desktop
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const selectedTheme = option.dataset.theme;
                if (themes[selectedTheme]) {
                    this.applyTheme(selectedTheme);
                    this.updateThemeUI();
                    themeSelector.classList.remove('active');
                }
            });
        });

        // Sélection de thème mobile
        const mobileThemeOptions = document.querySelectorAll('.mobile-theme-option');
        mobileThemeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const selectedTheme = option.dataset.theme;
                if (themes[selectedTheme]) {
                    this.applyTheme(selectedTheme);
                    this.updateThemeUI();
                    mobileThemeDropdown.classList.remove('active');
                }
            });
        });
    }

    getThemePrimaryColor() {
        return themes[this.currentTheme]?.variables['--primary-color'] || '#dc2626';
    }

    getThemeTextPrimaryColor() {
        return themes[this.currentTheme]?.variables['--text-primary'] || '#1e293b';
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getAllThemes() {
        return Object.keys(themes);
    }
}

// Export pour utilisation dans d'autres modules
export function getThemePrimaryColor() {
    return window.themeManager?.getThemePrimaryColor() || '#dc2626';
}

export function getThemeTextPrimaryColor() {
    return themes[window.themeManager?.getCurrentTheme()]?.variables['--text-primary'] || '#1e293b';
}       

export function getCurrentTheme() {
    return window.themeManager?.getCurrentTheme() || 'momiji';
}

export function getAllThemes() {
    return window.themeManager?.getAllThemes() || Object.keys(themes);
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Export par défaut
export default ThemeManager;
