# Otuya Global

Corporate website for Otuya Global Business & Technology Company.

- **Frontend:** Angular 18 (standalone components, lazy-loaded routes, signals)
- **Backend:** Laravel API with Sanctum token auth
- **Database:** MySQL via XAMPP (`fanuel_website`, port 3307)
- **Hosting:** Apache HTTP Server (XAMPP) serving both frontend and API
  proxy; public HTTPS tunnel available via localtunnel

> **Runbook:** hosting, deployment, configuration and troubleshooting
> are documented in [`OPS.md`](OPS.md).

## Structure

```
Fanuels website/
├── backend/      Laravel API
├── frontend/     Otuya Global corporate site (Angular)
├── render.yaml   Render service + database definition
├── Dockerfile    PHP 8.2 + pdo_pgsql image for Render
└── OPS.md        Operations runbook
```

## Setup (local)

### 1. Database

Start Apache and MySQL in the XAMPP control panel. The site uses MySQL
on `127.0.0.1:3307` (root, no password) — **not** port 3306, which is
a separate password-protected instance.

`backend/.env`:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3307
DB_DATABASE=fanuel_website
DB_USERNAME=root
DB_PASSWORD=
```

### 2. Backend

```bash
cd backend
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8001
```

The API is served at http://127.0.0.1:8001/api.

> The Sanctum `vendor:publish` step is required on fresh installs.
> Without it there is no `personal_access_tokens` table and every
> admin login fails.

Seeding creates an admin account and sample content:

- Email: `admin@otuyaelite.com`
- Password: `password`

**Change this password before deploying anywhere public.**

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

The site runs at http://localhost:4200. `npm start` uses
`proxy.conf.json` to forward `/api` calls to the Laravel backend, so
there is no CORS issue in development.

Production build:

```bash
npm run build      # output in dist/frontend/browser
```

## Admin panel

`http://localhost:4200/admin/login`

Manages services, projects, blog posts, categories, team members,
testimonials, contact messages and site settings. Every public page
reads from the database, so content changes appear immediately without
a rebuild.

## Email & contact submissions

Contact form submissions are stored in the `contact_messages` table and
emailed to the `contact_email` setting via Gmail SMTP (`MAIL_*`
variables in `.env` / Render environment).

When the API is unreachable, the frontend automatically falls back to
FormSubmit (`formsubmit.co`) so the message still reaches the mailbox —
email only, no database row. FormSubmit requires a one-time confirmation
click in the receiving mailbox.

## Main routes

Public API:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/home/stats` | Home page counters |
| GET | `/api/settings` | Site settings |
| GET | `/api/services` | Service list |
| GET | `/api/services/{slug}` | Single service |
| GET | `/api/projects` | Project list (paginated) |
| GET | `/api/projects/{slug}` | Single project |
| GET | `/api/posts` | Blog list (filter by `category`, `search`) |
| GET | `/api/posts/{slug}` | Single post |
| GET | `/api/categories` | Blog categories |
| GET | `/api/team` | Team members |
| GET | `/api/testimonials` | Testimonials |
| GET | `/api/process` | Six-stage engagement process |
| POST | `/api/contact` | Submit enquiry |
| POST | `/api/login` | Admin sign-in (returns token) |

Authenticated admin API lives under `/api/admin/*` and requires
`Authorization: Bearer <token>` from `POST /api/login`.

## Images

Site imagery lives in `frontend/public/images/` and is copied into the
build by the Angular asset pipeline. The `image` columns in the database
store root-relative paths, for example `/images/solutions/erp.svg`.

```
frontend/public/images/
├── about/studio.svg
├── process/{discovery,architecture,development,deployment,training,partnership}.svg
├── solutions/{erp,software,transformation,cloud,vertical}.svg
└── social/{facebook,linkedin,instagram,tiktok,youtube}.svg
```

To use real photography instead, drop the file into the matching folder
and update the `image` value for that row from **Admin → Services** (or
via `PUT /api/admin/services/{id}`). Rendering degrades cleanly:
components only show the image block when the field is non-empty.

## Deployment

- **Site:** build with `npm run build` (output in `dist/frontend/browser/`).
  Apache DocumentRoot points to this directory. The `postbuild` script
  also generates `404.html` (copy of `index.html`) for Angular client-side
  routing.
- **API:** Laravel runs as `php artisan serve --host=0.0.0.0 --port=8001`.
  Apache `ProxyPass` forwards `/api` → `http://127.0.0.1:8001/api/`.
- **External access:** Update the DuckDNS record `otuyaglobal.duckdns.org`
  to point to your public IP, then open firewall ports 80/443. Use
  win-acme (in `C:\Users\HomePC\win-acme`) for a Let's Encrypt certificate.
