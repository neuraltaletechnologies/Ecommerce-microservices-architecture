"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { ProductType } from "@repo/types";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Edit, Trash2, Package, Palette, Box, Award, Cpu, Star, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatTZS } from "@/lib/utils/currency";
import { useState } from "react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import AddProduct from "@/components/AddProduct";
import { Skeleton } from "@/components/ui/skeleton";

// Color hex mapping for visual display
const colorHexMap: Record<string, string> = {
  'Natural Titanium': '#8B8680',
  'Blue Titanium': '#5B7C99',
  'White Titanium': '#E8E4E0',
  'Black Titanium': '#3A3A3C',
  'Titanium Gray': '#71706E',
  'Space Black': '#1C1C1E',
  'Silver': '#C0C0C0',
  'Graphite': '#41424C',
  'Platinum': '#E5E4E2',
  'Sapphire': '#0F52BA',
  'blue': '#3B82F6',
  'green': '#22C55E',
  'red': '#EF4444',
  'yellow': '#EAB308',
  'purple': '#A855F7',
  'orange': '#F97316',
  'pink': '#EC4899',
  'black': '#000000',
  'white': '#FFFFFF',
  'gray': '#6B7280',
  'brown': '#92400E',
};

export default function ViewProductPage() {
  const params = useParams();
  const router = useRouter();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const productId = params?.id as string;
  const [editSheetOpen, setEditSheetOpen] = useState(false);

  const fetchProduct = async (id: string): Promise<ProductType> => {
    const productServiceUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL;
    if (!productServiceUrl) {
      throw new Error("Product service URL is not configured");
    }

    const token = await getToken();
    const res = await fetch(
      `${productServiceUrl}/products/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to fetch product:", res.status, errorText);
      throw new Error(`Failed to fetch product: ${res.status} - ${errorText}`);
    }
    
    return res.json();
  };

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!productId,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to delete product");
      }
    },
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/products");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-6 max-w-7xl">
        {/* Header Skeleton */}
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-9 w-36" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-56 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="w-full h-80 rounded-lg" />
                <div className="mt-4 space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Skeleton className="w-4 h-4 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="aspect-square rounded-md" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full mt-2" />
                </div>
                <Skeleton className="h-8 w-32" />
                <div className="space-y-3 pt-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-20 rounded-full" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-6 w-16" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-28" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-red-600">Failed to load product</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Parse images - handle both string and array formats
  const images = product.images as Record<string, string | string[]>;
  
  // Get all images flattened for the gallery
  const getAllImages = (): Array<{color: string, url: string, index: number}> => {
    const allImages: Array<{color: string, url: string, index: number}> = [];
    Object.entries(images || {}).forEach(([color, urls]) => {
      if (Array.isArray(urls)) {
        urls.forEach((url, idx) => {
          if (url) allImages.push({ color, url, index: idx });
        });
      } else if (urls) {
        allImages.push({ color, url: urls, index: 0 });
      }
    });
    return allImages;
  };

  const allImages = getAllImages();
  const firstImage = allImages[0]?.url || "";

  // Stock status display
  const getStockStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      in_stock: { label: "In Stock", variant: "default" },
      limited_stock: { label: "Limited Stock", variant: "secondary" },
      pre_order: { label: "Pre-Order", variant: "outline" },
      out_of_stock: { label: "Out of Stock", variant: "destructive" },
    };
    const config = statusConfig[status] ?? statusConfig.in_stock!;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="container mx-auto py-8 px-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
        <div className="flex gap-2">
          <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </SheetTrigger>
            <AddProduct 
              product={product} 
              onSuccess={() => setEditSheetOpen(false)} 
            />
          </Sheet>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("Are you sure you want to delete this product?")) {
                deleteMutation.mutate();
              }
            }}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Images */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Product Images
              </CardTitle>
              <CardDescription>
                {allImages.length} image{allImages.length !== 1 ? 's' : ''} across {product.colors.length} color{product.colors.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allImages.length > 0 ? (
                <div className="space-y-4">
                  {/* Featured Image */}
                  {firstImage && (
                    <div className="relative w-full h-80 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={firstImage}
                        alt={product.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  
                  {/* Image Grid by Color */}
                  <div className="space-y-4">
                    {product.colors.map((color) => {
                      const colorImages = images[color];
                      const imageArray = colorImages 
                        ? (Array.isArray(colorImages) ? colorImages : [colorImages])
                        : [];
                      const hex = colorHexMap[color] || "#888";
                      
                      if (imageArray.length === 0) return null;
                      
                      return (
                        <div key={color} className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <div 
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: hex }}
                            />
                            <span className="font-medium text-sm">{color}</span>
                            <Badge variant="secondary" className="text-xs ml-auto">
                              {imageArray.length} image{imageArray.length !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {imageArray.map((url, idx) => (
                              <div key={idx} className="relative aspect-square rounded-md overflow-hidden bg-gray-100">
                                <Image
                                  src={url}
                                  alt={`${product.name} - ${color} ${idx + 1}`}
                                  fill
                                  className="object-cover hover:scale-105 transition-transform"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No images available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Extended Data Section */}
          {(product.techHighlights?.length || product.boxContents?.length || 
            product.productFeatures?.length || product.certifications?.length) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  Extended Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tech Highlights */}
                {product.techHighlights && product.techHighlights.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Tech Highlights
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {product.techHighlights.map((highlight, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                          {highlight.icon && <span className="text-primary">{highlight.icon}</span>}
                          <span className="text-sm">{highlight.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Box Contents */}
                {product.boxContents && product.boxContents.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Box className="h-4 w-4" />
                      What&apos;s in the Box
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {product.boxContents.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Features */}
                {product.productFeatures && product.productFeatures.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Product Features</h3>
                    <div className="space-y-3">
                      {product.productFeatures.map((feature, index) => (
                        <div key={index} className="border-l-2 border-primary pl-4 py-1">
                          <h4 className="font-medium text-sm">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {product.certifications && product.certifications.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Certifications
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="text-sm py-1">
                          {cert.icon && <span className="mr-1">{cert.icon}</span>}
                          {cert.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Technical Specifications */}
          {product.technicalSpecs && Object.keys(product.technicalSpecs).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(product.technicalSpecs).map(([category, specsData]) => {
                    const specs = specsData as Array<{label: string, value: string}>;
                    return (
                      <div key={category}>
                        <h4 className="font-semibold text-sm mb-3 text-primary">{category}</h4>
                        <div className="space-y-2">
                          {specs?.map((spec, index) => (
                            <div key={index} className="flex justify-between text-sm py-2 border-b last:border-0">
                              <span className="text-muted-foreground">{spec.label}</span>
                              <span className="font-medium">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">{product.name}</h2>
                <p className="text-muted-foreground text-sm mt-1">{product.shortDescription}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">{formatTZS(product.price)}</span>
                {product.isHeroProduct && (
                  <Badge className="bg-yellow-500">
                    <Star className="h-3 w-3 mr-1" />
                    Hero
                  </Badge>
                )}
              </div>

              <Separator />
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <Badge variant="secondary">{product.categorySlug}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  {getStockStatusBadge(product.stockStatus || "in_stock")}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Stock</span>
                  <span className="font-medium">{product.stockQuantity || 0} units</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sold</span>
                  <span className="font-medium">{product.soldCount || 0} units</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Low Stock Alert</span>
                  <span className="font-medium">{product.lowStockThreshold || 10}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Palette className="h-4 w-4" />
                Colors ({product.colors.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => {
                  const hex = colorHexMap[color] || "#888";
                  return (
                    <div key={color} className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
                      <div 
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="text-sm">{color}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Sizes/Variants */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Sizes / Variants ({product.sizes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Badge key={size} variant="outline" className="text-sm">
                    {size}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product ID</span>
                <span className="font-mono text-xs">{product.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span>{new Date(product.updatedAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
