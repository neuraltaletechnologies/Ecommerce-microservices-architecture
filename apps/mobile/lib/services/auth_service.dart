import 'package:neurashop_mobile/config/constants.dart';
import 'package:neurashop_mobile/models/auth_models.dart';
import 'package:neurashop_mobile/services/dio_client.dart';

class AuthService {
  final _dioClient = DioClient();

  Future<AuthUser> getCurrentUser() async {
    try {
      final response = await _dioClient.client.get(
        '${AppConstants.authServiceUrl}/me',
      );

      return AuthUser.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }

  Future<AuthToken> login(LoginRequest request) async {
    try {
      final response = await _dioClient.client.post(
        '${AppConstants.authServiceUrl}/login',
        data: request.toJson(),
      );

      final token = AuthToken.fromJson(response.data);
      _dioClient.setAuthToken(token.accessToken);
      return token;
    } catch (e) {
      rethrow;
    }
  }

  Future<AuthToken> signup(SignupRequest request) async {
    try {
      final response = await _dioClient.client.post(
        '${AppConstants.authServiceUrl}/signup',
        data: request.toJson(),
      );

      final token = AuthToken.fromJson(response.data);
      _dioClient.setAuthToken(token.accessToken);
      return token;
    } catch (e) {
      rethrow;
    }
  }

  Future<void> logout() async {
    try {
      await _dioClient.client.post(
        '${AppConstants.authServiceUrl}/logout',
      );
      _dioClient.removeAuthToken();
    } catch (e) {
      rethrow;
    }
  }

  Future<AuthToken> refreshToken(String refreshToken) async {
    try {
      final response = await _dioClient.client.post(
        '${AppConstants.authServiceUrl}/refresh-token',
        data: {'refresh_token': refreshToken},
      );

      final token = AuthToken.fromJson(response.data);
      _dioClient.setAuthToken(token.accessToken);
      return token;
    } catch (e) {
      rethrow;
    }
  }

  Future<AuthUser> updateProfile({
    required String userId,
    String? firstName,
    String? lastName,
    String? avatar,
  }) async {
    try {
      final response = await _dioClient.client.patch(
        '${AppConstants.authServiceUrl}/users/$userId',
        data: {
          if (firstName != null) 'firstName': firstName,
          if (lastName != null) 'lastName': lastName,
          if (avatar != null) 'avatar': avatar,
        },
      );

      return AuthUser.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }
}
