# MongoDB Atlas IP Whitelist Setup

## Current Issue
The order service cannot connect to MongoDB Atlas because your IP address is not whitelisted.

## Your Current IP Address
**41.78.65.41**

## Steps to Fix (Whitelist IP in MongoDB Atlas)

1. **Go to MongoDB Atlas**
   - Visit: https://cloud.mongodb.com/
   - Sign in with your account

2. **Navigate to Network Access**
   - In the left sidebar, click on "Network Access"
   - You'll see the "IP Access List" tab

3. **Add Your IP Address**
   - Click the "ADD IP ADDRESS" button
   - Choose one of these options:
     - **Option A (Recommended for Development):** Click "ADD CURRENT IP ADDRESS" - Atlas will auto-detect: `41.78.65.41`
     - **Option B (Allow from anywhere - LESS SECURE):** Enter `0.0.0.0/0` (not recommended for production)
   - Add a comment: "Local Development - Nov 2025"
   - Click "Confirm"

4. **Wait for Deployment**
   - Atlas will take 1-2 minutes to update the whitelist
   - You'll see a green status indicator when ready

5. **Test the Connection**
   - Come back to VS Code
   - Run: `cd apps/order-service; pnpm start`
   - You should see: "Connected to MongoDB Atlas Serverless"

## Alternative: Use Docker MongoDB (Local Development)

If you prefer to use a local MongoDB instance:

1. **Start Docker Desktop**

2. **Run MongoDB Container**
   ```powershell
   docker run -d -p 27017:27017 --name mongo-order mongo:6.0
   ```

3. **Update .env file**
   - Open: `apps/order-service/.env`
   - Change `MONGO_URL` to: `mongodb://localhost:27017/ecommerce-orders`

4. **Restart Order Service**
   ```powershell
   cd apps/order-service
   pnpm start
   ```

## Current MongoDB Atlas Connection
- **Cluster:** ecommerce-order-service.dwex9ak.mongodb.net
- **Database:** ecommerce-orders
- **Username:** Julius
- **Current Status:** ❌ IP not whitelisted

---

**After whitelisting your IP, delete this file and restart the order service.**
