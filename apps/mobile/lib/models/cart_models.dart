import 'package:json_annotation/json_annotation.dart';

part 'cart_models.g.dart';

@JsonSerializable()
class CartItem {

  CartItem({
    required this.id,
    required this.productId,
    required this.productName,
    required this.price,
    required this.quantity,
    this.imageUrl,
  });

  factory CartItem.fromJson(Map<String, dynamic> json) =>
      _$CartItemFromJson(json);
  final String id;
  final String productId;
  final String productName;
  final double price;
  final int quantity;
  final String? imageUrl;

  Map<String, dynamic> toJson() => _$CartItemToJson(this);

  double get subtotal => price * quantity;
}

class CartState {

  CartState({
    this.items = const [],
    this.isLoading = false,
    this.error,
  });
  final List<CartItem> items;
  final bool isLoading;
  final String? error;

  double get total => items.fold(0, (sum, item) => sum + item.subtotal);

  int get itemCount => items.fold(0, (sum, item) => sum + item.quantity);

  CartState copyWith({
    List<CartItem>? items,
    bool? isLoading,
    String? error,
  }) => CartState(
      items: items ?? this.items,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
}
