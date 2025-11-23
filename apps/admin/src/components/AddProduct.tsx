"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { CategoryType, colors, ProductFormSchema, sizes } from "@repo/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";

// const categories = [
//   "T-shirts",
//   "Shoes",
//   "Accessories",
//   "Bags",
//   "Dresses",
//   "Jackets",
//   "Gloves",
// ] as const;

const fetchCategories = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/categories`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch categories!");
  }

  return await res.json();
};

const AddProduct = () => {
  const form = useForm<z.infer<typeof ProductFormSchema>>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      price: 0,
      categorySlug: "",
      sizes: [],
      colors: [],
      images: {},
    },
  });

  const { isPending, error, data } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { getToken } = useAuth();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof ProductFormSchema>) => {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to create product!");
      }
    },
    onSuccess: () => {
      toast.success("Product created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <SheetContent>
      <ScrollArea className="h-screen">
        <SheetHeader>
          <SheetTitle className="mb-4">Add Tech Product</SheetTitle>
          <SheetDescription asChild>
            <Form {...form}>
              <form
                className="space-y-8"
                onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the product name (e.g., Gaming Laptop, Wireless Earbuds, Smartphone).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Brief specs and features (e.g., "Intel Core i7, RTX 4060, 16GB RAM").
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the description of the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the price in TZS (Tanzanian Shillings).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {data && (
                  <FormField
                    control={form.control}
                    name="categorySlug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {data.map((cat: CategoryType) => (
                                <SelectItem key={cat.id} value={cat.slug}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Select category: Laptops, Smartphones, Audio, Gaming, Wearables, etc.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="sizes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sizes</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-4 my-2">
                          {sizes.map((size) => (
                            <div className="flex items-center gap-2" key={size}>
                              <Checkbox
                                id="size"
                                checked={field.value?.includes(size)}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentValues, size]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter((v) => v !== size)
                                    );
                                  }
                                }}
                              />
                              <label htmlFor="size" className="text-xs">
                                {size}
                              </label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Select available storage/RAM options (e.g., 256GB, 512GB, 1TB) or screen sizes.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="colors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colors</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-4 my-2">
                            {colors.map((color) => (
                              <div
                                className="flex items-center gap-2"
                                key={color}
                              >
                                <Checkbox
                                  id="color"
                                  checked={field.value?.includes(color)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValues, color]);
                                    } else {
                                      field.onChange(
                                        currentValues.filter((v) => v !== color)
                                      );
                                    }
                                  }}
                                />
                                <label
                                  htmlFor="color"
                                  className="text-xs flex items-center gap-2"
                                >
                                  <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: color }}
                                  />
                                  {color}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Select available colors/finishes for this tech product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Images</FormLabel>
                      <FormControl>
                        <div className="">
                          {form.watch("colors")?.map((color) => (
                            <div
                              className="mb-4 flex items-center gap-4"
                              key={color}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: color }}
                                />
                                <span className="text-sm font-medium min-w-[80px]">
                                  {color}:
                                </span>
                              </div>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    try {
                                      const formData = new FormData();
                                      formData.append("file", file);
                                      formData.append(
                                        "upload_preset",
                                        "ecommerce"
                                      );

                                      const res = await fetch(
                                        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                                        {
                                          method: "POST",
                                          body: formData,
                                        }
                                      );
                                      const data = await res.json();

                                      if (data.secure_url) {
                                        const currentImages =
                                          form.getValues("images") || {};
                                        form.setValue("images", {
                                          ...currentImages,
                                          [color]: data.secure_url,
                                        });
                                      }
                                    } catch (error) {
                                      console.log(error);
                                      toast.error("Upload failed!");
                                    }
                                  }
                                }}
                              />
                              {field.value?.[color] ? (
                                <span className="text-green-600 text-sm">
                                  Image selected
                                </span>
                              ) : (
                                <span className="text-red-600 text-sm">
                                  Image required
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </ScrollArea>
    </SheetContent>
  );
};

export default AddProduct;
