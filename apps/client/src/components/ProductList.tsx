import { ProductsType, ProductType } from "@repo/types";
import Categories from "./Categories";
import ProductCard from "./ProductCard";
import Link from "next/link";
import Filter from "./Filter";
import ProductCardSkeleton from "./skeletons/ProductCardSkeleton";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";

interface FetchDataParams {
  category?: string;
  sort?: string;
  search?: string;
  params: "homepage" | "products";
  brands?: string;
  rating?: string;
  priceMin?: string;
  priceMax?: string;
  batteryCapacity?: string;
}

const fetchData = async ({
  category,
  sort,
  search,
  params,
  brands,
  rating,
  priceMin,
  priceMax,
  batteryCapacity,
}: FetchDataParams) => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    // Category filter (exclude 'all' category)
    if (category && category !== "all") {
      queryParams.append("category", category);
    }
    
    // Search filter
    if (search) {
      queryParams.append("search", search);
    }
    
    // Brand filter (comma-separated)
    if (brands) {
      queryParams.append("brands", brands);
    }
    
    // Rating filter
    if (rating && rating !== "0") {
      queryParams.append("rating", rating);
    }
    
    // Price range filters
    if (priceMin) {
      queryParams.append("priceMin", priceMin);
    }
    if (priceMax) {
      queryParams.append("priceMax", priceMax);
    }
    
    // Battery capacity filter (comma-separated)
    if (batteryCapacity) {
      queryParams.append("batteryCapacity", batteryCapacity);
    }
    
    // Sort mapping to match backend
    let sortParam = "newest"; // default
    switch (sort) {
      case "price-asc":
      case "asc":
        sortParam = "asc";
        break;
      case "price-desc":
      case "desc":
        sortParam = "desc";
        break;
      case "oldest":
        sortParam = "oldest";
        break;
      default:
        sortParam = "newest";
    }
    queryParams.append("sort", sortParam);
    
    // Limit for homepage
    if (params === "homepage") {
      queryParams.append("limit", "8");
    }

    const url = `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || 'http://localhost:8000'}/products?${queryParams.toString()}`;
    
    console.log('Fetching products from:', url);
    
    const res = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!res.ok) {
      console.error(`Failed to fetch products: ${res.status} ${res.statusText}`);
      return [];
    }

    const data: ProductType[] = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

interface ProductListProps {
  category?: string;
  sort?: string;
  search?: string;
  params: "homepage" | "products";
  brands?: string;
  rating?: string;
  priceMin?: string;
  priceMax?: string;
  batteryCapacity?: string;
}

const ProductList = async ({
  category,
  sort,
  search,
  params,
  brands,
  rating,
  priceMin,
  priceMax,
  batteryCapacity,
}: ProductListProps) => {
  const products = await fetchData({ 
    category, 
    sort, 
    search, 
    params,
    brands,
    rating,
    priceMin,
    priceMax,
    batteryCapacity,
  });
  return (
    <div className="w-full">
      {/* Section Header */}


      <Categories />
      {params === "products" && <Filter />}
      
      <Suspense fallback={
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      }>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {Array.isArray(products) && products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Suspense>
      
      {params === "homepage" && (
       
        <div className="text-center mt-12">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors group"
          >
            View All Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductList;