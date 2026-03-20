import 'package:json_annotation/json_annotation.dart';

part 'product_models.g.dart';

@JsonSerializable()
class Product {

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.stock,
    required this.createdAt, required this.updatedAt, this.imageUrl,
    this.category,
    this.rating,
    this.reviews,
  });

  factory Product.fromJson(Map<String, dynamic> json) =>
      _$ProductFromJson(json);
  final String id;
  final String name;
  final String description;
  final double price;
  final int stock;
  final String? imageUrl;
  final String? category;
  final double? rating;
  final int? reviews;
  final DateTime createdAt;
  final DateTime updatedAt;

  Map<String, dynamic> toJson() => _$ProductToJson(this);

  bool get inStock => stock > 0;
}

@JsonSerializable()
class ProductsResponse {

  ProductsResponse({
    required this.data,
    required this.total,
    required this.page,
    required this.limit,
  });

  factory ProductsResponse.fromJson(Map<String, dynamic> json) =>
      _$ProductsResponseFromJson(json);
  final List<Product> data;
  final int total;
  final int page;
  final int limit;

  Map<String, dynamic> toJson() => _$ProductsResponseToJson(this);
}

@JsonSerializable()
class Category {

  Category({
    required this.id,
    required this.name,
    required this.productCount, this.description,
    this.imageUrl,
  });

  factory Category.fromJson(Map<String, dynamic> json) =>
      _$CategoryFromJson(json);
  final String id;
  final String name;
  final String? description;
  final String? imageUrl;
  final int productCount;

  Map<String, dynamic> toJson() => _$CategoryToJson(this);
}
