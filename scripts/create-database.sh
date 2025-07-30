#!/bin/bash

echo "🗄️  Database Creation Script for Event Hub"
echo "=========================================="

# Function to create PostgreSQL database
create_postgres_db() {
    local db_name=$1
    local db_user=$2
    local db_password=$3
    
    echo "Creating PostgreSQL database..."
    
    # Check if PostgreSQL is installed
    if ! command -v psql &> /dev/null; then
        echo "❌ PostgreSQL is not installed."
        echo "Please install PostgreSQL first:"
        echo "  - Windows: Download from https://www.postgresql.org/download/"
        echo "  - macOS: brew install postgresql"
        echo "  - Linux: sudo apt install postgresql postgresql-contrib"
        return 1
    fi
    
    # Create database
    echo "Creating database: $db_name"
    createdb "$db_name" 2>/dev/null && echo "✅ Database created successfully" || echo "⚠️  Database may already exist"
    
    # Generate connection string
    local connection_string="postgresql://${db_user}:${db_password}@localhost:5432/${db_name}"
    echo "Connection string: $connection_string"
    
    return 0
}

# Function to setup Docker database
setup_docker_db() {
    echo "Setting up Docker PostgreSQL..."
    
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed."
        echo "Please install Docker Desktop first."
        return 1
    fi
    
    # Start Docker containers
    echo "Starting PostgreSQL container..."
    docker-compose up -d postgres
    
    # Wait for database to be ready
    echo "Waiting for database to be ready..."
    sleep 10
    
    # Check if container is running
    if docker ps | grep -q "event-hub-db"; then
        echo "✅ PostgreSQL container is running"
        echo "Connection string: postgresql://postgres:password@localhost:5432/event_hub"
        
        # Optional: Start pgAdmin
        read -p "Start pgAdmin web interface? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose up -d pgadmin
            echo "✅ pgAdmin started at http://localhost:8080"
            echo "   Email: admin@admin.com"
            echo "   Password: admin"
        fi
    else
        echo "❌ Failed to start PostgreSQL container"
        return 1
    fi
    
    return 0
}

# Main menu
echo "Choose your database setup option:"
echo "1. Local PostgreSQL installation"
echo "2. Docker PostgreSQL (recommended)"
echo "3. Exit"

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "Setting up local PostgreSQL..."
        read -p "Database name (default: event_hub): " db_name
        db_name=${db_name:-event_hub}
        
        read -p "Database user (default: postgres): " db_user
        db_user=${db_user:-postgres}
        
        read -s -p "Database password: " db_password
        echo
        
        if create_postgres_db "$db_name" "$db_user" "$db_password"; then
            # Update .env file
            connection_string="postgresql://${db_user}:${db_password}@localhost:5432/${db_name}"
            
            if [ -f .env ]; then
                # Update existing .env
                sed -i.bak "s|^DATABASE_URL=.*|DATABASE_URL=$connection_string|" .env
                echo "✅ Updated .env file"
            else
                # Create new .env
                cp .env.example .env
                sed -i.bak "s|^DATABASE_URL=.*|DATABASE_URL=$connection_string|" .env
                echo "✅ Created .env file"
            fi
        fi
        ;;
    2)
        setup_docker_db
        if [ $? -eq 0 ]; then
            # Update .env file
            connection_string="postgresql://postgres:password@localhost:5432/event_hub"
            
            if [ -f .env ]; then
                sed -i.bak "s|^DATABASE_URL=.*|DATABASE_URL=$connection_string|" .env
                echo "✅ Updated .env file"
            else
                cp .env.example .env
                sed -i.bak "s|^DATABASE_URL=.*|DATABASE_URL=$connection_string|" .env
                echo "✅ Created .env file"
            fi
        fi
        ;;
    3)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid choice. Exiting..."
        exit 1
        ;;
esac

# Final setup steps
echo ""
echo "Next steps:"
echo "1. Install dependencies: npm install"
echo "2. Push database schema: npm run db:push"
echo "3. Start development server: npm run dev"
echo ""
echo "Database management:"
echo "- Use Drizzle Studio: npm run db:studio"
echo "- Connect with psql: psql \"$connection_string\""
echo ""