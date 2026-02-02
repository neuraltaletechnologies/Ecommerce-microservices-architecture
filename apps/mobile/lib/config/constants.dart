import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppConstants {
  // Backend Service URLs
  static String get productServiceUrl =>
      dotenv.env['PRODUCT_SERVICE_URL'] ?? 'http://localhost:8000';

  static String get orderServiceUrl =>
      dotenv.env['ORDER_SERVICE_URL'] ?? 'http://localhost:8001';

  static String get paymentServiceUrl =>
      dotenv.env['PAYMENT_SERVICE_URL'] ?? 'http://localhost:8002';

  static String get authServiceUrl =>
      dotenv.env['AUTH_SERVICE_URL'] ?? 'http://localhost:8003';

  static String get emailServiceUrl =>
      dotenv.env['EMAIL_SERVICE_URL'] ?? 'http://localhost:8004';

  // Clerk
  static String get clerkPublishableKey =>
      dotenv.env['CLERK_PUBLISHABLE_KEY'] ?? '';

  // Stripe
  static String get stripePublishableKey =>
      dotenv.env['STRIPE_PUBLISHABLE_KEY'] ?? '';

  // App Info
  static const String appName = 'Neurashop';
  static const String appVersion = '1.0.0';

  // Timeouts
  static const Duration apiTimeout = Duration(seconds: 30);
  static const Duration connectionTimeout = Duration(seconds: 10);
}

class AppSizes {
  static const double paddingXXS = 4.0;
  static const double paddingXS = 8.0;
  static const double paddingS = 12.0;
  static const double paddingM = 16.0;
  static const double paddingL = 24.0;
  static const double paddingXL = 32.0;
  static const double paddingXXL = 48.0;

  static const double borderRadiusS = 4.0;
  static const double borderRadiusM = 8.0;
  static const double borderRadiusL = 16.0;

  static const double iconSizeS = 16.0;
  static const double iconSizeM = 24.0;
  static const double iconSizeL = 32.0;
}

class AppStrings {
  static const String appName = 'Neurashop';
  static const String loading = 'Loading...';
  static const String error = 'Error';
  static const String retry = 'Retry';
  static const String back = 'Back';
  static const String cancel = 'Cancel';
  static const String save = 'Save';
  static const String delete = 'Delete';
  static const String edit = 'Edit';
  static const String logout = 'Logout';
}
