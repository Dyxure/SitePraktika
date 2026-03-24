# Земля Искусства — React + Node (заявки)

Проект: многостраничный сайт (React/Vite) + backend (Node/Express) для отправки двух форм:
- `Заявка на обучение` → email и/или Telegram
- `Заявка на конкурс` → email и/или Telegram

## Что внутри
- `frontend/` — React сайт (страницы + формы)
- `backend/` — Express API (`/api/forms/learning`, `/api/forms/competition`) + раздача `frontend/dist` в проде

## Локальный запуск

### 1) Backend
1. Откройте `backend/.env.example` и создайте `backend/.env` (заполните SMTP/Telegram при необходимости).
2. Запустите:
   - `cd backend`
   - `npm run dev` (или `npm run start`)

API будет доступен по адресу:
- `http://localhost:8080/api/health`

### 2) Frontend
1. Откройте `frontend/.env.example` (опционально) и создайте `frontend/.env`.
2. Запустите:
   - `cd frontend`
   - `npm run dev`

Сайт откроется обычно на `http://localhost:5173` (порт может отличаться, если занято).

## Где редактировать контент и формы

1. Контент сайта (заготовки):
   - `frontend/src/content/siteData.ts`
2. Поля форм (редактируемые):
   - `frontend/src/content/formConfigs.ts`

Важно: backend принимает доп. поля “мимо схемы” (не ломается при добавлении полей), но формат уведомлений в письме/Telegram лучше обновлять при сильных изменениях.

## Сборка и публикация (одним сервером)

1. Соберите frontend:
   - `cd frontend`
   - `npm run build`
2. Запустите backend в проде (Express раздаёт `frontend/dist`):
   - `cd backend`
   - `npm run start`

После этого сайт будет доступен на URL вашего backend-сервера (например, `https://your-domain.example`).

## Как просто выгрузить на хостинг

1. На вашей машине оставьте как есть структуру проекта и **выгрузите на сервер папку целиком**:
   - `backend/` (код + `package.json`)
   - `frontend/dist/` (обязательно)
   - остальные файлы `frontend/` можно тоже выгрузить, но это не критично.
2. На сервере в `backend/` выполните:
   - `npm install`
   - создайте `backend/.env` (по `backend/.env.example`) и заполните SMTP/Telegram (если нужны отправки)
   - `npm run start`
3. Проверьте в браузере:
   - главная: `/`
   - формы (глубокие роуты): `/apply/learning` и `/apply/competition`
   - эндпоинты API: `/api/health`

Если на сервер не включён/не найден `frontend/dist`, React-страницы не загрузятся (тогда нужно предварительно сделать `npm run build` в `frontend/` до выгрузки).

