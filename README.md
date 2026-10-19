# Otuya Global

Corporate website for Otuya Global Business & Technology Company.

- **Frontend:** Angular 18 (standalone components, lazy-loaded routes, signals)
- **Backend:** Laravel API with Sanctum token auth
- **Database:** MySQL via XAMPP (`fanuel_website`, port 3307)
- **Hosting:** static site on GitHub Pages (`otuyaglobal.duckdns.org`),
  API on Render (`otuya-api.onrender.com`)

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

- **Site:** build, then publish `dist/frontend/browser/` to the
  `gh-pages` branch (worktree procedure in OPS.md). `npm run build`
  also generates `404.html` (a copy of `index.html`) so Angular's
  client-side routes work on GitHub Pages.
- **API:** `render.yaml` at the repo root deploys `backend/` to Render
  as the `otuya-api` web service with a free PostgreSQL database.
  Replace the placeholder `MAIL_PASSWORD` with a Gmail app password
  after the first deploy.
## Complete Hosting Guide

### Prerequisites
- XAMPP (Apache + MySQL)
- PHP 8.2+, Node.js, npm, Composer
- Git

### Step 1: Start Services

#### Option A: XAMPP Control Panel
Start Apache and MySQL.

#### Option B: Command Line
`powershell
& \"C:\xampp\apache\bin\httpd.exe\"
`
(Laravel API runs separately)

### Step 2: Setup & Run Backend (Laravel)

`powershell
cd \"C:\xampp\htdocs\Fanuels website\backend\"
composer install
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
php artisan serve --host=0.0.0.0 --port=8001
`

API: http://127.0.0.1:8001/api

### Step 3: Build Frontend (Angular)

`powershell
cd \"C:\xampp\htdocs\Fanuels website\frontend\"
npm install
npm run build
`

Build output: rontend/dist/frontend/browser/ (includes 404.html for SPA routing)

### Step 4: Apache (Already Configured)

Apache serves the built SPA and proxies /api to Laravel. Start if not running:
`powershell
& \"C:\xampp\apache\bin\httpd.exe\"
`

Config: C:\xampp\apache\conf\extra\httpd-vhosts.conf

## Working URLs

| Environment | URL | Notes |
|---|---|---|
| Local HTTP | http://localhost/ | Main site |
| Local HTTPS | https://localhost/ | SSL (if configured) |
| Local API (proxy) | http://localhost/api/ | Proxied via Apache |
| Local API (direct) | http://127.0.0.1:8001/api | Direct Laravel |
| Public Tunnel | https://otuya-global.loca.lt/ | Temporary public access |
| Production | https://otuyaglobal.duckdns.org/ | Live site (DuckDNS) |
| Render API | https://otuya-api.onrender.com/api | Production API |

## Admin Access

- URL: http://localhost/admin/login (or via any above URL)
- Email: dmin@otuyaelite.com
- Password: password

**Change credentials before production use.**

## Public Sharing (Tunnel)

`powershell
npx --yes localtunnel@latest --port 80 --subdomain otuya-global
`

## Verification

`powershell
curl http://localhost/api/settings
curl http://localhost/api/services
curl http://localhost/api/home/stats
`

All return HTTP 200 with JSON.

## Architecture

- Frontend: Angular SPA built to dist/frontend/browser/, served by Apache
- Backend: Laravel API on port 8001, proxied by Apache at /api
- Database: SQLite (local, configured in backend/.env)
- SPA Routing: mod_rewrite + 404.html fallback

## Notes
- Apache modules: mod_rewrite, mod_proxy, mod_proxy_http, mod_deflate, mod_expires, mod_headers (all enabled)
- Contact form stores in DB + emails via SMTP; falls back to FormSubmit if API unavailable
