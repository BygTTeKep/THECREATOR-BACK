# The Creator — Backend

Backend API платформы **The Creator** ([thecreatorstudio.ru](https://thecreatorstudio.ru)) — membership-commerce с дропами, подписками, тирами доступа, заказами, оплатой через ЮKassa и доставкой через СДЭК.

Админ-панель: [admin.thecreatorstudio.ru](https://admin.thecreatorstudio.ru).

---

## Содержание

1. [О проекте](#о-проекте)
2. [Стек технологий](#стек-технологий)
3. [Архитектура](#архитектура)
4. [Структура репозитория](#структура-репозитория)
5. [Бизнес-домены](#бизнес-домены)
6. [Аутентификация и авторизация](#аутентификация-и-авторизация)
7. [API](#api)
8. [Модель данных](#модель-данных)
9. [Переменные окружения](#переменные-окружения)
10. [Установка и запуск](#установка-и-запуск)
11. [NPM-скрипты](#npm-скрипты)
12. [Внешние интеграции](#внешние-интеграции)
13. [Фоновые задачи](#фоновые-задачи)
14. [Документация модулей](#документация-модулей)
15. [Известные ограничения](#известные-ограничения)

---

## О проекте

Пользователь регистрируется по телефону (OTP), оформляет подписку, накапливает стаж в месяцах и получает **тир** (уровень членства). Тир определяет доступ к **дропам** (релизам). Внутри дропа — **продукты** с вариантами (размеры/SKU). Покупка оформляется как **заказ**, оплата — через **ЮKassa**, доставка — через **СДЭК**.

Ключевые сценарии:

| Сценарий | Описание |
|----------|----------|
| Auth | Вход/регистрация по телефону + OTP-код |
| Membership | Подписка → стаж (`total_months`) → тир |
| Drops | Временные/постоянные релизы с правилами доступа |
| Catalog | Продукты, варианты, изображения |
| Checkout | Заказ + доставка + оплата |
| Admin | Управление пользователями, дропами, заказами, флагами |
| Analytics | События, агрегации, ежедневная статистика в Telegram |
| Newsletter | Подписка на рассылку через Unisender |

---

## Стек технологий

| Слой | Технология |
|------|------------|
| Runtime | Node.js 20, TypeScript 5.9 |
| Framework | NestJS 11 (Express) |
| БД | PostgreSQL 16 + TypeORM 0.3 |
| Кэш / очереди | Redis 7 (Keyv + BullMQ) |
| Auth | JWT (`Authorization: Bearer`), срок жизни **21 день** |
| Валидация | `class-validator` + глобальный `ValidationPipe` |
| HTTP | `@nestjs/axios` |
| Расписание | `@nestjs/schedule` |
| События | `@nestjs/event-emitter` |
| API-доки | Swagger UI на `/api` (только вне `production`) |
| Статика | `/uploads` через `@nestjs/serve-static` |

---

## Архитектура

Монолит NestJS с модульной структурой. Каждый доменный модуль разделён на слои:

```
modules/<name>/
  <name>.module.ts
  domain/            # сущности, enum'ы, константы
  infrastructure/    # сервисы, мапперы, клиенты внешних API, DTO ответов
  presentation/      # контроллеры, request-DTO, cron-задачи
```

**Поток запроса:** Controller → Service → TypeORM Repository / внешний API → Mapper → Response DTO.

**Сквозная инфраструктура (`src/core/`):**

- `@AuthUser()` — текущий пользователь из JWT
- `@Roles(...)` — роли для `AdminGuard`
- `AuthGuard` / `AdminGuard`
- общие DTO пагинации и фильтров по датам
- утилита определения страны по телефону

**Паттерны:**

- EventEmitter развязывает вебхуки ЮKassa и обновление статусов заказов/подписок
- BullMQ асинхронно отправляет email (уведомления об окончании подписки)
- Feature flags управляют платёжными сценариями и режимом релиза
- Связи между таблицами чаще через ID-колонки (логические FK), без широкого использования TypeORM relations

---

## Структура репозитория

```
back-end/
├── deploy/
│   ├── Dockerfile                 # multi-stage: deps → build → runner
│   ├── docker-compose.yml         # postgres + redis + nest (prod)
│   └── docker-compose.local.yml   # локальный Postgres
├── uploads/                       # загруженные изображения (отдаются на /uploads)
├── src/
│   ├── main.ts                    # bootstrap, CORS, Swagger, ValidationPipe
│   ├── app.module.ts              # корневой модуль
│   ├── dataSource.ts              # TypeORM CLI (миграции)
│   ├── core/                      # guards, decorators, enums, utils
│   ├── migrations/                # миграции TypeORM
│   └── modules/                   # доменные модули
├── test/                          # e2e
├── .env.example
└── package.json
```

### Модули

| Модуль | Назначение |
|--------|------------|
| `auth` | Login / register / OTP |
| `users` | Профиль, тиры, cron истечения подписки |
| `tiers` | Уровни членства |
| `subscriptions` | Планы и подписки |
| `drops` | Дропы, файлы, auto-deactivate cron |
| `products` | Продукты, варианты, файлы |
| `inventory` | Заглушка (сток сейчас на `product_variants.stock`) |
| `rules` | Правила доступа к дропам |
| `orders` | Заказы и позиции |
| `payment` | ЮKassa: создание платежа и вебхуки |
| `delivery` | СДЭК + справочник стран/доставки |
| `files` | Multipart-загрузка изображений |
| `sms` | OTP (SMS Aero / Sigma SMS) |
| `telegram` | Уведомления о заказах и статистике |
| `features-flag` | Feature flags |
| `notifications` | Newsletter + Unisender + Bull processor |
| `queues` | Очередь `notifications` |
| `socialmedia` | Социальные ссылки |
| `statistics` | Analytics events + агрегации |

---

## Бизнес-домены

### Тиры (уровни)

Уровень зависит от `users.total_months` (месяцы активной подписки):

| Code | Стаж | Доступ |
|------|------|--------|
| `initiate` | 0 (без подписки) | Базовый |
| `member` | купил подписку | Дропы с минимальным тиром 2 |
| `core` | 3–5 месяцев | Дропы с минимальным тиром 3 |
| `inner` | 6+ месяцев | Дропы с минимальным тиром 4 |

Тир пересчитывается при запросе профиля (`GET /users/me`).

### Дропы

Релиз с периодом продаж (`starts_at` / `ends_at`), флагами `is_active` / `is_visible`, тиром, типом (`standart` | `preorder`) и линией (`permanent` | `limit`).

Доступ дополнительно ограничивается правилами в `drop_access_rules` (`min_tier_id`, `min_months`, `whitelist_only`).

Cron каждую минуту деактивирует дропы с истёкшим периодом.

### Подписки

Планы в `subscription_plans`. Подписка создаётся в статусе `pending`, после успешной оплаты ЮKassa → `active`. Статусы: `active` | `pending` | `canceled` | `past_due`.

За 3 дня до окончания периода в очередь ставится email-уведомление.

### Заказы

Жизненный цикл статуса:

```
pending → paid → picked_up → in_transit → delivered → received
                ↘ cancelled (на любом этапе)
```

При создании заказа отправляется уведомление в Telegram.

### Платежи

Feature flags:

- `payment_for_subscription` — оплата подписок
- `payment_for_orders` — оплата заказов
- `IS_RELEASE` — режим релиза

Отдельные webhook URL для подписок и заказов. После обработки вебхука нужно отвечать `200`.

---

## Аутентификация и авторизация

1. **`POST /auth/send-code`** — генерируется 6-значный код, кладётся в кэш (`sms_code:{phone}`, TTL 5 мин). Отправка SMS может быть отключена в коде (TODO).
2. **`POST /auth/register`** / **`POST /auth/login`** — проверка кода → JWT `{ id, role, current_tier_id? }`, expires **21d**.
3. Роль хранится в `users.metadata.role`: `admin` | `user` (по умолчанию `user`).
4. **`AuthGuard`** — проверяет Bearer JWT, загружает пользователя, кладёт в `request.user`.
5. **`AdminGuard`** — требует роль `admin` (или роли из `@Roles(...)`).

Паролей и refresh-токенов нет — только phone OTP.

---

## API

Базовый URL: `http://localhost:3001` (глобального prefix нет).  
Swagger (dev): `http://localhost:3001/api`.

Легенда Auth: **Public** / **Auth** (Bearer) / **Admin** (Auth + admin).

### Root

| Method | Path | Auth | Описание |
|--------|------|------|----------|
| GET | `/` | Public | Health-like: `"Hello World!"` |

### Auth — `/auth`

| Method | Path | Auth | Описание |
|--------|------|------|----------|
| POST | `/auth/send-code` | Public | Отправить OTP |
| POST | `/auth/login` | Public | Вход → `{ access_token }` |
| POST | `/auth/register` | Public | Регистрация (phone + email + OTP) |
| POST | `/auth/verify-phone-and-email` | Public | Проверка занятости phone/email |

### Users — `/users`

| Method | Path | Auth | Описание |
|--------|------|------|----------|
| GET | `/users/me` | Auth | Текущий пользователь (+ пересчёт тира) |
| POST | `/users/filter` | Admin | Фильтрация пользователей |
| PATCH | `/users/update/:id` | Admin | Обновление пользователя |
| GET | `/users/:id` | Admin | Пользователь по id |

### Subscriptions — `/subscriptions`

| Method | Path | Auth | Описание |
|--------|------|------|----------|
| GET | `/subscriptions` | Auth | Подписка текущего пользователя |
| GET | `/subscriptions/plans` | Auth | Список планов |
| POST | `/subscriptions/create` | Auth | Создать подписку |
| POST | `/subscriptions/update` | Auth | Обновить / пересоздать |
| POST | `/subscriptions/cancel` | Auth | Отменить |

### Drops — `/drops`

| Method | Path | Auth | Описание |
|--------|------|------|----------|
| POST | `/drops/all` | Auth | Список дропов (с учётом доступа) |
| GET | `/drops/:id` | Auth | Детали дропа |
| POST | `/drops` | Admin | Создать дроп |
| PUT | `/drops/:id` | Admin | Обновить дроп |

### Products — `/products`

| Method | Path | Auth | Описание |
|--------|------|------|----------|
| POST | `/products/create` | Admin | Создать продукт |
| POST | `/products/add-variants` | Admin | Добавить варианты (размеры/SKU) |
| GET | `/products/:id` | Auth | Получить продукт |

### Orders — `/orders`

| Method | Path | Auth | Описание |
|--------|------|------|----------|
| POST | `/orders` | Auth | Создать заказ |
| POST | `/orders/my` | Auth | Заказы текущего пользователя |
| POST | `/orders/get-orders` | Admin | Список/фильтр заказов |
| GET | `/orders/:id` | Admin | Детали заказа |
| PATCH | `/orders/:id` | Admin | Обновить статус / tracking |

### Payment — `/payment`

| Method | Path | Auth | Описание |
|--------|------|------|----------|
| POST | `/payment/youkassa` | Public | Создать платёж ЮKassa |
| POST | `/payment/youkassa/subscription/notification_url` | Public | Webhook подписок |
| POST | `/payment/youkassa/order/notification_url` | Public | Webhook заказов |

### Delivery — `/delivery`

| Method | Path | Auth | Описание |
|--------|------|------|----------|
| GET | `/delivery/get-delivery-by-user-phone` | Auth | Варианты доставки по стране телефона |

### Files — `/files`

| Method | Path | Auth | Описание |
|--------|------|------|----------|
| POST | `/files/upload` | Admin | Multipart `files` (до 10, jpg/jpeg/png) → URL `/uploads/...` |

### Rules — `/rules`

| Method | Path | Auth | Описание |
|--------|------|------|----------|
| POST | `/rules/create` | Admin | Создать правило доступа к дропу |

### Feature flags — `/feature-flag`

| Method | Path | Auth | Описание |
|--------|------|------|----------|
| GET | `/feature-flag/all` | Public | Все флаги |
| GET | `/feature-flag/get?name=` | Public | Флаг по имени |
| GET | `/feature-flag/:id` | Admin | Флаг по id |
| POST | `/feature-flag/create` | Admin | Создать |
| PUT | `/feature-flag/update/:id` | Admin | Обновить |
| DELETE | `/feature-flag/delete/:id` | Admin | Удалить |

### Statistics — `/statistics`

| Method | Path | Auth | Описание |
|--------|------|------|----------|
| POST | `/statistics` | Public | Записать analytics-событие |
| POST | `/statistics/calc` | Admin | Агрегация статистики |
| GET | `/statistics/countRegUser` | Public | Число зарегистрированных |

### Notifications — `/notifications`

| Method | Path | Auth | Описание |
|--------|------|------|----------|
| POST | `/notifications/addToNewsletter` | Public | Подписка на newsletter |
| POST | `/notifications/checkNewsLetter` | Public | Проверка подписки |
| POST | `/notifications/updateNewsletter` | Public | Обновить/создать запись |
| POST | `/notifications/newsletter/statistic` | Public | Статистика newsletter |

### Social media — `/socialmedia`

| Method | Path | Auth | Описание |
|--------|------|------|----------|
| GET | `/socialmedia` | Public | Ссылки на соцсети |

### Static

| Method | Path | Auth | Описание |
|--------|------|------|----------|
| GET | `/uploads/*` | Public | Загруженные файлы |

---

## Модель данных

```
users.current_tier_id ──────────────► tiers
subscriptions.user_id ──────────────► users
subscriptions.subscription_plan_id ► subscription_plans
drops.tier / rules.min_tier_id ─────► tiers
drop_access_rules.drop_id ──────────► drops
products.drop_id ───────────────────► drops
product_variants.product_id ────────► products
product_files.product_id ───────────► products
drops_files.drop_id ────────────────► drops
orders.user_id / drop_id ───────────► users / drops
order_items.order_id / product_id ──► orders / products
delivery_country ───────────────────► delivery ↔ countries
newsletter.user_id? ────────────────► users
analytics_events.user_id ───────────► users
```

### Основные таблицы

| Таблица | Ключевые поля |
|--------|----------------|
| `users` | uuid, email, phone, status, total_months, metadata (jsonb), current_tier_id |
| `tiers` | code, name, min_months, priority |
| `subscription_plans` | name, description, price (RUB) |
| `subscriptions` | user_id, status, period dates, plan_id, payment_id |
| `drops` | name, dates, is_active, tier, is_visible, drop_type, drop_line |
| `drops_files` | drop_id, file_url |
| `drop_access_rules` | drop_id, min_tier_id, min_months, whitelist_only |
| `products` | drop_id, name, base_cost, metadata |
| `product_variants` | product_id, size, sku, price, stock |
| `product_files` | product_id, file_url |
| `orders` | user_id, status, total_amount, drop_id, payment_id, tracking, delivery_*, payment_type |
| `order_items` | order_id, product_id, quantity, price |
| `delivery` / `countries` / `delivery_country` | справочник доставки |
| `feature_flags` | name, description, is_active |
| `newsletter` | email, enable, user_id?, user_session_id |
| `analytics_events` | event_type, user_id, page_url, metadata, ip, ua, session_id |
| `socialmedia` | name, link |

Схема БД эволюционирует через миграции в `src/migrations/` (`npm run typeorm:migrate`).

---

## Переменные окружения

Шаблон: [`.env.example`](./.env.example).

| Переменная | Назначение |
|------------|------------|
| `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` | PostgreSQL |
| `DB_AUTO_LOAD_ENTITIES` | TypeORM `autoLoadEntities` |
| `DB_SYNCHRONIZE` | `"true"` включает synchronize (в проде предпочтительны миграции) |
| `JWT_SECRET` | Подпись JWT |
| `PORT` | Порт приложения (по умолчанию `3001`) |
| `NODE_ENV` | `production` отключает Swagger |
| `FRONTEND_URL` | CORS origin фронтенда |
| `REDIS_URL` | Кэш + BullMQ |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_STAT_CHAT_ID` | Telegram |
| `SMS_BASE_URL`, `SMS_API_KEY`, `SMS_EMAIL_COMPANY` | SMS Aero |
| `SIGMA_SMS_BASE_URL`, `SIGMA_SMS_API_KEY` | Sigma SMS |
| `SDEK_BASE_URL`, `SDEK_CLIENT_ID`, `SDEK_CLIENT_SECRET`, `SDEK_ACCESS_TOKEN` | СДЭК |
| `YOUKASSA_BASE_URL`, `YOUKASSA_IDENPOTENT_KEY`, `YOUKASSA_SHOP_ID`, `YOUKASSA_SECRET_KEY` | ЮKassa |
| `RETURNURL_FOR_YOUKASSA` | Return URL после оплаты |
| `YOUKASSA_TRUST_IPS` | Доверенные IP вебхуков (через запятую) |
| `UNISENDER_API_KEY`, `UNISENDER_API_URL`, `THECREATOR_MAIL` | Email / Unisender |

### CORS

Разрешённые origins:

- `FRONTEND_URL`
- `http://localhost:3000`
- `http://localhost:4000`
- `http://www.thecreator.local`
- `https://admin.thecreatorstudio.ru`

Методы: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`, `PATCH`.  
Заголовки: `Content-Type`, `Authorization`. Credentials: `true`.

---

## Установка и запуск

### Требования

- Node.js 20+
- PostgreSQL 16
- Redis 7
- npm

### Локальная разработка

```bash
cp .env.example .env
# заполнить переменные

npm install

# опционально — только Postgres:
docker compose -f deploy/docker-compose.local.yml --env-file .env up -d

npm run typeorm:migrate
npm run start:dev
```

API: `http://localhost:3001`  
Swagger: `http://localhost:3001/api`

### Production (без Docker)

```bash
npm run build
npm run start:prod
```

### Production (Docker Compose)

Предварительно нужна внешняя сеть `thecreator-network`:

```bash
docker network create thecreator-network
docker compose -f deploy/docker-compose.yml --env-file .env up -d --build
```

Стек: `postgres` + `redis` + `nest` (порт **3001**). Образ: multi-stage Node 20 Alpine.

---

## NPM-скрипты

| Скрипт | Описание |
|--------|----------|
| `start` | Запуск Nest |
| `start:dev` | Watch-режим |
| `start:debug` | Debug + watch |
| `start:prod` | `node dist/main` |
| `build` | Сборка в `dist/` |
| `lint` | ESLint с `--fix` |
| `format` | Prettier |
| `test` | Unit-тесты (Jest, `rootDir: src`) |
| `test:watch` / `test:cov` / `test:debug` | Варианты Jest |
| `test:e2e` | E2E-тесты |
| `typeorm:generate` | Генерация миграции |
| `typeorm:migrate` | Применить миграции |
| `typeorm:revert` | Откатить последнюю миграцию |

---

## Внешние интеграции

| Сервис | Модуль | Назначение |
|--------|--------|------------|
| **ЮKassa** | `payment` | Платежи заказов и подписок, вебхуки |
| **СДЭК** | `delivery` | Доставка (РФ), пункты выдачи, OAuth |
| **SMS Aero** | `sms` | OTP (основной провайдер) |
| **Sigma SMS** | `sms` | Альтернативный SMS-провайдер |
| **Unisender** | `notifications` | Транзакционные / newsletter email |
| **Telegram Bot** | `telegram` | Заказы + ежедневная статистика |
| **Redis** | cache / queues | OTP-коды, BullMQ jobs |
| **Локальный диск** | `files` | Изображения в `./uploads` (не S3) |

В зависимостях есть, но в коде не используются: `twilio`, `@nestjs-modules/mailer`, `nodemailer`, `handlebars`. Поле `stripe_id` у подписок — legacy.

---

## Фоновые задачи

### Cron

| Задача | Расписание | Описание |
|--------|------------|----------|
| Auto-deactivate drops | каждую минуту | `is_active = false` для истёкших дропов |
| Subscription expiry notify | каждую минуту | Email за ~3 дня до конца периода (через очередь) |
| Daily Telegram stats | каждый день в 12:00 | Статистика в `TELEGRAM_STAT_CHAT_ID` |

### Очереди (BullMQ)

- Очередь `notifications`
- Job: `subscription_end_notification` — письмо об окончании подписки

### События (EventEmitter)

- Успешный вебхук ЮKassa → обновление статуса заказа / подписки
- Создание заказа → уведомление в Telegram

---

## Документация модулей

Доменные README (на русском) лежат рядом с модулями:

- [`auth`](src/modules/auth/README.md)
- [`users`](src/modules/users/README.md)
- [`tiers`](src/modules/tiers/README.md)
- [`subscriptions`](src/modules/subscriptions/README.md)
- [`drops`](src/modules/drops/README.md)
- [`products`](src/modules/products/README.md)
- [`orders`](src/modules/orders/README.md)
- [`rules`](src/modules/rules/README.md)
- [`inventory`](src/modules/inventory/README.md)
- [`payment`](src/modules/payment/README.md)
- [`delivery`](src/modules/delivery/README.md)
- [`sms`](src/modules/sms/README.md)
- [`telegram`](src/modules/telegram/README.md)
- [`files`](src/modules/files/README.md)
- [`features-flag`](src/modules/features-flag/README.md)
- [`statistics`](src/modules/statistics/README.md)

Интерактивная OpenAPI-схема доступна в Swagger UI (`/api`) вне production.

---

## Известные ограничения

- `InventoryModule` — пустая заглушка; остатки хранятся в `product_variants.stock`
- Отправка SMS в OTP-флоу может быть отключена (код логируется)
- `WhitelistEntity` не доведён / не используется в продакшен-флоу
- Хранение файлов — локальный диск (`uploads/`), без объектного хранилища
- Кастомных exception filters нет — стандартный слой Nest HTTP exceptions
