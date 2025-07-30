# Database Setup Options

Choose one of these options to set up your own database for Event Hub:

## Option 1: Local PostgreSQL Installation

### Windows
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember the password you set for the `postgres` user
4. Open Command Prompt and create database:
   ```cmd
   createdb -U postgres event_hub
   ```

### macOS
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql

# Create database
createdb event_hub
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres createdb event_hub
```

**Environment Configuration:**
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/event_hub
SESSION_SECRET=your-super-secret-key-make-it-long-and-random
```

## Option 2: Docker PostgreSQL (Recommended)

1. Install Docker Desktop
2. Use the provided docker-compose.yml:
   ```bash
   docker-compose up -d postgres
   ```

This creates a PostgreSQL container with:
- Database: `event_hub`
- Username: `postgres`
- Password: `password`
- Port: `5432`

**Environment Configuration:**
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/event_hub
SESSION_SECRET=your-super-secret-key-make-it-long-and-random
```

## Option 3: Cloud Database Services

### Neon (PostgreSQL) - Free Tier Available
1. Visit https://neon.tech
2. Sign up for free account
3. Create new project
4. Copy connection string

### Supabase - Free Tier Available
1. Visit https://supabase.com
2. Create new project
3. Get database URL from Settings > Database

### PlanetScale - Free Tier Available
1. Visit https://planetscale.com
2. Create database
3. Get connection string

### AWS RDS, Google Cloud SQL, Azure Database
- Enterprise options with more configuration

**Environment Configuration for Cloud:**
```env
DATABASE_URL=your_cloud_database_connection_string
SESSION_SECRET=your-super-secret-key-make-it-long-and-random
```

## Setup Steps After Database Creation

1. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit .env with your database URL:**
   ```env
   DATABASE_URL=postgresql://username:password@host:port/database_name
   SESSION_SECRET=generate-a-long-random-string-at-least-32-characters
   ```

3. **Install dependencies and setup:**
   ```bash
   npm install
   npm run db:push
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Database Management Tools

### GUI Tools
- **pgAdmin** - Full-featured PostgreSQL administration
- **DBeaver** - Universal database tool
- **Drizzle Studio** - Built-in: `npm run db:studio`

### Command Line
```bash
# Connect to database
psql -d event_hub

# Common commands
\dt          # List tables
\d users     # Describe users table
SELECT * FROM users;  # Query users
```

## Troubleshooting

### Connection Issues
1. Verify database is running: `pg_isready`
2. Check connection string format
3. Ensure database exists: `createdb event_hub`
4. Test connection: `psql "your_database_url"`

### Permission Issues
```bash
# Grant permissions (if needed)
GRANT ALL PRIVILEGES ON DATABASE event_hub TO your_user;
```

### Port Conflicts
- Default PostgreSQL port: 5432
- Change port in connection string if needed
- For Docker: modify docker-compose.yml ports

## Security Notes

- Never commit .env file to version control
- Use strong passwords for production
- Enable SSL for production databases
- Regularly backup your data
- Use environment-specific databases (dev/staging/prod)

## Production Considerations

- Use connection pooling
- Set up automated backups
- Monitor database performance
- Use read replicas for scaling
- Implement proper security groups/firewall rules