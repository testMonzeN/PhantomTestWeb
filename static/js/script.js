// Добавим анимацию при наведении на карточки
document.querySelectorAll('.pricing-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-10px)';
    card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'none';
    card.style.boxShadow = 'none';
  });
});

// Показать/скрыть пароль
document.querySelectorAll('.password-toggle').forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    const input = toggle.previousElementSibling;
    const icon = toggle.querySelector('i');

    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
  });
});

// Валидация формы регистрации
document.querySelector('.auth-form')?.addEventListener('submit', (e) => {
  const password1 = document.getElementById('id_password1');
  const password2 = document.getElementById('id_password2');

  if (password1 && password2 && password1.value !== password2.value) {
    e.preventDefault();
    alert('Пароли не совпадают!');
  }
});

// Превью аватара
document.addEventListener('DOMContentLoaded', function() {
    const avatarForm = document.getElementById('avatarForm');
    const avatarUpload = document.getElementById('avatarUpload');
    const avatarPreview = document.getElementById('avatarPreview');

    // Превью при выборе файла
    if (avatarUpload) {
        avatarUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    avatarPreview.innerHTML = `
                        <img src="${event.target.result}"
                             alt="Новый аватар"
                             class="profile-avatar">
                    `;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // AJAX-отправка формы
    if (avatarForm) {
        avatarForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);

            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Обновляем аватар на странице
                    document.querySelector('.profile-avatar').src = data.avatar_url;
                    // Закрываем модальное окно
                    document.getElementById('avatarModal').style.display = 'none';
                    // Показываем уведомление
                    showNotification('Аватар успешно обновлён!');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Ошибка при обновлении аватара', 'error');
            });
        });
    }
});

// Анимация статистики при прокрутке
const statItems = document.querySelectorAll('.stat-item');

function animateStats() {
  statItems.forEach((item, index) => {
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, index * 200);
  });
}

// Запуск анимации при загрузке
window.addEventListener('load', animateStats);

// Анимация преимуществ при прокрутке
const advantageCards = document.querySelectorAll('.advantage-card');
const steps = document.querySelectorAll('.step');

function checkScroll() {
  advantageCards.forEach((card, index) => {
    const cardPosition = card.getBoundingClientRect().top;
    if (cardPosition < window.innerHeight - 100) {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 150);
    }
  });

  steps.forEach((step, index) => {
    const stepPosition = step.getBoundingClientRect().top;
    if (stepPosition < window.innerHeight - 100) {
      setTimeout(() => {
        step.style.opacity = '1';
        step.style.transform = 'scale(1)';
      }, index * 200);
    }
  });
}

// Инициализация стилей перед анимацией
advantageCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'all 0.5s ease-out';
});

steps.forEach(step => {
  step.style.opacity = '0';
  step.style.transform = 'scale(0.9)';
  step.style.transition = 'all 0.5s ease-out';
});

window.addEventListener('scroll', checkScroll);
window.addEventListener('load', checkScroll);


// Анимация кнопки скачивания
const downloadBtn = document.querySelector('.download-btn');
if (downloadBtn) {
  downloadBtn.addEventListener('mouseenter', () => {
    downloadBtn.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
  });

  downloadBtn.addEventListener('mouseleave', () => {
    downloadBtn.style.boxShadow = 'none';
  });
}


document.addEventListener('DOMContentLoaded', function() {
  // Эффект параллакса для карточек
  const memberCards = document.querySelectorAll('.member-card');
  
  memberCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
          const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
          const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
          card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
      });

      card.addEventListener('mouseenter', () => {
          card.style.transition = 'none';
      });

      card.addEventListener('mouseleave', () => {
          card.style.transition = 'transform 0.5s ease';
          card.style.transform = 'rotateY(0deg) rotateX(0deg)';
      });
  });

  // Анимация социальных иконок
  const socialLinks = document.querySelectorAll('.social-link');
  
  socialLinks.forEach(link => {
      link.addEventListener('mouseover', () => {
          const icon = link.querySelector('i');
          icon.style.transform = 'scale(1.2)';
      });
      
      link.addEventListener('mouseout', () => {
          const icon = link.querySelector('i');
          icon.style.transform = 'scale(1)';
      });
  });
});


document.addEventListener('DOMContentLoaded', function() {
  // Анимация при наведении на аватар
  const avatar = document.querySelector('.avatar-placeholder-large');
  if (avatar) {
      avatar.addEventListener('mouseenter', () => {
          avatar.style.transform = 'scale(1.05)';
          avatar.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.5)';
      });
      
      avatar.addEventListener('mouseleave', () => {
          avatar.style.transform = 'scale(1)';
          avatar.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.4)';
      });
  }

  // Эффект при клике на социальные ссылки
  const socialLinks = document.querySelectorAll('.social-link-large');
  socialLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          // Можно добавить аналитику или другие действия
          console.log(`Переход на ${this.getAttribute('data-platform')}`);
      });
  });

  // Плавный скролл для всей страницы
  document.body.style.scrollBehavior = 'smooth';
});



document.addEventListener('DOMContentLoaded', function() {
  console.log('111111111111111111111');
    // Анимация заголовка
    const title = document.getElementById('typing-title');
    const titleText = title.textContent;
    title.textContent = '';
    
    let i = 0;
    const titleInterval = setInterval(function() {
        if (i < titleText.length) {
            title.textContent += titleText.charAt(i);
            i++;
        } else {
            clearInterval(titleInterval);
            title.style.borderRight = 'none';
        }
    }, 100);
    
    // Анимация для всех элементов с классом typing-text
    const typingElements = document.querySelectorAll('.typing-text');
    
    typingElements.forEach(element => {
        const originalText = element.getAttribute('data-text');
        element.innerHTML = '';
        element.style.width = '0';
        
        // Рассчитываем задержку для каждого элемента
        const delay = Array.from(typingElements).indexOf(element) * 500 + 1500;
        
        setTimeout(() => {
            let i = 0;
            const typingInterval = setInterval(function() {
                if (i < originalText.length) {
                    // Для обработки HTML-тегов в тексте
                    if (originalText.charAt(i) === '<') {
                        const tagEnd = originalText.indexOf('>', i);
                        if (tagEnd !== -1) {
                            element.innerHTML += originalText.substring(i, tagEnd + 1);
                            i = tagEnd + 1;
                        }
                    } else {
                        element.innerHTML += originalText.charAt(i);
                        i++;
                    }
                    
                    // Прокрутка вниз для длинных текстов
                    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    clearInterval(typingInterval);
                    element.style.borderRight = 'none';
                }
            }, 20);
        }, delay);
    });
});

