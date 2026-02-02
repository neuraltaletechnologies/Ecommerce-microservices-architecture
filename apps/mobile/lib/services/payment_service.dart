import 'package:neurashop_mobile/config/constants.dart';
import 'package:neurashop_mobile/models/payment_models.dart';
import 'package:neurashop_mobile/services/dio_client.dart';

class PaymentService {
  final _dioClient = DioClient();

  Future<StripeCheckoutSession> createCheckoutSession(
    CreateCheckoutSessionRequest request,
  ) async {
    try {
      final response = await _dioClient.client.post(
        '${AppConstants.paymentServiceUrl}/sessions/create-checkout-session',
        data: request.toJson(),
      );

      return StripeCheckoutSession.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }

  Future<PaymentIntent> createPaymentIntent({
    required double amount,
    required String currency,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      final response = await _dioClient.client.post(
        '${AppConstants.paymentServiceUrl}/payment-intents',
        data: {
          'amount': amount,
          'currency': currency,
          if (metadata != null) 'metadata': metadata,
        },
      );

      return PaymentIntent.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }

  Future<Map<String, dynamic>> confirmPayment({
    required String paymentIntentId,
    required Map<String, dynamic> paymentMethod,
  }) async {
    try {
      final response = await _dioClient.client.post(
        '${AppConstants.paymentServiceUrl}/payment-intents/$paymentIntentId/confirm',
        data: {
          'payment_method': paymentMethod,
        },
      );

      return response.data;
    } catch (e) {
      rethrow;
    }
  }
}
