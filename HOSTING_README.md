# Hosting Guide - Otuya Global

Complete step-by-step instructions for hosting this website locally with XAMPP + Apache + Laravel + Angular.

## Prerequisites

- XAMPP installed (Apache, MySQL)
- PHP 8.2+
- Node.js & npm
- Composer
- Git

## Quick Start (One-Time Setup)

### 1. Clone Repository
`powershell
cd C:\xampp\htdocs
git clone https://github.com/Fanu3kp/Fanuels-website.git
cd "Fanuels website"
`

### 2. Setup Backend (Laravel API)

`powershell
cd backend
composer install
cp .env.example .env  # or use existing .env
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
`

### 3. Setup Frontend (Angular)

`powershell
cd ..\frontend
npm install
npm run build
`

## Running the Website

### 1. Start Laravel API

`powershell
cd "C:\xampp\htdocs\Fanuels website\backend"
php artisan serve --host=0.0.0.0 --port=8001
`

### 2. Start Apache

`powershell
& "C:\xampp\apache\bin\httpd.exe"
`

Apache is pre-configured in C:\xampp\apache\conf\extra\httpd-vhosts.conf to:
- Serve built files from rontend/dist/frontend/browser/
- Proxy /api requests to http://127.0.0.1:8001/api
- Handle SPA routing (fallback to index.html)
- Enable GZIP compression and caching

## Access URLs

### Local
- **Main Site:** http://localhost/
- **HTTPS:** https://localhost/ (if SSL enabled in Apache)
- **Admin Panel:** http://localhost/admin/login
- **API Direct:** http://127.0.0.1:8001/api
- **API via Proxy:** http://localhost/api

**Admin Credentials:** dmin@otuyaelite.com / password

### Public (Temporary Sharing)
`powershell
npx --yes localtunnel@latest --port 80 --subdomain otuya-global
`
Access: https://otuya-global.loca.lt/

## Production URLs
- **Live Site:** https://otuyaglobal.duckdns.org/
- **API (Render):** https://otuya-api.onrender.com/api

## Verification
`powershell
curl http://localhost/api/settings
curl http://localhost/api/services
curl http://localhost/api/home/stats
`

All should return HTTP 200 with JSON data.

## Notes
- Frontend build creates 404.html (copy of index.html) for GitHub Pages SPA support
- Database uses SQLite locally (see ackend/.env) - migrated and seeded
- Contact form falls back to FormSubmit if API is unreachable
- Apache modules required: mod_rewrite, mod_proxy, mod_proxy_http, mod_deflate, mod_expires, mod_headers

## Troubleshooting
- If Apache fails to start, check for port 80 conflicts
- If API returns 500, run php artisan optimize:clear in backend
- If routes don't work, ensure mod_rewrite is enabled

## Mobile Optimization & Image Handling

### Mobile layout
Comprehensive `@media (max-width: 768px)` and `@media (max-width: 480px)` blocks are defined in `frontend/src/styles.scss`:
- `overflow-x: hidden` on `html`/`body` prevents horizontal scroll
- Grid layouts stack to 1 column on mobile
- Font sizes clamp via `clamp()` for fluid scaling
- `font-size: 16px` on inputs prevents iOS zoom-on-focus
- `white-space: normal` on `.btn`/`.chip` avoids text overflow

### Image constraints
- Global `img { max-width: 100%; height: auto; }` in `styles.scss`
- `@media (max-width: 768px) { img { max-height: 60vh; } }` constrains large images on mobile
- Hero background image capped at `max-height: 35vh` (768px) / `30vh` (480px) in `home.component.scss`
- Social preview images use `loading="lazy"` + `decoding="async"`

### Large images
Large JPEGs live in `frontend/src/assets/images/real/` (or `frontend/public/images/`):
- hero-office.jpg (~103KB), apps-photo.jpg (~132KB), pos-software.jpg (~128KB), cloud-server.jpg (~64KB)
- PHP GD re-encoding was tested but did not reliably reduce size; images kept at original quality
- Rebuild with `npm run build` after any image or style change
