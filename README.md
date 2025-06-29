# 📦 Phantom Web App

![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![API](https://img.shields.io/badge/API-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

## 📝 Описание

Phantom — это современное веб-приложение на Django с REST API и полноценным веб-интерфейсом. Включает систему пользователей с подписками, 2FA аутентификацией, лицензионными ключами и готовую конфигурацию для развертывания через Docker.

---

## ⚙️ Технологии

| Компонент               | Технология                      |
|-------------------------|---------------------------------|
| Backend                 | Django 4.x                      |
| API                     | Django REST Framework           |
| База данных             | SQLite (для разработки)         |
| Веб-сервер              | Nginx                           |
| Контейнеризация         | Docker + Docker Compose         |
| 2FA                     | pyotp + qrcode                  |
| Социальная аутентификация | django-allauth                |
| Фронтенд                | Django Templates + Bootstrap    |

---

## 🎯 Основные возможности

### 🔐 Система пользователей
- **Кастомная модель пользователя** с расширенными полями
- **Роли пользователей** с цветовой индикацией
- **Система подписок** с автоматическим отслеживанием окончания
- **Лицензионные ключи** для активации подписок
- **2FA аутентификация** с QR-кодами
- **Социальная аутентификация** (Google, GitHub)

### 💻 HWID система
- **Привязка к железу** - один пользователь, одно устройство
- **Автоматическая проверка** активной подписки для привязки
- **API для PC-приложений** с проверкой HWID

### 📊 Веб-интерфейс
- **Личный кабинет** с полной информацией о пользователе
- **Активация ключей** через веб-интерфейс
- **Настройка 2FA** с генерацией QR-кодов
- **Скачивание файлов** (лаунчер/билдер) для подписчиков
- **Главная страница** с описанием функций и ценами

### 📱 REST API
- **Полноценный API** для внешних приложений
- **Аутентификация** с поддержкой 2FA
- **HWID management** для PC-клиентов
- **JSON ответы** для интеграции

---

## 📂 Структура проекта

```bash
deploy-site/
├── docker-compose.yml           # Конфигурация Docker
├── nginx.conf                   # Настройки Nginx
├── Phantom/                     # Основной проект Django
│   ├── API/                     # REST API приложение
│   │   ├── views.py             # API endpoints (UserViewSet)
│   │   ├── urls.py              # API маршрутизация
│   │   └── serializers         # В views.py (UserSerializer, CabinetSerializer)
│   ├── cabinet/                 # Пользовательский кабинет
│   │   ├── models.py            # User, Role, SubscriptionType, LicenseKey
│   │   ├── forms.py             # Формы регистрации, входа, 2FA
│   │   ├── views.py             # Веб-интерфейс кабинета
│   │   ├── urls.py              # Маршруты кабинета
│   │   └── templates/           # HTML шаблоны
│   │       ├── account/         # Личный кабинет, смена пароля
│   │       ├── login/           # Страница входа
│   │       ├── registration/    # Регистрация
│   │       └── 2-fa/           # 2FA аутентификация
│   ├── home/                    # Главная страница сайта
│   │   ├── views.py             # Главная, фичи, цены, контакты
│   │   ├── urls.py              # Маршрутизация главной
│   │   └── templates/           
│   │       ├── home/            # Главная страница
│   │       ├── global/          # Базовые шаблоны
│   │       └── papers/          # Юридические документы
│   ├── logs/                    # Система логирования
│   │   ├── models.py            # UserLoginHistory
│   │   └── views.py             # Функции логирования
│   ├── Phantom/                 # Настройки Django
│   │   ├── settings.py          # Конфигурация проекта
│   │   ├── urls.py              # Главная маршрутизация
│   │   └── wsgi.py              # WSGI конфигурация
│   ├── requirements.txt         # Python зависимости
│   ├── manage.py                # Django CLI
│   ├── Dockerfile               # Конфигурация Docker образа
│   ├── static/                  # Статические файлы CSS/JS/Images
│   ├── media/                   # Загружаемые файлы
│   ├── db.sqlite3               # База данных (dev)
│   └── YOUR_File.txt            # Файл для скачивания (лаунчер)
```

---

## 🚀 Быстрый старт

### Вариант 1: Развертывание через Docker (рекомендуется)
```bash
# Клонируем репозиторий
git clone <repository_url>
cd deploy-site

# Запускаем контейнеры
docker-compose up --build
```
**Приложение будет доступно:** [http://localhost](http://localhost)

### Вариант 2: Локальная разработка
```bash
cd Phantom/

# Создаем виртуальное окружение
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate     # Windows

# Устанавливаем зависимости
pip install -r requirements.txt

# Выполняем миграции
python manage.py migrate

# Создаем суперпользователя
python manage.py createsuperuser

# Запускаем сервер
python manage.py runserver
```
**Доступно на:** [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 🌐 Веб-интерфейс

### 📋 Основные страницы
- **`/`** - Главная страница с описанием
- **`/cabinet/`** - Личный кабинет пользователя
- **`/cabinet/register/`** - Регистрация нового пользователя
- **`/cabinet/login/`** - Вход в систему
- **`/cabinet/authentication/`** - Настройка 2FA
- **`/admin/`** - Панель администратора Django

### 🔑 Функционал кабинета
- **Просмотр информации** о подписке и роли
- **Активация лицензионных ключей** через форму
- **Настройка 2FA** с генерацией QR-кода
- **Смена пароля** с подтверждением
- **Скачивание файлов** (только для подписчиков)
- **Отображение статуса** (Developer/Premium/Default User)

---

## 🔌 REST API

**Базовый URL:** `http://your-domain/api/users/`

### 🔐 Аутентификация
Все API методы (кроме `new_user`) требуют передачи `username` и `password` в теле запроса.
Для пользователей с включенной 2FA также требуется поле `2fa-code`.

### 📚 API Методы

#### 📖 GET Методы

**1. Список всех доступных методов**
```http
GET /api/users/
Content-Type: application/json

{
    "metod": "all_metods"
}
```
**Ответ:**
```json
{
    "metods": [
        "get_into",
        "get_hwid", 
        "get_field_user",
        "new_user",
        "change_password",
        "HWID"
    ]
}
```

**2. Получение данных пользователя**
```http
GET /api/users/
Content-Type: application/json

{
    "metod": "get_into",
    "name": "username",
    "password": "password"
}
```
**Ответ:**
```json
{
    "id": 1,
    "username": "testuser",
    "is_subscribed": true,
    "HWID": "ABC123-XYZ456"
}
```

**3. Аутентификация пользователя**
```http
GET /api/users/
Content-Type: application/json

{
    "metod": "login",
    "name": "username", 
    "password": "password",
    "2fa-code": "123456"  // Если включена 2FA
}
```
**Ответ (успех):**
```json
{
    "id": 1,
    "username": "testuser",
    "role_user": 2,
    "email": "test@example.com",
    "HWID": "ABC123-XYZ456",
    "is_subscribed": true,
    "mfa_enabled": true,
    "subscription_end_date": "2024-12-31T23:59:59Z",
    "registration_date": "2024-01-01T00:00:00Z"
}
```

**4. Получение HWID пользователя**
```http
GET /api/users/
Content-Type: application/json

{
    "metod": "get_hwid",
    "name": "username"
}
```

#### ✉️ POST Методы

**1. Регистрация нового пользователя**
```http
POST /api/users/
Content-Type: application/json

{
    "metod": "new_user",
    "username": "newuser",
    "password1": "securepass123",
    "password2": "securepass123", 
    "email": "user@example.com"
}
```

**2. Привязка HWID**
```http
POST /api/users/
Content-Type: application/json

{
    "metod": "HWID",
    "name": "username",
    "password": "password",
    "HWID": "PC123-456-HARDWARE-ID"
}
```
**Ответы:**
```json
{"HWID": "PC123-456-HARDWARE-ID"}  // 200 - успешная привязка
{"HWID": "existing_hwid"}          // 403 - уже есть HWID или нет подписки  
{"HWID": null}                     // 404 - неверные данные
```

**3. Смена пароля**
```http
POST /api/users/
Content-Type: application/json

{
    "metod": "change_password",
    "username": "existing_user",
    "old_password": "oldpass123",
    "new_password1": "newpass456",
    "new_password2": "newpass456"
}
```

---

## 🔧 Администрирование

### 👤 Создание ролей и типов подписок
```python
# Создание ролей через Django shell
python manage.py shell

from cabinet.models import Role, SubscriptionType

# Создание ролей
Role.objects.create(name="Default", color="#808080")
Role.objects.create(name="Premium", color="#FFD700") 
Role.objects.create(name="Developer", color="#FF0000")

# Создание типов подписок
SubscriptionType.objects.create(
    name="Месячная подписка",
    price=500.00,
    duration=30
)
```

### 🗝️ Создание лицензионных ключей
```python
from cabinet.models import LicenseKey, Role, SubscriptionType

# Создание ключа на 30 дней с Premium ролью
premium_role = Role.objects.get(name="Premium")
monthly_sub = SubscriptionType.objects.get(name="Месячная подписка")

LicenseKey.objects.create(
    duration_days=30,
    role=premium_role,
    subscription_type=monthly_sub
)
```

### 📊 Полезные команды
```bash
# Создание суперпользователя
python manage.py createsuperuser

# Миграции базы данных  
python manage.py makemigrations
python manage.py migrate

# Сбор статических файлов
python manage.py collectstatic --noinput

# Запуск тестов
python manage.py test
```

---

## ⚠️ Важные особенности

### 🔐 Безопасность
- **Хеширование паролей** Django
- **2FA аутентификация** с временными кодами
- **HWID привязка** для предотвращения мультиаккаунтинга
- **Социальная аутентификация** через OAuth2

### 🎫 Система лицензий
- **Одноразовые ключи** с автоматической деактивацией
- **Гибкая длительность** подписок
- **Автоматическое продление** при активации нескольких ключей
- **Привязка ролей** к лицензионным ключам

### 💾 База данных
- **SQLite** для разработки
- **Готовность к миграции** на PostgreSQL/MySQL
- **Автоматические миграции** при изменении моделей

### 🐳 Docker конфигурация
- **Nginx reverse proxy** для статических файлов
- **Volume mapping** для persistent данных
- **Готовая prod конфигурация**

---

## 🚨 Production замечания

1. **Измените SECRET_KEY** в `settings.py`
2. **Отключите DEBUG** в production
3. **Настройте ALLOWED_HOSTS** для вашего домена
4. **Используйте PostgreSQL** вместо SQLite
5. **Настройте HTTPS** в nginx
6. **Регулярно создавайте бэкапы** базы данных

---

## 📋 Зависимости

Основные Python пакеты (requirements.txt):
- `Django` - веб-фреймворк
- `django-rest-framework` - REST API
- `django-allauth` - социальная аутентификация
- `pyotp` - генерация 2FA кодов
- `qrcode` - создание QR-кодов для 2FA
- `Pillow` - обработка изображений
- `uwsgi` - WSGI сервер для production