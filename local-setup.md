# Local Development Setup

This guide will help you set up the Event Hub application on your local machine.

## Quick Start

1. **Prerequisites**
   - Node.js 18+ installed
   - PostgreSQL installed and running
   - Git (to clone the repository)

2. **Clone and Install**
   ```bash
   git clone <your-repo-url>
   cd event-hub
   npm install
   ```

3. **Database Setup**
   ```bash
   # Create a new PostgreSQL database
   createdb event_hub
   
   # Or using psql
   psql -c "CREATE DATABASE event_hub;"
   ```

4. **Environment Configuration**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your database credentials
   # DATABASE_URL=postgresql://username:password@localhost:5432/event_hub
   # SESSION_SECRET=your-long-random-secret-key
   ```

5. **Initialize Database**
   ```bash
   npm run db:push
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open http://localhost:5000 in your browser.

## Environment Variables

Create a `.env` file with these variables:

```env
# Required
DATABASE_URL=postgresql://username:password@localhost:5432/event_hub
SESSION_SECRET=your-super-secret-session-key-here-make-it-long-and-random

# Optional (if not using DATABASE_URL)
PGHOST=localhost
PGPORT=5432
PGUSER=your-username
PGPASSWORD=your-password
PGDATABASE=event_hub
```

## Database Schema

The application will automatically create these tables:
- `users` - User accounts with tier information
- `events` - Events with tier-based access
- `sessions` - Session storage for authentication

## Available Commands

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start           # Start production server

# Database
npm run db:push     # Push schema changes to database
npm run db:studio   # Open Drizzle Studio (database GUI)

# Utility
npm run type-check  # Run TypeScript type checking
```

## Default User Tiers

The application supports four tier levels:
- **Free** - Basic community events
- **Silver** - Premium workshops and networking
- **Gold** - VIP events and industry leaders
- **Platinum** - Exclusive summits and C-level access

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL format
   - Verify database exists

2. **Port Already in Use**
   - Change port in package.json dev script
   - Kill process using port 5000: `lsof -ti:5000 | xargs kill`

3. **Session Secret Error**
   - Ensure SESSION_SECRET is set in .env
   - Make it at least 32 characters long

### Development Tips

- The frontend and backend run on the same port (5000)
- Database changes should be made in `shared/schema.ts`
- Always run `npm run db:push` after schema changes
- Use Drizzle Studio to inspect database: `npm run db:studio`

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set production environment variables
3. Start production server:
   ```bash
   npm start
   ```

For production deployment, consider using:
- PM2 for process management
- Nginx as reverse proxy
- PostgreSQL as production database
- Environment-specific configuration