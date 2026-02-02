import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:neurashop_mobile/models/payment_models.dart';
import 'package:neurashop_mobile/services/payment_service.dart';

final paymentServiceProvider = Provider((ref) => PaymentService());

final createCheckoutSessionProvider =
    FutureProvider.family<StripeCheckoutSession, CreateCheckoutSessionRequest>(
  (ref, request) async {
    final paymentService = ref.watch(paymentServiceProvider);
    return paymentService.createCheckoutSession(request);
  },
);

final createPaymentIntentProvider = FutureProvider.family<PaymentIntent, Map<String, dynamic>>(
  (ref, params) async {
    final paymentService = ref.watch(paymentServiceProvider);
    return paymentService.createPaymentIntent(
      amount: params['amount'] as double,
      currency: params['currency'] as String,
      metadata: params['metadata'] as Map<String, dynamic>?,
    );
  },
);
