"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ProductType } from "@repo/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";


// export type Product = {
//   id: string | number;
//   price: number;
//   name: string;
//   shortDescription: string;
//   description: string;
//   sizes: string[];
//   colors: string[];
//   images: Record<string, string>;
// };

export const columns: ColumnDef<ProductType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
      />
    ),
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const product = row.original;
      const images = product.images as Record<string, string | string[]>;
      const firstColor = product.colors[0];
      
      // Get image URL - handle both string and array formats
      let imageUrl: string | null = null;
      if (images && firstColor) {
        const colorImages = images[firstColor];
        if (typeof colorImages === 'string') {
          imageUrl = colorImages;
        } else if (Array.isArray(colorImages) && colorImages.length > 0) {
          imageUrl = colorImages[0] || null;
        }
      }
      
      return (
        <div className="w-9 h-9 relative bg-gray-100 rounded-full flex items-center justify-center">
          {imageUrl && imageUrl.trim() !== '' ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">No img</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const product = row.original;
      const hasExtendedData = product.techHighlights || product.boxContents || 
                              product.productFeatures || product.technicalSpecs || 
                              product.certifications;
      return (
        <div className="flex items-center gap-2">
          <span>{product.name}</span>
          {hasExtendedData && (
            <Badge variant="secondary" className="text-xs">
              Extended
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "shortDescription",
    header: "Description",
  },
  {
    accessorKey: "stockQuantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const product = row.original;
      const stock = product.stockQuantity || 0;
      const threshold = product.lowStockThreshold || 10;
      const status = product.stockStatus || "in_stock";
      
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{stock}</span>
          <Badge 
            variant={
              status === "out_of_stock" ? "destructive" :
              status === "pre_order" ? "secondary" :
              stock <= threshold ? "outline" : "default"
            }
            className={cn(
              status === "limited_stock" && "bg-orange-100 text-orange-800 border-orange-300",
              stock <= threshold && stock > 0 && "border-yellow-500 text-yellow-700"
            )}
          >
            {status === "in_stock" ? "In Stock" :
             status === "limited_stock" ? "Limited" :
             status === "pre_order" ? "Pre-Order" :
             "Out of Stock"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "soldCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sold
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const sold = row.original.soldCount || 0;
      return <span className="font-medium">{sold}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(product.id.toString());
              }}
            >
              Copy product ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.location.href = `/products/${product.id}`}>
              View product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
