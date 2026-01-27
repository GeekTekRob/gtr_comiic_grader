@echo off
REM GTR Comic Grader - Windows Setup
REM This file simplifies installation for Windows users

echo.
echo ==========================================
echo   GTR Comic Grader - Setup
echo   Getting you ready to grade comics!
echo ==========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please download Node.js from:
    echo   https://nodejs.org
    echo.
    echo After installing Node.js, run this script again.
    pause
    exit /b 1
)

echo [1/3] Checking Node.js... OK

REM Install root dependencies
echo [2/3] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

REM Install client dependencies
echo [3/3] Installing client dependencies...
cd client
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install client dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ==========================================
echo   Setup Complete!
echo ==========================================
echo.
echo Next: Run the setup wizard
echo   npm run setup
echo.
echo Then start the app:
echo   npm run dev
echo.
pause
