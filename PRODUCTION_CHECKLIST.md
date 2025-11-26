# Production Deployment Checklist

## 🚀 MongoDB Atlas IP Whitelist for Render

### Quick Solution (Deploy First, Whitelist Later)

1. **Deploy order-service to Render** (it will fail to connect to MongoDB initially)
2. **Check Render logs** - you'll see:
   ```
   🌐 Outgoing IP Address: X.X.X.X
   ⚠️  Add this IP to MongoDB Atlas Network Access if connection fails
   ```
3. **Copy that IP address**
4. **Go to MongoDB Atlas**:
   - Navigate to: Network Access → IP Access List
   - Click: ADD IP ADDRESS
   - Paste the IP from Render logs
   - Comment: "Render order-service - Oregon"
   - Click: Confirm
5. **Wait 1-2 minutes** for Atlas to update
6. **Restart order-service** in Render dashboard

### Alternative: Use the /my-ip Endpoint

After deploying (even if MongoDB fails), visit:
```
https://neuraltale-order-service.onrender.com/my-ip
```

This will show you the IP to whitelist.

---

## 🌐 Services Overview

### Backend Services (Render)
- **product-service** (port 8000) - Neon PostgreSQL (no IP whitelist needed)
- **order-service** (port 8001) - MongoDB Atlas ⚠️ **Needs IP whitelist**
- **payment-service** (port 8002) - Stripe (no whitelist needed)
- **auth-service** (port 8003) - Clerk (no whitelist needed)
- **email-service** (port 8004) - Nodemailer (no whitelist needed)

### Frontend (Vercel)
- **client** - Next.js customer app
- **admin** - Next.js admin dashboard

**Important:** Vercel does NOT need MongoDB access. Only backend services connect to databases.

---

## 📝 Environment Variables on Render

Make sure these are set in Render dashboard for **order-service**:

```env
NODE_ENV=production
PORT=8001
MONGO_URL=mongodb+srv://Julius:[password]@ecommerce-order-service.dwex9ak.mongodb.net/ecommerce-orders?retryWrites=true&w=majority
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
EMAIL_SERVICE_URL=https://neuraltale-email-service.onrender.com
PRODUCT_SERVICE_URL=https://neuraltale-product-service.onrender.com
```

---

## 🔒 Security Best Practices

### MongoDB Atlas
- ✅ Whitelist only Render IPs (not 0.0.0.0/0 in production)
- ✅ Use strong password in connection string
- ✅ URL-encode special characters in password
- ✅ Enable audit logs (if on paid tier)

### Render
- ✅ Use environment variables (not hardcoded secrets)
- ✅ Enable auto-deploy from GitHub
- ✅ Set up health check endpoints (/health)

### Vercel
- ✅ Set NEXT_PUBLIC_*_SERVICE_URL to Render URLs
- ✅ Keep Clerk keys in environment variables

---

## 🧪 Testing Production Deployment

### 1. Test Order Service Health
```bash
curl https://neuraltale-order-service.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "uptime": 123,
  "timestamp": 1732569600000
}
```

### 2. Check Outgoing IP
```bash
curl https://neuraltale-order-service.onrender.com/my-ip
```

Expected response:
```json
{
  "ip": "X.X.X.X",
  "message": "Add this IP to MongoDB Atlas Network Access whitelist",
  "instructions": "https://cloud.mongodb.com/ → Network Access → Add IP Address"
}
```

### 3. Test Frontend Connection
- Visit: `https://your-vercel-app.vercel.app`
- Sign in with Clerk
- Navigate to `/orders`
- Should fetch orders from Render order-service

---

## 🐛 Troubleshooting

### Issue: "Could not connect to MongoDB Atlas"

**Solution:**
1. Check Render logs for the outgoing IP
2. Verify the IP is whitelisted in MongoDB Atlas
3. Wait 2 minutes after adding IP (Atlas needs time to propagate)
4. Restart the service in Render

### Issue: "Network Access shows my IP but still fails"

**Solution:**
- Make sure you added the **Render service IP** (not your local IP)
- Use the `/my-ip` endpoint to get the correct IP
- MongoDB Atlas can take up to 5 minutes to fully propagate changes

### Issue: "Connection timeout"

**Solution:**
- Check MONGO_URL in Render environment variables
- Verify the connection string includes `retryWrites=true&w=majority`
- Ensure password is URL-encoded (@ becomes %40, etc.)

---

## 🎯 Quick Reference

| Service | Database | IP Whitelist Needed? |
|---------|----------|---------------------|
| product-service | Neon PostgreSQL | ❌ No (uses connection string) |
| order-service | MongoDB Atlas | ✅ Yes (whitelist Render IP) |
| payment-service | None | ❌ No |
| auth-service | None | ❌ No |
| email-service | None | ❌ No |
| client (Vercel) | None | ❌ No (calls backend APIs) |
| admin (Vercel) | None | ❌ No (calls backend APIs) |

---

## 📋 Deployment Order

1. Deploy all backend services to Render
2. Note the order-service IP from logs
3. Whitelist IP in MongoDB Atlas
4. Restart order-service
5. Update Vercel environment variables with Render URLs
6. Deploy frontend to Vercel
7. Test end-to-end flow

---

## ✅ Post-Deployment Verification

- [ ] All Render services show "Live" status
- [ ] /health endpoints return 200 OK
- [ ] MongoDB Atlas shows whitelisted IP
- [ ] Vercel frontend loads successfully
- [ ] Can create an order from frontend
- [ ] Order appears in admin dashboard
- [ ] Email notifications sent (if configured)

---

**Need help? Check:**
- Render logs: `https://dashboard.render.com/`
- MongoDB Atlas: `https://cloud.mongodb.com/`
- Vercel logs: `https://vercel.com/dashboard`
