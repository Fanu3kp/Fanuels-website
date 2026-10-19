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
---

## Hosting & Deployment

### Local Development (XAMPP)

#### Prerequisites
- XAMPP (Apache + MySQL) installed
- PHP 8.2+, Node.js, npm, Composer, Git

#### Backend (Laravel API)
```powershell
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
php artisan serve --host=0.0.0.0 --port=8001
```
API: http://127.0.0.1:8001/api

#### Frontend (Angular)
```powershell
cd frontend
npm install
npm run build        # production build -> dist/frontend/browser/
npm start            # dev server -> http://localhost:4200
```

#### Apache (serves built SPA + proxies /api)
```powershell
& "C:\xampp\apache\bin\httpd.exe"
```
Config: C:\xampp\apache\conf\extra\httpd-vhosts.conf
- DocumentRoot: frontend/dist/frontend/browser/
- ProxyPass /api -> http://127.0.0.1:8001/api
- SPA routing via mod_rewrite + 404.html fallback

#### Access URLs (Local)
| URL | Purpose |
|-----|---------|
| http://localhost/ | Main site |
| http://localhost/admin/login | Admin panel |
| http://localhost/api/settings | API (proxied) |
| http://127.0.0.1:8001/api | API (direct) |

Admin: admin@otuyaelite.com / password

---

### Production Deployment

#### Frontend (GitHub Pages)
1. Build: `cd frontend && npm run build` (postbuild auto-creates 404.html)
2. Publish dist/ to gh-pages branch using git worktree (see OPS.md for full commands)
3. Verify: http://otuyaglobal.duckdns.org/ returns 200

#### Backend (Render - Free Tier)
1. Push code to GitHub (main branch)
2. Go to https://render.com -> New + -> Blueprint
3. Connect Fanu3kp/Fanuels-website repo
4. Render reads render.yaml -> creates otuya-api (Docker) + otuya-db (PostgreSQL)
5. Click "Deploy Blueprint" -> wait 2-5 min
6. Set MAIL_PASSWORD in Environment tab (Gmail app password)
7. Verify: https://otuya-api.onrender.com/api/settings returns JSON

#### Database Access
- **Local (MySQL 3307):** http://127.0.0.1/phpmyadmin or mysql CLI
- **Production (PostgreSQL):** DBeaver/pgAdmin with credentials from Render dashboard

#### Environment Variables (Production - Render)
Configured via render.yaml: APP_ENV=production, DB_CONNECTION=pgsql, CORS_ALLOWED_ORIGINS, MAIL_*, etc.

#### Contact Form Behavior
- API up: stores in DB + emails via Gmail SMTP
- API down (cold start): auto-fallback to FormSubmit (email only)
- FormSubmit requires one-time confirmation click in receiving mailbox

#### Troubleshooting
- "File not found" on GitHub Pages: rebuild (postbuild creates 404.html), redeploy
- Admin login fails on live site: Render API not deployed yet
- Cold starts: Render free tier sleeps after 15 min inactivity (~30s wake time)
- phpMyAdmin not loading: Apache vhosts intercepts; use http://127.0.0.1/phpmyadmin

---

## Database Configuration

### Local Development (SQLite)
The local `.env` uses SQLite for fast development without internet:

```env
DB_CONNECTION=sqlite
DB_DATABASE=database.sqlite
```

Setup:
```powershell
cd backend
php artisan migrate --force
php artisan db:seed --force
```

Database file: `backend/database/database.sqlite`

### Production (Render PostgreSQL)
Render uses PostgreSQL (configured in `render.yaml`):
- Database: `otuya-db` (PostgreSQL 18, free tier)
- Expires: 90 days (upgrade to paid to keep permanently)
- Connection: configured automatically via Render environment variables

### Local-to-Production Database Sync
Local (SQLite) and production (PostgreSQL) are **separate databases**. Data syncs via Laravel migrations and seeders:

```powershell
# Push local schema changes to production
cd backend
php artisan migrate --force   # runs on Render during deploy (Dockerfile CMD)

# Seed sample data
php artisan db:seed --force  # runs on Render during deploy
```

**Note:** Windows PHP does not support SNI, which Render PostgreSQL requires. Therefore, local development cannot connect directly to the Render PostgreSQL database. Use SQLite locally and let Render handle PostgreSQL in production.

### Accessing Databases

#### Local (SQLite)
- **Laravel Tinker:** `php artisan tinker` then `App\Models\Service::all();`
- **DB Browser for SQLite:** https://sqlitebrowser.org/dl/ (open database.sqlite)
- **VS Code:** Install "SQLite Viewer" extension

#### Production (PostgreSQL on Render)
- **DBeaver:** https://dbeaver.io/download/ (free) -> New Connection -> PostgreSQL
  - Host: dpg-dbb3d2m7bikc73bjfh4g-a.oregon-postgres.render.com
  - Port: 5432, Database: otuya, Username: otuya
  - Password: (from Render dashboard -> otuya-db -> Show)
  - SSL: Required
- **pgAdmin:** https://www.pgadmin.org/download/pgadmin-4-windows/

### Database Tables
Created by Laravel migrations and seeders:
- `users` - Admin accounts
- `services` - Service offerings
- `projects` - Portfolio projects
- `posts` - Blog posts
- `categories` - Blog categories
- `team_members` - Team profiles
- `testimonials` - Client testimonials
- `contact_messages` - Contact form submissions
- `settings` - Site settings (company name, contact info, social links)
- `personal_access_tokens` - Sanctum auth tokens

### Contact Form Data Flow
1. Customer submits contact form on live site
2. Frontend calls `POST /api/contact` -> Render Laravel API
3. API stores message in `contact_messages` table (PostgreSQL)
4. API emails notification via Gmail SMTP
5. If API is down (cold start): frontend auto-fallbacks to FormSubmit (email only, no DB row)

### Admin Data Management
- Admin panel: http://otuyaglobal.duckdns.org/admin/login
- Login: admin@otuyaelite.com / password
- Admin can: create/edit/delete services, projects, posts, categories, team members, testimonials, settings
- All changes saved to Render PostgreSQL database

### DBeaver Connection Steps (Windows)
1. Download DBeaver: https://dbeaver.io/download/
2. New Connection -> PostgreSQL -> "PostgreSQL standard driver"
3. Connect by: URL
4. URL: `jdbc:postgresql://dpg-dbb3d2m7bikc73bjfh4g-a.oregon-postgres.render.com:5432/otuya?sslmode=require`
5. Username: `otuya` / Password: (from Render dashboard)
6. SSL tab -> SSL mode: `require`, SSL Factory: `org.postgresql.ssl.NonValidatingFactory`
7. Test Connection -> Connected -> Finish
8. Browse: Schemas -> public -> Tables -> right-click -> View Data

Note: Use the full JDBC URL because the hostname contains special characters that DBeaver's URL parser doesn't handle correctly when entered as a plain host.
