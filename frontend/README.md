# Frontend — Otuya Global (Angular 18)

The public corporate site. Source in `src/`, production build in
`dist/frontend/browser/`.

## Commands

```bash
npm install
npm start          # ng serve on http://localhost:4200 (with API proxy)
npm run build      # production build; postbuild copies index.html -> 404.html
npx tsc --noEmit --project tsconfig.json   # type-check
```

## Configuration

- `src/environments/environment.ts` — compiled-in `apiUrl`
  (Render API) and site metadata.
- `proxy.conf.json` — `ng serve` forwards `/api` to
  `http://127.0.0.1:8001` (local Laravel).
- `src/app/core/api.service.ts` — when the page is opened from
  `localhost`/`127.0.0.1`, API calls use the relative `/api`
  (dev proxy); otherwise the compiled-in Render URL. This is why
  the admin panel works locally without CORS setup.

## Structure

```
src/app/
├── pages/      route components (home, services, products, contact, …)
├── admin/      admin panel (login, services, team, messages, settings, …)
├── layout/     site header, footer
├── core/       ApiService, models, mock-catalog (offline product data)
└── shared/     page hero, lazy image, reveal, newsletter, cookie consent
```

## Hosting notes

- GitHub Pages serves the `gh-pages` branch (custom domain
  `otuyaglobal.duckdns.org` via `CNAME`).
- `404.html` (generated from `index.html` by `postbuild`) is the
  SPA fallback — **never delete it** or client-side routes like
  `/services/otuya-pos` show GitHub's default 404.
- Images live in `public/images/` and are copied into the build by
  the Angular asset pipeline.

For the full deploy procedure (worktree push to `gh-pages`) and
troubleshooting, see [`../OPS.md`](../OPS.md).
