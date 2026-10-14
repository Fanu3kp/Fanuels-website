# Otuya Global — Operations Runbook

Hosting, configuration, deployment, repair and troubleshooting for the
Otuya Global website. Last verified 2026-10-11.

## Architecture

```
Browser
  └─ Local site  http://localhost  (Apache on port 80/443)
       ├─ Frontend: Angular SPA from dist/frontend/browser/
       ├─ API calls → /api/ proxied → http://127.0.0.1:8001/api  (Laravel artisan serve)
       │    └─ MySQL 127.0.0.1:3307, database fanuel_website
       └─ Public HTTPS tunnel: https://otuya-global.loca.lt  (localtunnel)

External access (once DuckDNS token is configured):
  ├─ http://otuyaglobal.duckdns.org → 196.96.176.241 (Apache)
  └─ Let's Encrypt SSL via win-acme (C:\Users\HomePC\win-acme)
```

- **Frontend:** Angular 18 SPA, source in `frontend/`, build output
  `frontend/dist/frontend/browser/`. Served by Apache (DocumentRoot).
- **Backend:** Laravel in `backend/`, routes under `/api` (see README.md for
  the endpoint table). ProxyPass in Apache forwards `/api` → Laravel on port 8001.
- **Hosting:** Apache (XAMPP) on the local machine. Apache serves the frontend
  and acts as a reverse proxy for the API. For external access, update the
  DuckDNS record `otuyaglobal.duckdns.org` to point to the public IP
  `196.96.176.241` using the DuckDNS update API.

## Key addresses & credentials

| What | Where |
| --- | --- |
| Live site (local) | http://localhost or https://localhost |
| Public HTTPS tunnel | https://otuya-global.loca.lt |
| External access (pending DuckDNS update) | http://otuyaglobal.duckdns.org → 196.96.176.241 |
| Local site | http://localhost |
| Local API | http://127.0.0.1:8001 |
| Admin login (local) | http://localhost/admin/login |
| Admin credentials | `admin@otuyaelite.com` / `password` (change after first login) |
| phpMyAdmin | http://localhost/phpmyadmin (auto-login, MySQL `127.0.0.1:3307`, root, no password) |
| Local database | MySQL `fanuel_website` on port **3307** (port 3306 is a *different*, password-protected instance — not used by the site) |
| Contact mailbox | fanuelotuya2@gmail.com |

## Local development

Prereqs: XAMPP (Apache + MySQL running), Node.js, PHP, Composer.

1. **MySQL** — XAMPP control panel → start Apache and MySQL. Verify port 3307
   is listening (the site's `backend/.env` uses `DB_PORT=3307`,
   `DB_DATABASE=fanuel_website`, `DB_USERNAME=root`, empty password).
2. **Laravel API:**
   ```powershell
   cd "C:\xampp\htdocs\Fanuels website\backend"
   php artisan serve --host=127.0.0.1 --port=8001
   ```
   First-time setup (if the database is empty):
   ```powershell
   composer install
   php artisan key:generate
   php artisan migrate --seed     # creates admin account + sample content
   ```
3. **Angular dev server:**
   ```powershell
   cd "C:\xampp\htdocs\Fanuels website\frontend"
   npm start                      # ng serve :4200 with proxy.conf.json
   ```
   `proxy.conf.json` forwards `/api` → `http://127.0.0.1:8001`, so the admin
   panel and all database-backed features work locally.

### Why the admin panel works locally but not on the live site

`ApiService.baseUrl()` (frontend/src/app/core/api.service.ts) returns the
relative `/api` for `localhost`/`127.0.0.1` (dev proxy → local Laravel) and
also for the production Apache vhost (same-origin, no CORS needed). The
`environment.ts` `apiUrl` is set to `/api` (same-origin relative path).

For external access, `otuyaglobal.duckdns.org` must resolve to the local
machine's public IP (196.96.176.241). Update the DuckDNS record using:
```
https://www.duckdns.org/update?domains=otuyaglobal&token=<YOUR_TOKEN>&ip=196.96.176.241
```
The token is in your DuckDNS account at https://www.duckdns.org/ (log in,
find the token next to your `otuyaglobal` domain).

## Contact form behaviour

1. **API up:** `POST /api/contact` → message stored in `contact_messages`
   (or the Render PostgreSQL table) **and** emailed via Gmail SMTP to the
   `contact_email` setting. Mail failures are caught and logged — the
   submission still returns 201 with a `REQ-YYMMDR-XXXXX` reference.
2. **API down:** the frontend silently falls back to FormSubmit — a
   form-encoded POST to `https://formsubmit.co/ajax/{contact_email}`.
   Delivery is **email only, no database row**. The user never sees a
   button; the fallback is automatic.

## Deploying the site (local Apache)

The frontend is served directly from Apache's DocumentRoot. To rebuild
and redeploy after frontend code changes:

```powershell
# 1. Commit source, push main
git add -A; git commit -m "message"; git push origin main

# 2. Build (postbuild auto-copies index.html -> 404.html)
cd frontend; npm run build

# 3. Apache serves from dist/frontend/browser/ (already configured)
```

Apache configuration is in `C:\xampp\apache\conf\extra\httpd-vhosts.conf`:
- Port 80: serves frontend, proxies `/api` to Laravel
- Port 443: same as port 80 but over HTTPS (mkcert self-signed cert)

## Deploying the API (local Apache proxy)

The API runs as `php artisan serve --host=0.0.0.0 --port=8001` in the
`backend/` directory. Apache's `ProxyPass` directive forwards
`http://localhost/api/` → `http://127.0.0.1:8001/api/`.

No separate API deploy step needed — just restart the Laravel server
after backend code changes:

```powershell
# Restart Laravel
cd "C:\xampp\htdocs\Fanuels website\backend"
php artisan serve --host=0.0.0.0 --port=8001
```

## Public HTTPS tunnel (temporary)

For external access without DNS/firewall changes, localtunnel provides
a public HTTPS URL:

```powershell
npx localtunnel --port 80 --subdomain otuya-global
```

This gives `https://otuya-global.loca.lt` which serves both the frontend
and the proxied API.

## Troubleshooting

**Site not loading at http://localhost**
- Confirm Apache is running: `Get-Process -Name httpd` should show processes.
  Start with `C:\xampp\apache\apache_start.bat` or `httpd.exe`.
- Confirm Laravel is running: `curl http://127.0.0.1:8001/api/settings`
  should return JSON. Restart with:
  `php artisan serve --host=0.0.0.0 --port=8001` in the `backend/` directory.

**API returns "Something went wrong"**
- Check Laravel logs: `tail backend/storage/logs/laravel.log`
- Verify MySQL is running on port 3307
- Confirm `backend/.env` has `APP_URL=http://127.0.0.1:8001`

**Admin login (admin panel at http://localhost/admin/login)**
- Ensure the Angular built files are being served (not `ng serve`).
  Test: `curl http://127.0.0.1/api/me` should return 401 without a token.

**phpMyAdmin won't open / shows login error**
- Use http://localhost/phpmyadmin (Apache must be running on port 80). Its
  config (`C:\xampp\phpMyAdmin\config.inc.php`) targets `127.0.0.1:3307`
  with root/no-password. Port 3306 is a separate password-protected MySQL —
  do not point the site at it.

**Contact messages arrive by email but not in the database**
- This happens when the FormSubmit fallback is triggered. Verify the API is
  running: `curl http://127.0.0.1:8001/api/contact -Method Post ...`.

**Stale site after deploy**
- Hard-refresh (Ctrl+F5). If old assets are still cached, the rebuild didn't
  take effect — check `dist/frontend/browser/` was regenerated and Apache
  DocumentRoot points to it.

**Dev server or API port already in use**
- `Get-NetTCPConnection -LocalPort 4200 -State Listen` (and 8001) to find the
  process; stop the old one or restart the background processes.

## Background processes (this machine)

- Apache HTTP Server: `httpd.exe` (started by `apache_start.bat`)
  - Listens on ports 80 (HTTP) and 443 (HTTPS)
  - Config: `C:\xampp\apache\conf\extra\httpd-vhosts.conf`
- Laravel API: `php artisan serve --host=0.0.0.0 --port=8001`
- MySQL: `127.0.0.1:3307` (database `fanuel_website`, user `root`, no password)
- LocalTunnel (temporary public HTTPS): `npx localtunnel --port 80 --subdomain otuya-global`
