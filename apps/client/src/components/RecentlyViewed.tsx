"use client";

import { ProductType } from "@repo/types";
import { Clock, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { formatTZS } from "@/lib/utils/currency";
import { getCloudinaryUrl } from "@/lib/utils/cloudinary";

interface RecentlyViewedProps {
  currentProductId?: number;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ currentProductId }) => {
  const [recentProducts, setRecentProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    const mockRecentProducts: ProductType[] = [
      {
        id: 1,
        name: "iPhone 15 Pro Max",
        shortDescription: "A17 Pro chip, Titanium Design, 256GB",
        description: "The ultimate iPhone with titanium design and A17 Pro chip.",
        price: 1199,
        sizes: ["128GB", "256GB", "512GB", "1TB"],
        colors: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
        images: {
          "Natural Titanium": "/products/iphone-15-pro-titanium.jpg",
          "Blue Titanium": "/products/iphone-15-pro-blue.jpg",
          "White Titanium": "/products/iphone-15-pro-white.jpg",
          "Black Titanium": "/products/iphone-15-pro-black.jpg",
        },
        techHighlights: null,
        boxContents: null,
        productFeatures: null,
        technicalSpecs: null,
        certifications: null,
        isHeroProduct: false,
        heroOrder: null,
        isPublished: true,
        discount: 0,
        brand: "Apple",
        externalSource: null,
        externalId: null,
        externalRawData: null,
        stockQuantity: 50,
        stockStatus: "in_stock",
        lowStockThreshold: 10,
        soldCount: 0,
        categorySlug: "smartphones",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "MacBook Pro 14\" M4",
        shortDescription: "M4 chip, 16GB RAM, 512GB SSD, Space Black",
        description: "Professional laptop with M4 chip for ultimate performance.",
        price: 1999,
        sizes: ["512GB", "1TB", "2TB"],
        colors: ["Space Black", "Silver"],
        images: {
          "Space Black": "/products/macbook-pro-14-black.jpg",
          "Silver": "/products/macbook-pro-14-silver.jpg",
        },
        techHighlights: null,
        boxContents: null,
        productFeatures: null,
        technicalSpecs: null,
        certifications: null,
        isHeroProduct: false,
        heroOrder: null,
        isPublished: true,
        discount: 0,
        brand: "Apple",
        externalSource: null,
        externalId: null,
        externalRawData: null,
        stockQuantity: 30,
        stockStatus: "in_stock",
        lowStockThreshold: 10,
        soldCount: 0,
        categorySlug: "laptops",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 8,
        name: "AirPods Pro (3rd Gen)",
        shortDescription: "Active Noise Cancellation, USB-C",
        description: "Premium wireless earbuds with advanced noise cancellation.",
        price: 249,
        sizes: ["One Size"],
        colors: ["White"],
        images: {
          "White": "/products/airpods-pro-3rd-gen.jpg",
        },
        techHighlights: null,
        boxContents: null,
        productFeatures: null,
        technicalSpecs: null,
        certifications: null,
        isHeroProduct: false,
        heroOrder: null,
        isPublished: true,
        discount: 0,
        brand: "Apple",
        externalSource: null,
        externalId: null,
        externalRawData: null,
        stockQuantity: 100,
        stockStatus: "in_stock",
        lowStockThreshold: 10,
        soldCount: 0,
        categorySlug: "audio",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 21,
        name: "iPad Pro 12.9\"",
        shortDescription: "M2 chip, 128GB, Wi-Fi + Cellular",
        description: "Ultimate iPad experience with M2 chip.",
        price: 1099,
        sizes: ["128GB", "256GB", "512GB", "1TB"],
        colors: ["Space Gray", "Silver"],
        images: {
          "Space Gray": "/products/ipad-pro-gray.jpg",
          "Silver": "/products/ipad-pro-silver.jpg",
        },
        techHighlights: null,
        boxContents: null,
        productFeatures: null,
        technicalSpecs: null,
        certifications: null,
        isHeroProduct: false,
        heroOrder: null,
        isPublished: true,
        discount: 0,
        brand: "Apple",
        externalSource: null,
        externalId: null,
        externalRawData: null,
        stockQuantity: 40,
        stockStatus: "in_stock",
        lowStockThreshold: 10,
        soldCount: 0,
        categorySlug: "tablets",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    // Filter out current product if provided
    const filteredProducts = currentProductId
      ? mockRecentProducts.filter(p => p.id !== currentProductId)
      : mockRecentProducts;

    setRecentProducts(filteredProducts.slice(0, 4));
  }, [currentProductId]);

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Recently Viewed</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recentProducts.map((product) => {
          // Get the first available image more robustly
          const getFirstImage = (): string => {
            const images = product.images as Record<string, string | string[]>;
            if (!images || Object.keys(images).length === 0) {
              return "https://via.placeholder.com/600x600?text=Product+Image";
            }

            const firstValue = Object.values(images)[0];
            if (typeof firstValue === 'string') return firstValue;
            if (Array.isArray(firstValue) && firstValue.length > 0 && typeof firstValue[0] === 'string') return firstValue[0];

            return "https://via.placeholder.com/600x600?text=Product+Image";
          };

          const firstImage = getFirstImage();
          const optimizedImageUrl = getCloudinaryUrl(firstImage, { width: 400, crop: 'fill' });

          return (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group block"
            >
              <div className="bg-gray-50 rounded-lg overflow-hidden mb-2 aspect-square relative">
                <Image
                  src={optimizedImageUrl}
                  alt={product.name}
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-[#0A7EA4] transition-colors">
                {product.name}
              </h4>
              <p className="text-sm font-semibold text-gray-900">
                {formatTZS(product.price)}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-[#0A7EA4] hover:text-[#001E3C] font-medium"
        >
          <Eye className="w-4 h-4" />
          View All Products
        </Link>
      </div>
    </div>
  );
};

export default RecentlyViewed;