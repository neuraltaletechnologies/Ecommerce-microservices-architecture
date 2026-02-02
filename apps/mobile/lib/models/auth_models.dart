import 'package:json_annotation/json_annotation.dart';

part 'auth_models.g.dart';

@JsonSerializable()
class AuthUser {
  final String id;
  final String email;
  final String? firstName;
  final String? lastName;
  final String? avatar;
  final String? role;
  final DateTime createdAt;
  final DateTime updatedAt;

  AuthUser({
    required this.id,
    required this.email,
    this.firstName,
    this.lastName,
    this.avatar,
    this.role,
    required this.createdAt,
    required this.updatedAt,
  });

  factory AuthUser.fromJson(Map<String, dynamic> json) =>
      _$AuthUserFromJson(json);

  Map<String, dynamic> toJson() => _$AuthUserToJson(this);

  String get fullName => '${firstName ?? ''} ${lastName ?? ''}'.trim();
}

@JsonSerializable()
class AuthToken {
  final String accessToken;
  final String? refreshToken;
  final int expiresIn;

  AuthToken({
    required this.accessToken,
    this.refreshToken,
    required this.expiresIn,
  });

  factory AuthToken.fromJson(Map<String, dynamic> json) =>
      _$AuthTokenFromJson(json);

  Map<String, dynamic> toJson() => _$AuthTokenToJson(this);
}

@JsonSerializable()
class LoginRequest {
  final String email;
  final String password;

  LoginRequest({
    required this.email,
    required this.password,
  });

  factory LoginRequest.fromJson(Map<String, dynamic> json) =>
      _$LoginRequestFromJson(json);

  Map<String, dynamic> toJson() => _$LoginRequestToJson(this);
}

@JsonSerializable()
class SignupRequest {
  final String email;
  final String password;
  final String firstName;
  final String lastName;

  SignupRequest({
    required this.email,
    required this.password,
    required this.firstName,
    required this.lastName,
  });

  factory SignupRequest.fromJson(Map<String, dynamic> json) =>
      _$SignupRequestFromJson(json);

  Map<String, dynamic> toJson() => _$SignupRequestToJson(this);
}

@JsonSerializable()
class CustomJwtSessionClaims {
  final String sub;
  final String email;
  @JsonKey(name: 'metadata')
  final ClerkMetadata? metadata;
  @JsonKey(name: 'public_metadata')
  final Map<String, dynamic>? publicMetadata;

  CustomJwtSessionClaims({
    required this.sub,
    required this.email,
    this.metadata,
    this.publicMetadata,
  });

  factory CustomJwtSessionClaims.fromJson(Map<String, dynamic> json) =>
      _$CustomJwtSessionClaimsFromJson(json);

  Map<String, dynamic> toJson() => _$CustomJwtSessionClaimsToJson(this);

  String? get role =>
      publicMetadata?['role'] as String? ?? metadata?.role as String?;
}

@JsonSerializable()
class ClerkMetadata {
  final String? role;

  ClerkMetadata({
    this.role,
  });

  factory ClerkMetadata.fromJson(Map<String, dynamic> json) =>
      _$ClerkMetadataFromJson(json);

  Map<String, dynamic> toJson() => _$ClerkMetadataToJson(this);
}
