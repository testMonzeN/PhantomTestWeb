document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navigation = document.querySelector('.navigation');
    
    if (menuToggle && navigation) {
        menuToggle.addEventListener('click', function(event) {
            event.stopPropagation(); // Предотвращаем всплытие события
            navigation.classList.toggle('mobile-active');
            menuToggle.classList.toggle('active');
        });
        
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navigation.classList.remove('mobile-active');
                    menuToggle.classList.remove('active');
                }
            });
        });
        
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = navigation.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnToggle && navigation.classList.contains('mobile-active')) {
                navigation.classList.remove('mobile-active');
                menuToggle.classList.remove('active');
            }
        });
    }
    
    const langSwitcher = document.querySelector('.lang-switcher');
    if (langSwitcher) {
        // Toggle language menu on click
        langSwitcher.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('open');
            
            // Выпадающее меню с языками
            /*
            const langMenu = document.querySelector('.language-dropdown');
            if (!langMenu) {
                const dropdown = document.createElement('div');
                dropdown.className = 'language-dropdown';
                dropdown.innerHTML = `
                    <div class="lang-option" data-lang="en">English</div>
                    <div class="lang-option" data-lang="ru">Русский</div>
                `;
                this.appendChild(dropdown);
                
                dropdown.querySelectorAll('.lang-option').forEach(option => {
                    option.addEventListener('click', function(e) {
                        e.stopPropagation();
                        langSwitcher.textContent = this.dataset.lang.toUpperCase();
                        langSwitcher.classList.remove('open');
                        // Код смены языка
                    });
                });
            }
            */
        });
        
        // Close language menu when clicking outside
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

    if (document.querySelector('.change-form-container')) {
        initChangeFormEffects();
    }
});

function initChangeFormEffects() {
    const buttons = document.querySelectorAll('.change-form-container .btn');
    
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(2px)';
            this.style.boxShadow = '0 2px 5px rgba(110, 72, 170, 0.3)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    const form = document.querySelector('.change-form-container form');
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        let initialValues = {};
        inputs.forEach(input => {
            initialValues[input.name] = input.value;
        });
        
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
        "| Welcome " + currentUsername,
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


// Уведомление info
function showComingSoonNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'phantom-notification';
    
    notification.innerHTML = `
        <div class="info-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7.5" stroke="#6e48aa"/>
                <text x="8" y="12" text-anchor="middle" fill="#6e48aa" style="font-size: 12px; font-weight: bold;">i</text>
            </svg>
        </div>
        <div class="notification-content">
            <div class="notification-title">Coming soon</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Добавляем уведомление
    document.body.appendChild(notification);
    
    // Закрытия
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.classList.add('hiding');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    });
    
    setTimeout(() => {
        notification.classList.add('hiding');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 2000);
    
    setTimeout(() => {
        notification.classList.add('visible');
    }, 10);
}

// Стили
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    const message = document.querySelector('.feature-coming-soon').getAttribute('message');
    document.head.appendChild(style);
    
    document.querySelectorAll('.feature-coming-soon').forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            showComingSoonNotification(message);
        });
    });
});




// Уведомление error
function showErrorNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'phantom-notification';
    
    notification.innerHTML = `
        <div class="error-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7.5" stroke="#6e48aa"/>
                <text x="8" y="12" text-anchor="middle" fill="#6e48aa" style="font-size: 12px; font-weight: bold;">i</text>
            </svg>
        </div>
        <div class="notification-content">
            <div class="notification-title">Attempt failed</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Добавляем уведомление
    document.body.appendChild(notification);
    
    // Закрытия
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.classList.add('hiding');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    });
    
    setTimeout(() => {
        notification.classList.add('hiding');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 2000);
    
    setTimeout(() => {
        notification.classList.add('visible');
    }, 10);
}

// Стили
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    document.head.appendChild(style);
    
    document.querySelectorAll('.feature-error-notification').forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            showErrorNotification();
        });
    });
});



// Уведомление success
function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'phantom-notification';
    
    notification.innerHTML = `
        <div class="success-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7.5" stroke="#6e48aa"/>
                <text x="8" y="12" text-anchor="middle" fill="#6e48aa" style="font-size: 12px; font-weight: bold;">i</text>
            </svg>
        </div>
        <div class="notification-content">
            <div class="notification-title">Success</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Добавляем уведомление
    document.body.appendChild(notification);
    
    // Закрытия
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.classList.add('hiding');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    });
    
    setTimeout(() => {
        notification.classList.add('hiding');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 2000);
    
    setTimeout(() => {
        notification.classList.add('visible');
    }, 10);
}

// Стили
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    document.head.appendChild(style);
    
    document.querySelectorAll('.feature-success-notification').forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            showSuccessNotification();
        });
    });
});



// Скрипт для отслеживания активного раздела при прокрутке
document.addEventListener('DOMContentLoaded', function() {
    // Получаем все заголовки разделов
    const sections = document.querySelectorAll('.papers-content h2');
    const navLinks = document.querySelectorAll('.papers-nav a');
    
    // Функция для определения активного раздела при прокрутке
    function onScroll() {
        const scrollPosition = window.scrollY;
        
        // Проверяем положение каждого раздела
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop) {
                // Удаляем класс active у всех ссылок
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Добавляем класс active к текущей активной ссылке
                const activeLink = document.querySelector(`.papers-nav a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Слушаем событие прокрутки
    window.addEventListener('scroll', onScroll);
    
    // Вызываем функцию при загрузке страницы
    onScroll();
});

// Удаление сообщения активации ключа
document.addEventListener('DOMContentLoaded', function() {
    const activationMessage = document.querySelector('.activation-message');
    if (activationMessage) {
        setTimeout(function() {
            activationMessage.style.opacity = '0';
            setTimeout(function() {
                activationMessage.remove();
            }, 300);
        }, 2000);
    }
});