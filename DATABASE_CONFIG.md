# Environment Variables for Serverless Databases

This project uses serverless databases for better scalability and cost efficiency.

## PostgreSQL (Neon)

### Required Environment Variables:
```bash
# Neon PostgreSQL Connection (with connection pooling)
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require&pgbouncer=true&connect_timeout=15"

# Direct URL for migrations (without connection pooling)
DIRECT_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require"
```

### Neon Setup Steps:
1. Create a Neon project at https://neon.tech
2. Copy the connection string from Neon dashboard
3. Use the pooled connection for `DATABASE_URL`
4. Use the direct connection for `DIRECT_URL`

## MongoDB (Atlas Serverless)

### Required Environment Variables:
```bash
# MongoDB Atlas Serverless Connection
MONGO_URL="mongodb+srv://username:password@cluster.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority"
```

### MongoDB Atlas Serverless Setup Steps:
1. Create a MongoDB Atlas account
2. Create a new cluster and select "Serverless"
3. Set up database user and network access
4. Copy the connection string and replace credentials

## Development vs Production

### Development (.env.local):
```bash
# Development databases (can use smaller instances)
DATABASE_URL="postgresql://dev_user:dev_pass@ep-dev.neon.tech/ecom_dev?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://dev_user:dev_pass@ep-dev.neon.tech/ecom_dev?sslmode=require"
MONGO_URL="mongodb+srv://dev_user:dev_pass@dev-cluster.mongodb.net/ecom_dev?retryWrites=true&w=majority"
```

### Production (.env.production):
```bash
# Production databases (optimized for performance)
DATABASE_URL="postgresql://prod_user:prod_pass@ep-prod.neon.tech/ecom_prod?sslmode=require&pgbouncer=true&connect_timeout=15"
DIRECT_URL="postgresql://prod_user:prod_pass@ep-prod.neon.tech/ecom_prod?sslmode=require"
MONGO_URL="mongodb+srv://prod_user:prod_pass@prod-cluster.mongodb.net/ecom_prod?retryWrites=true&w=majority"
```

## Database Operations

### PostgreSQL (Prisma) Commands:
```bash
# Generate Prisma client
pnpm --filter=@repo/product-db db:generate

# Run migrations (uses DIRECT_URL)
pnpm --filter=@repo/product-db db:migrate

# Deploy to production
pnpm --filter=@repo/product-db db:deploy
```

### MongoDB Operations:
- MongoDB Atlas Serverless automatically handles scaling
- No manual migration commands needed
- Schema changes are handled at application level via Mongoose models

## Benefits of Serverless Setup

### Neon PostgreSQL:
- **Auto-scaling**: Scales to zero when not in use
- **Branching**: Create database branches for development
- **Connection pooling**: Built-in PgBouncer for better performance
- **Point-in-time recovery**: Automatic backups

### MongoDB Atlas Serverless:
- **Pay-per-use**: Only pay for operations and storage used
- **Auto-scaling**: Automatically scales based on demand
- **Global clusters**: Low latency worldwide
- **Built-in security**: Encryption and network isolation