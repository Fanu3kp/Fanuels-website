@echo off
title Otuya Global - Start Local Server

echo ============================================
echo   Otuya Global - Local Development Server
echo ============================================
echo.

echo [1/4] Starting Apache HTTP Server (with GZIP + caching + OPcache)...
net start Apache2.4 2>nul
if %errorlevel% neq 0 (
    echo Apache service not found, starting httpd directly...
    start /min "Apache" "C:\xampp\apache\bin\httpd.exe"
)
timeout /t 2 /nobreak >nul
echo Apache started.

echo.
echo [2/4] Starting Laravel API Server (with OPcache)...
start /min "Laravel" cmd /c "cd /d "C:\xampp\htdocs\Fanuels website\backend" && C:\xampp\php\php.exe artisan serve --host=0.0.0.0 --port=8001"
timeout /t 2 /nobreak >nul
echo Laravel API started.

echo.
echo [3/4] Starting Cloudflare Tunnel (bypasses ISP firewall)...
echo (URL will be printed in the Cloudflare Tunnel window)
start /min "Cloudflare Tunnel" cmd /c "C:\Users\HomePC\cloudflared.exe tunnel --url http://localhost:80 --no-autoupdate"
timeout /t 5 /nobreak >nul
echo Cloudflare Tunnel started.

echo.
echo [4/4] Starting DuckDNS auto-updater (scheduled separately)...
echo Scheduled task: "DuckDNS Update - Otuya Global" (every 12 min)
echo.

echo ============================================
echo All services started successfully!
echo ============================================
echo.
echo Access the site at:
echo   Local HTTPS:  https://localhost
echo   Local HTTP:   http://localhost
echo   Cloudflare:   https://airfare-lift-dave-world.trycloudflare.com
echo   (URL changes each restart — check the Cloudflare Tunnel window)
echo.
echo Production (firewall must be open for external access):
echo   http://otuyaglobal.duckdns.org
echo   https://otuyaglobal.duckdns.org
echo.
pause
