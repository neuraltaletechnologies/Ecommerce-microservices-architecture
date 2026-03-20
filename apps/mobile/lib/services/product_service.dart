import 'package:neurashop_mobile/config/constants.dart';
import 'package:neurashop_mobile/models/product_models.dart';
import 'package:neurashop_mobile/services/dio_client.dart';

class ProductService {
  final _dioClient = DioClient();

  Future<ProductsResponse> getProducts({
    int page = 1,
    int limit = 10,
    String? category,
    String? search,
  }) async {
    try {
      final response = await _dioClient.client.get(
        '${AppConstants.productServiceUrl}/products',
        queryParameters: {
          'page': page,
          'limit': limit,
          if (category != null) 'category': category,
          if (search != null) 'search': search,
        },
      );

      return ProductsResponse.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }

  Future<Product> getProduct(String productId) async {
    try {
      final response = await _dioClient.client.get(
        '${AppConstants.productServiceUrl}/products/$productId',
      );

      return Product.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }

  Future<List<Category>> getCategories() async {
    try {
      final response = await _dioClient.client.get(
        '${AppConstants.productServiceUrl}/categories',
      );

      final data = response.data as List;
      return data.map((item) => Category.fromJson(item)).toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<List<Product>> getFeaturedProducts() async {
    try {
      final response = await _dioClient.client.get(
        '${AppConstants.productServiceUrl}/products/featured',
      );

      final data = response.data as List;
      return data.map((item) => Product.fromJson(item)).toList();
    } catch (e) {
      rethrow;
    }
  }
}
