@echo off
REM ParkWise Phase 3 - Complete Startup Script (Windows)
REM This script starts all services: Database, Backend, Frontend

setlocal enabledelayedexpansion

echo.
echo ========================================
echo ParkWise Phase 3 - Starting All Services
echo ========================================
echo.

REM Check prerequisites
echo Checking prerequisites...

REM Check Java
java -version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Java is not installed. Please install Java 17+
    pause
    exit /b 1
)
echo [OK] Java found

REM Check Node
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed. Please install Node.js 16+
    pause
    exit /b 1
)
echo [OK] Node.js found

REM Check PostgreSQL
psql --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: PostgreSQL is not installed. Please install PostgreSQL 12+
    pause
    exit /b 1
)
echo [OK] PostgreSQL found

echo.
echo Setting up database...

REM Create database
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'parkwise_experiments'" | findstr /c:"1" >nul
if errorlevel 1 (
    echo Creating database: parkwise_experiments
    createdb -U postgres parkwise_experiments
    echo [OK] Database created
) else (
    echo [OK] Database already exists
)

REM Run migrations
echo Running migrations...
psql -U postgres -d parkwise_experiments -f database\migrations\001_create_experiment_tables.sql >nul 2>&1
psql -U postgres -d parkwise_experiments -f database\migrations\002_create_species_identification_tables.sql >nul 2>&1
echo [OK] Migrations completed

echo.
echo Building backend...

REM Build backend
cd backend
call mvn clean install -q
if errorlevel 1 (
    echo ERROR: Backend build failed
    pause
    exit /b 1
)
echo [OK] Backend built

echo.
echo Installing frontend dependencies...

REM Install frontend dependencies
cd ..\frontend
call npm install -q
if errorlevel 1 (
    echo ERROR: Frontend dependency installation failed
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed

echo.
echo ========================================
echo Starting services...
echo ========================================
echo.

REM Start backend in new window
echo Starting Backend (Port 8081)...
cd ..\backend
start "ParkWise Backend" cmd /k "mvn spring-boot:run"
echo [OK] Backend started

REM Wait for backend to be ready
timeout /t 10 /nobreak

REM Start frontend in new window
echo Starting Frontend (Port 3000)...
cd ..\frontend
start "ParkWise Frontend" cmd /k "npm run dev"
echo [OK] Frontend started

echo.
echo ========================================
echo All services started successfully!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8081
echo Database: parkwise_experiments
echo.
echo Available Endpoints:
echo   - Experiments: http://localhost:8081/api/experiments
echo   - Species: http://localhost:8081/api/species
echo   - Analytics: http://localhost:8081/api/analytics
echo.
echo Documentation:
echo   - QUICKSTART.md
echo   - PHASE_3_STARTUP.md
echo   - IMPLEMENTATION_GUIDE.md
echo.
echo Press any key to exit...
pause >nul
