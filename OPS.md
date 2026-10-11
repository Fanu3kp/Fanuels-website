# Otuya Global — Operations Runbook

Hosting, configuration, deployment, repair and troubleshooting for the
Otuya Global website. Last verified 2026-10-11.

## Architecture

```
Browser
  ├─ Live site  http://otuyaglobal.duckdns.org   (GitHub Pages, gh-pages branch)
  │    └─ API calls → https://otuya-api.onrender.com/api  (Laravel on Render)
  │         └─ PostgreSQL (Render "otuya-db") + Gmail SMTP
  └─ Local site http://localhost:4200            (Angular dev server)
       └─ /api proxied → http://127.0.0.1:8001  (Laravel, `php artisan serve`)
            └─ MySQL 127.0.0.1:3307, database fanuel_website
```

- **Frontend:** Angular 18 SPA, source in `frontend/`, build output
  `frontend/dist/frontend/browser/`.
- **Backend:** Laravel in `backend/`, routes under `/api` (see README.md for
  the endpoint table).
- **Hosting:** the static SPA lives on GitHub Pages (branch `gh-pages`,
  custom domain via `CNAME` = `otuyaglobal.duckdns.org`). The Laravel API is
  a separate free-tier Render service (`render.yaml` at the repo root).

## Key addresses & credentials

| What | Where |
| --- | --- |
| Live site | http://otuyaglobal.duckdns.org |
| Local site | http://localhost:4200 |
| Local API | http://127.0.0.1:8001 |
| Admin login (local) | http://localhost:4200/admin/login |
| Admin credentials | `admin@otuyaelite.com` / `password` (change after first login) |
| phpMyAdmin | http://localhost/phpmyadmin (auto-login, MySQL `127.0.0.1:3307`, root, no password) |
| Local database | MySQL `fanuel_website` on port **3307** (port 3306 is a *different*, password-protected instance — not used by the site) |
| Render API | https://otuya-api.onrender.com/api |
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
relative `/api` when the page is opened from `localhost`/`127.0.0.1` (dev
proxy → local Laravel) and the compiled-in Render URL otherwise. The live
site has no backend until the Render service is deployed (below).

## Contact form behaviour

1. **API up:** `POST /api/contact` → message stored in `contact_messages`
   (or the Render PostgreSQL table) **and** emailed via Gmail SMTP to the
   `contact_email` setting. Mail failures are caught and logged — the
   submission still returns 201 with a `REQ-YYMMDR-XXXXX` reference.
2. **API down:** the frontend silently falls back to FormSubmit — a
   form-encoded POST to `https://formsubmit.co/ajax/{contact_email}`.
   Delivery is **email only, no database row**. The user never sees a
   button; the fallback is automatic.

## Deploying the site (GitHub Pages)

The `gh-pages` branch holds the built SPA. `dist/` is gitignored, so deploys
use a temporary worktree:

```powershell
# 1. Commit source, push main
git add -A; git commit -m "message"; git push origin main

# 2. Build (postbuild auto-copies index.html -> 404.html)
cd frontend; npm run build

# 3. Publish dist/ to gh-pages
$deploy = "$env:TEMP\gh-deploy"
Remove-Item -Recurse -Force $deploy -ErrorAction SilentlyContinue
git fetch origin gh-pages
git worktree add -f --detach $deploy origin/gh-pages
Get-ChildItem -Force $deploy | ? { $_.Name -ne '.git' } | Remove-Item -Recurse -Force
Copy-Item -Recurse -Force dist\frontend\browser\* $deploy
git -C $deploy add -A
git -C $deploy commit -m "Deploy: <what changed>"
git -C $deploy push origin HEAD:gh-pages
git worktree remove --force $deploy; git worktree prune
```

Verify: `curl http://otuyaglobal.duckdns.org/` returns 200 and the HTML
references the new `main-*.js` hash. GitHub Pages propagates in ~1 minute.

## Deploying the API (Render — one-time, needs your Render login)

The `render.yaml` at the repo root defines the `otuya-api` Docker web service
(php:8.2-cli + pdo_pgsql) and a free PostgreSQL database `otuya-db`.

1. https://render.com → sign in with GitHub → **New +** → **Web Service**.
2. Connect **Fanu3kp/Fanuels-website**; Render detects `render.yaml`
   (creates the service + database). Click **Create Web Service** (free).
3. After the build: **Environment** tab → replace the placeholder
   `MAIL_PASSWORD` with a real Gmail **app password** (Google Account →
   Security → App passwords) → Save (auto-redeploys).
4. Verify: `https://otuya-api.onrender.com/api/settings` returns JSON.

Until this is done, the live site delivers contact messages by email only
(FormSubmit) and the live admin panel cannot log in.

## Troubleshooting

**Admin login shows "Something went wrong"**
- Local: confirm Laravel is listening on 127.0.0.1:8001 and you are browsing
  via `localhost:4200` (not a built copy — the relative `/api` path needs the
  ng-serve proxy). Test: `Invoke-RestMethod http://127.0.0.1:8001/api/login -Method Post ...`.
- Live: the Render API is not deployed yet (see above).

**"This site can't be reached — localhost refused to connect"**
- Nothing is listening on the port. Start the dev server (`npm start` in
  `frontend/`) or the Laravel server (step 2 above).

**GitHub Pages "File not found" on pages like /services/otuya-pos**
- The SPA's `404.html` fallback is missing. It is generated automatically by
  the `postbuild` npm script (copy of `index.html`). Rebuild and redeploy.
  Never delete `404.html` from `gh-pages`.

**phpMyAdmin won't open / shows login error**
- Use http://localhost/phpmyadmin (Apache must be running on port 80). Its
  config (`C:\xampp\phpMyAdmin\config.inc.php`) targets `127.0.0.1:3307`
  with root/no-password. Port 3306 is a separate password-protected MySQL —
  do not point the site at it.

**Contact messages arrive by email but not in the database**
- Expected while the Render API is down: the FormSubmit fallback is email-only.
  Deploy the API to get database storage.

**FormSubmit fallback silently delivers nothing**
- FormSubmit requires a one-time confirmation: open the first message in
  fanuelotuya2@gmail.com and click the confirmation link. Until then
  submissions bounce.

**TypeScript errors after pulling/switching branches**
- Run `npx tsc --noEmit --project tsconfig.json` in `frontend/`; fix locally,
  rebuild, redeploy. (Historical bug: a stale `this.networkError` reference in
  contact.component.ts — already removed; do not reintroduce it.)

**Stale site after deploy**
- Hard-refresh (Ctrl+F5). If the old `main-*.js` is still referenced, the
  gh-pages push didn't land — redo step 3 and check `git log origin/gh-pages`.

**Dev server or API port already in use**
- `Get-NetTCPConnection -LocalPort 4200 -State Listen` (and 8001) to find the
  process; stop the old one or restart the background processes.

## Background processes (this machine)

- Angular dev server: `npx ng serve --host 0.0.0.0 --port 4200 --proxy-config proxy.conf.json`
- Laravel API: `php artisan serve --host=127.0.0.1 --port=8001`
