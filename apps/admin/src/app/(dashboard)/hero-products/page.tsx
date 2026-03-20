"use client";

import { ProductType } from "@repo/types";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Star, 
  StarOff, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Search,
  X,
  Filter
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { formatTZS } from "@/lib/utils/currency";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function HeroProductsPage() {
  const { getToken } = useAuth();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [heroProducts, setHeroProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      const productServiceUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL;
      if (!productServiceUrl) {
        console.error("NEXT_PUBLIC_PRODUCT_SERVICE_URL is not defined");
        toast.error("Configuration error: Product service URL not set");
        return;
      }
      
      const res = await fetch(
        `${productServiceUrl}/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to fetch products:", res.status, errorText);
        toast.error(`Failed to fetch products: ${res.status}`);
        return;
      }

      const data = await res.json();
      console.log("Fetched products:", data.length);
      console.log("Hero products:", data.filter((p: ProductType) => p.isHeroProduct));
      setProducts(data);
      setHeroProducts(
        data
          .filter((p: ProductType) => p.isHeroProduct)
          .sort((a: ProductType, b: ProductType) => 
            (a.heroOrder || 999) - (b.heroOrder || 999)
          )
      );
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(`Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleHeroStatus = async (productId: number, currentStatus: boolean) => {
    try {
      setUpdating(productId);
      const token = await getToken();

      const maxOrder = heroProducts.length > 0 
        ? Math.max(...heroProducts.map(p => p.heroOrder || 0))
        : 0;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isHeroProduct: !currentStatus,
            heroOrder: !currentStatus ? maxOrder + 1 : null,
          }),
        }
      );

      if (res.ok) {
        toast.success(
          !currentStatus 
            ? "Added to hero products" 
            : "Removed from hero products"
        );
        await fetchProducts();
      } else {
        toast.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("An error occurred");
    } finally {
      setUpdating(null);
    }
  };

  const updateHeroOrder = async (productId: number, direction: "up" | "down") => {
    try {
      setUpdating(productId);
      const token = await getToken();
      
      const currentIndex = heroProducts.findIndex(p => p.id === productId);
      if (
        (direction === "up" && currentIndex === 0) ||
        (direction === "down" && currentIndex === heroProducts.length - 1)
      ) {
        return;
      }

      const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      const currentProduct = heroProducts[currentIndex];
      const swapProduct = heroProducts[swapIndex];

      // Type guard: ensure both products exist
      if (!currentProduct || !swapProduct) {
        toast.error("Unable to reorder products");
        return;
      }

      // Swap orders
      const updates = [
        fetch(
          `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products/${currentProduct.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              heroOrder: swapProduct.heroOrder,
            }),
          }
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products/${swapProduct.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              heroOrder: currentProduct.heroOrder,
            }),
          }
        ),
      ];

      await Promise.all(updates);
      toast.success("Order updated successfully");
      await fetchProducts();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    } finally {
      setUpdating(null);
    }
  };

  const getProductImage = (product: ProductType): string => {
    const firstColor = product.colors?.[0];
    if (firstColor && product.images) {
      const images = product.images as Record<string, string | string[]>;
      const imageValue = images[firstColor];
      if (imageValue) {
        return Array.isArray(imageValue) ? imageValue[0] || "/products/placeholder.jpg" : imageValue;
      }
    }
    return "/products/placeholder.jpg";
  };

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.categorySlug))).filter(Boolean) as string[];
  }, [products]);

  // Filter non-hero products
  const filteredNonHeroProducts = useMemo(() => {
    let filtered = products.filter((p) => !p.isHeroProduct);
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categorySlug.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter.length > 0) {
      filtered = filtered.filter(p => categoryFilter.includes(p.categorySlug));
    }
    
    return filtered;
  }, [products, searchQuery, categoryFilter]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg p-6">
          <div className="h-7 w-64 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-96 bg-gray-300/70 rounded"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="pb-3">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="h-8 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>

        {/* Current Hero Products Card Skeleton */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 w-5 bg-yellow-200 rounded"></div>
              <div className="h-5 w-40 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 w-80 bg-gray-100 rounded"></div>
          </div>
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                <div className="flex flex-col gap-2">
                  <div className="h-6 w-12 bg-gray-200 rounded"></div>
                  <div className="flex flex-col gap-1">
                    <div className="h-6 w-6 bg-gray-100 rounded"></div>
                    <div className="h-6 w-6 bg-gray-100 rounded"></div>
                  </div>
                </div>
                <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  <div className="h-3 w-64 bg-gray-100 rounded"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Products Card Skeleton */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-6 border-b border-gray-100">
            <div className="h-5 w-36 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-72 bg-gray-100 rounded"></div>
          </div>
          <div className="p-6">
            <div className="flex gap-4 mb-4">
              <div className="h-10 flex-1 bg-gray-100 rounded-md"></div>
              <div className="h-10 w-32 bg-gray-100 rounded-md"></div>
            </div>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                    <div className="h-3 w-64 bg-gray-100 rounded"></div>
                    <div className="flex items-center gap-4">
                      <div className="h-3 w-20 bg-gray-200 rounded"></div>
                      <div className="h-5 w-16 bg-gray-100 rounded-full"></div>
                    </div>
                  </div>
                  <div className="h-8 w-28 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tips Card Skeleton */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-5 bg-gray-300 rounded"></div>
            <div className="h-5 w-56 bg-gray-300 rounded"></div>
          </div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded mt-0.5"></div>
                <div className="h-4 flex-1 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#001E3C]/10 to-[#0A7EA4]/10 border border-[#0A7EA4]/30 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Hero Products Management
        </h1>
        <p className="text-gray-600">
          Manage products displayed in the homepage hero slider. Drag to reorder or add/remove products.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Hero Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0A7EA4]">
              {heroProducts.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Available Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.max(0, 10 - heroProducts.length)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hero Products Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            Current Hero Products
          </CardTitle>
          <CardDescription>
            These products are displayed in the homepage hero slider (max 10)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {heroProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <StarOff className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hero products configured yet</p>
              <p className="text-sm mt-2">Add products from the list below</p>
            </div>
          ) : (
            <div className="space-y-3">
              {heroProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                >
                  {/* Order Badge */}
                  <div className="flex flex-col gap-2">
                    <Badge variant="secondary" className="w-12 text-center">
                      #{product.heroOrder}
                    </Badge>
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateHeroOrder(product.id, "up")}
                        disabled={index === 0 || updating === product.id}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateHeroOrder(product.id, "down")}
                        disabled={
                          index === heroProducts.length - 1 || 
                          updating === product.id
                        }
                        className="h-6 w-6 p-0"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Product Image */}
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={getProductImage(product)}
                      alt={product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {product.shortDescription}
                    </p>
                    <p className="text-sm font-medium text-[#0A7EA4] mt-1">
                      {formatTZS(product.price)}
                    </p>
                  </div>

                  {/* Actions */}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => toggleHeroStatus(product.id, true)}
                    disabled={updating === product.id}
                  >
                    {updating === product.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Remove
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Products Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Available Products</CardTitle>
              <CardDescription>
                Select products to add to the hero slider
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredNonHeroProducts.length} products
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Category
                  {categoryFilter.length > 0 && (
                    <span className="ml-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                      {categoryFilter.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {categories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={categoryFilter.includes(category)}
                    onCheckedChange={(checked) => {
                      setCategoryFilter(prev =>
                        checked
                          ? [...prev, category]
                          : prev.filter((c) => c !== category)
                      );
                    }}
                  >
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Products List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredNonHeroProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No products found</p>
              </div>
            ) : (
              filteredNonHeroProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                >
                  {/* Product Image */}
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={getProductImage(product)}
                      alt={product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {product.shortDescription}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm font-medium text-[#0A7EA4]">
                        {formatTZS(product.price)}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {product.categorySlug}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => toggleHeroStatus(product.id, false)}
                    disabled={
                      heroProducts.length >= 10 || updating === product.id
                    }
                  >
                    {updating === product.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Star className="w-4 h-4 mr-2" />
                        Add to Hero
                      </>
                    )}
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="bg-[#001E3C]/5 border-[#0A7EA4]/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#001E3C]">
            <AlertCircle className="w-5 h-5" />
            Tips for Managing Hero Products
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-[#001E3C]/80 space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>Choose products with high-quality images for best visual impact</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>Mix different product categories to appeal to diverse users</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>Use the order arrows to prioritize your best-selling or featured products</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>Regularly update hero products to keep your homepage fresh</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
