# health-check.ps1
Write-Host "DSA Tracker - System Health Check" -ForegroundColor Cyan
Write-Host "==================================="

# 1. Check Node.js and npm
Write-Host "`nChecking Node.js and npm..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    $npmVersion = npm -v
    Write-Host "OK Node $nodeVersion" -ForegroundColor Green
    Write-Host "OK npm $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR Node.js/npm not found. Please install Node.js." -ForegroundColor Red
    exit 1
}

# 2. Check required files and folders
Write-Host "`nChecking file structure..." -ForegroundColor Yellow
$requiredPaths = @(
    "bookmarks.html",
    "scripts/parseBookmarks.js",
    "backend/index.js",
    "backend/package.json",
    "frontend/package.json",
    "frontend/src/index.js",
    "frontend/src/data/dsaData.json"
)
$allGood = $true
foreach ($path in $requiredPaths) {
    if (Test-Path $path) {
        Write-Host "OK $path" -ForegroundColor Green
    } else {
        Write-Host "MISSING $path" -ForegroundColor Red
        $allGood = $false
    }
}
if (-not $allGood) {
    Write-Host "WARNING: Some files are missing. The app may not work correctly." -ForegroundColor Red
}

# 3. Check environment variables in frontend
Write-Host "`nChecking Firebase environment variables..." -ForegroundColor Yellow
if (Test-Path "frontend/.env") {
    Write-Host "OK frontend/.env exists" -ForegroundColor Green
    # Optionally check for required keys
    $envContent = Get-Content "frontend/.env" -Raw
    $requiredKeys = @("REACT_APP_API_KEY", "REACT_APP_AUTH_DOMAIN", "REACT_APP_PROJECT_ID")
    $missingKeys = @()
    foreach ($key in $requiredKeys) {
        if ($envContent -notmatch "$key=") {
            $missingKeys += $key
        }
    }
    if ($missingKeys.Count -eq 0) {
        Write-Host "OK All required Firebase keys present" -ForegroundColor Green
    } else {
        Write-Host "MISSING keys: $($missingKeys -join ', ')" -ForegroundColor Red
    }
} else {
    Write-Host "MISSING frontend/.env - create it from .env.example" -ForegroundColor Red
}

# 4. Check backend service account key
if (Test-Path "backend/serviceAccountKey.json") {
    Write-Host "OK backend/serviceAccountKey.json exists" -ForegroundColor Green
} else {
    Write-Host "MISSING backend/serviceAccountKey.json - required for Firebase Admin" -ForegroundColor Red
}

# 5. Try to start backend server and test API
Write-Host "`nTesting backend API..." -ForegroundColor Yellow
$backendProcess = Start-Process -FilePath "node" -ArgumentList "backend/index.js" -PassThru -NoNewWindow
Start-Sleep -Seconds 3  # give server time to start

try {
    $sheetResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/sheet" -ErrorAction Stop
    if ($sheetResponse.Count -gt 0) {
        Write-Host "OK /api/sheet - received data" -ForegroundColor Green
    } else {
        Write-Host "WARNING /api/sheet - returned empty array" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR /api/sheet - failed: $_" -ForegroundColor Red
}

# Stop backend process
Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue

# 6. Check frontend build
Write-Host "`nTesting frontend build..." -ForegroundColor Yellow
Push-Location frontend
try {
    $buildOutput = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK Frontend builds successfully" -ForegroundColor Green
    } else {
        Write-Host "ERROR Frontend build failed" -ForegroundColor Red
        Write-Host $buildOutput
    }
} finally {
    Pop-Location
}

# 7. Check if dev server can start (optional, may keep running)
Write-Host "`nChecking frontend dev server start..." -ForegroundColor Yellow
Push-Location frontend
$devProcess = Start-Process -FilePath "npm" -ArgumentList "start" -PassThru -NoNewWindow
Start-Sleep -Seconds 5
if ($devProcess.HasExited) {
    Write-Host "ERROR Frontend dev server failed to start" -ForegroundColor Red
} else {
    Write-Host "OK Frontend dev server started (PID: $($devProcess.Id)) - press Ctrl+C in its window to stop" -ForegroundColor Green
    # Keep it running; user will stop manually
}
Pop-Location

Write-Host "`nHealth check completed!" -ForegroundColor Cyan