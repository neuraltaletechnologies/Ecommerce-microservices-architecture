"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ProductType, colors as availableColors, sizes as availableSizes, CategoryType } from "@repo/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import { ArrowLeft, Loader2, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

type EditProductFormProps = {
  product: ProductType;
};

type FormData = {
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  categorySlug: string;
  colors: string[];
  sizes: string[];
  images: Record<string, string>;
  techHighlights: Array<{label: string, icon: string}>;
  boxContents: string[];
  productFeatures: Array<{title: string, description: string}>;
  technicalSpecs: Record<string, Array<{label: string, value: string}>>;
  certifications: Array<{label: string, icon: string}>;
};

const normalizeImages = (colors: string[], images: Record<string, string>) => {
  const normalized: Record<string, string> = {};

  colors.forEach((color) => {
    const value = images[color]?.trim();
    if (value) {
      normalized[color] = value;
    }
  });

  return normalized;
};

const sanitizeSpecs = (technicalSpecs: FormData["technicalSpecs"]) => {
  const normalized: FormData["technicalSpecs"] = {};

  Object.entries(technicalSpecs || {}).forEach(([section, items]) => {
    const sectionName = section.trim();
    if (!sectionName) return;

    const validItems = (items || [])
      .filter((item) => item?.label?.trim() && item?.value?.trim())
      .map((item) => ({
        label: item.label.trim(),
        value: item.value.trim(),
      }));

    if (validItems.length > 0) {
      normalized[sectionName] = validItems;
    }
  });

  return normalized;
};

const fetchCategories = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/categories`
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export default function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter();
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });
  
  const [formData, setFormData] = useState<FormData>({
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description || "",
    price: product.price,
    categorySlug: product.categorySlug,
    colors: product.colors,
    sizes: product.sizes,
    images: typeof product.images === 'object' ? product.images as Record<string, string> : {},
    techHighlights: (product.techHighlights as Array<{label: string, icon: string}>) || [],
    boxContents: (product.boxContents as string[]) || [],
    productFeatures: (product.productFeatures as Array<{title: string, description: string}>) || [],
    technicalSpecs: (product.technicalSpecs as Record<string, Array<{label: string, value: string}>>) || {},
    certifications: (product.certifications as Array<{label: string, icon: string}>) || [],
  });

  const handleColorToggle = (color: string) => {
    const isSelected = formData.colors.includes(color);
    if (isSelected) {
      const newImages = {...formData.images};
      delete newImages[color];
      setFormData({
        ...formData,
        colors: formData.colors.filter(c => c !== color),
        images: newImages
      });
    } else {
      setFormData({
        ...formData,
        colors: [...formData.colors, color]
      });
    }
  };

  const handleSizeToggle = (size: string) => {
    const isSelected = formData.sizes.includes(size);
    if (isSelected) {
      setFormData({
        ...formData,
        sizes: formData.sizes.filter(s => s !== size)
      });
    } else {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, size]
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = await getToken();
      const normalizedColors = Array.from(new Set(formData.colors.map((color) => color.trim()).filter(Boolean)));
      const normalizedSizes = Array.from(new Set(formData.sizes.map((size) => size.trim()).filter(Boolean)));
      const normalizedImages = normalizeImages(normalizedColors, formData.images);

      const missingImageColors = normalizedColors.filter((color) => !normalizedImages[color]);
      if (missingImageColors.length > 0) {
        toast.error(`Add image URL for: ${missingImageColors.join(", ")}`);
        setIsLoading(false);
        return;
      }

      const price = Number(formData.price);
      if (!Number.isFinite(price) || price <= 0) {
        toast.error("Price must be a valid number greater than 0");
        setIsLoading(false);
        return;
      }

      const payload = {
        name: formData.name.trim(),
        shortDescription: formData.shortDescription.trim(),
        description: formData.description.trim(),
        price,
        categorySlug: formData.categorySlug,
        colors: normalizedColors,
        sizes: normalizedSizes,
        images: normalizedImages,
        techHighlights: formData.techHighlights
          .filter((item) => item.label.trim() && item.icon.trim())
          .map((item) => ({ label: item.label.trim(), icon: item.icon.trim() })),
        boxContents: formData.boxContents.map((item) => item.trim()).filter(Boolean),
        productFeatures: formData.productFeatures
          .filter((item) => item.title.trim() && item.description.trim())
          .map((item) => ({ title: item.title.trim(), description: item.description.trim() })),
        technicalSpecs: sanitizeSpecs(formData.technicalSpecs),
        certifications: formData.certifications
          .filter((item) => item.label.trim() && item.icon.trim())
          .map((item) => ({ label: item.label.trim(), icon: item.icon.trim() })),
      };
      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products/${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        let message = "Failed to update product";
        try {
          const body = await res.json();
          message = body?.error || body?.message || message;
        } catch {
          try {
            const text = await res.text();
            if (text) message = text;
          } catch {
            // Keep fallback message.
          }
        }
        throw new Error(message);
      }

      toast.success("Product updated successfully");
      router.push(`/products/${product.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="mb-6">
        <Link href={`/products/${product.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Product
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Essential product details and pricing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="shortDescription">Short Description</Label>
              <Input
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                maxLength={60}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({
                    ...formData,
                    price: value === "" ? 0 : Number(value),
                  });
                }}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.categorySlug}
                onValueChange={(value) => setFormData({...formData, categorySlug: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category: CategoryType) => (
                    <SelectItem key={category.slug} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Variants & Options */}
        <Card>
          <CardHeader>
            <CardTitle>Variants & Options</CardTitle>
            <CardDescription>Available colors and sizes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="mb-3 block">Colors</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableColors.map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      id={`color-${color}`}
                      checked={formData.colors.includes(color)}
                      onCheckedChange={() => handleColorToggle(color)}
                    />
                    <Label htmlFor={`color-${color}`} className="cursor-pointer">
                      {color}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Sizes</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableSizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size}`}
                      checked={formData.sizes.includes(size)}
                      onCheckedChange={() => handleSizeToggle(size)}
                    />
                    <Label htmlFor={`size-${size}`} className="cursor-pointer">
                      {size}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>Image URLs for each selected color</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.colors.map((color) => (
              <div key={color}>
                <Label htmlFor={`image-${color}`}>{color}</Label>
                <Input
                  id={`image-${color}`}
                  placeholder={`Image URL for ${color}`}
                  value={formData.images[color] || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    images: {...formData.images, [color]: e.target.value}
                  })}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Extended Information */}
        <Card>
          <CardHeader>
            <CardTitle>Extended Product Information</CardTitle>
            <CardDescription>Additional details and specifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tech Highlights */}
            <div>
              <Label className="mb-2 block">Tech Highlights</Label>
              {formData.techHighlights.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Label"
                    value={item.label}
                    onChange={(e) => {
                      const updated = [...formData.techHighlights];
                      if (updated[index]) {
                        updated[index].label = e.target.value;
                        setFormData({...formData, techHighlights: updated});
                      }
                    }}
                  />
                  <Input
                    placeholder="Icon"
                    value={item.icon}
                    onChange={(e) => {
                      const updated = [...formData.techHighlights];
                      if (updated[index]) {
                        updated[index].icon = e.target.value;
                        setFormData({...formData, techHighlights: updated});
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        techHighlights: formData.techHighlights.filter((_, i) => i !== index)
                      });
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData({
                    ...formData,
                    techHighlights: [...formData.techHighlights, {label: "", icon: ""}]
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Highlight
              </Button>
            </div>

            {/* Box Contents */}
            <div>
              <Label className="mb-2 block">What&apos;s in the Box</Label>
              {formData.boxContents.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Item"
                    value={item}
                    onChange={(e) => {
                      const updated = [...formData.boxContents];
                      updated[index] = e.target.value;
                      setFormData({...formData, boxContents: updated});
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        boxContents: formData.boxContents.filter((_, i) => i !== index)
                      });
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData({
                    ...formData,
                    boxContents: [...formData.boxContents, ""]
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>

            {/* Product Features */}
            <div>
              <Label className="mb-2 block">Product Features</Label>
              {formData.productFeatures.map((item, index) => (
                <div key={index} className="space-y-2 mb-4 p-3 border rounded">
                  <Input
                    placeholder="Title"
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...formData.productFeatures];
                      if (updated[index]) {
                        updated[index].title = e.target.value;
                        setFormData({...formData, productFeatures: updated});
                      }
                    }}
                  />
                  <Textarea
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...formData.productFeatures];
                      if (updated[index]) {
                        updated[index].description = e.target.value;
                        setFormData({...formData, productFeatures: updated});
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        productFeatures: formData.productFeatures.filter((_, i) => i !== index)
                      });
                    }}
                  >
                    <Trash className="h-4 w-4 mr-2" /> Remove Feature
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData({
                    ...formData,
                    productFeatures: [...formData.productFeatures, {title: "", description: ""}]
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Feature
              </Button>
            </div>

            {/* Technical Specs */}
            <div>
              <Label className="mb-2 block">Technical Specifications (JSON)</Label>
              <Textarea
                placeholder='{"General": [{"label": "Model", "value": "XYZ-2024"}]}'
                value={JSON.stringify(formData.technicalSpecs, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFormData({...formData, technicalSpecs: parsed});
                  } catch {
                    // Invalid JSON, don't update
                  }
                }}
                rows={6}
              />
            </div>

            {/* Certifications */}
            <div>
              <Label className="mb-2 block">Certifications</Label>
              {formData.certifications.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Label"
                    value={item.label}
                    onChange={(e) => {
                      const updated = [...formData.certifications];
                      if (updated[index]) {
                        updated[index].label = e.target.value;
                        setFormData({...formData, certifications: updated});
                      }
                    }}
                  />
                  <Input
                    placeholder="Icon"
                    value={item.icon}
                    onChange={(e) => {
                      const updated = [...formData.certifications];
                      if (updated[index]) {
                        updated[index].icon = e.target.value;
                        setFormData({...formData, certifications: updated});
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        certifications: formData.certifications.filter((_, i) => i !== index)
                      });
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData({
                    ...formData,
                    certifications: [...formData.certifications, {label: "", icon: ""}]
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Certification
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t py-4">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/products/${product.id}`)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Product
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
