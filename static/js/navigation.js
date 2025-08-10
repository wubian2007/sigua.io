/**
 * Navigation Manager for Sigua.io
 * Handles mobile navigation and smooth scrolling
 */

class NavigationManager {
    constructor() {
        this.navToggle = document.getElementById('nav-toggle');
        this.nav = document.getElementById('main-nav');
        this.isNavOpen = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupSmoothScrolling();
        this.setupScrollEffects();
    }

    bindEvents() {
        // Mobile navigation toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.toggleNavigation();
            });
        }

        // Close navigation when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isNavOpen && !this.nav.contains(e.target) && !this.navToggle.contains(e.target)) {
                this.closeNavigation();
            }
        });

        // Close navigation on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isNavOpen) {
                this.closeNavigation();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && this.isNavOpen) {
                this.closeNavigation();
            }
        });
    }

    /**
     * Toggle mobile navigation
     */
    toggleNavigation() {
        if (this.isNavOpen) {
            this.closeNavigation();
        } else {
            this.openNavigation();
        }
    }

    /**
     * Open mobile navigation
     */
    openNavigation() {
        this.navToggle.classList.add('active');
        this.nav.classList.remove('hidden');
        this.isNavOpen = true;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Add animation class
        this.nav.classList.add('nav--open');
    }

    /**
     * Close mobile navigation
     */
    closeNavigation() {
        this.navToggle.classList.remove('active');
        this.nav.classList.add('hidden');
        this.isNavOpen = false;
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Remove animation class
        this.nav.classList.remove('nav--open');
    }

    /**
     * Setup smooth scrolling for anchor links
     */
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = anchor.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Close mobile navigation if open
                    if (this.isNavOpen) {
                        this.closeNavigation();
                    }
                    
                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Setup scroll effects for header and elements
     */
    setupScrollEffects() {
        let lastScrollTop = 0;
        const header = document.querySelector('.header');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Header background effect
            if (header) {
                if (scrollTop > 50) {
                    header.classList.add('header--scrolled');
                } else {
                    header.classList.remove('header--scrolled');
                }
            }
            
            // Hide/show header on scroll
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                header?.classList.add('header--hidden');
            } else {
                // Scrolling up
                header?.classList.remove('header--hidden');
            }
            
            lastScrollTop = scrollTop;
        });
    }

    /**
     * Add intersection observer for animations
     */
    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.feature, .news-card').forEach(el => {
            observer.observe(el);
        });
    }
}

// Add navigation styles
const navStyles = document.createElement('style');
navStyles.textContent = `
    /* Mobile Navigation Styles */
    @media (max-width: 767px) {
        .nav {
            position: fixed;
            top: 80px;
            left: 0;
            width: 100%;
            background: rgba(23, 22, 46, 0.98);
            backdrop-filter: blur(10px);
            transform: translateX(-100%);
            transition: transform 0.3s ease-in-out;
            z-index: 99;
        }
        
        .nav--open {
            transform: translateX(0);
        }
        
        .nav__list {
            flex-direction: column;
            padding: 2rem;
            gap: 1rem;
        }
        
        .nav__link {
            display: block;
            padding: 1rem;
            border-radius: 0.5rem;
            text-align: center;
        }
    }
    
    /* Header Scroll Effects */
    .header {
        transition: all 0.3s ease-in-out;
    }
    
    .header--scrolled {
        background: rgba(23, 22, 46, 0.98);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .header--hidden {
        transform: translateY(-100%);
    }
    
    /* Animation Classes */
    .fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Accessibility Improvements */
    .nav-toggle:focus,
    .nav__link:focus {
        outline: 2px solid var(--color-accent-pink);
        outline-offset: 2px;
    }
    
    /* Reduced Motion Support */
    @media (prefers-reduced-motion: reduce) {
        .nav,
        .header,
        .fade-in-up {
            animation: none;
            transition: none;
        }
    }
`;

document.head.appendChild(navStyles);

// Initialize navigation manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NavigationManager();
});
