document.addEventListener('DOMContentLoaded', function() {
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
    
    if (document.querySelector('.pricing-carousel')) {
        initCarousel();
    }

    // Эффекты для кнопок в форме изменения данных
    if (document.querySelector('.change-form-container')) {
        initChangeFormEffects();
    }
});

function initChangeFormEffects() {
    const buttons = document.querySelectorAll('.change-form-container .btn');
    
    buttons.forEach(button => {
        // Эффект нажатия
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(2px)';
            this.style.boxShadow = '0 2px 5px rgba(110, 72, 170, 0.3)';
        });
        
        // Возврат к эффекту hover после отжатия
        button.addEventListener('mouseup', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
        
        // Отмена эффекта при выходе курсора за пределы кнопки
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Проверка изменений формы и активация кнопки сохранения
    const form = document.querySelector('.change-form-container form');
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Сохраняем изначальные значения полей
        let initialValues = {};
        inputs.forEach(input => {
            initialValues[input.name] = input.value;
        });
        
        // Отслеживание изменений
        inputs.forEach(input => {
            input.addEventListener('input', checkFormChanges);
        });
        
        function checkFormChanges() {
            let hasChanges = false;
            
            inputs.forEach(input => {
                if (input.value !== initialValues[input.name]) {
                    hasChanges = true;
                }
            });
            
            if (hasChanges) {
                submitBtn.classList.add('btn-pulse');
            } else {
                submitBtn.classList.remove('btn-pulse');
            }
        }
    }
}

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
    
    prevBtn.addEventListener('click', goToPrev);
    nextBtn.addEventListener('click', goToNext);
    
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
    
    window.addEventListener('resize', function() {
        const newVisibleItems = Math.floor(carousel.offsetWidth / items[0].offsetWidth);
        
        if (newVisibleItems !== visibleItems) {
            currentIndex = 0;
            updateCarousel();
            
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