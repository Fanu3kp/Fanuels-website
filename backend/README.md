# Backend — Otuya Global API (Laravel)

Laravel API for the Otuya Global website. Sanctum token auth for the
admin panel; public read endpoints feed every site page.

## Quick start

```bash
composer install
php artisan key:generate
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8001
```

API base: http://127.0.0.1:8001/api

> `vendor:publish` for Sanctum is required — without it there is no
> `personal_access_tokens` table and every admin login fails.

## Environment (.env)

```
APP_URL=http://127.0.0.1:8001
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3307              # XAMPP MySQL — NOT 3306 (separate instance)
DB_DATABASE=fanuel_website
DB_USERNAME=root
DB_PASSWORD=              # empty on the local XAMPP instance

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=fanuelotuya2@gmail.com
MAIL_PASSWORD=<gmail app password>
MAIL_FROM_ADDRESS=fanuelotuya2@gmail.com
MAIL_FROM_NAME=Otuya Global
MAIL_ENCRYPTION=tls
```

> **Important:** `MAIL_PASSWORD` must be a Gmail **app password** (Google Account → Security → App passwords), not your normal account password. App passwords are account-specific — generate it while signed into the exact account listed in `MAIL_USERNAME`.

## Contact Form — Email Delivery (Two Paths)

**Primary path (live site):** The frontend submits contact forms directly to **FormSubmit** (`https://formsubmit.co/ajax/{contact_email}`), bypassing the API entirely to avoid Render cold-start timeouts. FormSubmit requires a one-time confirmation: check the `contact_email` inbox and click the activation link before submissions are delivered.

**Fallback path:** If FormSubmit is unreachable, the frontend falls back to the Laravel API (`POST /api/contact`), which stores the message in `contact_messages` and attempts Gmail SMTP delivery. Mail failures are caught and logged — the request still returns 201 with a `REQ-YYMMDR-XXXXX` reference.

**Email hidden from UI:** The contact email address is not displayed on any public page (`*ngIf="false"` on contact sidebar and footer).

Seeded admin: `admin@otuyaelite.com` / `password` — change it.

## Contact submissions

`POST /api/contact` (routes/api.php → `ContactController@store`):

1. Validates and stores the message in `contact_messages`
   (attachments go to `storage/app/public/contact-attachments`).
2. Emails it to the `contact_email` setting. Mail failures are
   caught and logged (`storage/logs/laravel.log`) — the request
   still returns `201` with a `REQ-YYMMDR-XXXXX` reference.
3. Honeypot: a filled `website` field silently returns 201.

When the API is unreachable, the frontend falls back to FormSubmit
(email only, no DB row) — see `../OPS.md`.

## Render deployment

`../render.yaml` deploys this directory as the `otuya-api` Docker
service (`../Dockerfile`: php:8.2-cli + pdo_pgsql) with a free
PostgreSQL database `otuya-db`. After deploying, replace the
placeholder `MAIL_PASSWORD` in the Render dashboard with a real
Gmail app password.

## API surface

Public: `/api/home/stats`, `/api/settings`, `/api/services[/{slug}]`,
`/api/projects[/{slug}]`, `/api/posts[/{slug}]`, `/api/categories`,
`/api/team`, `/api/testimonials`, `/api/process`, `/api/search`,
`POST /api/contact`, `POST /api/login`.

Admin (requires `Authorization: Bearer <token>` from
`POST /api/login`, admin role): `/api/admin/{services,projects,
posts,categories,team,testimonials,messages,settings}` — full CRUD
plus `GET /api/admin/messages/unread-count` and
`PATCH /api/admin/messages/{id}/read`.
