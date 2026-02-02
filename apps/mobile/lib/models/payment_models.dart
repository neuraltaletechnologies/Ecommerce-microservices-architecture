import 'package:json_annotation/json_annotation.dart';

part 'payment_models.g.dart';

@JsonSerializable()
class PaymentIntent {
  final String id;
  final double amount;
  final String currency;
  final String status;
  final String? clientSecret;

  PaymentIntent({
    required this.id,
    required this.amount,
    required this.currency,
    required this.status,
    this.clientSecret,
  });

  factory PaymentIntent.fromJson(Map<String, dynamic> json) =>
      _$PaymentIntentFromJson(json);

  Map<String, dynamic> toJson() => _$PaymentIntentToJson(this);
}

@JsonSerializable()
class StripeCheckoutSession {
  final String sessionId;
  final String publishableKey;
  final String? url;

  StripeCheckoutSession({
    required this.sessionId,
    required this.publishableKey,
    this.url,
  });

  factory StripeCheckoutSession.fromJson(Map<String, dynamic> json) =>
      _$StripeCheckoutSessionFromJson(json);

  Map<String, dynamic> toJson() => _$StripeCheckoutSessionToJson(this);
}

@JsonSerializable()
class CreateCheckoutSessionRequest {
  final List<CheckoutItem> items;
  final double totalPrice;
  final String? successUrl;
  final String? cancelUrl;

  CreateCheckoutSessionRequest({
    required this.items,
    required this.totalPrice,
    this.successUrl,
    this.cancelUrl,
  });

  factory CreateCheckoutSessionRequest.fromJson(Map<String, dynamic> json) =>
      _$CreateCheckoutSessionRequestFromJson(json);

  Map<String, dynamic> toJson() => _$CreateCheckoutSessionRequestToJson(this);
}

@JsonSerializable()
class CheckoutItem {
  final String productId;
  final String productName;
  final int quantity;
  final double price;

  CheckoutItem({
    required this.productId,
    required this.productName,
    required this.quantity,
    required this.price,
  });

  factory CheckoutItem.fromJson(Map<String, dynamic> json) =>
      _$CheckoutItemFromJson(json);

  Map<String, dynamic> toJson() => _$CheckoutItemToJson(this);
}
