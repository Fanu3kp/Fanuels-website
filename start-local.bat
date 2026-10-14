@echo off
title Otuya Global - Start Local Server

echo ============================================
echo   Otuya Global - Local Development Server
echo ============================================
echo.

echo Starting Apache HTTP Server...
net start Apache2.4 2>nul
if %errorlevel% neq 0 (
    echo Apache service not found, starting httpd directly...
    start /min "Apache" "C:\xampp\apache\bin\httpd.exe"
)
timeout /t 2 /nobreak >nul
echo Apache started.

echo.
echo Starting Laravel API Server...
start /min "Laravel" cmd /c "cd /d "C:\xampp\htdocs\Fanuels website\backend" && C:\xampp\php\php.exe artisan serve --host=0.0.0.0 --port=8001"
timeout /t 2 /nobreak >nul
echo Laravel API started.

echo.
echo All services started.
echo.
echo Access the site at:
echo   HTTPS:  https://localhost
echo   HTTP:   http://localhost
echo.
echo For external access (requires DuckDNS + firewall):
echo   http://otuyaglobal.duckdns.org
echo.
pause
