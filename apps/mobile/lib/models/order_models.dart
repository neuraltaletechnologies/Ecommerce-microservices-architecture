import 'package:json_annotation/json_annotation.dart';

part 'order_models.g.dart';

@JsonSerializable()
class Order {
  final String id;
  final String userId;
  final List<OrderItem> items;
  final double totalPrice;
  final String status;
  final String? paymentStatus;
  final String? paymentMethod;
  final String? trackingNumber;
  final DateTime createdAt;
  final DateTime updatedAt;

  Order({
    required this.id,
    required this.userId,
    required this.items,
    required this.totalPrice,
    required this.status,
    this.paymentStatus,
    this.paymentMethod,
    this.trackingNumber,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Order.fromJson(Map<String, dynamic> json) => _$OrderFromJson(json);

  Map<String, dynamic> toJson() => _$OrderToJson(this);
}

@JsonSerializable()
class OrderItem {
  final String productId;
  final String productName;
  final int quantity;
  final double price;
  final double? subtotal;

  OrderItem({
    required this.productId,
    required this.productName,
    required this.quantity,
    required this.price,
    this.subtotal,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) =>
      _$OrderItemFromJson(json);

  Map<String, dynamic> toJson() => _$OrderItemToJson(this);
}

@JsonSerializable()
class CreateOrderRequest {
  final List<CartItemData> items;
  final double totalPrice;
  final String? paymentMethod;
  final String? shippingAddress;

  CreateOrderRequest({
    required this.items,
    required this.totalPrice,
    this.paymentMethod,
    this.shippingAddress,
  });

  factory CreateOrderRequest.fromJson(Map<String, dynamic> json) =>
      _$CreateOrderRequestFromJson(json);

  Map<String, dynamic> toJson() => _$CreateOrderRequestToJson(this);
}

@JsonSerializable()
class CartItemData {
  final String productId;
  final String productName;
  final int quantity;
  final double price;

  CartItemData({
    required this.productId,
    required this.productName,
    required this.quantity,
    required this.price,
  });

  factory CartItemData.fromJson(Map<String, dynamic> json) =>
      _$CartItemDataFromJson(json);

  Map<String, dynamic> toJson() => _$CartItemDataToJson(this);
}

@JsonSerializable()
class OrdersResponse {
  final List<Order> data;
  final int total;

  OrdersResponse({
    required this.data,
    required this.total,
  });

  factory OrdersResponse.fromJson(Map<String, dynamic> json) =>
      _$OrdersResponseFromJson(json);

  Map<String, dynamic> toJson() => _$OrdersResponseToJson(this);
}
