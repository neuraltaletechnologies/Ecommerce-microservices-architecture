import 'package:json_annotation/json_annotation.dart';

part 'payment_models.g.dart';

@JsonSerializable()
class PaymentIntent {

  PaymentIntent({
    required this.id,
    required this.amount,
    required this.currency,
    required this.status,
    this.clientSecret,
  });

  factory PaymentIntent.fromJson(Map<String, dynamic> json) =>
      _$PaymentIntentFromJson(json);
  final String id;
  final double amount;
  final String currency;
  final String status;
  final String? clientSecret;

  Map<String, dynamic> toJson() => _$PaymentIntentToJson(this);
}

@JsonSerializable()
class StripeCheckoutSession {

  StripeCheckoutSession({
    required this.sessionId,
    required this.publishableKey,
    this.url,
  });

  factory StripeCheckoutSession.fromJson(Map<String, dynamic> json) =>
      _$StripeCheckoutSessionFromJson(json);
  final String sessionId;
  final String publishableKey;
  final String? url;

  Map<String, dynamic> toJson() => _$StripeCheckoutSessionToJson(this);
}

@JsonSerializable()
class CreateCheckoutSessionRequest {

  CreateCheckoutSessionRequest({
    required this.items,
    required this.totalPrice,
    this.successUrl,
    this.cancelUrl,
  });

  factory CreateCheckoutSessionRequest.fromJson(Map<String, dynamic> json) =>
      _$CreateCheckoutSessionRequestFromJson(json);
  final List<CheckoutItem> items;
  final double totalPrice;
  final String? successUrl;
  final String? cancelUrl;

  Map<String, dynamic> toJson() => _$CreateCheckoutSessionRequestToJson(this);
}

@JsonSerializable()
class CheckoutItem {

  CheckoutItem({
    required this.productId,
    required this.productName,
    required this.quantity,
    required this.price,
  });

  factory CheckoutItem.fromJson(Map<String, dynamic> json) =>
      _$CheckoutItemFromJson(json);
  final String productId;
  final String productName;
  final int quantity;
  final double price;

  Map<String, dynamic> toJson() => _$CheckoutItemToJson(this);
}
