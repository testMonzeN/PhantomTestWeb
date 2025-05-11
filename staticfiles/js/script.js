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
    
    console.log(totalItems, visibleItems);
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

document.title = "Phantom";
document.addEventListener('DOMContentLoaded', function() {
    const baseTitle = "Phantom";
    const phrases = [
        "| Нечто большее",
        "| Скрытие читов",
        "| Welcome to Phantom",
        "| Welcome " + (typeof currentUsername !== 'undefined' ? currentUsername : '')
    ];
    
    let currentPhrase = 0;
    let currentChar = 0;
    let isDeleting = false;
    let isEnd = false;
    
    function typeTitle() {
        const phraseText = phrases[currentPhrase];
        const fullText = phraseText.substring(0, currentChar);
        
        document.title = baseTitle + " " + fullText;
        
        // печать
        if (!isDeleting && currentChar <= phraseText.length) {
            currentChar++;
            
            if (currentChar > phraseText.length) {
                isEnd = true;
                isDeleting = true;
                setTimeout(typeTitle, 1500);
                return;
            }
        }
        
        // удаление
        if (isDeleting && currentChar >= 0) {
            currentChar--;
            
            if (currentChar === 0) {
                isDeleting = false;
                currentPhrase = (currentPhrase + 1) % phrases.length;
            }
        }
        
        // скорость анимации
        const typingSpeed = isDeleting ? 50 : 200;
        const nextStep = isEnd ? 0 : typingSpeed;
        isEnd = false;
        
        setTimeout(typeTitle, nextStep);
    }
    
    typeTitle();
});

/*
// Функция для отображения уведомления о недоступности
function showFeatureUnavailable(featureName) {
    Swal.fire({
        title: 'Coming soon',
        //html: `Функция <b>${featureName}</b> временно недоступна.<br>Мы работаем над её восстановлением.`,
        html: `This feature is coming soon`,
        icon: 'info',
        confirmButtonText: 'Ok',
        
        // Стилизация под тему сайта
        confirmButtonColor: '#6e48aa',        // Фиолетовый основной 
        background: '#121212',               // Темный фон
        color: '#ffffff',                    // Белый текст
        iconColor: '#9470d7',                // Светло-фиолетовый для иконки
        
        // Дополнительные настройки
        timer: 5000,
        timerProgressBar: true,
        
        // Настройка границ и теней
        showClass: {
            popup: 'swal2-show',
            backdrop: 'swal2-backdrop-show',
            icon: 'swal2-icon-show'
        },
        customClass: {
            popup: 'phantom-notification',
            title: 'phantom-notification-title',
            confirmButton: 'phantom-btn'
        }
    });
}

// Добавьте стили для кастомных классов
//document.addEventListener('DOMContentLoaded', function() {
//    const style = document.createElement('style');
//    document.head.appendChild(style);
//});

// При клике на кнопку или ссылку, которая ведет к недоступной функции
document.addEventListener('DOMContentLoaded', function() {
    const unavailableFeatures = document.querySelectorAll('.feature-unavailable');
    
    unavailableFeatures.forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            showFeatureUnavailable(this.dataset.featureName || 'Выбранная функция');
        });
    });
});

*/

// Функция для отображения уведомления в правом нижнем углу
function showComingSoonNotification(featureName) {
    // Создаем элементы уведомления
    const notification = document.createElement('div');
    notification.className = 'phantom-notification-toast';
    
    // Иконка информации
    const infoIcon = document.createElement('div');
    infoIcon.className = 'info-icon';
    infoIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7" stroke="#6e48aa" stroke-width="2"/><path d="M8 4V8M8 12V12" stroke="#6e48aa" stroke-width="2" stroke-linecap="round"/></svg>';
    
    // Содержимое уведомления
    const content = document.createElement('div');
    content.className = 'notification-content';
    
    const title = document.createElement('div');
    title.className = 'notification-title';
    title.textContent = 'Скоро будет доступно';
    
    const message = document.createElement('div');
    message.className = 'notification-message';
    message.textContent = `Функция "${featureName}" появится в ближайшее время`;
    
    content.appendChild(title);
    content.appendChild(message);
    
    // Кнопка закрытия
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(notification);
    });
    
    // Собираем уведомление
    notification.appendChild(infoIcon);
    notification.appendChild(content);
    notification.appendChild(closeBtn);
    
    // Добавляем на страницу
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Автоматическое закрытие через 5 секунд
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}


// Инициализация для элементов с классом .feature-coming-soon
document.addEventListener('DOMContentLoaded', function() {
    const comingSoonFeatures = document.querySelectorAll('.feature-coming-soon');
    
    comingSoonFeatures.forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            showComingSoonNotification(this.dataset.featureName || 'Выбранная функция');
        });
    });
});