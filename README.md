# E-commerce Microservices Architecture

Production-grade e-commerce platform in a Turborepo monorepo. The backend is split into multiple services with direct HTTP communication. The frontend ships as two Next.js apps plus a Flutter mobile client.

## Architecture

### Services and ports

| Service | Port | Framework | Database | Auth middleware |
| --- | --- | --- | --- | --- |
| product-service | 8000 | Express | Prisma + Neon PostgreSQL | @clerk/express |
| order-service | 8001 | Fastify | Mongoose + MongoDB Atlas | @clerk/fastify |
| payment-service | 8002 | Hono | None | @hono/clerk-auth |
| auth-service | 8003 | Express | None | @clerk/express |
| email-service | 8004 | Express | None | Internal only |

### Frontends

| App | Port | Framework | Auth |
| --- | --- | --- | --- |
| client | 3002 | Next.js 15 | @clerk/nextjs |
| admin | 3003 | Next.js 15 | @clerk/nextjs |
| mobile | N/A | Flutter | Clerk tokens via API |

### Communication

- Services talk via direct HTTP (no queue). Example flow: payment-service -> order-service -> email-service.
- Frontends call services via `NEXT_PUBLIC_*_SERVICE_URL` environment variables.

## Repository layout

- Apps live in [apps](apps) (backend services, web clients, Flutter mobile).
- Shared packages live in [packages](packages) (types, database clients, configs).
- Deployment blueprint for Render lives in [render.yaml](render.yaml).
- Turborepo config lives in [turbo.json](turbo.json).

## Quick start

### Prerequisites

- Node.js 18+
- pnpm 9+
- Neon PostgreSQL and MongoDB Atlas accounts
- Clerk account (auth)
- Stripe account (optional payments)

### Install

```bash
pnpm install
```

### Run all services

```bash
pnpm dev
```

### Run a single service

```bash
turbo dev --filter=product-service
```

## Environment variables

### Backend services

- `DATABASE_URL`, `DIRECT_URL` (product-service, Prisma)
- `MONGO_URL` (order-service, Mongoose)
- `CLERK_SECRET_KEY` (all services that verify auth)
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (payment-service)
- `EMAIL_SERVICE_URL`, `ORDER_SERVICE_URL` (inter-service calls)
- `FRONTEND_URL`, `ADMIN_URL` (CORS)

### Frontend apps

- `NEXT_PUBLIC_PRODUCT_SERVICE_URL`
- `NEXT_PUBLIC_ORDER_SERVICE_URL`
- `NEXT_PUBLIC_PAYMENT_SERVICE_URL`
- `NEXT_PUBLIC_AUTH_SERVICE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

## Database workflows

### Prisma (product-service)

Schema lives in [packages/product-db/prisma/schema.prisma](packages/product-db/prisma/schema.prisma).

```bash
pnpm --filter=@repo/product-db db:generate
pnpm --filter=@repo/product-db db:migrate
```

### Mongoose (order-service)

Models live in [packages/order-db/src/order-model.ts](packages/order-db/src/order-model.ts). Connection singleton is in [packages/order-db/src/connection.ts](packages/order-db/src/connection.ts).

## Auth and roles

- Shared claims type: `CustomJwtSessionClaims` from `@repo/types`.
- Express services (product/auth) check role in both `publicMetadata.role` and `metadata.role`.
- Fastify/Hono services check role in `metadata.role` only.

## Payments (optional)

- Client creates a Stripe checkout session in payment-service.
- Stripe webhook validates signature then creates an order via order-service.
- Orders can also be created without Stripe for manual or COD workflows.

Webhook logic is in [apps/payment-service/src/routes/webhooks.route.ts](apps/payment-service/src/routes/webhooks.route.ts).

## Admin external product API

- Admin can search external APIs and import product details.
- Priority order: TechSpecs -> DummyJSON -> FakeStore.
- Rate limit: 30 requests per minute per user.
- Cache duration: 10 minutes.

Admin UI entry point is in [apps/admin/src/components/ExternalProductSearch.tsx](apps/admin/src/components/ExternalProductSearch.tsx).

## Mobile app

- Flutter app lives in [apps/mobile](apps/mobile).
- Setup and onboarding docs are in [apps/mobile/SETUP.md](apps/mobile/SETUP.md) and [apps/mobile/GETTING_STARTED.md](apps/mobile/GETTING_STARTED.md).

## Build and lint

```bash
pnpm lint
pnpm check-types
```

Build a single app or package:

```bash
pnpm exec turbo build --filter=product-service
```

## Deployment

### Backends on Render

- Render reads [render.yaml](render.yaml) to deploy all services.
- Ensure all backend environment variables are set per service.

### Frontends on Vercel

- Deploy [apps/client](apps/client) and [apps/admin](apps/admin) as separate projects.
- Vercel build command for both apps:

```bash
cd ../../packages/product-db && pnpm prisma generate && cd ../../apps/client && pnpm run build
```

Update the build command path when deploying the admin app.

## Troubleshooting

- If a service returns 401, confirm `CLERK_SECRET_KEY` and allowed origins.
- If products fail to load, verify `NEXT_PUBLIC_PRODUCT_SERVICE_URL` and CORS settings.
- If Stripe webhooks fail, confirm `STRIPE_WEBHOOK_SECRET` and webhook URL.
- If Prisma fails in CI, ensure `DIRECT_URL` is set and migrations ran.

## Key entry points

- product-service: [apps/product-service/src/index.ts](apps/product-service/src/index.ts)
- order-service: [apps/order-service/src/index.ts](apps/order-service/src/index.ts)
- payment-service: [apps/payment-service/src/index.ts](apps/payment-service/src/index.ts)
- auth-service: [apps/auth-service/src/index.ts](apps/auth-service/src/index.ts)
- email-service: [apps/email-service/src/index.ts](apps/email-service/src/index.ts)
