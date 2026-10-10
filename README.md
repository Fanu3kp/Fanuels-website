# Otuya Elite

Corporate website for Otuya Elite Digital & Business Solutions.

- **Frontend:** Angular 18 (standalone components, lazy-loaded routes, signals)
- **Sub-sites:** four independently deployable Angular apps in a shared workspace
- **Backend:** Laravel 12 API with Sanctum token auth
- **Database:** MySQL via XAMPP (`otuyaelite`)

## Structure

```
Fanuels website/
├── backend/    Laravel API
├── frontend/   Main Otuya Elite corporate site (Angular)
└── subsites/   Four vertical sub-sites (Angular multi-project workspace)
```

## Sub-sites

Four separately deployable sites sit under the Otuya Elite umbrella, one per
vertical, each with its own accent colour and its own release:

| Project | Site | Local port |
| --- | --- | --- |
| `poultry` | Otuya Poultry — broiler, layer and egg supply | 4301 |
| `wine` | Otuya Wine — wine, cellar and gifting | 4302 |
| `fashion` | Otuya Fashion — apparel and footwear | 4303 |
| `livestock` | Otuya Livestock — goats and smallstock | 4304 |

They share a `ui` library for the design system, header, footer, enquiry form
and the landing, products and contact pages, so each vertical only supplies its
own `brand.ts` and `content.ts`. Content is local, so every sub-site runs
without the Laravel backend.

```bash
cd subsites
npm install
npm start     # serves all four
npm run build # builds the library, then all four apps
```

See `subsites/README.md` for deploying each site to its own domain and for
wiring the enquiry forms to the API.

## Setup

### 1. Database

Start MySQL and Apache in the XAMPP control panel, then create the database:

```bash
C:/xampp/mysql/bin/mysql.exe -u root -p -e "CREATE DATABASE IF NOT EXISTS otuyaelite CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

Set your MySQL password in `backend/.env`:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=otuyaelite
DB_USERNAME=root
DB_PASSWORD=your-password
```

> If you have forgotten the MySQL root password, right-click
> `reset-mysql-password.bat` in the project root and choose
> **Run as administrator**. It sets the password to `fanatech` and creates
> the `otuyaelite` database for you. Delete both that script and
> `reset-password.sql` once you are done.

### 2. Backend

```bash
cd backend
composer install
php artisan key:generate
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

The API is served at http://127.0.0.1:8000/api.

> The `vendor:publish` step for Sanctum is required. Without it there is no
> `personal_access_tokens` table and every admin login fails.

Seeding creates an admin account and sample content for every section:

- Email: `admin@otuyaelite.com`
- Password: `password`

**Change this password before deploying anywhere public.**

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

The site runs at http://localhost:4200. `npm start` uses `proxy.conf.json` to forward
`/api` calls to the Laravel backend, so there is no CORS issue in development.

For a production build:

```bash
npm run build      # output in dist/frontend
```

## Admin panel

`http://localhost:4200/admin/login`

Manages services, projects, blog posts, categories, team members, testimonials,
contact messages and site settings. Every public page reads from the database, so
content changes appear immediately without a rebuild.

## Email notifications

Contact form submissions are always stored in the `contact_messages` table and
emailed to the address in the `contact_email` setting. Mail uses XAMPP's sendmail
on port 1025. If sendmail is not running, submissions still succeed and appear in
**Admin → Messages**; the failure is logged in `backend/storage/logs/laravel.log`.

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

Authenticated admin API lives under `/api/admin/*` and requires
`Authorization: Bearer <token>` from `POST /api/login`.

## Images

Site imagery lives in `frontend/public/images/` and is served straight from the
Angular app at `/images/...`. The `image` columns in the database store that
root-relative path, for example `/images/solutions/erp.svg`.

```
frontend/public/images/
├── about/studio.svg
├── process/{discovery,architecture,development,deployment,training,partnership}.svg
└── solutions/{erp,software,transformation,cloud,vertical}.svg
```

The current files are vector artwork generated for Otuya Elite. To use real
photography instead, drop the file into the matching folder and update the
`image` value for that row from **Admin → Services** (or via
`PUT /api/admin/services/{id}`). Rendering degrades cleanly: components only
show the image block when the field is non-empty.