# E-commerce Microservices Architecture

Modern e-commerce platform built with TypeScript microservices in a Turborepo monorepo. Production-ready with hybrid deployment: Render (backends) + Vercel (frontends).

## 🏗️ Architecture

### Microservices (Backend)
- **product-service** (port 8000) - Product catalog with Prisma/Neon PostgreSQL
- **order-service** (port 8001) - Order management with MongoDB Atlas/Fastify  
- **payment-service** (port 8002) - Stripe payments with Hono framework
- **auth-service** (port 8003) - Clerk authentication with Express
- **email-service** (port 8004) - Email notifications via HTTP endpoints

### Frontend Applications
- **client** (port 3002) - Customer-facing Next.js 15 app with Stripe checkout
- **admin** (port 3003) - Admin dashboard for order/product management

### Tech Stack
- **Framework**: Next.js 15, TypeScript, Turborepo
- **Styling**: Tailwind CSS 4
- **Auth**: Clerk
- **Payments**: Stripe
- **Databases**: Neon PostgreSQL (serverless), MongoDB Atlas
- **Communication**: Direct HTTP (no message queue)
- **Deployment**: Render (backends) + Vercel (frontends)

## 🚀 Quick Start up

### Prerequisites
- Node.js 18+
- pnpm 9.0.0
- Neon PostgreSQL account
- MongoDB Atlas account
- Clerk account (authentication)
- Stripe account (payments)

### Local Development

```bash
# Install dependencies
pnpm install

# Start all services
pnpm dev

# Start specific service
turbo dev --filter=product-service
```

## ☁️ Deployment

### Production Architecture (Hybrid Deployment)

**Optimal Setup**: Vercel (Frontends) + Render (Backends)

```
Users → Vercel CDN (Global) → Render APIs → Databases
         (Frontends)            (Backends)   (Neon/MongoDB)
```

#### Why This Architecture?

| Component | Platform | Reason |
|-----------|----------|--------|
| **Frontends** | ✅ Vercel | Built for Next.js, global CDN, zero cold starts, 100GB free |
| **Backends** | ✅ Render | Full Node.js, persistent connections, 750 hours/month |
| **Databases** | Neon + MongoDB Atlas | Serverless PostgreSQL + MongoDB, free tiers |

---

### 📦 Backend Deployment → Render

1. **Push to GitHub**:
   ```bash
   git push origin direct-Link-no-Kafka-
   ```

2. **Deploy via Blueprint** (Automatic):
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect GitHub → Select this repository
   - Branch: `direct-Link-no-Kafka-`
   - Render auto-detects `render.yaml`
   - Click "Apply" → Deploys all 5 services

3. **Set Environment Variables** (per service):
   - DATABASE_URL (product-service)
   - MONGO_URL (order-service)
   - CLERK_SECRET_KEY (all services)
   - STRIPE_SECRET_KEY (payment-service)
   - Service URLs for inter-service communication

📖 **Complete Guide**: [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

**Service URLs** (after deployment):
- `https://neuraltale-product-service.onrender.com`
- `https://neuraltale-order-service.onrender.com`
- `https://neuraltale-payment-service.onrender.com`
- `https://neuraltale-auth-service.onrender.com`
- `https://neuraltale-email-service.onrender.com`

---

### 🌐 Frontend Deployment → Vercel

1. **Deploy Client**:
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Import GitHub repository
   - **Root Directory**: `apps/client`
   - **Build Command**: `cd ../../packages/product-db && pnpm prisma generate && cd ../../apps/client && pnpm run build`
   - **Branch**: `direct-Link-no-Kafka-`
   - Add environment variables (see VERCEL_DEPLOYMENT.md)
   - Click "Deploy"

2. **Deploy Admin**:
   - Same process, use **Root Directory**: `apps/admin`

📖 **Complete Guide**: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

**Frontend URLs** (after deployment):
- Client: `https://neuraltale-client.vercel.app`
- Admin: `https://neuraltale-admin.vercel.app`

---

### Post-Deployment Checklist

- [ ] Update backend CORS with Vercel URLs
- [ ] Set FRONTEND_URL in Render services
- [ ] Update Stripe webhook URLs
- [ ] Update Clerk allowed origins
- [ ] Run Prisma migrations on production DB
- [ ] Test complete user flow

---

## 🗂️ Project Structure

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build
yarn dlx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
