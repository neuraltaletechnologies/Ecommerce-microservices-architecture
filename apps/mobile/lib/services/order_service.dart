import 'package:neurashop_mobile/config/constants.dart';
import 'package:neurashop_mobile/models/order_models.dart';
import 'package:neurashop_mobile/services/dio_client.dart';

class OrderService {
  final _dioClient = DioClient();

  Future<Order> createOrder(CreateOrderRequest request) async {
    try {
      final response = await _dioClient.client.post(
        '${AppConstants.orderServiceUrl}/orders',
        data: request.toJson(),
      );

      return Order.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }

  Future<OrdersResponse> getOrders({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await _dioClient.client.get(
        '${AppConstants.orderServiceUrl}/orders',
        queryParameters: {
          'page': page,
          'limit': limit,
        },
      );

      return OrdersResponse.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }

  Future<Order> getOrder(String orderId) async {
    try {
      final response = await _dioClient.client.get(
        '${AppConstants.orderServiceUrl}/orders/$orderId',
      );

      return Order.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }

  Future<Order> updateOrder(String orderId, Map<String, dynamic> updates) async {
    try {
      final response = await _dioClient.client.patch(
        '${AppConstants.orderServiceUrl}/orders/$orderId',
        data: updates,
      );

      return Order.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }

  Future<void> cancelOrder(String orderId) async {
    try {
      await _dioClient.client.delete(
        '${AppConstants.orderServiceUrl}/orders/$orderId',
      );
    } catch (e) {
      rethrow;
    }
  }
}
