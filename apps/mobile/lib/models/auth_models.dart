import 'package:json_annotation/json_annotation.dart';

part 'auth_models.g.dart';

@JsonSerializable()
class AuthUser {

  AuthUser({
    required this.id,
    required this.email,
    required this.createdAt, required this.updatedAt, this.firstName,
    this.lastName,
    this.avatar,
    this.role,
  });

  factory AuthUser.fromJson(Map<String, dynamic> json) =>
      _$AuthUserFromJson(json);
  final String id;
  final String email;
  final String? firstName;
  final String? lastName;
  final String? avatar;
  final String? role;
  final DateTime createdAt;
  final DateTime updatedAt;

  Map<String, dynamic> toJson() => _$AuthUserToJson(this);

  String get fullName => '${firstName ?? ''} ${lastName ?? ''}'.trim();
}

@JsonSerializable()
class AuthToken {

  AuthToken({
    required this.accessToken,
    required this.expiresIn, this.refreshToken,
  });

  factory AuthToken.fromJson(Map<String, dynamic> json) =>
      _$AuthTokenFromJson(json);
  final String accessToken;
  final String? refreshToken;
  final int expiresIn;

  Map<String, dynamic> toJson() => _$AuthTokenToJson(this);
}

@JsonSerializable()
class LoginRequest {

  LoginRequest({
    required this.email,
    required this.password,
  });

  factory LoginRequest.fromJson(Map<String, dynamic> json) =>
      _$LoginRequestFromJson(json);
  final String email;
  final String password;

  Map<String, dynamic> toJson() => _$LoginRequestToJson(this);
}

@JsonSerializable()
class SignupRequest {

  SignupRequest({
    required this.email,
    required this.password,
    required this.firstName,
    required this.lastName,
  });

  factory SignupRequest.fromJson(Map<String, dynamic> json) =>
      _$SignupRequestFromJson(json);
  final String email;
  final String password;
  final String firstName;
  final String lastName;

  Map<String, dynamic> toJson() => _$SignupRequestToJson(this);
}

@JsonSerializable()
class CustomJwtSessionClaims {

  CustomJwtSessionClaims({
    required this.sub,
    required this.email,
    this.metadata,
    this.publicMetadata,
  });

  factory CustomJwtSessionClaims.fromJson(Map<String, dynamic> json) =>
      _$CustomJwtSessionClaimsFromJson(json);
  final String sub;
  final String email;
  @JsonKey(name: 'metadata')
  final ClerkMetadata? metadata;
  @JsonKey(name: 'public_metadata')
  final Map<String, dynamic>? publicMetadata;

  Map<String, dynamic> toJson() => _$CustomJwtSessionClaimsToJson(this);

  String? get role =>
      publicMetadata?['role'] as String? ?? metadata?.role;
}

@JsonSerializable()
class ClerkMetadata {

  ClerkMetadata({
    this.role,
  });

  factory ClerkMetadata.fromJson(Map<String, dynamic> json) =>
      _$ClerkMetadataFromJson(json);
  final String? role;

  Map<String, dynamic> toJson() => _$ClerkMetadataToJson(this);
}
