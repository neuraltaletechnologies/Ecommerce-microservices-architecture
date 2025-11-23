# E-commerce Microservices Architecture

Modern e-commerce platform built with TypeScript microservices in a Turborepo monorepo.

## 🏗️ Architecture

### Microservices (Backend)
- **product-service** (port 8000) - Product catalog with Prisma/PostgreSQL
- **order-service** (port 8001) - Order management with MongoDB/Fastify  
- **payment-service** (port 8002) - Stripe payments with Hono
- **auth-service** (port 8003) - Clerk authentication with Express
- **email-service** (port 8004) - Email notifications via HTTP

### Frontend Applications
- **client** (port 3002) - Customer-facing Next.js app
- **admin** (port 3003) - Admin dashboard

## 🚀 Quick Start

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

### Hybrid Deployment (Recommended)

**Best approach**: Backend on Render + Frontends on Cloudflare Pages

#### Backend Services → Render

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Deploy to Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Select this repository
   - Render will auto-detect `render.yaml`
   - Click "Apply" (deploys 5 backend services)

3. **Set Environment Variables**:
   - See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for complete list

📖 **Backend Guide**: [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

#### Frontends → Cloudflare Pages

1. **Deploy Client**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Workers & Pages → Create → Pages
   - Connect GitHub → Select repository
   - Configure: `cd apps/client && npm install && npm run build`
   - Set environment variables (see CLOUDFLARE_PAGES.md)

2. **Deploy Admin**: Same process for admin frontend

📖 **Frontend Guide**: [CLOUDFLARE_PAGES.md](./CLOUDFLARE_PAGES.md)

**Why Hybrid?**
- ✅ Render: Better Node.js/backend support
- ✅ Cloudflare: Global CDN, faster frontends, no cold starts
- ✅ Both: Free tier, auto-deploy on push

**Service URLs** (after deployment):
- Backend: `https://neuraltale-*-service.onrender.com`
- Frontends: `https://neuraltale-*.pages.dev`

📖 See [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md) for details

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
