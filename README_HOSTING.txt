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
- Database uses SQLite locally (see backend/.env) - migrated and seeded
- Contact form submits directly to FormSubmit (email delivery) to avoid Render API cold-start timeout. FormSubmit requires a one-time confirmation: check fanuelotuya2@gmail.com inbox and click the activation link.
- Contact form falls back to Laravel API (database storage) if FormSubmit is unreachable
- Apache modules required: mod_rewrite, mod_proxy, mod_proxy_http, mod_deflate, mod_expires, mod_headers

## Troubleshooting
- If Apache fails to start, check for port 80 conflicts
- If API returns 500, run php artisan optimize:clear in backend
- If routes don't work, ensure mod_rewrite is enabled
