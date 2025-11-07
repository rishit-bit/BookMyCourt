@echo off
echo.
echo ========================================
echo    BookMyCourt - Sports Booking Platform
echo ========================================
echo.
echo Starting BookMyCourt application...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check if MongoDB is running (optional check)
echo Checking MongoDB connection...
echo Note: Make sure MongoDB is running on localhost:27017
echo.

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing server dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install server dependencies!
        pause
        exit /b 1
    )
)

if not exist "client\node_modules" (
    echo Installing client dependencies...
    cd client
    npm install
    cd ..
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install client dependencies!
        pause
        exit /b 1
    )
)

echo.
echo Dependencies installed successfully!
echo.
echo Starting BookMyCourt in development mode...
echo.
echo The application will open in your browser at:
echo - Frontend: http://localhost:3000
echo - Backend:  http://localhost:5000
echo.
echo Press Ctrl+C to stop the application
echo.

REM Start the application
npm run dev

echo.
echo BookMyCourt has been stopped.
pause


