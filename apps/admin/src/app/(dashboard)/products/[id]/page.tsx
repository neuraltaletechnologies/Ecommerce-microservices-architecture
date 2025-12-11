"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { ProductType } from "@repo/types";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatTZS } from "@/lib/utils/currency";

const fetchProduct = async (id: string): Promise<ProductType> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products/${id}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }
  return res.json();
};

export default function ViewProductPage() {
  const params = useParams();
  const router = useRouter();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const productId = params?.id as string;

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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
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

  const images = product.images as Record<string, string>;
  const firstColor = product.colors[0] || "";
  const firstImage = firstColor ? (images?.[firstColor] || "") : "";

  return (
    <div className="container mx-auto py-8 px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/products/${productId}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image & Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {firstImage && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src={firstImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p className="text-muted-foreground">{product.shortDescription}</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{formatTZS(product.price)}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Variants & Options */}
        <Card>
          <CardHeader>
            <CardTitle>Variants & Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Available Colors</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Badge key={color} variant="secondary">
                    {color}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Available Sizes/Storage</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Badge key={size} variant="outline">
                    {size}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Category</h3>
              <Badge variant="default">{product.categorySlug}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Extended Data Section */}
      {(product.techHighlights || product.boxContents || product.productFeatures || 
        product.technicalSpecs || product.certifications) && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Extended Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tech Highlights */}
            {product.techHighlights && product.techHighlights.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Tech Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {product.techHighlights.map((highlight, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {highlight.icon && <span className="mr-1">{highlight.icon}</span>}
                      {highlight.label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Box Contents */}
            {product.boxContents && product.boxContents.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">What&apos;s in the Box</h3>
                <ul className="list-disc list-inside space-y-1">
                  {product.boxContents.map((item, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Product Features */}
            {product.productFeatures && product.productFeatures.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Product Features</h3>
                <div className="space-y-3">
                  {product.productFeatures.map((feature, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <h4 className="font-medium">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Specifications */}
            {product.technicalSpecs && Object.keys(product.technicalSpecs).length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Technical Specifications</h3>
                <div className="space-y-4">
                  {Object.entries(product.technicalSpecs).map(([category, specsData]) => {
                    const specs = specsData as Array<{label: string, value: string}>;
                    return (
                    <div key={category}>
                      <h4 className="font-medium text-sm mb-2 text-primary">{category}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {specs && specs.map((spec, index) => (
                          <div key={index} className="flex justify-between text-sm border-b pb-1">
                            <span className="text-muted-foreground">{spec.label}:</span>
                            <span className="font-medium">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );})}
                </div>
              </div>
            )}

            {/* Certifications */}
            {product.certifications && product.certifications.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
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

      {/* Product Images Gallery */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(images).map(([color, imageUrl]) => {
              const hasImage = imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== "";
              return (
                <div key={color} className="space-y-2">
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border bg-gray-100 flex items-center justify-center">
                    {hasImage ? (
                      <Image
                        src={imageUrl}
                        alt={`${product.name} - ${color}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-sm text-gray-400">No image</span>
                    )}
                  </div>
                  <p className="text-sm text-center text-muted-foreground">{color}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
