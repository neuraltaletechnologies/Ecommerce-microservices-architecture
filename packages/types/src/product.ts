import type { Product, Category } from "@repo/product-db";
import z from "zod";

// Extended Product type with additional JSON fields
export type ProductType = Product & {
  techHighlights?: Array<{label: string, icon: string}> | null;
  boxContents?: string[] | null;
  productFeatures?: Array<{title: string, description: string}> | null;
  technicalSpecs?: Record<string, Array<{label: string, value: string}>> | null;
  certifications?: Array<{label: string, icon: string}> | null;
};

export type ProductsType = ProductType[];

export type StripeProductType = {
  id: string;
  name: string;
  price: number;
};

export const colors = [
  // Traditional colors
  "blue",
  "green",
  "red",
  "yellow",
  "purple",
  "orange",
  "pink",
  "brown",
  "gray",
  "black",
  "white",
  
  // Tech product colors
  "Natural Titanium",
  "Blue Titanium", 
  "White Titanium",
  "Black Titanium",
  "Titanium Gray",
  "Titanium Black",
  "Titanium Violet",
  "Titanium Yellow",
  "Space Black",
  "Silver",
  "Platinum Silver",
  "Graphite",
  "Off Black",
  "Storm Grey",
  "White Smoke",
  "Moonstone Blue",
  "Pale Gray",
  "Off-White",
  "Dark Grey",
  "Natural",
  "Platinum",
  "Sapphire",
  "Dune",
  "Black/Cyan",
  "White/Black",
] as const;

export const sizes = [
  // Traditional clothing sizes
  "xs",
  "s", 
  "m",
  "l",
  "xl",
  "xxl",
  
  // Shoe sizes
  "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48",
  
  // Tech product sizes/capacities
  "128GB", "256GB", "512GB", "1TB", "2TB", "4TB",
  "Standard", "Compact", "Tenkeyless",
  "27-inch", "32-inch",
  "43mm", "47mm", "49mm",
] as const;

export const ProductFormSchema = z
  .object({
    name: z
      .string({ message: "Product name is required!" })
      .min(1, { message: "Product name is required!" }),
    shortDescription: z
      .string({ message: "Short description is required!" })
      .min(1, { message: "Short description is required!" })
      .max(200),
    description: z
      .string({ message: "Description is required!" })
      .min(1, { message: "Description is required!" }),
    price: z
      .number({ message: "Price is required!" })
      .min(1, { message: "Price is required!" }),
    discount: z.number().int().min(0).max(100).default(0), // Discount percentage
    categorySlug: z
      .string({ message: "Category is required!" })
      .min(1, { message: "Category is required!" }),
    sizes: z
      .array(z.enum(sizes))
      .min(1, { message: "At least one size is required!" }),
    colors: z
      .array(z.enum(colors))
      .min(1, { message: "At least one color is required!" }),
    images: z.record(z.string(), z.union([z.string(), z.array(z.string())]), {
      message: "Image for each color is required!",
    }),
    techHighlights: z.array(z.object({
      label: z.string(),
      icon: z.string(),
    })).optional(),
    boxContents: z.array(z.string()).optional(),
    productFeatures: z.array(z.object({
      title: z.string(),
      description: z.string(),
    })).optional(),
    technicalSpecs: z.record(z.string(), z.array(z.object({
      label: z.string(),
      value: z.string(),
    }))).optional(),
    certifications: z.array(z.object({
      label: z.string(),
      icon: z.string(),
    })).optional(),
    stockQuantity: z.number().int().min(0).default(0),
    stockStatus: z.enum(["in_stock", "limited_stock", "pre_order", "out_of_stock"]).default("in_stock"),
    lowStockThreshold: z.number().int().min(0).default(10),
    soldCount: z.number().int().min(0).default(0),
    isPublished: z.boolean().default(true),
    brand: z.string().optional(),
    externalSource: z.string().optional(),
    externalId: z.string().optional(),
  })
  .refine(
    (data) => {
      const missingImages = data.colors.filter(
        (color: string) => !data.images?.[color]
      );
      return missingImages.length === 0;
    },
    {
      message: "Image is required for each selected color!",
      path: ["images"],
    }
  );

// Simplified schema for API imports - only business fields needed
export const ApiImportSchema = z.object({
  price: z.number({ message: "Price is required!" }).min(1, { message: "Price must be greater than 0" }),
  discount: z.number().int().min(0).max(100).default(0),
  stockQuantity: z.number().int().min(0).default(0),
  categorySlug: z.string({ message: "Category is required!" }).min(1, { message: "Category is required!" }),
  isPublished: z.boolean().default(true),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
});

export type CategoryType = Category;

export const CategoryFormSchema = z.object({
  name: z
    .string({ message: "Name is Required!" })
    .min(1, { message: "Name is Required!" }),
  slug: z
    .string({ message: "Slug is Required!" })
    .min(1, { message: "Slug is Required!" }),
});
