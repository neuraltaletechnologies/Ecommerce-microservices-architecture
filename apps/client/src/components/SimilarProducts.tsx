"use client";

import { ProductType } from "@repo/types";
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SimilarProductsProps {
  categorySlug: string;
  currentProductId: string;
}

export default function SimilarProducts({ categorySlug, currentProductId }: SimilarProductsProps) {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || 'http://localhost:8000'}/products?category=${categorySlug}&limit=8`;
        const res = await fetch(url);
        
        if (!res.ok) {
          console.error('Failed to fetch similar products');
          return;
        }

        const data: ProductType[] = await res.json();
        // Filter out current product (compare as strings since id comes from URL)
        const filtered = data.filter(p => p.id.toString() !== currentProductId);
        setProducts(filtered);
      } catch (error) {
        console.error('Error fetching similar products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [categorySlug, currentProductId]);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('similar-products-container');
    if (!container) return;

    const scrollAmount = 320; // Approximate width of one product card + gap
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    setScrollPosition(newPosition);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const showNavigation = products.length > 4;

  return (
    <div className="border-t border-gray-200 pt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Similar products</h2>
        
        {showNavigation && (
          <div className="flex gap-2">
            <button
              onClick={() => handleScroll('left')}
              disabled={scrollPosition === 0}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        )}
      </div>

      <div 
        id="similar-products-container"
        className="overflow-x-auto hide-scrollbar"
      >
        <div className="flex gap-4 pb-4 w-max">
          {products.map((product) => (
            <div key={product.id} className="w-72 flex-shrink-0">
              <ProductCard product={product} />
              
              {/* Additional Product Info */}
              <div className="mt-2 px-2">
                <p className="text-sm text-gray-600">Neurashop</p>
                {product.colors && product.colors.length > 1 && (
                  <p className="text-sm text-gray-500">
                    {product.colors.length} variants
                  </p>
                )}
                <p className="text-sm text-gray-900 font-medium mt-1">
                  From {new Intl.NumberFormat('en-TZ', {
                    style: 'currency',
                    currency: 'TZS',
                    minimumFractionDigits: 0,
                  }).format(product.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
