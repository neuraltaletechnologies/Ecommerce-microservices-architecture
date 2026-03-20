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
    super.originalException,
  }) : super(
    message: message ?? 'Network error occurred',
    code: 'NETWORK_ERROR',
  );
}

class ServerException extends AppException {

  ServerException({
    String? message,
    this.statusCode,
    super.originalException,
  }) : super(
    message: message ?? 'Server error occurred',
    code: 'SERVER_ERROR',
  );
  final int? statusCode;
}

class UnauthorizedException extends AppException {
  UnauthorizedException({
    String? message,
    super.originalException,
  }) : super(
    message: message ?? 'Unauthorized',
    code: 'UNAUTHORIZED',
  );
}

class NotFoundException extends AppException {
  NotFoundException({
    String? message,
    super.originalException,
  }) : super(
    message: message ?? 'Not found',
    code: 'NOT_FOUND',
  );
}
