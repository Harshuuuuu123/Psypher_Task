#!/bin/bash

echo "🚀 Setting up Event Hub for local development..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found. You can:"
    echo "   1. Install PostgreSQL locally"
    echo "   2. Use Docker: docker-compose up -d postgres"
    echo "   3. Use a cloud PostgreSQL service"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your database credentials"
else
    echo "✅ .env file already exists"
fi

# Create database if using local PostgreSQL
read -p "🔧 Create local PostgreSQL database? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Database name (default: event_hub): " db_name
    db_name=${db_name:-event_hub}
    
    echo "Creating database: $db_name"
    createdb $db_name 2>/dev/null || echo "Database may already exist"
fi

# Push database schema
echo "🗄️  Setting up database schema..."
npm run db:push

echo ""
echo "✅ Setup complete! 🎉"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your database credentials"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:5000"
echo ""
echo "Available commands:"
echo "  npm run dev          # Start development server"
echo "  npm run db:studio    # Open database GUI"
echo "  npm run build        # Build for production"
echo ""