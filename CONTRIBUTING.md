# Contributing to Event Hub

Thank you for your interest in contributing to Event Hub! This document provides guidelines and information for contributors.

## Development Setup

1. **Fork and Clone**
   ```bash
   git fork <repository-url>
   git clone <your-fork-url>
   cd event-hub
   ```

2. **Quick Setup**
   ```bash
   # For Linux/Mac
   ./scripts/setup-local.sh
   
   # For Windows
   ./scripts/setup-local.bat
   
   # Or manual setup
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   npm run db:push
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

## Project Structure

```
├── client/               # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions
│   │   └── pages/       # Page components
├── server/              # Express backend
│   ├── auth.ts         # Authentication logic
│   ├── db.ts           # Database connection
│   ├── routes.ts       # API routes
│   └── storage.ts      # Data access layer
├── shared/             # Shared types and schemas
└── scripts/            # Development scripts
```

## Coding Standards

### TypeScript
- Use strict TypeScript configuration
- Always type function parameters and return values
- Use shared types from `shared/schema.ts`
- Prefer interfaces over types for object shapes

### React
- Use functional components with hooks
- Use custom hooks for complex logic
- Follow the existing component structure
- Use proper TypeScript props interfaces

### Backend
- Use async/await instead of callbacks
- Implement proper error handling
- Use Drizzle ORM for database operations
- Follow RESTful API conventions

### Styling
- Use Tailwind CSS for styling
- Use shadcn/ui components when possible
- Follow the existing design system
- Ensure responsive design (mobile-first)

## Database Changes

1. **Schema Changes**
   - Modify `shared/schema.ts`
   - Run `npm run db:push` to apply changes
   - Test migrations thoroughly

2. **Seed Data**
   - Add seed data to `server/storage.ts`
   - Ensure data is consistent across tiers

## Testing

### Manual Testing
- Test all user flows (signup, login, tier changes)
- Verify responsive design on different screen sizes
- Check database operations work correctly
- Test error states and edge cases

### Automated Testing (Future)
- Unit tests for utilities and hooks
- Integration tests for API endpoints
- E2E tests for critical user flows

## Commit Guidelines

Use conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Build/dependency changes

Examples:
```
feat: add tier upgrade modal
fix: resolve authentication redirect issue
docs: update local development setup
```

## Pull Request Process

1. **Before Submitting**
   - Test your changes thoroughly
   - Run type checking: `npm run check`
   - Ensure database migrations work
   - Update documentation if needed

2. **PR Requirements**
   - Clear description of changes
   - Link to related issues
   - Screenshots for UI changes
   - Testing instructions

3. **Review Process**
   - Code review by maintainers
   - Automated checks must pass
   - Address feedback promptly

## Common Development Tasks

### Adding a New Page
1. Create component in `client/src/pages/`
2. Add route in `client/src/App.tsx`
3. Update navigation if needed

### Adding a New API Endpoint
1. Define route in `server/routes.ts`
2. Add storage methods in `server/storage.ts`
3. Update types in `shared/schema.ts`
4. Add frontend integration

### Adding a New Component
1. Create in `client/src/components/`
2. Follow existing naming patterns
3. Include proper TypeScript types
4. Use Tailwind for styling

## Debugging

### Database Issues
- Use `npm run db:studio` to inspect data
- Check connection string in `.env`
- Verify PostgreSQL is running

### Authentication Issues
- Check session configuration
- Verify SESSION_SECRET is set
- Inspect browser dev tools for cookies

### Build Issues
- Clear cache: `npm run clean && npm install`
- Check TypeScript errors: `npm run check`
- Verify all imports are correct

## Getting Help

- Create an issue for bugs or feature requests
- Check existing issues before creating new ones
- Provide detailed reproduction steps
- Include environment information

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).