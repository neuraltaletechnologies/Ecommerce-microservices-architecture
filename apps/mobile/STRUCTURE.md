name: Neurashop Mobile Flutter App

# Flutter App Structure Overview

## 📁 Complete Directory Structure

```
apps/mobile/
├── android/                        # Android platform-specific files
├── ios/                           # iOS platform-specific files
├── web/                           # Web platform-specific files
├── lib/                           # Main Dart application code
│   ├── main.dart                  # App entry point with ProviderScope
│   ├── config/
│   │   ├── constants.dart         # App constants, URLs, sizes, strings
│   │   └── router.dart            # Go Router navigation configuration
│   │
│   ├── models/                    # Data models with JSON serialization
│   │   ├── auth_models.dart       # AuthUser, AuthToken, LoginRequest, etc.
│   │   ├── product_models.dart    # Product, Category, ProductsResponse
│   │   ├── order_models.dart      # Order, OrderItem, CreateOrderRequest
│   │   ├── cart_models.dart       # CartItem, CartState
│   │   └── payment_models.dart    # PaymentIntent, StripeCheckoutSession
│   │
│   ├── services/                  # API service layer
│   │   ├── dio_client.dart        # Singleton Dio HTTP client with interceptors
│   │   ├── auth_service.dart      # Auth API calls (login, signup, profile)
│   │   ├── product_service.dart   # Product API calls (list, search, categories)
│   │   ├── order_service.dart     # Order API calls (create, list, update)
│   │   └── payment_service.dart   # Payment API calls (checkout, intent)
│   │
│   ├── providers/                 # Riverpod state management
│   │   ├── auth_provider.dart     # Auth state with StateNotifier
│   │   ├── product_provider.dart  # Product data providers
│   │   ├── cart_provider.dart     # Shopping cart state
│   │   ├── order_provider.dart    # Order management providers
│   │   └── payment_provider.dart  # Payment operation providers
│   │
│   ├── screens/                   # UI Screens
│   │   ├── splash_screen.dart     # App splash/loading screen
│   │   └── home/
│   │       └── home_screen.dart   # Home page with featured products
│   │   ├── products/              # (Placeholder for product screens)
│   │   ├── cart/                  # (Placeholder for cart screen)
│   │   ├── orders/                # (Placeholder for orders screen)
│   │   ├── auth/                  # (Placeholder for auth screens)
│   │   └── profile/               # (Placeholder for profile screen)
│   │
│   ├── widgets/                   # Reusable UI components (placeholder)
│   │   └── (Custom widgets will go here)
│   │
│   └── utils/                     # Utility functions and helpers
│       ├── logger.dart            # Logger utility with pretty printer
│       ├── extensions.dart        # String and double extensions
│       └── exceptions.dart        # Custom exception classes
│
├── test/                          # Unit and widget tests
├── pubspec.yaml                   # Dependencies and project configuration
├── analysis_options.yaml          # Linter rules and analysis settings
├── .env.example                   # Example environment variables
├── .gitignore                     # Git ignore patterns
└── README.md                      # Project documentation
```

## 🔧 Key Files Breakdown

### Configuration Files

**`pubspec.yaml`** - Project dependencies:
- `provider` & `riverpod` - State management
- `dio` - HTTP client
- `clerk_flutter` - Authentication
- `flutter_stripe` - Payments
- `go_router` - Navigation
- `hive` & `shared_preferences` - Local storage
- `json_annotation` & `json_serializable` - JSON handling

**`.env.example`** - Backend service URLs:
```
PRODUCT_SERVICE_URL=http://localhost:8000
ORDER_SERVICE_URL=http://localhost:8001
PAYMENT_SERVICE_URL=http://localhost:8002
AUTH_SERVICE_URL=http://localhost:8003
EMAIL_SERVICE_URL=http://localhost:8004
```

### Core Application Files

**`main.dart`** - App entry point:
- Loads environment variables
- Sets up ProviderScope for Riverpod
- Configures Material3 theme
- Initializes router

**`lib/config/constants.dart`** - App configuration:
- Backend service URLs (from env vars)
- App sizes and padding constants
- String constants
- Timeout configurations

**`lib/config/router.dart`** - Navigation:
- GoRouter configuration
- Routes: home, splash, and placeholders
- Route paths and builders

### Models (Data Layer)

All models have `@JsonSerializable()` for automatic JSON conversion:

**`auth_models.dart`**:
- `AuthUser` - User profile data
- `AuthToken` - JWT token response
- `LoginRequest` - Login credentials
- `SignupRequest` - Registration data
- `CustomJwtSessionClaims` - Clerk JWT structure
- `ClerkMetadata` - User role and metadata

**`product_models.dart`**:
- `Product` - Single product with price, stock, ratings
- `ProductsResponse` - Paginated products
- `Category` - Product category

**`order_models.dart`**:
- `Order` - Complete order with items and status
- `OrderItem` - Single item in order
- `CreateOrderRequest` - Request to create order
- `CartItemData` - Cart item for order creation
- `OrdersResponse` - Paginated orders

**`cart_models.dart`**:
- `CartItem` - Product in shopping cart
- `CartState` - Shopping cart state with total/count

**`payment_models.dart`**:
- `PaymentIntent` - Stripe payment intent
- `StripeCheckoutSession` - Stripe session
- `CreateCheckoutSessionRequest` - Checkout request
- `CheckoutItem` - Item for checkout

### Services (API Layer)

**`dio_client.dart`** - HTTP client singleton:
- Base Dio configuration
- Interceptors for auth tokens
- Methods to set/remove auth token

**`auth_service.dart`** - Authentication:
- `getCurrentUser()` - Fetch current user
- `login()` - Login with email/password
- `signup()` - Create new account
- `logout()` - Logout and clear token
- `refreshToken()` - Refresh expired token
- `updateProfile()` - Update user info

**`product_service.dart`** - Products:
- `getProducts()` - List with pagination and filters
- `getProduct()` - Single product by ID
- `getCategories()` - All categories
- `getFeaturedProducts()` - Featured products

**`order_service.dart`** - Orders:
- `createOrder()` - Create new order
- `getOrders()` - List user's orders
- `getOrder()` - Single order details
- `updateOrder()` - Update order
- `cancelOrder()` - Cancel order

**`payment_service.dart`** - Payments:
- `createCheckoutSession()` - Stripe checkout
- `createPaymentIntent()` - Create payment intent
- `confirmPayment()` - Confirm payment method

### State Management (Providers)

**`auth_provider.dart`**:
- `authServiceProvider` - Service instance
- `authStateProvider` - Auth state with login/signup/logout
- `currentUserProvider` - Fetch current authenticated user
- `AuthState` class - Auth state model
- `AuthNotifier` - State mutations

**`product_provider.dart`**:
- `productsProvider` - Paginated product list
- `productProvider` - Single product by ID
- `categoriesProvider` - Product categories
- `featuredProductsProvider` - Featured products

**`cart_provider.dart`**:
- `cartProvider` - Shopping cart state
- `CartNotifier` - Add/remove/update items, clear cart
- Local storage persistence (TODO)

**`order_provider.dart`**:
- `ordersProvider` - User's orders list
- `orderProvider` - Single order details
- `createOrderProvider` - Create order operation

**`payment_provider.dart`**:
- `createCheckoutSessionProvider` - Stripe checkout
- `createPaymentIntentProvider` - Payment intent

### Screens (UI Layer)

**`splash_screen.dart`**:
- Splash/loading screen
- Auto-navigates to home after 3 seconds

**`home_screen.dart`**:
- Featured products horizontal scroll
- Categories grid
- Bottom navigation bar
- Pull-to-refresh functionality

### Utilities

**`logger.dart`** - Logging with pretty printer
**`extensions.dart`** - String and double extensions (validation, formatting)
**`exceptions.dart`** - Custom exception classes:
- `AppException` - Base exception
- `NetworkException` - Network errors
- `ServerException` - Server errors
- `UnauthorizedException` - Auth failures
- `NotFoundException` - Not found errors

## 🚀 Getting Started

1. **Navigate to mobile app**:
   ```bash
   cd apps/mobile
   ```

2. **Create .env file** from example:
   ```bash
   cp .env.example .env
   # Edit .env with your backend URLs
   ```

3. **Install dependencies**:
   ```bash
   flutter pub get
   ```

4. **Generate JSON serialization code**:
   ```bash
   dart run build_runner build
   ```

5. **Run the app**:
   ```bash
   flutter run
   ```

## 📋 What's Included

✅ **Complete project structure** with best practices
✅ **All 5 API services** integrated via DioClient
✅ **Models** for all domains (auth, products, orders, payments, cart)
✅ **Riverpod providers** for state management
✅ **Service layer** for API communication
✅ **Navigation** with GoRouter
✅ **Utilities** (logger, extensions, exceptions)
✅ **Home screen** with featured products and categories
✅ **Environment configuration** with .env support

## ⏳ Next Steps (TODO)

1. Complete remaining screens:
   - Product details screen
   - Product search/filter screen
   - Shopping cart screen
   - Checkout flow
   - Order history/tracking
   - User authentication screens (login/signup)
   - User profile screen

2. Implement:
   - Cart persistence (SharedPreferences/Hive)
   - Token storage and refresh logic
   - Error handling UI
   - Loading states
   - Image caching

3. Add features:
   - Wishlist
   - Product reviews/ratings
   - Order tracking
   - Push notifications
   - Offline mode

4. Testing:
   - Unit tests for services
   - Widget tests for screens
   - Integration tests

## 📱 Technology Stack

- **Framework**: Flutter 3.0+
- **Language**: Dart 3.0+
- **State Management**: Riverpod
- **API Client**: Dio
- **Navigation**: Go Router
- **Auth**: Clerk Flutter
- **Payments**: Flutter Stripe
- **Storage**: SharedPreferences / Hive
- **Serialization**: json_serializable

## 🔗 Backend Integration

All services connect to the same microservices backend:
- **Product Service** (8000) - via ProductService
- **Order Service** (8001) - via OrderService
- **Payment Service** (8002) - via PaymentService
- **Auth Service** (8003) - via AuthService
- **Email Service** (8004) - triggered via OrderService

Perfect! The complete Flutter mobile app structure is now set up and ready for development.
