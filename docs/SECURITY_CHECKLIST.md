# Security Implementation Checklist

## ✅ Authentication & Authorization

### Clerk Integration
- [x] Install `@clerk/express` in product-service
- [x] Install `@clerk/nextjs` in admin dashboard
- [x] Configure Clerk middleware on all routes
- [x] Implement `shouldBeUser` middleware
- [x] Implement `shouldBeAdmin` middleware
- [ ] Set up admin role in Clerk dashboard
- [ ] Configure webhook for user sync

### Role-Based Access Control (RBAC)
```typescript
// Required in Clerk publicMetadata
{
  "role": "admin" | "user"
}
```

**Implementation Status**: ✅ Complete
- Admin-only routes: `/products/*`, `/hero/*`, `/categories/*`
- User routes: `/orders`, `/profile`

---

## ✅ Input Validation

### Server-Side Validation
- [x] Validate product data structure
- [x] Check required fields (name, price, description)
- [x] Validate price is positive integer
- [x] Ensure colors have corresponding images
- [x] Validate hero order (1-10 range)
- [x] Check category exists before assignment

### Client-Side Validation
```typescript
// Using Zod schema validation
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(3).max(200),
  price: z.number().int().positive(),
  colors: z.array(z.string()).min(1),
  images: z.record(z.array(z.string().url())),
  // ... more fields
});
```

**To Implement**:
- [ ] Add Zod validation to all forms
- [ ] Real-time validation feedback
- [ ] File type validation for uploads

---

## 🔒 Data Protection

### SQL Injection Prevention
**Status**: ✅ Protected (Prisma ORM)
- All queries use Prisma's parameterized queries
- No raw SQL without sanitization
- Type-safe database operations

### XSS Prevention
**Status**: ⚠️ Needs Implementation

**Required Actions**:
```bash
npm install isomorphic-dompurify
```

```typescript
import DOMPurify from "isomorphic-dompurify";

// Sanitize all user input
const cleanInput = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: [], // No HTML
  ALLOWED_ATTR: [],
});
```

- [ ] Install DOMPurify
- [ ] Sanitize product names
- [ ] Sanitize descriptions
- [ ] Sanitize all text inputs

### CSRF Protection
**Status**: ✅ Protected (Clerk handles CSRF)
- Clerk middleware includes CSRF protection
- All mutations require valid session token

---

## 🚦 Rate Limiting

### Implementation Required
```bash
npm install express-rate-limit
```

```typescript
import rateLimit from "express-rate-limit";

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/products", adminLimiter);
app.use("/hero", adminLimiter);
```

**To Implement**:
- [ ] Install express-rate-limit
- [ ] Apply to product-service
- [ ] Configure different limits for:
  - Read operations: 300/15min
  - Write operations: 50/15min
  - Admin operations: 100/15min

---

## 🔐 CORS Configuration

### Current Configuration
```typescript
const allowedOrigins = [
  "http://localhost:3002", // Client
  "http://localhost:3003", // Admin
  "http://localhost:3004", // Client dev
  "https://neuraltale-client.onrender.com",
  "https://neuraltale-admin.onrender.com",
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
```

**Status**: ✅ Configured

**To Review**:
- [ ] Remove localhost in production
- [ ] Add production domains
- [ ] Test CORS on staging

---

## 📤 File Upload Security

### Cloudinary Configuration
**Status**: ⚠️ Partially Implemented

**Required Security Measures**:

```typescript
// File validation
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png", 
  "image/webp",
  "image/avif"
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const validateFile = (file: File) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Invalid file type");
  }
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large");
  }
  
  // Validate image dimensions
  const img = new Image();
  img.src = URL.createObjectURL(file);
  
  return new Promise((resolve, reject) => {
    img.onload = () => {
      if (img.width < 500 || img.height < 500) {
        reject("Image too small (min 500x500)");
      }
      if (img.width > 4000 || img.height > 4000) {
        reject("Image too large (max 4000x4000)");
      }
      resolve(true);
    };
  });
};
```

**To Implement**:
- [ ] File type validation
- [ ] File size validation
- [ ] Image dimension validation
- [ ] Malware scanning (use Cloudinary add-on)
- [ ] Signed upload URLs
- [ ] Upload rate limiting

---

## 🔍 Logging & Monitoring

### Audit Trail
**Status**: ❌ Not Implemented

**Required Implementation**:

```typescript
// Create AuditLog model
model AuditLog {
  id        Int      @id @default(autoincrement())
  userId    String
  action    String   // CREATE, UPDATE, DELETE, etc.
  resource  String   // products, hero, categories
  resourceId Int?
  details   Json?
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  
  @@index([userId, createdAt])
  @@index([resource, resourceId])
}
```

```typescript
// Logging middleware
const auditLog = async (req, res, next) => {
  const originalSend = res.json;
  
  res.json = function(data) {
    // Log after successful operation
    if (res.statusCode < 400) {
      prisma.auditLog.create({
        data: {
          userId: req.userId,
          action: req.method,
          resource: req.baseUrl,
          resourceId: req.params.id,
          details: { body: req.body },
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
        },
      });
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};
```

**To Implement**:
- [ ] Create AuditLog model
- [ ] Implement logging middleware
- [ ] Log all CRUD operations
- [ ] Log authentication events
- [ ] Log failed access attempts
- [ ] Set up log rotation
- [ ] Export logs to external service (Datadog, LogRocket)

---

## 🛡️ Environment Variables

### Required Variables Checklist

```bash
# Database
DATABASE_URL=                 # ✅ Set
DIRECT_URL=                   # ✅ Set

# Authentication
CLERK_SECRET_KEY=             # ✅ Set
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= # ✅ Set

# Services
NEXT_PUBLIC_PRODUCT_SERVICE_URL=   # ✅ Set
NEXT_PUBLIC_ADMIN_URL=             # ✅ Set

# File Upload
CLOUDINARY_CLOUD_NAME=        # ✅ Set
CLOUDINARY_API_KEY=           # ✅ Set
CLOUDINARY_API_SECRET=        # ✅ Set

# Optional
NODE_ENV=production           # ⚠️ Set in production
SENTRY_DSN=                   # ❌ Not set (optional)
LOG_LEVEL=                    # ❌ Not set (optional)
```

**Security Measures**:
- [ ] Never commit .env files
- [ ] Use secret management (Vercel, Railway)
- [ ] Rotate secrets regularly
- [ ] Use different secrets per environment
- [ ] Audit .env access logs

---

## 🔒 HTTPS & Network Security

### SSL/TLS
**Production Status**: ✅ Handled by hosting (Vercel, Render)

**Checklist**:
- [ ] Force HTTPS redirects
- [ ] Use HSTS headers
- [ ] Certificate auto-renewal configured
- [ ] Test SSL configuration (SSL Labs)

### Security Headers

```typescript
// Required headers
import helmet from "helmet";

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "https://res.cloudinary.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
```

**To Implement**:
- [ ] Install helmet
- [ ] Configure CSP
- [ ] Add HSTS header
- [ ] Add X-Frame-Options
- [ ] Add X-Content-Type-Options

---

## 🧪 Testing Security

### Penetration Testing Checklist
- [ ] SQL injection attempts
- [ ] XSS vulnerability testing
- [ ] CSRF testing
- [ ] Authentication bypass attempts
- [ ] Authorization boundary testing
- [ ] File upload exploits
- [ ] Rate limit testing
- [ ] Session management testing

### Security Scanning Tools
```bash
# Install OWASP ZAP or Burp Suite

# Run npm audit
npm audit

# Fix vulnerabilities
npm audit fix

# Scan dependencies
npm install -g snyk
snyk test
snyk monitor
```

**To Implement**:
- [ ] Set up automated security scanning
- [ ] Run npm audit weekly
- [ ] Configure Snyk monitoring
- [ ] Schedule penetration tests
- [ ] Bug bounty program (future)

---

## 📋 Pre-Deployment Security Checklist

### Code Review
- [ ] All admin routes have authentication
- [ ] All mutations have authorization
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] No hardcoded secrets
- [ ] No console.logs with sensitive data

### Infrastructure
- [ ] Database backups configured
- [ ] Monitoring and alerting set up
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] SSL certificates valid

### Documentation
- [ ] Security policies documented
- [ ] Incident response plan ready
- [ ] Admin user training completed
- [ ] Audit log review process
- [ ] Backup/restore procedures tested

---

## 🚨 Incident Response Plan

### If Security Breach Detected:

1. **Immediate Actions**
   - [ ] Isolate affected systems
   - [ ] Revoke compromised credentials
   - [ ] Enable maintenance mode
   - [ ] Notify security team

2. **Investigation**
   - [ ] Review audit logs
   - [ ] Identify breach scope
   - [ ] Document timeline
   - [ ] Preserve evidence

3. **Recovery**
   - [ ] Patch vulnerabilities
   - [ ] Restore from clean backup
   - [ ] Reset all credentials
   - [ ] Re-deploy services

4. **Post-Incident**
   - [ ] Conduct post-mortem
   - [ ] Update security measures
   - [ ] User notification (if required)
   - [ ] Document lessons learned

---

## 📞 Security Contacts

**Security Team**: security@neuraltale.com  
**Emergency**: +255 XXX XXX XXX  
**Clerk Support**: support@clerk.com  
**Hosting Support**: See respective platforms

---

## 📅 Regular Security Maintenance

### Weekly
- [ ] Review audit logs
- [ ] Check for failed login attempts
- [ ] Monitor rate limit violations

### Monthly
- [ ] Run npm audit
- [ ] Review user permissions
- [ ] Update dependencies
- [ ] Test backup restoration

### Quarterly
- [ ] Security training for team
- [ ] Penetration testing
- [ ] Review and update policies
- [ ] Rotate API keys

---

**Last Updated**: December 10, 2025  
**Next Review**: January 10, 2026  
**Reviewed By**: Security Team
