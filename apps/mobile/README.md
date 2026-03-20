# Neurashop Mobile

Flutter mobile application for Neurashop e-commerce platform.

## Architecture

The mobile app follows clean architecture with separation of concerns:

```
lib/
├── main.dart                 # App entry point
├── config/                   # App configuration
│   ├── constants.dart
│   └── router.dart
├── models/                   # Data models (JSON serializable)
│   ├── auth_models.dart
│   ├── product_models.dart
│   ├── order_models.dart
│   ├── cart_models.dart
│   └── payment_models.dart
├── services/                 # API services (business logic)
│   ├── dio_client.dart
│   ├── auth_service.dart
│   ├── product_service.dart
│   ├── order_service.dart
│   └── payment_service.dart
├── providers/                # State management (Riverpod)
│   ├── auth_provider.dart
│   ├── product_provider.dart
│   ├── cart_provider.dart
│   ├── order_provider.dart
│   └── payment_provider.dart
├── screens/                  # UI screens
│   ├── splash_screen.dart
│   ├── home/
│   ├── products/
│   ├── cart/
│   ├── orders/
│   ├── auth/
│   └── profile/
├── widgets/                  # Reusable UI components
├── utils/                    # Utilities and helpers
│   ├── logger.dart
│   ├── extensions.dart
│   └── exceptions.dart
└── test/                     # Tests
```

## Setup

### Prerequisites
- Flutter 3.0+
- Dart 3.0+

### Installation

1. Clone the repository
2. Navigate to `apps/mobile/`
3. Copy `.env.example` to `.env` and update with your backend URLs
4. Install dependencies:
   ```bash
   flutter pub get
   ```

5. Generate JSON serialization code:
   ```bash
   dart run build_runner build
   ```

### Running

```bash
# Run on default device
flutter run

# Run on specific device
flutter run -d <device-id>

# Run in release mode
flutter run --release

# Run on web
flutter run -d web-server
```

## State Management

Uses **Riverpod** for state management:

- `AuthProvider` - Authentication state and user management
- `ProductProvider` - Product listing and details
- `CartProvider` - Shopping cart state
- `OrderProvider` - Order management
- `PaymentProvider` - Payment operations

## API Integration

All backend services use the same URLs configured in `constants.dart`:

- Product Service (8000)
- Order Service (8001)
- Payment Service (8002)
- Auth Service (8003)
- Email Service (8004)

## Key Features

- [x] Product browsing and search
- [x] Shopping cart management
- [x] Order creation
- [x] Authentication with Clerk
- [x] Payment integration with Stripe
- [ ] User profile management
- [ ] Order history and tracking
- [ ] Wishlist
- [ ] Reviews and ratings

## Dependencies

- **State Management**: `hooks_riverpod`
- **HTTP Client**: `dio`
- **Authentication**: `clerk_flutter`
- **Payments**: `flutter_stripe`
- **Navigation**: `go_router`
- **Local Storage**: `shared_preferences`, `hive`
- **JSON Serialization**: `json_annotation`, `json_serializable`

## Testing

```bash
# Run tests
flutter test

# Run tests with coverage
flutter test --coverage
```

## Building

```bash
# Android
flutter build apk
flutter build appbundle

# iOS
flutter build ios

# Web
flutter build web
```

## Environment Variables

Create a `.env` file in the project root:

```env
PRODUCT_SERVICE_URL=http://localhost:8000
ORDER_SERVICE_URL=http://localhost:8001
PAYMENT_SERVICE_URL=http://localhost:8002
AUTH_SERVICE_URL=http://localhost:8003
EMAIL_SERVICE_URL=http://localhost:8004

CLERK_PUBLISHABLE_KEY=your_clerk_key
STRIPE_PUBLISHABLE_KEY=your_stripe_key

ENVIRONMENT=development
```

## Contributing

Please follow the established code structure and naming conventions.
