# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

E-commerce platform in a Turborepo + pnpm workspace monorepo. Five backend microservices (three different frameworks), two Next.js frontends, and shared workspace packages. Services communicate via **direct HTTP** (no message queue — Kafka was removed; see branch history).

## Commands

```bash
pnpm install                                # Install all workspace deps
pnpm dev                                    # Start ALL apps via turbo
turbo dev --filter=product-service          # Start a single app/service
pnpm lint                                   # Lint all packages (Next.js apps only have lint scripts)
pnpm check-types                            # tsc --noEmit across packages
pnpm format                                 # Prettier on **/*.{ts,tsx,md}
pnpm exec turbo build --filter=client       # Build a single app

# Prisma (after editing packages/product-db/prisma/schema.prisma)
pnpm --filter=@repo/product-db db:generate  # Regenerate client
pnpm --filter=@repo/product-db db:migrate   # Dev migration (needs DIRECT_URL)
pnpm --filter=@repo/product-db db:deploy    # Apply migrations (CI/prod)
```

There is **no test suite** in this repo — no test scripts or test framework are configured.

Backend services run via `tsx --env-file=.env --watch`; each service needs its own `.env` in its app directory. Backend "build" scripts are no-ops (echo only) — services run TypeScript directly with tsx in production too.

## Architecture

| App | Port | Framework | Database | Auth middleware |
|---|---|---|---|---|
| apps/product-service | 8000 | Express 5 | Prisma + Neon PostgreSQL | `@clerk/express` |
| apps/order-service | 8001 | **Fastify** | Mongoose + MongoDB Atlas | `@clerk/fastify` |
| apps/payment-service | 8002 | **Hono** | none | `@hono/clerk-auth` |
| apps/auth-service | 8003 | Express | none | `@clerk/express` |
| apps/email-service | 8004 | Express 4 | none | none (internal only) |
| apps/client | 3004 (dev) | Next.js 16 | — | `@clerk/nextjs` |
| apps/admin | 3003 (dev) | Next.js 16 | — | `@clerk/nextjs` |

(`.github/copilot-instructions.md` lists client on port 3002 and Next.js 15 — the package.json scripts are the source of truth: client runs `next dev --port 3004`, both apps are on Next 16.)

### Service communication (direct HTTP)

Payment flow: client → payment-service (Stripe checkout session) → Stripe webhook (`apps/payment-service/src/routes/webhooks.route.ts`, validates `STRIPE_WEBHOOK_SECRET`) → POST to order-service (`ORDER_SERVICE_URL`) → order-service POSTs to email-service (`EMAIL_SERVICE_URL`). Stripe is optional — orders can also be created directly (manual/COD).

Frontends call services through `NEXT_PUBLIC_{PRODUCT,ORDER,PAYMENT,AUTH}_SERVICE_URL` env vars.

### Shared packages

- `@repo/types` — shared TS types + Zod schemas (auth, product, cart, order). `CustomJwtSessionClaims` lives here.
- `@repo/product-db` — Prisma client using Neon serverless adapter (WebSocket). Schema: `packages/product-db/prisma/schema.prisma`. Import: `import { prisma, Prisma } from "@repo/product-db"`.
- `@repo/order-db` — Mongoose `Order` model (`src/order-model.ts`) + connection singleton (`src/connection.ts`). Import: `import { Order, connectOrderDB } from "@repo/order-db"`.
- Packages export raw TypeScript (`./src/index.ts`) — no build step.

## Critical patterns

### Auth middleware differs per framework — don't copy between services

Each service has its own `src/middleware/authMiddleware.ts`:

```typescript
// Express (product/auth-service): middleware function
app.get("/route", shouldBeUser, handler);
// Fastify (order-service): preHandler hook
fastify.get("/route", { preHandler: shouldBeUser }, handler);
// Hono (payment-service): createMiddleware
app.use("/route", shouldBeUser);
```

### Role location in JWT claims is inconsistent

```typescript
// Express services check BOTH locations:
const role = claims.publicMetadata?.role || claims.metadata?.role;
// Fastify/Hono services check metadata only:
const role = claims.metadata?.role; // "user" | "admin" | "moderator" | "superadmin"
```

### Frontend specifics

- Client cart state: Zustand with `persist` in `apps/client/src/stores/cartStore.ts` (storage key `cart-storage`).
- Clerk middleware in `apps/client/src/middleware.ts` and `apps/admin/src/middleware.ts` also sets cache/security headers.
- Admin uses shadcn-style Radix components, TanStack Query/Table, recharts.

### External product import (admin)

Admin "Add Product" can import from external APIs via product-service `GET /external-products/search?q=...` (admin only). Logic: `apps/product-service/src/utils/externalProductApi.ts`; UI: `apps/admin/src/components/ExternalProductSearch.tsx`. Fallback chain: TechSpecs (needs `TECHSPECS_API_KEY`) → DummyJSON → Platzi → FakeStore. Rate limit 30 req/min/user, 10-min cache, prices converted USD → TZS (× 2500). Imported products still need manual price and stock. Current API status: `EXTERNAL_APIS_STATUS.md`.

## Environment variables

- product-service: `DATABASE_URL`, `DIRECT_URL` (Prisma/Neon), `CLERK_SECRET_KEY`, Cloudinary creds, `TECHSPECS_API_KEY` (optional)
- order-service: `MONGO_URL`, `CLERK_SECRET_KEY`, `EMAIL_SERVICE_URL`
- payment-service: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `CLERK_SECRET_KEY`, `ORDER_SERVICE_URL`
- CORS on backends: `FRONTEND_URL`, `ADMIN_URL`
- Frontends: `NEXT_PUBLIC_*_SERVICE_URL` (4 services), `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

## Deployment

- Backends → Render via `render.yaml` blueprint (`https://neuraltale-{service}.onrender.com`).
- Frontends → Vercel as separate projects. Build command must generate Prisma first:
  `cd ../../packages/product-db && pnpm prisma generate && cd ../../apps/client && pnpm run build`
- Production: client `https://neurashop.neuraltale.com`, admin `https://backoffice.neuraltale.com`.
