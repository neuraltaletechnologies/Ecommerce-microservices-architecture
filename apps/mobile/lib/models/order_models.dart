import 'package:json_annotation/json_annotation.dart';

part 'order_models.g.dart';

@JsonSerializable()
class Order {

  Order({
    required this.id,
    required this.userId,
    required this.items,
    required this.totalPrice,
    required this.status,
    required this.createdAt, required this.updatedAt, this.paymentStatus,
    this.paymentMethod,
    this.trackingNumber,
  });

  factory Order.fromJson(Map<String, dynamic> json) => _$OrderFromJson(json);
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

  Map<String, dynamic> toJson() => _$OrderToJson(this);
}

@JsonSerializable()
class OrderItem {

  OrderItem({
    required this.productId,
    required this.productName,
    required this.quantity,
    required this.price,
    this.subtotal,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) =>
      _$OrderItemFromJson(json);
  final String productId;
  final String productName;
  final int quantity;
  final double price;
  final double? subtotal;

  Map<String, dynamic> toJson() => _$OrderItemToJson(this);
}

@JsonSerializable()
class CreateOrderRequest {

  CreateOrderRequest({
    required this.items,
    required this.totalPrice,
    this.paymentMethod,
    this.shippingAddress,
  });

  factory CreateOrderRequest.fromJson(Map<String, dynamic> json) =>
      _$CreateOrderRequestFromJson(json);
  final List<CartItemData> items;
  final double totalPrice;
  final String? paymentMethod;
  final String? shippingAddress;

  Map<String, dynamic> toJson() => _$CreateOrderRequestToJson(this);
}

@JsonSerializable()
class CartItemData {

  CartItemData({
    required this.productId,
    required this.productName,
    required this.quantity,
    required this.price,
  });

  factory CartItemData.fromJson(Map<String, dynamic> json) =>
      _$CartItemDataFromJson(json);
  final String productId;
  final String productName;
  final int quantity;
  final double price;

  Map<String, dynamic> toJson() => _$CartItemDataToJson(this);
}

@JsonSerializable()
class OrdersResponse {

  OrdersResponse({
    required this.data,
    required this.total,
  });

  factory OrdersResponse.fromJson(Map<String, dynamic> json) =>
      _$OrdersResponseFromJson(json);
  final List<Order> data;
  final int total;

  Map<String, dynamic> toJson() => _$OrdersResponseToJson(this);
}
