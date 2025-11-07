Write-Host ""
Write-Host "========================================"
Write-Host "    BookMyCourt - Sports Booking Platform"
Write-Host "========================================"
Write-Host ""
Write-Host "Starting BookMyCourt application..."
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: npm is not installed!" -ForegroundColor Red
    Write-Host "Please install npm or reinstall Node.js" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if MongoDB is running (optional check)
Write-Host "Checking MongoDB connection..."
Write-Host "Note: Make sure MongoDB is running on localhost:27017" -ForegroundColor Yellow
Write-Host ""

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing server dependencies..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install server dependencies!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

if (-not (Test-Path "client\node_modules")) {
    Write-Host "Installing client dependencies..." -ForegroundColor Cyan
    Set-Location client
    npm install
    Set-Location ..
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install client dependencies!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""
Write-Host "Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Starting BookMyCourt in development mode..." -ForegroundColor Cyan
Write-Host ""
Write-Host "The application will open in your browser at:" -ForegroundColor Yellow
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "- Backend:  http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the application" -ForegroundColor Yellow
Write-Host ""

# Start the application
npm run dev

Write-Host ""
Write-Host "BookMyCourt has been stopped." -ForegroundColor Yellow
Read-Host "Press Enter to exit"

