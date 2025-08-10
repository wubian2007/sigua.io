/**
 * Single Page Application Manager for Sigua.io
 * Handles page navigation and content switching
 */

class SPAManager {
    constructor() {
        this.currentSection = 'home';
        this.sections = ['home', 'features', 'faq', 'download'];
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupFAQ();
        this.handleInitialRoute();
    }

    bindEvents() {
        // Navigation links
        document.querySelectorAll('.nav__link[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.section) {
                this.showSection(e.state.section, false);
            }
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                const targetId = href.substring(1);
                if (this.sections.includes(targetId)) {
                    e.preventDefault();
                    this.navigateToSection(targetId);
                }
            });
        });
    }

    /**
     * Navigate to a specific section
     * @param {string} section - Section ID
     */
    navigateToSection(section) {
        if (this.sections.includes(section)) {
            this.showSection(section);
            this.updateURL(section);
            this.updateActiveNav(section);
        }
    }

    /**
     * Show a specific section
     * @param {string} section - Section ID
     * @param {boolean} animate - Whether to animate the transition
     */
    showSection(section, animate = true) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(s => {
            s.classList.remove('section--active');
            if (animate) {
                s.style.opacity = '0';
                s.style.transform = 'translateY(20px)';
            }
        });

        // Show target section
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.classList.add('section--active');
            if (animate) {
                setTimeout(() => {
                    targetSection.style.opacity = '1';
                    targetSection.style.transform = 'translateY(0)';
                }, 100);
            } else {
                targetSection.style.opacity = '1';
                targetSection.style.transform = 'translateY(0)';
            }
        }

        this.currentSection = section;
    }

    /**
     * Update URL without page reload
     * @param {string} section - Section ID
     */
    updateURL(section) {
        const url = new URL(window.location);
        url.hash = `#${section}`;
        window.history.pushState({ section }, '', url);
    }

    /**
     * Update active navigation link
     * @param {string} section - Section ID
     */
    updateActiveNav(section) {
        document.querySelectorAll('.nav__link').forEach(link => {
            link.classList.remove('nav__link--active');
        });
        
        const activeLink = document.querySelector(`[data-section="${section}"]`);
        if (activeLink) {
            activeLink.classList.add('nav__link--active');
        }
    }

    /**
     * Handle initial route on page load
     */
    handleInitialRoute() {
        const hash = window.location.hash.substring(1);
        if (hash && this.sections.includes(hash)) {
            this.showSection(hash, false);
            this.updateActiveNav(hash);
        } else {
            this.updateActiveNav('home');
        }
    }

    /**
     * Setup FAQ accordion functionality
     */
    setupFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-item__question');
            const answer = item.querySelector('.faq-item__answer');
            
            if (question && answer) {
                question.addEventListener('click', () => {
                    const isOpen = item.classList.contains('faq-item--open');
                    
                    // Close all other items
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('faq-item--open');
                        const otherAnswer = otherItem.querySelector('.faq-item__answer');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = '0';
                        }
                    });
                    
                    // Toggle current item
                    if (!isOpen) {
                        item.classList.add('faq-item--open');
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    }
                });
            }
        });
    }

    /**
     * Add scroll animations
     */
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.feature, .faq-item, .download-option').forEach(el => {
            observer.observe(el);
        });
    }
}

// Add SPA styles
const spaStyles = document.createElement('style');
spaStyles.textContent = `
    /* Section Management */
    .section {
        display: none;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    .section--active {
        display: block;
    }
    
    /* Navigation Active State */
    .nav__link--active {
        background: var(--gradient-hover);
        box-shadow: var(--shadow-glow);
    }
    
    /* FAQ Accordion */
    .faq-item__question {
        cursor: pointer;
        padding: 1rem;
        background: var(--color-secondary);
        border-radius: var(--radius-md);
        margin-bottom: 0.5rem;
        transition: all var(--transition-normal);
        position: relative;
    }
    
    .faq-item__question:hover {
        background: var(--color-surface);
    }
    
    .faq-item__question::after {
        content: '+';
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        font-size: 1.5rem;
        transition: transform var(--transition-normal);
    }
    
    .faq-item--open .faq-item__question::after {
        transform: translateY(-50%) rotate(45deg);
    }
    
    .faq-item__answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
        padding: 0 1rem;
    }
    
    .faq-item__answer p {
        margin: 0;
        padding: 1rem 0;
        color: var(--color-text-secondary);
    }
    
    /* FAQ Grid */
    .faq__grid {
        display: grid;
        gap: var(--spacing-lg);
        max-width: 800px;
        margin: 0 auto;
    }
    
    /* Download Section */
    .download-section {
        padding: var(--spacing-2xl) 0;
    }
    
    .section__title {
        font-size: var(--font-size-3xl);
        font-weight: 700;
        text-align: center;
        margin-bottom: var(--spacing-md);
    }
    
    .section__subtitle {
        text-align: center;
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-xl);
    }
    
    .download-section__grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--spacing-lg);
        max-width: 1000px;
        margin: 0 auto;
    }
    
    @media (min-width: 768px) {
        .download-section__grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }
    
    .download-option {
        background: var(--color-secondary);
        padding: var(--spacing-lg);
        border-radius: var(--radius-lg);
        text-align: center;
        transition: all var(--transition-normal);
    }
    
    .download-option:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
    }
    
    .download-option__icon {
        width: 64px;
        height: 64px;
        margin: 0 auto var(--spacing-md);
        background: var(--gradient-primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .download-option__svg {
        width: 32px;
        height: 32px;
        color: white;
    }
    
    .download-option__title {
        font-size: var(--font-size-xl);
        font-weight: 700;
        margin-bottom: var(--spacing-sm);
    }
    
    .download-option__description {
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-lg);
        line-height: 1.6;
    }
    
    .download-option__btn {
        display: inline-block;
        background: var(--gradient-primary);
        color: white;
        padding: var(--spacing-sm) var(--spacing-lg);
        border-radius: var(--radius-full);
        text-decoration: none;
        font-weight: 600;
        transition: all var(--transition-normal);
    }
    
    .download-option__btn:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
        color: white;
        text-decoration: none;
    }
    
    .download-option__qr {
        margin-top: var(--spacing-md);
    }
    
    .download-option__qr-img {
        width: 120px;
        height: 120px;
        margin: 0 auto;
    }
    
    /* Animation Classes */
    .animate-in {
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
    
    /* Responsive Design */
    @media (max-width: 767px) {
        .faq__grid {
            grid-template-columns: 1fr;
        }
        
        .download-section__grid {
            grid-template-columns: 1fr;
        }
    }
`;

document.head.appendChild(spaStyles);

// Initialize SPA manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SPAManager();
});
