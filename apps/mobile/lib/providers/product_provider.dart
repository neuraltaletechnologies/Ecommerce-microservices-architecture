import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:neurashop_mobile/models/product_models.dart';
import 'package:neurashop_mobile/services/product_service.dart';

final productServiceProvider = Provider((ref) => ProductService());

final productsProvider = FutureProvider.family<ProductsResponse, Map<String, dynamic>>(
  (ref, params) async {
    final productService = ref.watch(productServiceProvider);
    final page = params['page'] as int? ?? 1;
    final limit = params['limit'] as int? ?? 10;
    final category = params['category'] as String?;
    final search = params['search'] as String?;

    return productService.getProducts(
      page: page,
      limit: limit,
      category: category,
      search: search,
    );
  },
);

final productProvider = FutureProvider.family<Product, String>(
  (ref, productId) async {
    final productService = ref.watch(productServiceProvider);
    return productService.getProduct(productId);
  },
);

final categoriesProvider = FutureProvider<List<Category>>(
  (ref) async {
    final productService = ref.watch(productServiceProvider);
    return productService.getCategories();
  },
);

final featuredProductsProvider = FutureProvider<List<Product>>(
  (ref) async {
    final productService = ref.watch(productServiceProvider);
    return productService.getFeaturedProducts();
  },
);
