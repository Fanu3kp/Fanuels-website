@echo off
title Otuya Global - Start Local Server

echo ============================================
echo   Otuya Global - Local Development Server
echo ============================================
echo.

echo [1/2] Starting Apache HTTP Server (with GZIP + caching + OPcache)...
net start Apache2.4 2>nul
if %errorlevel% neq 0 (
    echo Apache service not found, starting httpd directly...
    start /min "Apache" "C:\xampp\apache\bin\httpd.exe"
)
timeout /t 2 /nobreak >nul
echo Apache started.

echo.
echo [2/2] Starting Laravel API Server (with OPcache)...
start /min "Laravel" cmd /c "cd /d "C:\xampp\htdocs\Fanuels website\backend" && C:\xampp\php\php.exe artisan serve --host=0.0.0.0 --port=8001"
timeout /t 2 /nobreak >nul
echo Laravel API started.

echo.
echo ============================================
echo All services started successfully!
echo ============================================
echo.
echo Access the site at:
echo   Local HTTPS:  https://localhost
echo   Local HTTP:   http://localhost
echo.
pause