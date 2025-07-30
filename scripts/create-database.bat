@echo off
echo 🗄️  Database Creation Script for Event Hub
echo ==========================================

echo Choose your database setup option:
echo 1. Local PostgreSQL installation
echo 2. Docker PostgreSQL (recommended)
echo 3. Exit

set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" goto local_postgres
if "%choice%"=="2" goto docker_postgres
if "%choice%"=="3" goto exit
echo Invalid choice. Exiting...
goto exit

:local_postgres
echo Setting up local PostgreSQL...

:: Check if PostgreSQL is installed
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL is not installed.
    echo Please install PostgreSQL first from https://www.postgresql.org/download/
    pause
    goto exit
)

set /p db_name="Database name (default: event_hub): "
if "%db_name%"=="" set db_name=event_hub

set /p db_user="Database user (default: postgres): "
if "%db_user%"=="" set db_user=postgres

set /p db_password="Database password: "

echo Creating database: %db_name%
createdb -U %db_user% %db_name% 2>nul && echo ✅ Database created successfully || echo ⚠️  Database may already exist

set connection_string=postgresql://%db_user%:%db_password%@localhost:5432/%db_name%
echo Connection string: %connection_string%

:: Update .env file
if exist .env (
    echo ✅ Updating .env file
) else (
    copy .env.example .env
    echo ✅ Created .env file
)

:: Note: Windows batch doesn't have good sed equivalent, user needs to manually update
echo Please update your .env file with:
echo DATABASE_URL=%connection_string%

goto finish

:docker_postgres
echo Setting up Docker PostgreSQL...

:: Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed.
    echo Please install Docker Desktop first.
    pause
    goto exit
)

echo Starting PostgreSQL container...
docker-compose up -d postgres

echo Waiting for database to be ready...
timeout /t 10 /nobreak >nul

:: Check if container is running
docker ps | findstr "event-hub-db" >nul
if %errorlevel% equ 0 (
    echo ✅ PostgreSQL container is running
    echo Connection string: postgresql://postgres:password@localhost:5432/event_hub
    
    set /p start_pgadmin="Start pgAdmin web interface? (y/N): "
    if /i "%start_pgadmin%"=="y" (
        docker-compose up -d pgadmin
        echo ✅ pgAdmin started at http://localhost:8080
        echo    Email: admin@admin.com
        echo    Password: admin
    )
    
    :: Update .env file
    set connection_string=postgresql://postgres:password@localhost:5432/event_hub
    if exist .env (
        echo ✅ .env file exists - please update DATABASE_URL manually
    ) else (
        copy .env.example .env
        echo ✅ Created .env file - please update DATABASE_URL manually
    )
    
    echo Please update your .env file with:
    echo DATABASE_URL=%connection_string%
    
) else (
    echo ❌ Failed to start PostgreSQL container
    goto exit
)

goto finish

:finish
echo.
echo Next steps:
echo 1. Update .env file with the database URL shown above
echo 2. Install dependencies: npm install
echo 3. Push database schema: npm run db:push
echo 4. Start development server: npm run dev
echo.
echo Database management:
echo - Use Drizzle Studio: npm run db:studio
echo - Connect with psql: psql "your_database_url"
echo.

:exit
pause