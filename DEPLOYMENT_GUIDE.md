# 🚀 Production Deployment Guide

## ⚠️ CRITICAL: Environment Configuration

### **Current Issue**
Your `.env` files contain **localhost URLs** which will NOT work in production! You need to update these for deployment.

---

## 📋 Pre-Deployment Checklist

### **1. Deploy Your Microservices First**

You need to deploy these services to get their production URLs:

| Service | Port | Purpose | Deploy To |
|---------|------|---------|-----------|
| product-service | 8000 | Products & Categories | Render/Railway/Fly.io |
| order-service | 8001 | Orders Management | Render/Railway/Fly.io |
| payment-service | 8002 | Stripe Payments | Render/Railway/Fly.io |
| auth-service | 8003 | Authentication | Render/Railway/Fly.io |

**Example Production URLs after deployment:**
```
https://product-service-abc123.onrender.com
https://order-service-def456.onrender.com
https://payment-service-ghi789.onrender.com
https://auth-service-jkl012.onrender.com
```

---

## 🔧 Environment Variables Setup

### **For Local Development** (Current Setup ✅)

Keep your `.env.local` files with localhost:
```bash
NEXT_PUBLIC_PRODUCT_SERVICE_URL=http://localhost:8000
NEXT_PUBLIC_ORDER_SERVICE_URL=http://localhost:8001
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:8002
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8003
```

### **For Production Deployment** (REQUIRED ⚠️)

Update `.env` or set in Vercel/Netlify dashboard:
```bash
NEXT_PUBLIC_PRODUCT_SERVICE_URL=https://your-product-service.onrender.com
NEXT_PUBLIC_ORDER_SERVICE_URL=https://your-order-service.onrender.com
NEXT_PUBLIC_PAYMENT_SERVICE_URL=https://your-payment-service.onrender.com
NEXT_PUBLIC_AUTH_SERVICE_URL=https://your-auth-service.onrender.com
```

---

## 📝 Step-by-Step Deployment

### **Option A: Deploy to Render (Recommended)**

#### **1. Deploy Backend Services**

**For each service (product, order, payment, auth):**

```bash
# 1. Push to GitHub (if not done)
git add .
git commit -m "Prepare for production deployment"
git push origin main

# 2. Go to Render Dashboard (https://dashboard.render.com)
# 3. Click "New +" → "Web Service"
# 4. Connect your GitHub repository
# 5. Configure service:

Name: product-service
Environment: Node
Build Command: cd apps/product-service && npm install
Start Command: cd apps/product-service && npm start
```

**Environment Variables in Render:**
```
DATABASE_URL=your-neon-postgresql-url
CLERK_SECRET_KEY=your-clerk-secret
CLOUDINARY_URL=your-cloudinary-url
PORT=8000
NODE_ENV=production
```

**Repeat for all 4 services** (order, payment, auth) with their respective ports.

#### **2. Deploy Frontend Apps**

**Client App:**
```bash
# Deploy to Vercel (recommended for Next.js)
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy client
cd apps/client
vercel --prod

# 3. Add environment variables in Vercel dashboard:
# https://vercel.com/your-project/settings/environment-variables
```

**Environment Variables in Vercel:**
```
NEXT_PUBLIC_PRODUCT_SERVICE_URL=https://product-service-xyz.onrender.com
NEXT_PUBLIC_ORDER_SERVICE_URL=https://order-service-xyz.onrender.com
NEXT_PUBLIC_PAYMENT_SERVICE_URL=https://payment-service-xyz.onrender.com
NEXT_PUBLIC_AUTH_SERVICE_URL=https://auth-service-xyz.onrender.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-key
CLERK_SECRET_KEY=your-clerk-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-key
CLOUDINARY_URL=your-cloudinary-url
NEXT_PUBLIC_BASE_URL=https://eshop.neuraltale.com
```

**Admin App:**
```bash
cd apps/admin
vercel --prod

# Add same environment variables but with:
NEXT_PUBLIC_BASE_URL=https://admin.neuraltale.com
```

---

### **Option B: Deploy to Railway**

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Deploy each service
cd apps/product-service
railway init
railway up

# 4. Add environment variables
railway variables set DATABASE_URL="your-db-url"
```

---

## 🔐 Security Checklist

### **❌ DO NOT COMMIT TO GIT:**
- `.env` files with secrets
- Database passwords
- API keys (Clerk, Stripe, Cloudinary)
- Production URLs with sensitive data

### **✅ DO COMMIT TO GIT:**
- `.env.example` files (without actual secrets)
- Code changes
- Configuration files

### **🔒 Use Environment Variables in Deployment Platform:**
Set all secrets in:
- Vercel Dashboard → Settings → Environment Variables
- Render Dashboard → Environment → Environment Variables
- Railway Dashboard → Variables

---

## 🌐 DNS Configuration

### **Your Custom Domains:**
- **Client:** eshop.neuraltale.com
- **Admin:** admin.neuraltale.com

### **Setup in Vercel:**
1. Go to Project Settings → Domains
2. Add custom domain: `eshop.neuraltale.com`
3. Update DNS records in your domain provider:
   ```
   Type: CNAME
   Name: eshop
   Value: cname.vercel-dns.com
   ```

### **Setup in Cloudflare/Domain Provider:**
```
CNAME  eshop    cname.vercel-dns.com
CNAME  admin    cname.vercel-dns.com
```

---

## 🧪 Testing Production URLs

### **Before Going Live:**

1. **Test Backend Services:**
```bash
curl https://your-product-service.onrender.com/health
curl https://your-order-service.onrender.com/health
curl https://your-payment-service.onrender.com/health
curl https://your-auth-service.onrender.com/health
```

2. **Test Frontend:**
```bash
curl https://eshop.neuraltale.com
curl https://admin.neuraltale.com
```

3. **Check Browser Console:**
- Open DevTools → Network tab
- Verify API calls go to production URLs (not localhost)
- Check for CORS errors

---

## 🔄 Deployment Workflow

### **Development:**
```bash
# Local development uses .env.local with localhost
npm run dev
```

### **Staging/Production:**
```bash
# 1. Update code
git add .
git commit -m "feature: add new filter"
git push origin main

# 2. Vercel auto-deploys (if connected to GitHub)
# OR manually:
vercel --prod

# 3. Verify deployment
# Check https://eshop.neuraltale.com
```

---

## ⚡ Quick Reference

### **Current Setup (Local Development):**
```
✅ Client: http://localhost:3004
✅ Admin: http://localhost:3003
✅ Product Service: http://localhost:8000
✅ Order Service: http://localhost:8001
✅ Payment Service: http://localhost:8002
✅ Auth Service: http://localhost:8003
```

### **Production Setup (After Deployment):**
```
🌐 Client: https://eshop.neuraltale.com
🌐 Admin: https://admin.neuraltale.com
🌐 Product Service: https://your-product-service.onrender.com
🌐 Order Service: https://your-order-service.onrender.com
🌐 Payment Service: https://your-payment-service.onrender.com
🌐 Auth Service: https://your-auth-service.onrender.com
```

---

## 📚 Additional Resources

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Render Deployment Docs](https://render.com/docs)
- [Railway Deployment Docs](https://docs.railway.app)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

---

## 🆘 Common Issues

### **Issue: "Failed to fetch products"**
**Solution:** Update `NEXT_PUBLIC_PRODUCT_SERVICE_URL` in Vercel dashboard

### **Issue: "CORS Error"**
**Solution:** Add your frontend URL to backend CORS allowed origins

### **Issue: "Cannot reach database"**
**Solution:** Check Neon database is active and connection string is correct

### **Issue: "Clerk authentication failed"**
**Solution:** Verify Clerk keys are set in production environment

---

## ✅ Final Checklist Before Going Live

- [ ] All backend services deployed and returning health check
- [ ] Frontend apps deployed to Vercel
- [ ] All environment variables set in deployment platforms
- [ ] Custom domains configured (eshop.neuraltale.com, admin.neuraltale.com)
- [ ] DNS records updated
- [ ] Database connection working in production
- [ ] Stripe payment testing completed
- [ ] Clerk authentication working
- [ ] CORS configured for production URLs
- [ ] SSL certificates active (https)
- [ ] Test complete user flow: browse → add to cart → checkout → payment

---

**Remember:** Never commit `.env` files with real secrets to Git! Always use `.env.example` for templates.
