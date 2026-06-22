/**
 * main.js
 * Professional minimalist interaction handler for Arief's CS portfolio.
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initActiveNavTracker();
    initContactForm();
});

/**
 * 1. Scroll-triggered reveal animations using IntersectionObserver
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Stop observing once revealed to maintain efficiency
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -100px 0px', // Triggers slightly before element enters viewport
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * 2. Active Navigation Highlight & Underline Indicator
 */
function initActiveNavTracker() {
    const nav = document.querySelector('.main-nav');
    const indicator = document.querySelector('.nav-indicator');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Set position of the orange underline indicator
    function moveIndicator(activeLink) {
        if (!activeLink || window.innerWidth <= 768) {
            if (indicator) indicator.style.opacity = '0';
            return;
        }
        
        const linkRect = activeLink.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        
        if (indicator) {
            indicator.style.left = `${linkRect.left - navRect.left}px`;
            indicator.style.width = `${linkRect.width}px`;
            indicator.style.opacity = '1';
        }
    }

    // Scroll Observer to track active section
    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -50% 0px', // Trigger when section occupies the upper-middle region
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${activeId}`) {
                        link.classList.add('active');
                        moveIndicator(link);
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // Handle viewport resize to adjust active underline alignment
    window.addEventListener('resize', () => {
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) {
            moveIndicator(activeLink);
        } else if (indicator) {
            indicator.style.opacity = '0';
        }
    });

    // If hero section is visible, hide the indicator (reset states)
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    if (indicator) indicator.style.opacity = '0';
                }
            });
        }, { root: null, rootMargin: '-10% 0px -80% 0px', threshold: 0 });
        
        heroObserver.observe(heroSection);
    }
}

/**
 * 3. Contact Form Interactivity & Simulated Submission
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    
    if (!form || !status) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const messageInput = document.getElementById('form-message');
        const submitButton = form.querySelector('.btn-submit');
        const submitText = submitButton.querySelector('span');
        
        // Visual loading state
        submitButton.disabled = true;
        const originalText = submitText.textContent;
        submitText.textContent = 'Sending...';
        
        // Simulate network API delay
        setTimeout(() => {
            submitButton.disabled = false;
            submitText.textContent = originalText;
            
            // Standard success scenario
            status.className = 'form-status success';
            status.style.display = 'block';
            status.textContent = `Thanks, ${nameInput.value}. Your message has been sent successfully.`;
            
            // Reset input values
            form.reset();
            
            // Fade out status message after 6 seconds
            setTimeout(() => {
                status.style.opacity = '0';
                status.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    status.style.display = 'none';
                    status.style.opacity = '1';
                }, 500);
            }, 6000);
            
        }, 1200);
    });
}
