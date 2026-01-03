"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatTZS } from "@/lib/utils/currency";
import HeroSkeleton from "./skeletons/HeroSkeleton";

import { ChevronLeft, ChevronRight, Star, Zap, Headphones, Gamepad2, Smartphone, Laptop } from "lucide-react";

interface HeroProduct {
  id: number;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  images: Record<string, string[]>;
  categorySlug: string;
  colors: string[];
  sizes: string[];
}

const HeroSection = () => {
  const [heroProducts, setHeroProducts] = useState<HeroProduct[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroProducts = async () => {
      try {
        const res = await fetch('/api/hero-products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setHeroProducts(data);
          }
        }
      } catch (error) {
        console.error('Error fetching hero products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroProducts();
  }, []);

  useEffect(() => {
    if (isAutoPlaying && heroProducts.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroProducts.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, heroProducts.length]);
  const nextSlide = () => {
    if (heroProducts.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % heroProducts.length);
    }
  };

  const prevSlide = () => {
    if (heroProducts.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + heroProducts.length) % heroProducts.length);
    }
  };

  if (loading) {
    return <HeroSkeleton />;
  }

  if (!heroProducts || heroProducts.length === 0) {
    return null;
  }

  const currentProduct = heroProducts[currentSlide];

  if (!currentProduct) {
    return null;
  }
  
  // Get the first image from the first color variant
  const getProductImage = (product: HeroProduct): string => {
    const firstColor = product.colors?.[0];
    if (firstColor && product.images && product.images[firstColor]) {
      const imageArray = product.images[firstColor];
      return imageArray?.[0] || '/products/placeholder.jpg';
    }
    return '/products/placeholder.jpg';
  };

  const getCategoryIcon = (categorySlug: string) => {
    switch (categorySlug.toLowerCase()) {
      case "audio":
      case "headphones":
        return <Headphones className="w-5 h-5" />;
      case "gaming":
      case "gaming-laptops":
        return <Gamepad2 className="w-5 h-5" />;
      case "smartphones":
        return <Smartphone className="w-5 h-5" />;
      case "laptops":
        return <Laptop className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  const formatCategoryName = (slug: string): string => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden h-screen min-h-[600px] -mt-2 sm:-mt-4 md:-mt-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #60a5fa 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #c084fc 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-4 sm:pt-24 sm:pb-6 lg:pt-28 lg:pb-8 h-full flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center flex-1 min-h-0">
          {/* Product Content */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6 flex flex-col justify-center">
            {/* Brand Header */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-2 text-blue-300">
                {getCategoryIcon(currentProduct.categorySlug)}
                <span className="text-sm font-medium uppercase tracking-wider">
                  {formatCategoryName(currentProduct.categorySlug)}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight">
                {currentProduct.name}
              </h1>
              <p className="text-base sm:text-lg text-blue-100 leading-relaxed">
                {currentProduct.shortDescription}
              </p>
            </div>

            {/* Colors & Sizes */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-blue-200">Available Options</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentProduct.colors.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                    <span className="text-sm text-blue-100">
                      {currentProduct.colors.length} Colors
                    </span>
                  </div>
                )}
                {currentProduct.sizes.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                    <span className="text-sm text-blue-100">
                      {currentProduct.sizes.length} Sizes
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  {formatTZS(currentProduct.price)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="text-sm font-medium">In Stock</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/products/${currentProduct.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 text-center"
              >
                Shop Now
              </Link>
              <Link
                href={`/products/${currentProduct.id}`}
                className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 text-center"
              >
                View Details
              </Link>
            </div>
          </div>

          {/* Product Image */}
          <div className="relative flex items-center justify-center order-first lg:order-last">
            <div className="relative w-full max-w-sm sm:max-w-md h-64 sm:h-80 lg:h-[450px] rounded-2xl overflow-hidden ">
              <Image
                src={getProductImage(currentProduct)}
                alt={currentProduct.name}
                fill
                className="object-contain p-3 sm:p-4"
                priority
              />
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center items-center mb-10 space-x-4">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            aria-label="Previous product"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Slide Indicators */}
          <div className="flex space-x-2">
            {heroProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                  index === currentSlide ? "bg-blue-400" : "bg-white/30 hover:bg-white/50"
                }`}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            aria-label="Next product"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;