import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:neurashop_mobile/models/order_models.dart';
import 'package:neurashop_mobile/services/order_service.dart';

final orderServiceProvider = Provider((ref) => OrderService());

final ordersProvider = FutureProvider.family<OrdersResponse, Map<String, dynamic>>(
  (ref, params) async {
    final orderService = ref.watch(orderServiceProvider);
    final page = params['page'] as int? ?? 1;
    final limit = params['limit'] as int? ?? 10;

    return orderService.getOrders(page: page, limit: limit);
  },
);

final orderProvider = FutureProvider.family<Order, String>(
  (ref, orderId) async {
    final orderService = ref.watch(orderServiceProvider);
    return orderService.getOrder(orderId);
  },
);

final createOrderProvider = FutureProvider.family<Order, CreateOrderRequest>(
  (ref, request) async {
    final orderService = ref.watch(orderServiceProvider);
    return orderService.createOrder(request);
  },
);
