document.addEventListener('DOMContentLoaded', function() {
    // Language switcher dropdown
    const langSwitcher = document.querySelector('.lang-switcher');
    if (langSwitcher) {
        langSwitcher.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('open');
        });
        
        document.addEventListener('click', function() {
            langSwitcher.classList.remove('open');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // Initialize carousel if present on the page
    if (document.querySelector('.pricing-carousel')) {
        initCarousel();
    }
});

// Carousel Functionality
function initCarousel() {
    const carousel = document.querySelector('.pricing-carousel');
    const items = document.querySelectorAll('.carousel-item');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!carousel || !items.length) return;
    
    let currentIndex = 0;
    const itemWidth = items[0].offsetWidth;
    const visibleItems = Math.floor(carousel.offsetWidth / itemWidth);
    const totalItems = items.length;
    
    // Create dots
    for (let i = 0; i < totalItems - visibleItems + 1; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.dataset.index = i;
        dotsContainer.appendChild(dot);
        
        dot.addEventListener('click', function() {
            goToSlide(parseInt(this.dataset.index));
        });
    }
    
    const dots = document.querySelectorAll('.dot');
    
    // Event listeners for navigation
    prevBtn.addEventListener('click', goToPrev);
    nextBtn.addEventListener('click', goToNext);
    
    // For touch devices
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        if (touchEndX < touchStartX) {
            goToNext();
        } else if (touchEndX > touchStartX) {
            goToPrev();
        }
    }
    
    // Navigation functions
    function goToPrev() {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        }
    }
    
    function goToNext() {
        if (currentIndex < totalItems - visibleItems) {
            goToSlide(currentIndex + 1);
        }
    }
    
    function goToSlide(index) {
        if (index < 0 || index > totalItems - visibleItems) return;
        
        currentIndex = index;
        updateCarousel();
        
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }
    
    function updateCarousel() {
        const offset = -currentIndex * (itemWidth + parseInt(window.getComputedStyle(items[0]).marginRight));
        carousel.style.transform = `translateX(${offset}px)`;
    }
    
    // Responsive handling
    window.addEventListener('resize', function() {
        const newVisibleItems = Math.floor(carousel.offsetWidth / items[0].offsetWidth);
        
        if (newVisibleItems !== visibleItems) {
            // Reset carousel position
            currentIndex = 0;
            updateCarousel();
            
            // Update dots
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalItems - newVisibleItems + 1; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.dataset.index = i;
                dotsContainer.appendChild(dot);
                
                dot.addEventListener('click', function() {
                    goToSlide(parseInt(this.dataset.index));
                });
            }
        }
    });
}