"use client";

import { ProductType } from "@repo/types";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  StarOff, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { toast } from "react-toastify";

export default function HeroProductsPage() {
  const { getToken } = useAuth();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [heroProducts, setHeroProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setProducts(data);
        setHeroProducts(
          data
            .filter((p: ProductType) => p.isHeroProduct)
            .sort((a: ProductType, b: ProductType) => 
              (a.heroOrder || 999) - (b.heroOrder || 999)
            )
        );
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
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
    if (firstColor && product.images && product.images[firstColor]) {
      return product.images[firstColor][0] || "/products/placeholder.jpg";
    }
    return "/products/placeholder.jpg";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
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
            <div className="text-2xl font-bold text-blue-600">
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
                    <p className="text-sm font-medium text-blue-600 mt-1">
                      TZS {((product.price * 2300) / 100).toLocaleString()}
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
          <CardTitle>Available Products</CardTitle>
          <CardDescription>
            Select products to add to the hero slider
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {products
              .filter((p) => !p.isHeroProduct)
              .map((product) => (
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
                      <p className="text-sm font-medium text-blue-600">
                        TZS {((product.price * 2300) / 100).toLocaleString()}
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
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <AlertCircle className="w-5 h-5" />
            Tips for Managing Hero Products
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>Choose products with high-quality images for best visual impact</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>Mix different product categories to appeal to diverse customers</p>
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
