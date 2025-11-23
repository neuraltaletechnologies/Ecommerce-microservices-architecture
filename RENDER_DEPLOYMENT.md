# Deploying to Render

This guide covers deploying all microservices and frontends to Render.

## Prerequisites

- GitHub account
- Render account (sign up at https://render.com)
- All environment variables/secrets ready
- Neon PostgreSQL database
- MongoDB Atlas database
- Clerk account for authentication
- Stripe account for payments
- SMTP credentials for emails

## Quick Start (Automatic Deployment)

Render will automatically detect the `render.yaml` file in your repository root and deploy all services.

### 1. Connect Repository to Render

1. Go to https://dashboard.render.com
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Select the repository: `JuliusNtale/Ecommerce-microservices-architecture`
5. Render will detect `render.yaml` automatically
6. Click "Apply" to create all services

### 2. Set Environment Variables

After services are created, you need to set the secret environment variables for each service:

#### Product Service
```
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/db?pgbouncer=true
DIRECT_URL=postgresql://user:pass@ep-xxx.neon.tech/db
CLERK_SECRET_KEY=sk_test_xxx
CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Order Service
```
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/db
CLERK_SECRET_KEY=sk_test_xxx
CLERK_PUBLISHABLE_KEY=pk_test_xxx
```

#### Payment Service
```
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
CLERK_SECRET_KEY=sk_test_xxx
CLERK_PUBLISHABLE_KEY=pk_test_xxx
```

#### Auth Service
```
CLERK_SECRET_KEY=sk_test_xxx
CLERK_PUBLISHABLE_KEY=pk_test_xxx
```

#### Email Service
```
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

#### Client Frontend
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

#### Admin Frontend
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
```

### 3. Deploy Services

Once environment variables are set, Render will automatically deploy all services. You can monitor the deployment logs in the Render dashboard.

## Service URLs

After deployment, your services will be available at:

- **Product Service**: https://neuraltale-product-service.onrender.com
- **Order Service**: https://neuraltale-order-service.onrender.com
- **Payment Service**: https://neuraltale-payment-service.onrender.com
- **Auth Service**: https://neuraltale-auth-service.onrender.com
- **Email Service**: https://neuraltale-email-service.onrender.com
- **Client**: https://neuraltale-client.onrender.com
- **Admin**: https://neuraltale-admin.onrender.com

## Manual Deployment (Alternative)

If you prefer to deploy services individually:

### Deploy a Single Service

1. Go to Render Dashboard
2. Click "New" → "Web Service"
3. Connect your repository
4. Configure:
   - **Name**: neuraltale-product-service
   - **Region**: Oregon (US West)
   - **Branch**: direct-Link-no-Kafka-
   - **Root Directory**: (leave empty)
   - **Environment**: Node
   - **Build Command**: `cd apps/product-service && npm install && npx prisma generate`
   - **Start Command**: `cd apps/product-service && node src/index.js`
   - **Plan**: Free
5. Add environment variables
6. Click "Create Web Service"

Repeat for other services with their respective configurations.

## Important Notes

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds (cold start)
- 750 hours/month per service (enough for one service 24/7)

### Database Connections
- **Neon PostgreSQL**: Uses connection pooling (pgbouncer=true) for serverless
- **MongoDB Atlas**: Optimized for serverless with connection reuse

### Monorepo Configuration
Since this is a monorepo, build commands include `cd apps/service-name` to navigate to the correct directory.

### Health Checks
All services have a `/health` endpoint for Render's health monitoring.

### Prisma Migrations
For product-service, run migrations manually:
```bash
# In Render Shell or locally
npx prisma migrate deploy
```

## Troubleshooting

### Build Failures
- Check build logs in Render dashboard
- Ensure all dependencies are in package.json
- Verify build commands are correct

### Service Not Starting
- Check if environment variables are set correctly
- Review application logs for errors
- Ensure PORT is not hardcoded (Render sets it automatically)

### Connection Timeouts
- Verify service URLs are correct
- Check if target service is deployed and healthy
- Review CORS settings

### Cold Starts
- Free tier services sleep after inactivity
- Consider upgrading to paid plan for always-on services
- First request will be slow (30-60s)

## Post-Deployment Tasks

### 1. Update Stripe Webhooks
Update your Stripe webhook URL to:
```
https://neuraltale-payment-service.onrender.com/webhooks/stripe
```

### 2. Update Clerk Settings
Update allowed origins in Clerk dashboard:
- https://neuraltale-client.onrender.com
- https://neuraltale-admin.onrender.com

### 3. Test All Services
Visit each health endpoint:
- https://neuraltale-product-service.onrender.com/health
- https://neuraltale-order-service.onrender.com/health
- https://neuraltale-payment-service.onrender.com/health
- https://neuraltale-auth-service.onrender.com/health
- https://neuraltale-email-service.onrender.com/health

### 4. Monitor Logs
Watch logs in Render dashboard for any errors or warnings.

## Continuous Deployment

Render automatically redeploys when you push to the connected branch:
1. Push changes to GitHub
2. Render detects the push
3. Automatically rebuilds and redeploys affected services

## Scaling

### Free Tier
- 1 instance per service
- Spins down after inactivity

### Paid Plans
- Multiple instances
- Always-on services
- Auto-scaling
- Better performance

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- Project Issues: GitHub repository issues

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Render Cloud                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Client     │  │    Admin     │  │   Product    │      │
│  │  (Next.js)   │  │  (Next.js)   │  │   Service    │      │
│  │              │  │              │  │  (Express)   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│  ┌──────────────┐  ┌──────┴───────┐  ┌──────────────┐      │
│  │    Order     │  │   Payment    │  │     Auth     │      │
│  │   Service    │  │   Service    │  │   Service    │      │
│  │  (Fastify)   │  │    (Hono)    │  │  (Express)   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│                    ┌───────┴────────┐                        │
│                    │     Email      │                        │
│                    │    Service     │                        │
│                    │   (Express)    │                        │
│                    └────────────────┘                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
         │                   │                   │
         ▼                   ▼                   ▼
    ┌─────────┐       ┌──────────┐       ┌──────────┐
    │  Neon   │       │ MongoDB  │       │  Clerk   │
    │PostgreSQL│       │  Atlas   │       │  Auth    │
    └─────────┘       └──────────┘       └──────────┘
```

## Cost Estimate (Free Tier)

- All 7 services: **$0/month**
- Neon PostgreSQL: **$0/month** (up to 0.5 GB)
- MongoDB Atlas: **$0/month** (up to 512 MB)
- Clerk Auth: **$0/month** (up to 10,000 MAU)
- Stripe: Pay-as-you-go (2.9% + $0.30 per transaction)

**Total**: ~$0/month for development/small-scale production
