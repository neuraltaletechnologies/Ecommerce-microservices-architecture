# Copilot Instructions

This is an E-commerce microservices architecture built with TypeScript in a Turborepo monorepo. Understanding the service patterns and communication flows is critical for effective development.

## Architecture Overview

### Microservices Structure
- **auth-service** (port 8003) - Clerk authentication, user management
- **product-service** (port 8000) - Product CRUD, Prisma/PostgreSQL 
- **order-service** (port 8001) - Order management, MongoDB, Fastify
- **payment-service** (port 8002) - Stripe payments, Hono framework
- **email-service** (port 8004) - Email notifications via HTTP endpoints

### Frontend Applications
- **client** (port 3002) - Customer Next.js app with Stripe integration
- **admin** (port 3003) - Admin dashboard for management

## Key Development Patterns

### Authentication Flow
All services use Clerk for auth. Services validate tokens via `@clerk/express` middleware:
```typescript
// Pattern: shouldBeUser/shouldBeAdmin middleware
import { getAuth } from "@clerk/express";
const auth = getAuth(req);
req.userId = auth.userId;
```

### Service Communication
Services communicate via direct HTTP calls for simplicity:
```typescript
// Pattern: Direct HTTP calls for notifications
await fetch(`${EMAIL_SERVICE_URL}/send-order-email`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, amount, status }),
});
```

### Database Patterns
- **product-service**: Prisma client with **Neon PostgreSQL** (serverless)
- **order-service**: Mongoose with **MongoDB Atlas Serverless**
- **Shared types**: `@repo/types` for consistent data structures
- **Connection handling**: Optimized for serverless with connection pooling

### Serverless Database Configuration
```typescript
// Neon PostgreSQL - uses connection pooling automatically
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/db?pgbouncer=true"
DIRECT_URL="postgresql://user:pass@ep-xxx.neon.tech/db" // for migrations

// MongoDB Atlas Serverless - optimized connection options
MONGO_URL="mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority"
```

### Development Commands

```bash
# Start all services in development
pnpm dev

# Start specific service
turbo dev --filter=product-service

# Database operations (from workspace root)
pnpm --filter=@repo/product-db db:generate
pnpm --filter=@repo/product-db db:migrate
```

### Service Ports & URLs
- product-service: 8000
- order-service: 8001  
- payment-service: 8002
- auth-service: 8003
- email-service: 8004
- client: 3002
- admin: 3003

### Essential Environment Variables
- `DATABASE_URL` - Neon PostgreSQL (with pgbouncer connection pooling)
- `DIRECT_URL` - Neon PostgreSQL direct connection (for migrations)
- `MONGO_URL` - MongoDB Atlas Serverless
- `CLERK_SECRET_KEY` - Authentication
- `STRIPE_SECRET_KEY` - Payments
- `EMAIL_SERVICE_URL` - Email service endpoint (default: http://localhost:8004)
- `NEXT_PUBLIC_*_SERVICE_URL` - Service endpoints for frontends

### Framework-Specific Notes
- **auth/product-service**: Express.js with middleware patterns
- **order-service**: Fastify with plugin registration
- **payment-service**: Hono framework with different syntax
- **email-service**: Express.js with HTTP endpoints for notifications
- **Frontend apps**: Next.js 15 with App Router, server components for data fetching

When working on services, always check the corresponding package.json for service-specific scripts.