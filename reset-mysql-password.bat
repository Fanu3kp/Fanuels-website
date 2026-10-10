@echo off
REM ============================================================
REM  Otuya Elite - MySQL root password reset
REM  Run this file AS ADMINISTRATOR (right-click > Run as administrator)
REM ============================================================

echo.
echo  Resetting the MySQL root password to: fanatech
echo.
pause

echo [1/6] Stopping the MySQL57 service...
net stop MySQL57
if errorlevel 1 goto :failed

echo [2/6] Starting MySQL with --skip-grant-tables...
start "" /B "C:\xampp\mysql\bin\mysqld.exe" --skip-grant-tables --skip-networking=0 --port=3306
timeout /t 6 /nobreak >nul

echo [3/6] Setting the new password...
"C:\xampp\mysql\bin\mysql.exe" -u root --skip-password < "%~dp0reset-password.sql"
if errorlevel 1 goto :failed

echo [4/6] Shutting the temporary server down...
"C:\xampp\mysql\bin\mysqladmin.exe" -u root --skip-password shutdown
timeout /t 4 /nobreak >nul

echo [5/6] Restarting the MySQL57 service...
net start MySQL57
if errorlevel 1 goto :failed

echo [6/6] Verifying the new credentials...
timeout /t 4 /nobreak >nul
"C:\xampp\mysql\bin\mysql.exe" -u root -pfanatech -e "SELECT 'Password works' AS result;"
if errorlevel 1 goto :failed

echo.
echo  ============================================
echo   Done. MySQL root password is now: fanatech
echo  ============================================
echo.
pause
exit /b 0

:failed
echo.
echo  RESET FAILED. Restore the original my.ini if it was
echo  changed, then try again.
echo.
pause
exit /b 1