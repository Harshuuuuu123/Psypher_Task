# Event Hub - Tier-Based Event Platform

## Overview

Event Hub is a full-stack web application that provides a tier-based event access system. Users can view and access events based on their subscription tier (Free, Silver, Gold, Platinum), with higher tiers unlocking premium events. The application features user authentication via Replit's OAuth system and a modern React frontend with shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Authentication**: Replit OAuth with Passport.js
- **Session Management**: Express sessions with PostgreSQL storage
- **Database ORM**: Drizzle ORM with Neon PostgreSQL

### Database Design
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle Kit for migrations
- **Key Tables**:
  - `users`: User profiles with tier information
  - `events`: Events with tier-based access control
  - `sessions`: Session storage for authentication

## Key Components

### Authentication System
- **OAuth Provider**: Replit OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Security Features**: HTTP-only cookies, CSRF protection, secure session management
- **User Management**: Automatic user creation/updates on login

### Tier System
- **Tiers**: Free, Silver, Gold, Platinum (hierarchical access)
- **Access Control**: Events are filtered based on user tier
- **Upgrade Flow**: In-app tier upgrade simulation (modal-based)

### Event Management
- **Event Display**: Card-based layout with tier indicators
- **Access Control**: Locked events show upgrade prompts
- **Data Seeding**: Automatic event creation on server startup

### UI/UX Components
- **Design System**: shadcn/ui with Radix UI primitives
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Elements**: Toast notifications, modals, dropdown menus
- **Loading States**: Skeleton loaders and proper loading indicators

## Data Flow

1. **Authentication Flow**: User authenticates via Replit OAuth → Session created → User data upserted to database
2. **Event Access Flow**: User tier retrieved → Events filtered by tier → Client receives accessible events
3. **Upgrade Flow**: User selects new tier → API validates request → Database updated → Client state refreshed

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **express**: Backend web framework
- **passport**: Authentication middleware

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **wouter**: Lightweight React router

### Development Tools
- **vite**: Frontend build tool and dev server
- **tsx**: TypeScript execution for development
- **esbuild**: Production backend bundling

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Database**: Drizzle Kit manages schema migrations

### Environment Configuration
- **Development**: Uses tsx for hot reloading, Vite dev server
- **Production**: Compiled JavaScript bundle with static file serving
- **Database**: Requires `DATABASE_URL` environment variable

### Hosting Requirements
- **Runtime**: Node.js environment with ES module support
- **Database**: PostgreSQL database (optimized for Neon)
- **Environment Variables**: 
  - `DATABASE_URL`: PostgreSQL connection string
  - `SESSION_SECRET`: Session encryption key
  - `REPL_ID`: Replit authentication identifier
  - `ISSUER_URL`: OAuth issuer endpoint

### Security Considerations
- Session-based authentication with secure cookies
- Environment variable protection for sensitive data
- Database connection pooling for scalability
- CORS and security headers configuration