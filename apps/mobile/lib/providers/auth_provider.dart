import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:neurashop_mobile/models/auth_models.dart';
import 'package:neurashop_mobile/services/auth_service.dart';

final authServiceProvider = Provider((ref) => AuthService());

final authStateProvider =
    StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final authService = ref.watch(authServiceProvider);
  return AuthNotifier(authService);
});

final currentUserProvider = FutureProvider<AuthUser?>((ref) async {
  final authService = ref.watch(authServiceProvider);
  try {
    return await authService.getCurrentUser();
  } catch (e) {
    return null;
  }
});

class AuthState {

  AuthState({
    this.user,
    this.token,
    this.isLoading = false,
    this.error,
    this.isAuthenticated = false,
  });
  final AuthUser? user;
  final AuthToken? token;
  final bool isLoading;
  final String? error;
  final bool isAuthenticated;

  AuthState copyWith({
    AuthUser? user,
    AuthToken? token,
    bool? isLoading,
    String? error,
    bool? isAuthenticated,
  }) => AuthState(
      user: user ?? this.user,
      token: token ?? this.token,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
    );
}

class AuthNotifier extends StateNotifier<AuthState> {

  AuthNotifier(this._authService)
      : super(
          const AuthState(),
        );
  final AuthService _authService;

  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final token = await _authService.login(
        LoginRequest(email: email, password: password),
      );
      final user = await _authService.getCurrentUser();
      state = state.copyWith(
        token: token,
        user: user,
        isAuthenticated: true,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isLoading: false,
      );
    }
  }

  Future<void> signup(
    String email,
    String password,
    String firstName,
    String lastName,
  ) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final token = await _authService.signup(
        SignupRequest(
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
        ),
      );
      final user = await _authService.getCurrentUser();
      state = state.copyWith(
        token: token,
        user: user,
        isAuthenticated: true,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isLoading: false,
      );
    }
  }

  Future<void> logout() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _authService.logout();
      state = const AuthState();
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isLoading: false,
      );
    }
  }

  Future<void> updateProfile({
    required String firstName,
    required String lastName,
  }) async {
    if (state.user == null) return;

    state = state.copyWith(isLoading: true, error: null);
    try {
      final updatedUser = await _authService.updateProfile(
        userId: state.user!.id,
        firstName: firstName,
        lastName: lastName,
      );
      state = state.copyWith(
        user: updatedUser,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        error: e.toString(),
        isLoading: false,
      );
    }
  }
}
