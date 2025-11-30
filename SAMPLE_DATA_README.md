# Sample Data Documentation

## Overview
This directory contains realistic sample data for the e-commerce microservices architecture.

## Files

### 1. `sample-data-products.sql`
**Database:** Neon PostgreSQL (product-service)

**Contains:**
- 6 Categories (Laptops, Smartphones, Tablets, Headphones, Smartwatches, Cameras)
- 10 Products with complete details including:
  - Basic info (name, description, price)
  - Variants (sizes, colors)
  - Images
  - Technical highlights
  - Box contents
  - Product features
  - Technical specifications
  - Certifications

**Products included:**
1. MacBook Pro 16" - $2,499
2. Dell XPS 15 - $1,899
3. iPhone 15 Pro - $999
4. Samsung Galaxy S24 Ultra - $1,199
5. iPad Pro 12.9" - $1,099
6. Sony WH-1000XM5 - $399
7. AirPods Max - $549
8. Apple Watch Series 9 - $399
9. Sony Alpha 7 IV - $2,499

### 2. `sample-data-orders.js`
**Database:** MongoDB Atlas (order-service)

**Contains:**
- 10 Orders from different users
- Mix of single and multi-product orders
- 9 successful orders, 1 failed order
- Date range: Nov 20-27, 2024
- Total order value: ~$1,575 (average ~$157 per order)

**Order statistics:**
- Total successful orders: 9
- Total failed orders: 1
- Total revenue: $1,535.12
- Average order value: $157.50

## How to Use

### Load Products (PostgreSQL)

**Option 1: Using Prisma Studio**
```bash
cd packages/product-db
pnpm prisma studio
```
Then manually add products using the UI.

**Option 2: Using psql**
```bash
# Connect to Neon database
psql "postgresql://neondb_owner:npg_jMfztEK6WVJ3@ep-late-haze-adbmi2n9.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Run the SQL file
\i sample-data-products.sql
```

**Option 3: Using SQL client (DBeaver, TablePlus, etc.)**
1. Connect to your Neon database
2. Open `sample-data-products.sql`
3. Execute the script

### Load Orders (MongoDB)

**Option 1: Using MongoDB Compass**
1. Connect to your MongoDB Atlas cluster
2. Select database: `ecommerce-orders`
3. Select collection: `orders`
4. Click "Add Data" → "Import File"
5. Or use the mongosh tab and paste the script

**Option 2: Using mongosh**
```bash
# Connect to MongoDB Atlas
mongosh "mongodb+srv://Julius:mweGf2xBNGw0SO2E@ecommerce-order-service.dwex9ak.mongodb.net/ecommerce-orders"

# Load the script
load('sample-data-orders.js')
```

**Option 3: Using Node.js**
```bash
cd packages/order-db
node -e "$(cat ../../sample-data-orders.js)"
```

## Sample Data Details

### Product Categories Distribution
- Laptops: 2 products
- Smartphones: 2 products
- Tablets: 1 product
- Headphones: 2 products
- Smartwatches: 1 product
- Cameras: 1 product

### Price Range
- Budget: $399 (Headphones, Smartwatch)
- Mid-range: $999-$1,199 (Smartphones, Tablet)
- Premium: $1,899-$2,499 (Laptops, Camera)

### Customer Data
All orders use realistic sample customer data:
- john.doe@example.com (2 orders, $3,298 spent)
- sarah.smith@example.com (2 orders, 1 failed)
- mike.johnson@example.com (1 order, $1,899)
- emily.brown@example.com (1 order, $1,199)
- david.wilson@example.com (1 order, $1,498)
- And more...

**Note:** User IDs are sample Clerk user IDs. In production, these would be actual authenticated user IDs.

## Verification Queries

### Check Products (PostgreSQL)
```sql
-- Count products by category
SELECT c.name, COUNT(p.id) as product_count
FROM "Category" c
LEFT JOIN "Product" p ON c.slug = p."categorySlug"
GROUP BY c.name;

-- Get products with price range
SELECT name, price/100.0 as price_usd, "categorySlug"
FROM "Product"
ORDER BY price DESC;
```

### Check Orders (MongoDB)
```javascript
// Count orders by status
db.orders.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])

// Total revenue
db.orders.aggregate([
  { $match: { status: "success" } },
  { $group: { _id: null, total: { $sum: "$amount" } } }
])

// Orders per customer
db.orders.aggregate([
  { $group: { _id: "$email", orderCount: { $sum: 1 } } },
  { $sort: { orderCount: -1 } }
])
```

## Important Notes

1. **Prices are in cents**: $99.99 = 9999 cents
2. **Images**: Paths reference existing placeholder images in `/public/products/`
3. **User IDs**: Sample Clerk user IDs - replace with actual user IDs in production
4. **Dates**: Orders dated Nov 20-27, 2024 - adjust as needed
5. **Stock**: No inventory tracking in this sample data - implement as needed

## Next Steps

After loading sample data:
1. Test product browsing on client app (eshop.neuraltale.com)
2. Test category filtering
3. Test product detail pages with extended data
4. Test order history for sample users
5. Test admin dashboard product management
6. Test admin dashboard order viewing

## Production Considerations

Before using in production:
- [ ] Replace sample user IDs with real Clerk user IDs
- [ ] Add actual product images to Cloudinary
- [ ] Update product descriptions and specs
- [ ] Set up inventory management
- [ ] Configure proper product categorization
- [ ] Add more products to each category
- [ ] Implement product reviews/ratings
- [ ] Add product search and filters
