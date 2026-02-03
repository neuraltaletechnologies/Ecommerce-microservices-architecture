import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:neurashop_mobile/models/cart_models.dart';
import 'package:shared_preferences/shared_preferences.dart';

final cartProvider =
    StateNotifierProvider<CartNotifier, CartState>((ref) => CartNotifier());

class CartNotifier extends StateNotifier<CartState> {
  CartNotifier() : super(CartState());

  void addToCart(CartItem item) {
    final existingIndex =
        state.items.indexWhere((i) => i.productId == item.productId);

    if (existingIndex >= 0) {
      final updatedItems = [...state.items];
      final existingItem = updatedItems[existingIndex];
      updatedItems[existingIndex] = CartItem(
        id: existingItem.id,
        productId: existingItem.productId,
        productName: existingItem.productName,
        price: existingItem.price,
        quantity: existingItem.quantity + item.quantity,
        imageUrl: existingItem.imageUrl,
      );
      state = state.copyWith(items: updatedItems);
    } else {
      state = state.copyWith(items: [...state.items, item]);
    }
    _saveCart();
  }

  void removeFromCart(String productId) {
    final updatedItems =
        state.items.where((item) => item.productId != productId).toList();
    state = state.copyWith(items: updatedItems);
    _saveCart();
  }

  void updateQuantity(String productId, int quantity) {
    final updatedItems = state.items.map((item) {
      if (item.productId == productId) {
        return CartItem(
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          quantity: quantity,
          imageUrl: item.imageUrl,
        );
      }
      return item;
    }).toList();

    state = state.copyWith(items: updatedItems);
    _saveCart();
  }

  void clearCart() {
    state = CartState();
    _saveCart();
  }

  Future<void> _saveCart() async {
    // Save cart to local storage
    final prefs = await SharedPreferences.getInstance();
    // TODO: Implement JSON serialization and save to prefs
  }

  Future<void> loadCart() async {
    // Load cart from local storage
    final prefs = await SharedPreferences.getInstance();
    // TODO: Implement JSON deserialization and load from prefs
  }
}
