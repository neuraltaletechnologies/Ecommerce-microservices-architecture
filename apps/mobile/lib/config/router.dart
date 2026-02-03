import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:neurashop_mobile/screens/home/home_screen.dart';
import 'package:neurashop_mobile/screens/splash_screen.dart';

final goRouterProvider = Provider<GoRouter>((ref) => GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        name: 'home',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/splash',
        name: 'splash',
        builder: (context, state) => const SplashScreen(),
      ),
      // Add more routes here
    ],
  ));
