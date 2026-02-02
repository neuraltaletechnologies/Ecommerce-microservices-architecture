class AppException implements Exception {
  final String message;
  final String? code;
  final dynamic originalException;

  AppException({
    required this.message,
    this.code,
    this.originalException,
  });

  @override
  String toString() => message;
}

class NetworkException extends AppException {
  NetworkException({
    String? message,
    dynamic originalException,
  }) : super(
    message: message ?? 'Network error occurred',
    code: 'NETWORK_ERROR',
    originalException: originalException,
  );
}

class ServerException extends AppException {
  final int? statusCode;

  ServerException({
    String? message,
    this.statusCode,
    dynamic originalException,
  }) : super(
    message: message ?? 'Server error occurred',
    code: 'SERVER_ERROR',
    originalException: originalException,
  );
}

class UnauthorizedException extends AppException {
  UnauthorizedException({
    String? message,
    dynamic originalException,
  }) : super(
    message: message ?? 'Unauthorized',
    code: 'UNAUTHORIZED',
    originalException: originalException,
  );
}

class NotFoundException extends AppException {
  NotFoundException({
    String? message,
    dynamic originalException,
  }) : super(
    message: message ?? 'Not found',
    code: 'NOT_FOUND',
    originalException: originalException,
  );
}
