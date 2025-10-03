// Breezio particle animation
document.addEventListener('DOMContentLoaded', function() {
    const introContainer = document.querySelector('.intro-container');
    const particlesContainer = document.querySelector('.particles-container');
    const navbar = document.querySelector('.navbar');
    const mainContent = document.querySelector('.main-content');
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    // Set initial body state
    document.body.classList.add('intro-active');
    
    // Particle colors
    const colors = ['blue', 'green', 'yellow', 'pink', 'purple'];
    
    // Create particles from all directions
    function createParticles() {
        const particleCount = 25; // Total number of particles
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = `particle ${colors[Math.floor(Math.random() * colors.length)]}`;
            
            // Random size between 4px and 12px
            const size = Math.random() * 8 + 4;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Position particles around the edges of the screen
            const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
            let startX, startY;
            
            switch(edge) {
                case 0: // Top edge
                    startX = Math.random() * 100;
                    startY = -5;
                    break;
                case 1: // Right edge
                    startX = 105;
                    startY = Math.random() * 100;
                    break;
                case 2: // Bottom edge
                    startX = Math.random() * 100;
                    startY = 105;
                    break;
                case 3: // Left edge
                    startX = -5;
                    startY = Math.random() * 100;
                    break;
            }
            
            particle.style.left = startX + '%';
            particle.style.top = startY + '%';
            
            // Random animation delay for staggered effect
            const delay = Math.random() * 0.8;
            particle.style.animationDelay = delay + 's';
            
            particlesContainer.appendChild(particle);
        }
    }
    
    // Initialize the animation
    function initAnimation() {
        // Create particles
        createParticles();
        
        // Start fade out after 3 seconds
        setTimeout(() => {
            introContainer.classList.add('fade-out');
        }, 3000);
        
        // Complete animation and clean up after fade out
        setTimeout(() => {
            completeAnimation();
        }, 3800);
    }
    
    // Complete the animation sequence
    function completeAnimation() {
        // Update body state
        document.body.classList.remove('intro-active');
        document.body.classList.add('intro-complete');
        
        // Show navbar with animation
        setTimeout(() => {
            navbar.classList.add('show');
        }, 200);
        
        // Show main content with animation
        setTimeout(() => {
            mainContent.classList.add('show');
        }, 600);
        
        // Hide intro container after navbar appears
        setTimeout(() => {
            introContainer.style.display = 'none';
        }, 800);
        
        // Emit custom event for integration with other parts of the app
        const animationCompleteEvent = new CustomEvent('breezioAnimationComplete', {
            detail: { duration: 3800 }
        });
        document.dispatchEvent(animationCompleteEvent);
    }
    
    // Handle visibility change (pause/resume animations when tab is not visible)
    document.addEventListener('visibilitychange', function() {
        const particles = document.querySelectorAll('.particle');
        const centerBurst = document.querySelector('.center-burst');
        const breezioText = document.querySelector('.breezio-text');
        
        if (document.hidden) {
            // Pause animations when tab is not visible
            particles.forEach(p => p.style.animationPlayState = 'paused');
            if (centerBurst) centerBurst.style.animationPlayState = 'paused';
            if (breezioText) breezioText.style.animationPlayState = 'paused';
        } else {
            // Resume animations when tab becomes visible
            particles.forEach(p => p.style.animationPlayState = 'running');
            if (centerBurst) centerBurst.style.animationPlayState = 'running';
            if (breezioText) breezioText.style.animationPlayState = 'running';
        }
    });
    
    // Mobile navbar toggle functionality
    function setupMobileNavbar() {
        navbarToggle.addEventListener('click', function() {
            navbarToggle.classList.toggle('active');
            navbarMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navbarLinks = document.querySelectorAll('.navbar-link');
        navbarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                navbarToggle.classList.remove('active');
                navbarMenu.classList.remove('active');
                
                // Smooth scroll to section
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navbar.contains(event.target)) {
                navbarToggle.classList.remove('active');
                navbarMenu.classList.remove('active');
            }
        });
    }
    
    // Smooth scrolling for all navigation links
    function setupSmoothScrolling() {
        const allLinks = document.querySelectorAll('a[href^="#"]');
        allLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for navbar height
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Intersection Observer for animations
    function setupScrollAnimations() {
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
        
        // Observe feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `all 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
        
        // Observe method items
        const methodItems = document.querySelectorAll('.method-item');
        methodItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            item.style.transition = `all 0.6s ease ${index * 0.2}s`;
            observer.observe(item);
        });
    }
    
    // Navbar background on scroll
    function setupNavbarScroll() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar.style.background = 'rgba(5, 5, 15, 0.98)';
                navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
            } else {
                navbar.style.background = 'rgba(5, 5, 15, 0.95)';
                navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
            }
            
            // Hide/show navbar on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }
    
    // Custom cursor functionality
    function setupCustomCursor() {
        // Create custom cursor elements
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
        
        // Create cursor trail
        const trailElements = [];
        for (let i = 0; i < 10; i++) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.opacity = (10 - i) / 10;
            trail.style.transform = `scale(${(10 - i) / 10})`;
            document.body.appendChild(trail);
            trailElements.push(trail);
        }
        
        let mouseX = 0, mouseY = 0;
        let trailX = [], trailY = [];
        
        // Initialize trail positions
        for (let i = 0; i < 10; i++) {
            trailX[i] = 0;
            trailY[i] = 0;
        }
        
        // Mouse move handler
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Update cursor position
            cursor.style.left = mouseX - 10 + 'px';
            cursor.style.top = mouseY - 10 + 'px';
        });
        
        // Animate trail
        function animateTrail() {
            trailX[0] = mouseX;
            trailY[0] = mouseY;
            
            for (let i = 1; i < trailElements.length; i++) {
                trailX[i] += (trailX[i - 1] - trailX[i]) * 0.3;
                trailY[i] += (trailY[i - 1] - trailY[i]) * 0.3;
                
                trailElements[i].style.left = trailX[i] - 3 + 'px';
                trailElements[i].style.top = trailY[i] - 3 + 'px';
            }
            
            requestAnimationFrame(animateTrail);
        }
        animateTrail();
        
        // Hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .feature-card, .method-item, .navbar-link, .cta-button, .primary-button, .secondary-button');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }
    
    // Card hover effects with mouse tracking
    function setupCardHoverEffects() {
        const featureCards = document.querySelectorAll('.feature-card');
        const methodItems = document.querySelectorAll('.method-item');
        
        // Feature cards mouse tracking
        featureCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                card.style.setProperty('--mouse-x', x + '%');
                card.style.setProperty('--mouse-y', y + '%');
                
                // 3D tilt effect
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const rotateX = (e.clientY - centerY) / 10;
                const rotateY = (centerX - e.clientX) / 10;
                
                card.style.transform = `translateY(-15px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.setProperty('--mouse-x', '50%');
                card.style.setProperty('--mouse-y', '50%');
            });
        });
        
        // Method items mouse tracking
        methodItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                item.style.setProperty('--mouse-x', x + '%');
                item.style.setProperty('--mouse-y', y + '%');
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.setProperty('--mouse-x', '50%');
                item.style.setProperty('--mouse-y', '50%');
            });
        });
    }
    
    // Magnetic button effects
    function setupMagneticEffects() {
        const magneticElements = document.querySelectorAll('.primary-button, .secondary-button, .cta-button');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = (e.clientX - centerX) * 0.2;
                const deltaY = (e.clientY - centerY) * 0.2;
                
                element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
            });
        });
    }
    
    // Accessibility: Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Simplified animation for users who prefer reduced motion
        const breezioText = document.querySelector('.breezio-text');
        breezioText.style.opacity = '1';
        breezioText.style.animation = 'fadeInTextSimple 1s ease-out 0.5s forwards';
        
        // Skip particle creation and show navbar immediately
        setTimeout(() => {
            completeAnimation();
        }, 2000);
        return;
    }
    
    // Initialize the animation
    initAnimation();
    
    // Setup all interactive features
    setupMobileNavbar();
    setupSmoothScrolling();
    setupScrollAnimations();
    setupNavbarScroll();
    setupCustomCursor();
    setupCardHoverEffects();
    setupMagneticEffects();
    
    // Export for potential external control
    window.BreezioAnimation = {
        restart: initAnimation,
        complete: completeAnimation
    };
});

// Performance optimization
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        console.log('Breezio animation resources ready');
    });
}