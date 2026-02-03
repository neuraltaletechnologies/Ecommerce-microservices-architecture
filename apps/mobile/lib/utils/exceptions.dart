class AppException implements Exception {

  AppException({
    required this.message,
    this.code,
    this.originalException,
  });
  final String message;
  final String? code;
  final dynamic originalException;

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

  ServerException({
    String? message,
    this.statusCode,
    dynamic originalException,
  }) : super(
    message: message ?? 'Server error occurred',
    code: 'SERVER_ERROR',
    originalException: originalException,
  );
  final int? statusCode;
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
