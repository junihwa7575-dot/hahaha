document.addEventListener('DOMContentLoaded', () => {
    
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a small delay based on index for stagger effect
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        observer.observe(card);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Code Window Hover Effect (3D Parallax)
    const codeWindow = document.querySelector('.code-window');
    const heroVisual = document.querySelector('.hero-visual');

    if (codeWindow && heroVisual) {
        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            codeWindow.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        heroVisual.addEventListener('mouseleave', () => {
            codeWindow.style.transform = `rotateX(5deg) rotateY(-5deg)`;
        });
    }

    // Input animation simulation
    const generateBtn = document.querySelector('.cta-section .btn-primary');
    const inputField = document.querySelector('.cta-section input');

    if (generateBtn && inputField) {
        generateBtn.addEventListener('click', () => {
            if(inputField.value.trim() !== '') {
                const originalText = generateBtn.innerHTML;
                generateBtn.innerHTML = 'Generating... ✨';
                generateBtn.style.opacity = '0.8';
                
                setTimeout(() => {
                    generateBtn.innerHTML = 'Complete! 🎉';
                    generateBtn.style.background = '#27c93f';
                    
                    setTimeout(() => {
                        generateBtn.innerHTML = originalText;
                        generateBtn.style.background = '';
                        generateBtn.style.opacity = '1';
                        inputField.value = '';
                    }, 2000);
                }, 1500);
            } else {
                inputField.focus();
                inputField.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    inputField.style.animation = '';
                }, 500);
            }
        });
    }

    // Add keyframe animation for shake programmatically
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); border-color: #ff5f56; }
            75% { transform: translateX(5px); border-color: #ff5f56; }
        }
    `;
    document.head.appendChild(style);
});
