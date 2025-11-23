# Deploying Frontends to Cloudflare Pages

Deploy your Next.js client and admin frontends to Cloudflare Pages for fast, global CDN delivery.

## Why Cloudflare Pages for Frontends?

- ✅ **FREE** - Unlimited bandwidth on free tier
- ✅ **Fast** - Global CDN with edge caching
- ✅ **Next.js Support** - Native support for Next.js 15
- ✅ **Auto Deploy** - Push to GitHub = automatic deployment
- ✅ **Preview URLs** - Every PR gets a preview URL
- ✅ **No Cold Starts** - Always instant

## Prerequisites

- GitHub repository pushed
- Backend services deployed to Render (get URLs first)
- Cloudflare account (free)

## Deployment Steps

### 1. Deploy Client Frontend

#### A. Via Cloudflare Dashboard (Recommended)

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com
   - Navigate to: Workers & Pages → Create → Pages → Connect to Git

2. **Connect GitHub Repository**
   - Select: `JuliusNtale/Ecommerce-microservices-architecture`
   - Branch: `direct-Link-no-Kafka-`

3. **Configure Build Settings**
   - **Project Name**: `neuraltale-client`
   - **Production Branch**: `direct-Link-no-Kafka-`
   - **Framework Preset**: None (Don't select Next.js - we'll use custom commands)
   - **Build Command**: `pnpm install && cd packages/product-db && pnpm prisma generate && cd ../../apps/client && npx @cloudflare/next-on-pages`
   - **Build Output Directory**: `apps/client/.vercel/output/static`
   - **Root Directory**: (leave empty)

4. **Set Environment Variables**
   Click "Add Variable" for each:
   ```
   NODE_VERSION=18
   DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
   DIRECT_URL=postgresql://dummy:dummy@localhost:5432/dummy
   NEXT_PUBLIC_PRODUCT_SERVICE_URL=https://neuraltale-product-service.onrender.com
   NEXT_PUBLIC_ORDER_SERVICE_URL=https://neuraltale-order-service.onrender.com
   NEXT_PUBLIC_PAYMENT_SERVICE_URL=https://neuraltale-payment-service.onrender.com
   NEXT_PUBLIC_AUTH_SERVICE_URL=https://neuraltale-auth-service.onrender.com
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
   CLERK_SECRET_KEY=sk_test_xxx
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
   ```
   
   **Note**: DATABASE_URL and DIRECT_URL are dummy values needed for Prisma generation only. The frontend doesn't connect directly to the database.

5. **Deploy**
   - Click "Save and Deploy"
   - Wait 2-5 minutes for build
   - Your site will be live at: `neuraltale-client.pages.dev`

#### B. Via Wrangler CLI (Alternative)

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy from client directory
cd apps/client
npx @cloudflare/next-on-pages
wrangler pages deploy .vercel/output/static --project-name=neuraltale-client
```

### 2. Deploy Admin Frontend

Repeat the same process for admin:

1. **Dashboard**: Workers & Pages → Create → Pages → Connect to Git
2. **Project Name**: `neuraltale-admin`
3. **Build Command**: `pnpm install && cd packages/product-db && pnpm prisma generate && cd ../../apps/admin && pnpm run build`
4. **Build Output Directory**: `apps/admin/.next`
5. **Environment Variables**:
   ```
   NODE_VERSION=18
   DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
   DIRECT_URL=postgresql://dummy:dummy@localhost:5432/dummy
   NEXT_PUBLIC_PRODUCT_SERVICE_URL=https://neuraltale-product-service.onrender.com
   NEXT_PUBLIC_ORDER_SERVICE_URL=https://neuraltale-order-service.onrender.com
   NEXT_PUBLIC_PAYMENT_SERVICE_URL=https://neuraltale-payment-service.onrender.com
   NEXT_PUBLIC_AUTH_SERVICE_URL=https://neuraltale-auth-service.onrender.com
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
   CLERK_SECRET_KEY=sk_test_xxx
   ```
   
   **Note**: DATABASE_URL and DIRECT_URL are dummy values needed for Prisma generation only.

### 3. Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to your Pages project
   - Click "Custom Domains"
   - Add your domain: `client.yourdomain.com`
   - Follow DNS setup instructions

2. **Update CORS in Backend Services**
   - Add your custom domain to allowed origins
   - Redeploy backend services if needed

## Final URLs

After deployment, you'll have:

- **Client**: `https://neuraltale-client.pages.dev`
- **Admin**: `https://neuraltale-admin.pages.dev`
- **Product Service**: `https://neuraltale-product-service.onrender.com`
- **Order Service**: `https://neuraltale-order-service.onrender.com`
- **Payment Service**: `https://neuraltale-payment-service.onrender.com`
- **Auth Service**: `https://neuraltale-auth-service.onrender.com`
- **Email Service**: `https://neuraltale-email-service.onrender.com`

## Post-Deployment Updates

### Update Backend CORS

Your backend services need to allow requests from Cloudflare Pages URLs. Already configured in code:

```typescript
const allowedOrigins = [
  "http://localhost:3002",
  "https://neuraltale-client.onrender.com",
  "https://neuraltale-client.pages.dev",  // ✅ Add this
  process.env.FRONTEND_URL,
];
```

Add these environment variables to Render services:

**Product Service**:
```
FRONTEND_URL=https://neuraltale-client.pages.dev
ADMIN_URL=https://neuraltale-admin.pages.dev
```

**Auth Service**:
```
ADMIN_URL=https://neuraltale-admin.pages.dev
```

**Payment Service**:
```
FRONTEND_URL=https://neuraltale-client.pages.dev
```

Then redeploy each service in Render dashboard.

### Update Clerk Settings

1. Go to Clerk Dashboard
2. Navigate to: API Keys → Allowed Origins
3. Add:
   - `https://neuraltale-client.pages.dev`
   - `https://neuraltale-admin.pages.dev`

### Update Stripe Settings

1. Go to Stripe Dashboard → Webhooks
2. Update webhook URL: `https://neuraltale-payment-service.onrender.com/webhooks/stripe`
3. Ensure events include: `checkout.session.completed`

## Troubleshooting

### Build Fails

**Issue**: Build command not finding package.json
**Solution**: Ensure build command includes `cd apps/client` or `cd apps/admin`

**Issue**: Module not found errors
**Solution**: Check that all dependencies are in package.json, not just devDependencies

### Environment Variables Not Working

**Issue**: Variables are undefined in runtime
**Solution**: 
- For client-side: Must start with `NEXT_PUBLIC_`
- For server-side: Regular naming (CLERK_SECRET_KEY)
- Redeploy after adding variables

### CORS Errors

**Issue**: API calls blocked by CORS
**Solution**: 
1. Add Cloudflare Pages URL to backend CORS config
2. Set FRONTEND_URL/ADMIN_URL environment variables in Render
3. Redeploy backend services

### Images Not Loading

**Issue**: External images blocked
**Solution**: Check `next.config.ts` has correct remote patterns:
```typescript
images: {
  remotePatterns: [
    { protocol: "https", hostname: "images.unsplash.com" },
    { protocol: "https", hostname: "res.cloudinary.com" },
    { protocol: "https", hostname: "img.clerk.com" },
  ],
}
```

## Continuous Deployment

Cloudflare Pages automatically redeploys when you push to GitHub:

```bash
git add .
git commit -m "Update frontend"
git push origin direct-Link-no-Kafka-
```

- **Production**: Deploys from `direct-Link-no-Kafka-` branch
- **Preview**: Every PR gets a unique preview URL
- **Rollback**: One-click rollback in dashboard

## Performance Benefits

### Cloudflare Pages vs Render for Frontends

| Feature | Cloudflare Pages | Render |
|---------|-----------------|--------|
| Global CDN | ✅ 275+ locations | ❌ Single region |
| Edge Caching | ✅ Automatic | ❌ Limited |
| Cold Starts | ✅ Never | ❌ Yes (free tier) |
| Bandwidth | ✅ Unlimited | ✅ 100GB/month |
| Build Time | ✅ ~2-3 min | ⚠️ ~3-5 min |
| Cost | ✅ Free | ✅ Free |

## Monitoring

### Cloudflare Dashboard
- View deployment logs
- Monitor traffic analytics
- Check error rates
- View build history

### Analytics (Optional)
- Enable Cloudflare Web Analytics (free)
- View real-time visitor stats
- Track page performance
- Monitor errors

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                 Cloudflare Global CDN                │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────────────┐      ┌──────────────────┐    │
│  │  Client Frontend │      │  Admin Frontend  │    │
│  │   (Next.js)      │      │    (Next.js)     │    │
│  │   pages.dev      │      │    pages.dev     │    │
│  └────────┬─────────┘      └────────┬─────────┘    │
│           │                          │               │
└───────────┼──────────────────────────┼───────────────┘
            │                          │
            ▼                          ▼
┌─────────────────────────────────────────────────────┐
│                    Render Cloud                      │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Product  │  │  Order   │  │ Payment  │          │
│  │ Service  │  │ Service  │  │ Service  │          │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘          │
│       │             │              │                 │
│  ┌────┴─────┐  ┌───┴──────┐  ┌───┴──────┐          │
│  │   Auth   │  │  Email   │  │ Services │          │
│  │ Service  │  │ Service  │  │   APIs   │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                       │
└───────────────────────────────────────────────────────┘
         │              │              │
         ▼              ▼              ▼
    ┌────────┐    ┌─────────┐    ┌────────┐
    │  Neon  │    │ MongoDB │    │ Clerk  │
    │  PG    │    │  Atlas  │    │  Auth  │
    └────────┘    └─────────┘    └────────┘
```

## Cost Estimate

- **Cloudflare Pages** (2 frontends): **$0/month**
- **Render** (5 backend services): **$0/month** (free tier)
- **Neon PostgreSQL**: **$0/month** (up to 0.5 GB)
- **MongoDB Atlas**: **$0/month** (up to 512 MB)
- **Clerk Auth**: **$0/month** (up to 10,000 MAU)
- **Stripe**: Pay-as-you-go (2.9% + $0.30 per transaction)

**Total Infrastructure**: ~$0/month for development/small-scale production

## Support

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs)
- [Cloudflare Community](https://community.cloudflare.com)

---

**Recommended Setup**: 
- ✅ Frontends on Cloudflare Pages (faster, global CDN)
- ✅ Backends on Render (better Node.js support)
- ✅ Best of both worlds!
