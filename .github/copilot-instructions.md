# Copilot Instructions

E-commerce microservices in a Turborepo monorepo. **Three different backend frameworks** with **two databases** and **direct HTTP communication**.

## Architecture Quick Reference

| Service | Port | Framework | Database | Auth Middleware |
|---------|------|-----------|----------|-----------------|
| product-service | 8000 | Express | Prisma/Neon PostgreSQL | `@clerk/express` |
| order-service | 8001 | **Fastify** | Mongoose/MongoDB Atlas | `@clerk/fastify` |
| payment-service | 8002 | **Hono** | — | `@hono/clerk-auth` |
| auth-service | 8003 | Express | — | `@clerk/express` |
| email-service | 8004 | Express | — | None (internal) |
| client | 3002 | Next.js 15 | — | `@clerk/nextjs` |
| admin | 3003 | Next.js 15 | — | `@clerk/nextjs` |

## Critical Patterns

### Framework-Specific Auth Middleware
Each backend has different middleware syntax - **do not copy patterns between services blindly**:

```typescript
// Express (product/auth-service) - middleware function
app.get("/route", shouldBeUser, handler);

// Fastify (order-service) - preHandler hook
fastify.get("/route", { preHandler: shouldBeUser }, handler);

// Hono (payment-service) - createMiddleware pattern
app.use("/route", shouldBeUser);
```

### Role-Based Access
Admin checks use `CustomJwtSessionClaims` from `@repo/types`. **Note**: Role location differs:
```typescript
// Express (product-service) - checks both locations
const role = claims.publicMetadata?.role || claims.metadata?.role;

// Fastify/Hono - checks metadata only
const role = claims.metadata?.role; // "user" | "admin" | "moderator" | "superadmin"
```

### Service Communication (Direct HTTP, No Message Queue)
Services call each other via HTTP. Pattern used for payment→order→email flow:
```typescript
// payment-service/webhooks.route.ts → order-service
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:8001';
await fetch(`${ORDER_SERVICE_URL}/orders`, { method: 'POST', body: JSON.stringify(orderData) });

// order-service → email-service
await fetch(`${EMAIL_SERVICE_URL}/send-order-email`, { body: JSON.stringify({ email, amount, status }) });
```

### Frontend → Backend Communication
Frontends use `NEXT_PUBLIC_*_SERVICE_URL` env vars for API calls:
```typescript
// Client-side or server components
const url = `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products`;
```

## Database Patterns

### Prisma (product-service) - Neon PostgreSQL with WebSocket
Prisma client uses Neon's serverless adapter. Schema in `packages/product-db/prisma/schema.prisma`:
```bash
# After schema changes
pnpm --filter=@repo/product-db db:generate  # Regenerate client
pnpm --filter=@repo/product-db db:migrate   # Run migrations (uses DIRECT_URL)
```

### Mongoose (order-service) - MongoDB Atlas
Order model in `packages/order-db/src/order-model.ts`. Connection singleton in `connection.ts`.

## Shared Packages

| Package | Purpose | Import |
|---------|---------|--------|
| `@repo/types` | Shared TypeScript types (auth, product, order, cart) | `import { CustomJwtSessionClaims } from "@repo/types"` |
| `@repo/product-db` | Prisma client + schema | `import { prisma, Prisma } from "@repo/product-db"` |
| `@repo/order-db` | Mongoose models + connection | `import { Order, connectOrderDB } from "@repo/order-db"` |

## Frontend Patterns

### State Management
Client uses Zustand with persistence. Cart state in `apps/client/src/stores/cartStore.ts`:
```typescript
const useCartStore = create<CartStoreStateType & CartStoreActionsType>()(
  persist((set) => ({ /* state */ }), { name: 'cart-storage' })
);
```

### Middleware & Caching
Clerk middleware in `apps/client/src/middleware.ts` handles auth + adds cache/security headers:
- Static assets: `max-age=31536000, immutable`
- Cloudinary images: `max-age=86400, stale-while-revalidate=43200`

## Development Commands

```bash
pnpm dev                              # Start ALL services (uses turbo.json)
turbo dev --filter=product-service    # Single service
pnpm --filter=@repo/product-db db:generate  # Regenerate Prisma
pnpm --filter=@repo/product-db db:migrate   # Run migrations
pnpm lint                             # Lint all packages
pnpm check-types                      # Type-check all packages
```

**Important**: Use `pnpm --filter=<package-name>` for workspace-specific commands.

## Environment Variables

**Backend services**: `DATABASE_URL`, `DIRECT_URL`, `MONGO_URL`, `CLERK_SECRET_KEY`, `STRIPE_SECRET_KEY`, `EMAIL_SERVICE_URL`, `ORDER_SERVICE_URL`

**Frontend apps**: `NEXT_PUBLIC_PRODUCT_SERVICE_URL`, `NEXT_PUBLIC_ORDER_SERVICE_URL`, `NEXT_PUBLIC_PAYMENT_SERVICE_URL`, `NEXT_PUBLIC_AUTH_SERVICE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

## Stripe Integration (Optional Payments)

Payment via Stripe is **optional** - orders can be created directly without payment. The flow:
1. Client creates Stripe checkout session via `payment-service/sessions/create-checkout-session`
2. On successful payment, Stripe webhook (`/webhooks/stripe`) triggers order creation
3. Webhook validates signature with `STRIPE_WEBHOOK_SECRET`, then calls order-service

```typescript
// Webhook signature validation in payment-service/routes/webhooks.route.ts
event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
```

## Deployment

### Production URLs
- **Client**: `https://neurashop.neuraltale.com`
- **Admin**: `https://backoffice.neuraltale.com`
- **Backends**: `https://neuraltale-{service-name}.onrender.com`

### Hybrid Deployment Strategy
- **Frontends** → Vercel (Next.js optimized, global CDN)
- **Backends** → Render (persistent Node.js, `render.yaml` blueprint)
- **Databases** → Neon PostgreSQL + MongoDB Atlas (serverless)

### Vercel Frontend Build Command
```bash
cd ../../packages/product-db && pnpm prisma generate && cd ../../apps/client && pnpm run build
```

### Post-Deployment Checklist
- Update backend CORS with production frontend URLs
- Set `FRONTEND_URL`/`ADMIN_URL` in Render services
- Configure Stripe webhook URL to production payment-service
- Add Render service IPs to MongoDB Atlas Network Access
- Update Clerk allowed origins

## Key Files to Reference

- Auth middleware patterns: `apps/*/src/middleware/authMiddleware.ts`
- Service entry points: `apps/*/src/index.ts`  
- Prisma schema: `packages/product-db/prisma/schema.prisma`
- Order model: `packages/order-db/src/order-model.ts`
- Shared types: `packages/types/src/*.ts`
- Payment webhook flow: `apps/payment-service/src/routes/webhooks.route.ts`
- Render deployment config: `render.yaml`
- Turborepo config: `turbo.json`
- Frontend middleware: `apps/client/src/middleware.ts`, `apps/admin/src/middleware.ts`
- Cart store: `apps/client/src/stores/cartStore.ts`
- External product API: `apps/product-service/src/utils/externalProductApi.ts`
- Admin product search: `apps/admin/src/components/ExternalProductSearch.tsx`

## External Product API Integration

Admin can import product data from external APIs instead of manual entry:

### API Priority (with fallbacks)
1. **TechSpecs API** - Primary source for tech products (requires `TECHSPECS_API_KEY`)
2. **DummyJSON** - Fallback with product dimensions and metadata
3. **FakeStore API** - Last resort for basic product info

### Admin Workflow
1. Open "Add Product" → "API" tab
2. Search for product (e.g., "MacBook Pro 14")
3. Select result to import specs, images, description
4. Admin must manually set: **price** and **stock quantity**
5. Review in "Basic" tab, then save

### Backend Route
```typescript
// GET /external-products/search?q=iPhone 15 (admin only)
// Returns: { results: ExternalProductResult[], fromCache: boolean, rateLimited: boolean }
```

### Rate Limiting & Caching
- 30 requests/minute per user (returns 429 if exceeded)
- Results cached for 10 minutes to reduce API calls
- Cache key: lowercase search query