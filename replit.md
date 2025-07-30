# Event Hub - Tier-Based Event Platform

## Overview

Event Hub is a modern full-stack web application that provides a tier-based event access system. Users can view and access events based on their subscription tier (Free, Silver, Gold, Platinum), with higher tiers unlocking more exclusive events. The application features user authentication, responsive design, and an interactive upgrade system for testing different access levels.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for component-based UI development
- **Tailwind CSS** with shadcn/ui component library for styling and design system consistency
- **TanStack Query** for efficient server state management and data fetching
- **Wouter** for lightweight client-side routing
- **Vite** for fast development builds and hot module replacement

### Backend Architecture
- **Node.js** with Express.js for the REST API server
- **TypeScript** with ES modules for type safety and modern JavaScript features
- **Session-based authentication** using Passport.js with local strategy
- **RESTful API design** with clear separation of concerns

### Database Design
- **PostgreSQL** as the primary database
- **Drizzle ORM** for type-safe database operations and schema management
- **Session storage** in PostgreSQL using connect-pg-simple for persistent sessions

## Key Components

### Authentication System
- Custom username/password authentication using Passport.js Local Strategy
- Password hashing with Node.js crypto scrypt function
- Session-based authentication with PostgreSQL session store
- Authentication middleware for protected routes

### Tier-Based Access Control
- Four-tier system: Free, Silver, Gold, Platinum
- Hierarchical access (higher tiers include all lower tier events)
- Dynamic event filtering based on user tier
- Interactive tier upgrade system for testing

### Database Schema
- **Users table**: Stores user credentials, profile info, and tier level
- **Events table**: Contains event details with tier requirements
- **Sessions table**: Manages user sessions (required for authentication)

### Frontend State Management
- TanStack Query for server state caching and synchronization
- React Context for authentication state
- Form management with React Hook Form and Zod validation

## Data Flow

1. **User Authentication**: Login/register → session creation → user context update
2. **Event Loading**: User tier verification → filtered event query → display with access controls
3. **Tier Upgrades**: Tier selection → database update → event list refresh → access level changes

## External Dependencies

### Frontend Dependencies
- **@radix-ui**: Comprehensive component primitives for accessible UI
- **@tanstack/react-query**: Server state management and caching
- **@hookform/resolvers**: Form validation integration
- **lucide-react**: Icon library for consistent iconography
- **date-fns**: Date manipulation and formatting

### Backend Dependencies
- **passport & passport-local**: Authentication strategy implementation
- **connect-pg-simple**: PostgreSQL session store integration
- **drizzle-orm**: Type-safe ORM for database operations
- **@neondatabase/serverless**: Serverless PostgreSQL driver

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first CSS framework
- **ESLint & Prettier**: Code quality and formatting

## Deployment Strategy

### Build Process
- Frontend builds to `dist/public` using Vite
- Backend bundles to `dist/index.js` using esbuild
- Environment-specific configuration through `.env` files

### Database Requirements
- PostgreSQL instance with connection string in `DATABASE_URL`
- Automatic schema synchronization with `npm run db:push`
- Session table creation handled automatically by connect-pg-simple

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret key for session encryption
- `NODE_ENV`: Environment mode (development/production)

### Local Development
- Single command setup with `npm run dev`
- Database seeding with sample events on startup
- Hot module replacement for frontend development
- Automatic TypeScript compilation and error checking

The application follows a clean architecture pattern with clear separation between presentation, business logic, and data layers. The tier-based access system is implemented through database-level filtering rather than client-side restrictions, ensuring security and proper access control.