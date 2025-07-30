# Event Hub - Tier-Based Event Platform

A modern full-stack web application that provides a tier-based event access system. Users can view and access events based on their subscription tier (Free, Silver, Gold, Platinum), with higher tiers unlocking premium events.

## Features

- **User Authentication**: Custom username/password authentication system
- **Tier-Based Access**: Events filtered by user subscription tier
- **Responsive Design**: Modern UI with Tailwind CSS and shadcn/ui components
- **Real-time Updates**: TanStack Query for efficient data fetching
- **Tier Upgrades**: Interactive upgrade system for testing different access levels

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** with shadcn/ui component library
- **TanStack Query** for server state management
- **Wouter** for client-side routing
- **Vite** for development and production builds

### Backend
- **Node.js** with Express.js
- **TypeScript** with ES modules
- **PostgreSQL** with Drizzle ORM
- **Session-based authentication**

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd event-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/event_hub
   SESSION_SECRET=your-super-secret-session-key-here
   ```

4. **Database Setup**
   ```bash
   # Create database
   createdb event_hub
   
   # Push database schema
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio for database management

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── pages/         # Page components
├── server/                # Backend Express application
│   ├── db.ts             # Database connection
│   ├── storage.ts        # Data access layer
│   ├── auth.ts           # Authentication logic
│   └── routes.ts         # API routes
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema and types
└── package.json
```

## User Tiers

- **Free**: Access to community events and basic networking
- **Silver**: Premium workshops and wine tastings
- **Gold**: VIP networking and industry leader events  
- **Platinum**: Exclusive summits and C-level access

## Authentication

The application uses session-based authentication with:
- Custom login/signup forms
- Password hashing with scrypt
- PostgreSQL session storage
- Secure session management

## Database Schema

- **users**: User profiles with tier information
- **events**: Events with tier-based access control
- **sessions**: Session storage for authentication

## Development Notes

- The frontend and backend run on the same port (5000) using Vite's proxy
- Hot reloading is enabled for both frontend and backend
- Database changes should be made through Drizzle schema updates
- Use `npm run db:push` instead of manual migrations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure code quality
5. Submit a pull request

## License

This project is licensed under the MIT License.