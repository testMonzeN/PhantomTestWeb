# 📦 Phantom Web App

![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![API](https://img.shields.io/badge/API-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

## 📝 Описание

Phantom — это современное веб-приложение на Django с REST API, готовое к развертыванию через Docker. Включает:
- Backend на Django REST Framework
- Готовую конфигурацию Nginx
- Оптимизированную структуру проекта для продакшена

---

## ⚙️ Технологии

| Компонент       | Технология                  |
|-----------------|-----------------------------|
| Backend         | Django 4.x                  |
| API             | DRF (Django REST Framework) |
| База данных     | SQLite (для разработки)     |
| Веб-сервер      | Nginx                       |
| Контейнеризация | Docker + Docker Compose     |
| Фронтенд        | Статические шаблоны Django  |
---

## 📂 Структура проекта

```bash
deploy-site/
├── docker-compose.yml     # Конфигурация мультиконтейнерного развертывания
├── nginx.conf             # Настройки Nginx
├── Phantom/               # Папка сайта
│   ├── API/               # Основное приложение API
│   │   ├── models.py      # Модели данных
│   │   ├── views.py       # API-эндпоинты + Сериализаторы DRF
│   │   └── urls.py        # Маршрутизация API
│   ├── cabinet/           # Страница личного кабинета
│   │   ├── models.py      # Модели юзера, ключей
│   │   ├── forms.py       # Формы заполнения данных 
│   │   ├── urls.py        # Маршрутизаторы приложения
│   │   └── views.py       # Функции кабинета
│   ├── home/              # Главная страничка   
│   │   ├── models.py      # -
│   │   ├── forms.py       # -
│   │   ├── urls.py        # Маршрутизиция главной страницы
│   │   └── views.py       # Рендер главной странциы
│   ├── logs/              # Логирование действий 
│   │   ├── models.py      # Модели сообщений
│   │   ├── forms.py       # - 
│   │   ├── urls.py        # - 
│   │   └── views.py       # Функции логов
│   ├── Phantom/           # Главная папка
│   ├── manage.py          # Django CLI
│   ├── requirements.txt   # Зависимости Python
│   ├── Dockerfile         # Конфигурация образа Django
│   ├── static/            # Статические файлы (CSS/JS)
│   ├── media/             # Загружаемые файлы
│   └── db.sqlite3         # База данных (dev)
```

---

## 🚀 Быстрый старт

### Вариант 1: Развертывание через Docker (рекомендуется)
```bash
docker-compose up --build
```
Приложение будет доступно: [http://localhost](http://localhost)

### Вариант 2: Локальная разработка
```bash
cd Phantom/

# Установка зависимостей
pip install -r requirements.txt

# Миграции базы данных
python manage.py migrate

# Создание суперпользователя (опционально)
python manage.py createsuperuser

# Запуск сервера
python manage.py runserver
```
Доступно на [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 🛠 Администрирование

### Полезные команды
```bash
# Создать суперпользователя
python manage.py createsuperuser

# Запуск тестов (если есть)
python manage.py test

# Сбор статических файлов (для production)
python manage.py collectstatic --noinput
```

### Доступ к админке
После создания суперпользователя:
- Перейдите по `/admin`
- Используйте данные, введенные при создании


## 🌐 API (betatest)
**Базовый URL:** `https://your_domen.net/api/users/`

## 🔑 Аутентификация
Все методы API (кроме `new_user`) требуют:
- `username` и `password` в теле запроса


## 📚 Методы API

### 🔍 GET Методы

#### 1. Получить список всех методов
```http
GET /api/users/
```
**Тело запроса:**
```data
{
    "metod": "all_metods"
}
```
**Ответ:**
```data
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

#### 2. Получить данные пользователя
```http
GET /api/users/
```
**Тело запроса:**
```data
{
    "metod": "get_into",
    "name": "username",
    "password": "password"
}
```
**Ответ (успех):**
```data
{
    "id": 1,
    "username": "testuser",
    "is_subscribed": true,
    "HWID": "ABC123-XYZ456"
}
```

#### 3. Проверка логина
```http
GET /api/users/
```
**Тело запроса:**
```data
{
    "metod": "login",
    "name": "username",
    "password": "password"
}
```
**Ответы:**
```data
{"message": "Login successful", "status": true}  // 200 OK
{"message": "Login failed", "status": false}     // 400 Bad Request
```

---

### ✉️ POST Методы

#### 1. Регистрация нового пользователя
```http
POST /api/users/
```
**Тело запроса:**
```data
{
    "metod": "new_user",
    "username": "newuser",
    "password": "securepass123",
    "email": "user@example.com"
}
```
**Ответы:**
```data
{"message": "User created successfully"}  // 200 OK
{"message": "User creation failed"}       // 400 Bad Request
```

#### 2. Привязка HWID (для PC-приложения)
```http
POST /api/users/
```
**Тело запроса:**
```data
{
    "metod": "HWID",
    "name": "username",
    "password": "password",
    "HWID": "PC123-456-HARDWARE-ID"
}
```
**Ответы:**
```data
{"HWID": "PC123-456-HARDWARE-ID"}  // 200 OK (при успешной привязке) или 403 Forbidden (нет подписки)
{"HWID": null}                     // 404 Not Found (неверные данные) 
```

#### 3. Смена пароля
```http
POST /api/users/
```
**Тело запроса:**
```data
{
    "metod": "change_password",
    "username": "existing_user",
    "old_password": "oldpass123",
    "new_password": "newpass456"
}
```
**Ответы:**
```data
{"message": "Password changed successfully"}  // 200 OK
{"message": "Password change failed"}         // 400 Bad Request
```

---

## 🛠️ Примеры использования

### Python (requests)
```python
import requests

# Аутентификация
response = requests.post("https://your_domen.net/api/users/", data={
    "metod": "login",
    "name": "testuser",
    "password": "secret123"
})

# Получение HWID
hwid_response = requests.get("https://your_domen.net/api/users/", data={
    "metod": "get_hwid",
    "name": "testuser"
})
```


---

## ⚠️ Особенности реализации
1. **HWID-привязка**:
   - Требует активной подписки (`is_subscribed=True`)
   - Можно привязать только один раз
   - Проверяется в PC-приложении при запуске

2. **Безопасность**:
   - Все пароли хранятся в хешированном виде
   - Критические операции требуют повторной аутентификации

3. **Ограничения**:
   - SQLite используется только для разработки
   - В production рекомендуется PostgreSQL с шифрованием


## ⚠️ Важные заметки

1. **Конфигурация Nginx**:
   - Настроен как reverse proxy для Django
   - Обрабатывает статические файлы в production

2. **База данных**:
   - В разработке используется SQLite
   - Для production замените на PostgreSQL/MySQL

3. **Безопасность**:
   - Обязательно установите `SECRET_KEY` в production
   - Не используйте DEBUG=True в продакшене

4. **Файл YOUR_File.txt**:
   - Ваш продукт