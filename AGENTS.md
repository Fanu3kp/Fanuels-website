# Frontend (Angular)

## Build
```
npm run build
```

## Type checking
```
npx tsc --noEmit --project tsconfig.json
```

## Lint
```
npx eslint src --ext .ts,.scss 2>/dev/null || npm run lint 2>/dev/null || true
```

## Deployment (Apache + Laravel)

### Start services
```powershell
# Apache (httpd.exe from XAMPP)
& "C:\xampp\apache\bin\httpd.exe"

# Laravel API server
php artisan serve --host=0.0.0.0 --port=8001

# Localtunnel (temporary public access)
npx --yes localtunnel@latest --port 80 --subdomain otuya-global
```

### DuckDNS autoupdate
- **Scheduled Task**: "DuckDNS Update - Otuya Global" (every 12 minutes, respects 5/hour limit)
- **Token file**: `C:\Config\duckdns-token.txt`
- **Script**: `duckdns-update.ps1`

### Apache configuration
- **Config**: `C:\xampp\apache\conf\extra\httpd-vhosts.conf`
- **Modules to enable**: `mod_deflate`, `mod_expires`, `mod_filter`, `mod_headers`, `mod_rewrite`, `mod_proxy`, `mod_ssl`
- **SSL cert**: `C:\Temp\otuya-mkcert.crt` / `.key` (mkcert, trusted locally)
- **DocumentRoot**: `C:\xampp\htdocs\Fanuels website\frontend\dist\frontend\browser`

### Firewall (requires admin)
```cmd
netsh advfirewall firewall add rule name="Apache HTTP"  dir=in action=allow protocol=TCP localport=80
netsh advfirewall firewall add rule name="Apache HTTPS" dir=in action=allow protocol=TCP localport=443
```

### Access URLs
- **Local (trusted SSL)**: `https://localhost/`
- **Local (HTTP)**: `http://localhost/`
- **Public tunnel**: `https://otuya-global.loca.lt/`
- **Production**: `https://otuyaglobal.duckdns.org/` (needs firewall open)

## Notes
- Angular build is production-optimized (AOT, minification, cssnano)
- Lazy-loaded components via `loadComponent`
- Admin styles loaded on-demand via `styles-admin.scss`
- Vanta/Three.js removed (replaced with CSS animations)
- GZIP + 1-year browser caching via Apache mod_deflate/mod_expires
