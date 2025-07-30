@echo off
echo 🚀 Setting up Event Hub for local development...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

:: Check if PostgreSQL is installed
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  PostgreSQL not found. You can:
    echo    1. Install PostgreSQL locally
    echo    2. Use Docker: docker-compose up -d postgres
    echo    3. Use a cloud PostgreSQL service
)

:: Install dependencies
echo 📦 Installing dependencies...
npm install

:: Check if .env exists
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please edit .env file with your database credentials
) else (
    echo ✅ .env file already exists
)

:: Create database if using local PostgreSQL
set /p create_db="🔧 Create local PostgreSQL database? (y/N): "
if /i "%create_db%"=="y" (
    set /p db_name="Database name (default: event_hub): "
    if "%db_name%"=="" set db_name=event_hub
    
    echo Creating database: %db_name%
    createdb %db_name% 2>nul || echo Database may already exist
)

:: Push database schema
echo 🗄️  Setting up database schema...
npm run db:push

echo.
echo ✅ Setup complete! 🎉
echo.
echo Next steps:
echo 1. Edit .env file with your database credentials
echo 2. Run: npm run dev
echo 3. Open: http://localhost:5000
echo.
echo Available commands:
echo   npm run dev          # Start development server
echo   npm run db:studio    # Open database GUI
echo   npm run build        # Build for production
echo.
pause