import { ProductsType, ProductType } from "@repo/types";
import Categories from "./Categories";
import ProductCard from "./ProductCard";
import Link from "next/link";
import Filter from "./Filter";

const fetchData = async ({
  category,
  sort,
  search,
  params,
}: {
  category?: string;
  sort?: string;
  search?: string;
  params: "homepage" | "products";
}) => {
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
    
    // Sort mapping to match backend
    let sortParam = "newest"; // default
    switch (sort) {
      case "price-asc":
        sortParam = "asc";
        break;
      case "price-desc":
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

const ProductList = async ({
  category,
  sort,
  search,
  params,
}: {
  category: string;
  sort?: string;
  search?: string;
  params: "homepage" | "products";
}) => {
  const products = await fetchData({ category, sort, search, params });
  return (
    <div className="w-full">
      {/* Section Header */}


      <Categories />
      {params === "products" && <Filter />}
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        {Array.isArray(products) && products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {params === "homepage" && (
        <div className="flex justify-center mt-12">
          <Link
            href={category ? `/products/?category=${category}` : "/products"}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105"
          >
            View All Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductList;