# Deploying Frontends to Vercel

Deploy your Next.js client and admin frontends to Vercel - the platform built by the creators of Next.js.

## Why Vercel for Next.js?

- ✅ **Built for Next.js** - Created by Next.js team, perfect compatibility
- ✅ **Zero Configuration** - Detects Next.js automatically
- ✅ **FREE Tier** - 100GB bandwidth, unlimited deployments
- ✅ **Fast** - Global CDN with edge caching
- ✅ **Auto Deploy** - Push to GitHub = automatic deployment
- ✅ **Preview URLs** - Every PR gets a preview URL
- ✅ **Built-in Analytics** - Performance metrics included

## Prerequisites

- GitHub repository pushed
- Backend services deployed to Render (get URLs first)
- Vercel account (free) - Sign up at https://vercel.com

## Deployment Steps

### 1. Deploy Client Frontend

#### Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new
   - Click "Add New..." → "Project"
   - Click "Import Git Repository"

2. **Import GitHub Repository**
   - Click "Import" on `JuliusNtale/Ecommerce-microservices-architecture`
   - If not listed, click "Adjust GitHub App Permissions" to grant access

3. **Configure Project**
   - **Project Name**: `neuraltale-client` (or your preferred name)
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `apps/client`
   - **Build Command**: Leave default or use: `pnpm run build`
   - **Output Directory**: `.next` (default)
   - **Install Command**: `pnpm install`
   
   **IMPORTANT - Set Production Branch:**
   - Expand "Git" section (or it will be in Settings after deployment)
   - **Production Branch**: Change from `main` to `direct-Link-no-Kafka-`
   - This ensures Vercel deploys from your working branch

4. **Set Environment Variables**
   Click "Environment Variables" and add:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_jMfztEK6WVJ3@ep-late-haze-adbmi2n9-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
   DIRECT_URL=postgresql://neondb_owner:npg_jMfztEK6WVJ3@ep-late-haze-adbmi2n9.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
   NEXT_PUBLIC_PRODUCT_SERVICE_URL=https://neuraltale-product-service.onrender.com
   NEXT_PUBLIC_ORDER_SERVICE_URL=https://neuraltale-order-service.onrender.com
   NEXT_PUBLIC_PAYMENT_SERVICE_URL=https://neuraltale-payment-service.onrender.com
   NEXT_PUBLIC_AUTH_SERVICE_URL=https://neuraltale-auth-service.onrender.com
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cXVhbGl0eS1zaGVlcC0xNS5jbGVyay5hY2NvdW50cy5kZXYk
   CLERK_SECRET_KEY=sk_test_3S6KqWrGgPtD1puuZPFfPS1mkok4qgYDMPhJq2nf1I
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Your site will be live at: `neuraltale-client.vercel.app`

### 2. Deploy Admin Frontend

Repeat the same process for admin:

1. **Vercel Dashboard** → Add New Project → Import
2. **Same Repository**: `JuliusNtale/Ecommerce-microservices-architecture`
3. **Configure Project**:
   - **Project Name**: `neuraltale-admin`
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/admin`
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

4. **Environment Variables**:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_jMfztEK6WVJ3@ep-late-haze-adbmi2n9-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
   DIRECT_URL=postgresql://neondb_owner:npg_jMfztEK6WVJ3@ep-late-haze-adbmi2n9.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
   NEXT_PUBLIC_PRODUCT_SERVICE_URL=https://neuraltale-product-service.onrender.com
   NEXT_PUBLIC_ORDER_SERVICE_URL=https://neuraltale-order-service.onrender.com
   NEXT_PUBLIC_PAYMENT_SERVICE_URL=https://neuraltale-payment-service.onrender.com
   NEXT_PUBLIC_AUTH_SERVICE_URL=https://neuraltale-auth-service.onrender.com
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cXVhbGl0eS1zaGVlcC0xNS5jbGVyay5hY2NvdW50cy5kZXYk
   CLERK_SECRET_KEY=sk_test_3S6KqWrGgPtD1puuZPFfPS1mkok4qgYDMPhJq2nf1I
   ```

### 3. Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to your project → Settings → Domains
   - Add your domain: `shop.yourdomain.com`
   - Follow DNS setup instructions (add CNAME record)

2. **Automatic HTTPS**
   - Vercel automatically provisions SSL certificates
   - No configuration needed

## Final URLs

After deployment, you'll have:

- **Client**: `https://neuraltale-client.vercel.app`
- **Admin**: `https://neuraltale-admin.vercel.app`
- **Product Service**: `https://neuraltale-product-service.onrender.com`
- **Order Service**: `https://neuraltale-order-service.onrender.com`
- **Payment Service**: `https://neuraltale-payment-service.onrender.com`
- **Auth Service**: `https://neuraltale-auth-service.onrender.com`
- **Email Service**: `https://neuraltale-email-service.onrender.com`

## Post-Deployment Updates

### Update Backend CORS

Your backend services need to allow requests from Vercel URLs:

```typescript
const allowedOrigins = [
  "http://localhost:3002",
  "https://neuraltale-client.vercel.app",  // Add this
  process.env.FRONTEND_URL,
];
```

Add environment variable in Render:
```
FRONTEND_URL=https://neuraltale-client.vercel.app
ADMIN_URL=https://neuraltale-admin.vercel.app
```

Then redeploy backend services for CORS changes to take effect.

### Update Stripe Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Update webhook URL to: `https://neuraltale-client.vercel.app/api/webhooks/stripe`
3. Update STRIPE_WEBHOOK_SECRET in payment service

### Update Clerk Settings

1. Go to Clerk Dashboard → Your Application
2. Add Vercel URLs to allowed origins:
   - `https://neuraltale-client.vercel.app`
   - `https://neuraltale-admin.vercel.app`

## Troubleshooting

### Build Fails with Prisma Error

**Issue**: Cannot find Prisma client
**Solution**: Vercel automatically detects monorepos and runs Prisma generate. If it fails, check that `DATABASE_URL` and `DIRECT_URL` are set in environment variables.

### Environment Variables Not Working

**Issue**: Variables are undefined in runtime
**Solution**: 
- Client-side variables MUST start with `NEXT_PUBLIC_`
- Redeploy after adding new variables
- Check Vercel Dashboard → Project → Settings → Environment Variables

### CORS Errors

**Issue**: API calls blocked by CORS
**Solution**: 
1. Add Vercel URL to backend CORS whitelist
2. Set FRONTEND_URL environment variable in Render
3. Redeploy backend services

### Images Not Loading

**Issue**: External images blocked
**Solution**: Verify `next.config.ts` has correct remote patterns:
```typescript
images: {
  remotePatterns: [
    { protocol: "https", hostname: "images.unsplash.com" },
    { protocol: "https", hostname: "img.clerk.com" },
    { protocol: "https", hostname: "res.cloudinary.com" },
  ],
}
```

## Monitoring & Analytics

### Vercel Dashboard
- View deployment logs
- Monitor build times
- Check function invocations
- Real-time error tracking

### Analytics (Included Free)
- Vercel Web Analytics automatically enabled
- View traffic, performance metrics
- No additional configuration needed

## CI/CD Workflow

Vercel automatically:
1. **Watches your branch** - Monitors `direct-Link-no-Kafka-`
2. **Builds on push** - Every commit triggers a build
3. **Preview deployments** - Each PR gets a unique URL
4. **Production deploy** - Merges to main branch deploy to production

## Vercel vs Render

| Feature | Vercel (Frontend) | Render (Backend) |
|---------|------------------|------------------|
| Best For | Next.js, Static Sites | Node.js APIs, Databases |
| Build Time | 2-3 minutes | 5-10 minutes |
| Cold Starts | None | Yes (free tier) |
| Free Tier | 100GB bandwidth | 750 hours/month |
| Edge Network | ✅ Global CDN | ❌ Single region |

**Recommended Setup**:
- ✅ Frontends on Vercel (faster, built for Next.js)
- ✅ Backends on Render (full Node.js support, database connections)

## Success Checklist

- [ ] Client deployed to Vercel
- [ ] Admin deployed to Vercel
- [ ] Environment variables configured
- [ ] Backend CORS updated with Vercel URLs
- [ ] Backend services redeployed
- [ ] Stripe webhook URLs updated
- [ ] Clerk allowed origins updated
- [ ] Test complete user flow (browse → cart → checkout)
- [ ] Monitor Vercel analytics for errors

---

**Your deployment is complete! 🎉**

Access your sites:
- Client: https://neuraltale-client.vercel.app
- Admin: https://neuraltale-admin.vercel.app
