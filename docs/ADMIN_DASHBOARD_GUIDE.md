# Admin Dashboard Enhancement Documentation

## Overview
Complete guide for managing products and hero section items with full CRUD operations, database schema, sample data, and security considerations.

---

## Table of Contents
1. [Database Schema](#database-schema)
2. [Sample Data Setup](#sample-data-setup)
3. [Admin Interface Features](#admin-interface-features)
4. [API Endpoints](#api-endpoints)
5. [Security Considerations](#security-considerations)
6. [Deployment Guide](#deployment-guide)

---

## Database Schema

### Complete Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Product {
  id                 Int      @id @default(autoincrement())
  name               String
  shortDescription   String
  description        String
  price              Int      // Price in cents
  sizes              String[]
  colors             String[]
  images             Json     // { "color": ["url1", "url2"] }
  techHighlights     Json?    // [{ label: string, icon: string }]
  boxContents        Json?    // ["item1", "item2"]
  productFeatures    Json?    // [{ title: string, description: string }]
  technicalSpecs     Json?    // { category: [{ label: string, value: string }] }
  certifications     Json?    // [{ label: string, icon: string }]
  isHeroProduct      Boolean  @default(false)
  heroOrder          Int?     // 1-10 for hero products
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  categorySlug       String
  category           Category @relation(fields: [categorySlug], references: [slug])
  
  @@index([isHeroProduct, heroOrder])
  @@index([categorySlug])
}

model Category {
  id       Int       @id @default(autoincrement())
  name     String
  slug     String    @unique
  products Product[]
}
```

### Database Migration

```bash
# Navigate to product-db package
cd packages/product-db

# Create migration
pnpm prisma migrate dev --name add_hero_products_fields

# Deploy to production
pnpm prisma migrate deploy

# Generate Prisma client
pnpm prisma generate
```

---

## Sample Data Setup

### Using the SQL Seed File

```bash
# Connect to your Neon database
psql -h ep-late-haze-adbmi2n9.c-2.us-east-1.aws.neon.tech -U your_user -d neondb

# Run the seed file
\i packages/product-db/prisma/seed.sql

# Or via command line
psql -h <host> -U <user> -d <database> -f packages/product-db/prisma/seed.sql
```

### Sample Data Includes:
- **20 Categories**: Smartphones, Laptops, Gaming, Audio, Wearables, etc.
- **5 Hero Products**: Premium items for homepage slider
- **10 Regular Products**: Complete product catalog
- **Complete Product Data**: Images, specs, highlights, features

### Key Hero Products in Sample Data:
1. ASUS ROG Strix G16 Gaming Laptop (Order: 1)
2. iPhone 15 Pro Max (Order: 2)
3. AirPods Pro 3rd Gen (Order: 3)
4. Apple Watch Series 9 (Order: 4)
5. MacBook Pro 14" M4 Pro (Order: 5)

---

## Admin Interface Features

### 1. Hero Products Management Page
**Location**: `/admin/hero-products`

#### Features:
- **Visual Product Cards**: Display product image, name, description, price
- **Drag & Reorder**: Change hero product display order
- **Add/Remove**: Toggle hero status with one click
- **Real-time Stats**: Track hero slots usage (max 10)
- **Batch Operations**: Update multiple products at once

#### UI Components:
```tsx
- Product Grid with Images
- Order Controls (Up/Down Arrows)
- Add to Hero Button
- Remove from Hero Button
- Stats Dashboard
- Search & Filter
```

### 2. Products Management
**Location**: `/admin/products`

#### Features:
- **Full CRUD Operations**:
  - Create new products with all fields
  - Edit existing products
  - Delete products (with confirmation)
  - Bulk operations
  
- **Data Table with**:
  - Sorting by name, price, date
  - Filtering by category
  - Search functionality
  - Pagination
  - Export to CSV

- **Product Form Fields**:
  ```typescript
  - Basic Info: name, shortDescription, description
  - Pricing: price (in cents)
  - Variants: colors[], sizes[]
  - Images: { color: [urls] }
  - Category: categorySlug
  - Hero Status: isHeroProduct, heroOrder
  - Technical: techHighlights, boxContents
  - Features: productFeatures, technicalSpecs
  - Certifications: certifications[]
  ```

### 3. Enhanced Edit Form
**Location**: `/admin/products/[id]/edit`

#### Sections:
1. **Basic Information**
   - Product name, descriptions
   - Category selection
   - Price input (TZS conversion)

2. **Variants & Images**
   - Color picker with image upload
   - Size/capacity options
   - Multi-image upload per color
   - Image preview gallery

3. **Hero Product Settings**
   - Toggle hero status
   - Set hero order (1-10)
   - Preview position

4. **Technical Specifications**
   - Dynamic spec categories
   - Key-value pairs
   - Icon selection

5. **Features & Highlights**
   - Tech highlights with icons
   - Product features list
   - Box contents
   - Certifications

---

## API Endpoints

### Product Endpoints

#### Get All Products
```http
GET /products
Authorization: Bearer <token>
```

#### Get Single Product
```http
GET /products/:id
```

#### Create Product
```http
POST /products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Product Name",
  "shortDescription": "Short desc",
  "description": "Full description",
  "price": 99900,
  "sizes": ["256GB", "512GB"],
  "colors": ["Black", "Silver"],
  "images": {
    "Black": ["url1.jpg", "url2.jpg"],
    "Silver": ["url3.jpg"]
  },
  "categorySlug": "smartphones",
  "isHeroProduct": false
}
```

#### Update Product
```http
PUT /products/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "price": 89900,
  "isHeroProduct": true,
  "heroOrder": 1
}
```

#### Delete Product
```http
DELETE /products/:id
Authorization: Bearer <admin-token>
```

### Hero Product Endpoints

#### Get Hero Products
```http
GET /products/hero

Response:
[
  {
    "id": 1,
    "name": "Product Name",
    "isHeroProduct": true,
    "heroOrder": 1,
    ...
  }
]
```

#### Batch Update Hero Products
```http
POST /hero/batch-update
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "updates": [
    { "id": 1, "isHeroProduct": true, "heroOrder": 1 },
    { "id": 2, "isHeroProduct": true, "heroOrder": 2 },
    { "id": 3, "isHeroProduct": false, "heroOrder": null }
  ]
}
```

#### Reorder Hero Products
```http
POST /hero/reorder
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "productIds": [5, 2, 8, 1, 3]  // New order
}
```

#### Clear All Hero Products
```http
DELETE /hero/clear
Authorization: Bearer <admin-token>

Response:
{
  "message": "All hero products cleared",
  "count": 5
}
```

#### Get Hero Stats
```http
GET /hero/stats

Response:
{
  "totalProducts": 150,
  "heroCount": 5,
  "availableSlots": 5,
  "heroProducts": [...]
}
```

### Category Endpoints

#### Get All Categories
```http
GET /categories

Response:
[
  { "id": 1, "name": "Smartphones", "slug": "smartphones" },
  { "id": 2, "name": "Laptops", "slug": "laptops" }
]
```

---

## Security Considerations

### 1. Authentication & Authorization

#### Clerk Authentication
```typescript
// All admin routes require authentication
import { getAuth } from "@clerk/express";

export const shouldBeAdmin = (req, res, next) => {
  const auth = getAuth(req);
  const userId = auth.userId;

  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const claims = auth.sessionClaims as CustomJwtSessionClaims;

  if (claims.metadata?.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized - Admin only" });
  }

  req.userId = userId;
  next();
};
```

#### Setting Admin Role in Clerk
```javascript
// In Clerk Dashboard or via API
{
  "publicMetadata": {
    "role": "admin"
  }
}
```

### 2. Input Validation

```typescript
// Validate product data
const validateProductData = (data) => {
  // Required fields
  if (!data.name || !data.description || !data.price) {
    throw new Error("Missing required fields");
  }

  // Price validation
  if (data.price < 0) {
    throw new Error("Price must be positive");
  }

  // Colors and images validation
  if (data.colors?.length > 0) {
    const missingImages = data.colors.filter(
      color => !data.images[color]
    );
    if (missingImages.length > 0) {
      throw new Error("Missing images for colors");
    }
  }

  // Hero order validation
  if (data.isHeroProduct && data.heroOrder) {
    if (data.heroOrder < 1 || data.heroOrder > 10) {
      throw new Error("Hero order must be between 1-10");
    }
  }
};
```

### 3. Rate Limiting

```typescript
import rateLimit from "express-rate-limit";

// Admin endpoints rate limiting
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  message: "Too many requests from this IP",
});

app.use("/products", adminLimiter);
app.use("/hero", adminLimiter);
```

### 4. CORS Configuration

```typescript
const allowedOrigins = [
  "http://localhost:3003", // Admin local
  "https://admin.neurashop.com", // Production admin
  process.env.ADMIN_URL,
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
```

### 5. SQL Injection Prevention

```typescript
// Prisma ORM automatically prevents SQL injection
// All queries are parameterized

// ✅ Safe
const product = await prisma.product.findUnique({
  where: { id: productId }
});

// ❌ Don't use raw queries without sanitization
// Use Prisma's built-in query methods
```

### 6. XSS Prevention

```typescript
// Sanitize user input
import DOMPurify from "isomorphic-dompurify";

const sanitizeInput = (input: string) => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
  });
};

// Usage
const product = {
  name: sanitizeInput(req.body.name),
  description: sanitizeInput(req.body.description),
};
```

### 7. File Upload Security

```typescript
// Cloudinary configuration
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validate file types
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const validateImage = (file: File) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Invalid file type");
  }
  
  if (file.size > 5 * 1024 * 1024) { // 5MB
    throw new Error("File too large");
  }
};
```

### 8. Environment Variables

```bash
# Required Environment Variables

# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:pass@host.neon.tech/db?pgbouncer=true"
DIRECT_URL="postgresql://user:pass@host.neon.tech/db"

# Clerk Authentication
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."

# Service URLs
NEXT_PUBLIC_PRODUCT_SERVICE_URL="http://localhost:8000"
NEXT_PUBLIC_ADMIN_URL="http://localhost:3003"

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 9. Audit Logging

```typescript
// Log all admin actions
const logAdminAction = async (
  userId: string,
  action: string,
  details: any
) => {
  console.log({
    timestamp: new Date().toISOString(),
    userId,
    action,
    details,
  });
  
  // Store in database for audit trail
  // await prisma.auditLog.create({ ... });
};

// Usage
await logAdminAction(req.userId, "UPDATE_HERO_PRODUCTS", {
  productIds: [1, 2, 3],
});
```

### 10. Error Handling

```typescript
// Global error handler
app.use((err, req, res, next) => {
  // Log error (use proper logging service in production)
  console.error("Error:", err);

  // Don't expose internal errors to client
  const isProduction = process.env.NODE_ENV === "production";
  
  res.status(err.status || 500).json({
    error: isProduction 
      ? "Internal server error" 
      : err.message,
  });
});
```

---

## Deployment Guide

### 1. Database Setup (Neon)

```bash
# Install Neon CLI
npm install -g neonctl

# Create project
neonctl projects create --name neurashop-production

# Get connection strings
neonctl connection-string <project-id>

# Run migrations
cd packages/product-db
pnpm prisma migrate deploy

# Seed database
psql $DATABASE_URL -f prisma/seed.sql
```

### 2. Service Deployment

```bash
# Build services
pnpm build

# Deploy product-service
cd apps/product-service
# Deploy to your hosting (Railway, Render, etc.)

# Deploy admin dashboard
cd apps/admin
# Deploy to Vercel
vercel --prod
```

### 3. Environment Setup

```bash
# Production environment variables
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
CLERK_SECRET_KEY="sk_live_..."
NODE_ENV="production"
```

### 4. Testing Checklist

- [ ] Create new product via admin
- [ ] Edit existing product
- [ ] Delete product
- [ ] Add product to hero
- [ ] Remove from hero
- [ ] Reorder hero products
- [ ] Test with non-admin user (should fail)
- [ ] Verify hero products display on homepage
- [ ] Test image uploads
- [ ] Check database connection pooling

---

## Best Practices

1. **Always backup database before bulk operations**
2. **Test changes on staging first**
3. **Monitor hero products performance (max 10)**
4. **Regularly rotate featured products**
5. **Optimize images before upload (use Cloudinary)**
6. **Keep audit logs of all admin actions**
7. **Use descriptive commit messages**
8. **Document any custom modifications**

---

## Support & Troubleshooting

### Common Issues

**Issue**: Hero products not displaying
- Check `isHeroProduct` flag is `true`
- Verify `heroOrder` is set (1-10)
- Check API endpoint `/products/hero`

**Issue**: Unauthorized access
- Verify Clerk admin role is set
- Check JWT token is being sent
- Confirm middleware is applied

**Issue**: Image upload fails
- Check Cloudinary credentials
- Verify file size < 5MB
- Confirm allowed file types

---

## License
MIT © Neuraltale 2025
