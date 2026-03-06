"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatTZS } from "@/lib/utils/currency";
import HeroSkeleton from "./skeletons/HeroSkeleton";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Tag } from "lucide-react";
import { getCloudinaryUrl } from "@/lib/utils/cloudinary";

interface HeroProduct {
  id: number;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  images: Record<string, string | string[]>;
  categorySlug: string;
  colors: string[];
  sizes: string[];
  stockStatus: string;
  stockQuantity?: number;
}

interface HeroSectionProps {
  initialProducts?: HeroProduct[];
}

// Helper function to get stock status badge info
const getStockBadge = (status: string) => {
  switch (status) {
    case 'in_stock':
      return { label: 'In Stock', bgColor: 'bg-green-100', textColor: 'text-green-800', dotColor: 'bg-green-500', showOfferIcon: false };
    case 'limited_stock':
      return { label: 'Limited Stock', bgColor: 'bg-[#FDB913]/20', textColor: 'text-[#001E3C]', dotColor: 'bg-[#FDB913]', showOfferIcon: true };
    case 'pre_order':
      return { label: 'Pre-Order', bgColor: 'bg-[#0A7EA4]/20', textColor: 'text-[#0A7EA4]', dotColor: 'bg-[#0A7EA4]', showOfferIcon: false };
    case 'out_of_stock':
      return { label: 'Out of Stock', bgColor: 'bg-red-100', textColor: 'text-red-800', dotColor: 'bg-red-500', showOfferIcon: false };
    default:
      return { label: 'In Stock', bgColor: 'bg-green-100', textColor: 'text-green-800', dotColor: 'bg-green-500', showOfferIcon: false };
  }
};

const HeroSection = ({ initialProducts = [] }: HeroSectionProps) => {
  const [heroProducts, setHeroProducts] = useState<HeroProduct[]>(initialProducts);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Only fetch if no initial products provided (fallback for client-side navigation)
  useEffect(() => {
    if (initialProducts.length === 0 && heroProducts.length === 0) {
      const fetchHeroProducts = async () => {
        try {
          const res = await fetch("/api/hero-products", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
              setHeroProducts(data);
            }
          }
        } catch (error) {
          console.error("Error fetching hero products:", error);
        }
      };

      fetchHeroProducts();
    }
  }, [initialProducts.length, heroProducts.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroProducts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroProducts.length]);

  const handleSlideChange = useCallback((newIndex: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(newIndex);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    if (heroProducts.length > 0) {
      handleSlideChange((currentSlide + 1) % heroProducts.length);
    }
  }, [heroProducts.length, currentSlide, handleSlideChange]);

  const prevSlide = useCallback(() => {
    if (heroProducts.length > 0) {
      handleSlideChange((currentSlide - 1 + heroProducts.length) % heroProducts.length);
    }
  }, [heroProducts.length, currentSlide, handleSlideChange]);

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0]?.clientX ?? null);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0]?.clientX ?? null);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Show skeleton only when no initial products and still loading via client fetch
  if (!heroProducts || heroProducts.length === 0) {
    // If initialProducts were empty, show skeleton while fetching
    if (initialProducts.length === 0) {
      return <HeroSkeleton />;
    }
    return null;
  }

  const currentProduct = heroProducts[currentSlide];

  if (!currentProduct) {
    return null;
  }

  // Get the first image from the first color variant
  const getProductImage = (product: HeroProduct): string => {
    const firstColor = product.colors?.[0];
    let imageUrl = "https://via.placeholder.com/1200x800?text=Product+Image";

    if (firstColor && product.images && product.images[firstColor]) {
      const imageData = product.images[firstColor];
      // Handle both string and array formats
      if (typeof imageData === 'string' && imageData.trim() !== '') {
        imageUrl = imageData;
      } else if (Array.isArray(imageData) && imageData.length > 0) {
        const validUrl = imageData.find((url: string) => url && typeof url === 'string' && url.trim() !== '');
        imageUrl = validUrl || imageUrl;
      }
    }

    return getCloudinaryUrl(imageUrl, {
      width: 1200,
      quality: 'auto',
      format: 'auto',
    });
  };

  const formatCategoryName = (slug: string): string => {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const headline = currentProduct.name;
  const subheadline =
    currentProduct.shortDescription?.trim() ||
    currentProduct.description?.trim() ||
    `Discover premium ${formatCategoryName(currentProduct.categorySlug)} built for your needs.`;

  return (
    <section
      className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-gradient-to-br from-[#F8F8F8] via-white to-[#F5E6D3]/30 overflow-hidden min-h-[600px] lg:min-h-[700px]"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-label="Featured products carousel"
      role="region"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FDB913]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#0A7EA4]/10 rounded-full blur-3xl" />
      </div>

      {/* Powered by Neuraltale badge */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 lg:top-8 lg:left-12 z-20">
        <div className="flex items-center gap-2 bg-[#001E3C] text-white px-3 py-1.5 rounded-full text-xs font-semibold">
          <Sparkles className="w-3 h-3 text-[#FDB913]" />
          <span>Powered by Neuraltale</span>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center min-h-[600px] lg:min-h-[700px] py-12 lg:py-0">

          {/* LEFT COLUMN - Text Content */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 lg:space-y-8 order-2 lg:order-1 z-10">
            <div className="space-y-6">

              {/* Headline & Subtitle */}
              <div
                className={`space-y-4 transition-all duration-500 ease-out ${isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                  }`}
              >              {/* Stock Status Badge */}
                {currentProduct.stockStatus && (() => {
                  const badge = getStockBadge(currentProduct.stockStatus);
                  return (
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${badge.bgColor} ${badge.textColor} text-sm font-semibold`}>
                      <span className={`w-2 h-2 rounded-full ${badge.dotColor} animate-pulse`}></span>
                      {badge.showOfferIcon && <Tag className="w-3 h-3" />}
                      {badge.label}
                    </div>
                  );
                })()}
                <h1 className="text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                  {headline}
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {subheadline}
                </p>
              </div>

              {/* CTA Buttons */}
              <div
                className={`flex flex-col sm:flex-row gap-4 transition-all duration-500 ease-out delay-100 ${isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                  }`}
              >
                <Link
                  href={`/products/${currentProduct.id}`}
                  className="inline-flex items-center justify-center gap-2 bg-[#FDB913] hover:bg-[#e5a811] text-[#001E3C] px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200 group shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                  Explore Product
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  href={`/products?category=${currentProduct.categorySlug}`}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm text-[#001E3C] border-2 border-[#001E3C] hover:bg-[#001E3C] hover:text-white transition-all duration-200"
                >
                  Browse {formatCategoryName(currentProduct.categorySlug)}
                </Link>
              </div>

              {/* Pagination Dots */}
              <div
                className={`hidden lg:flex items-center gap-2 pt-8 transition-all duration-500 ease-out delay-150 ${isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                  }`}
              >
                {heroProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlideChange(index)}
                    className={`transition-all duration-300 rounded-full ${index === currentSlide
                        ? "w-8 h-2 bg-[#FDB913]"
                        : "w-2 h-2 bg-gray-300 hover:bg-[#0A7EA4]"
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={index === currentSlide ? "true" : "false"}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Product Image */}
          <div className="lg:col-span-7 relative flex items-center justify-center order-1 lg:order-2">

            {/* Main Product Image */}
            <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[550px]">
              <div
                className={`relative w-full h-full transition-all duration-500 ease-out ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
                  }`}
              >
                <Image
                  src={getProductImage(currentProduct)}
                  alt={currentProduct.name}
                  fill
                  className="object-contain"
                  priority
                  sizes="50vw"
                />
              </div>
            </div>

            {/* Floating Product Card */}
            <div
              className={`absolute bottom-4 right-4 sm:bottom-8 sm:right-8 lg:bottom-12 lg:right-0 bg-white rounded-xl shadow-xl p-4 sm:p-5 w-[200px] sm:w-[240px] transition-all duration-500 ease-out delay-200 ${isTransitioning ? "opacity-0 translate-x-8" : "opacity-100 translate-x-0"
                }`}
            >
              <div className="relative w-full h-24 sm:h-28 mb-3 bg-gray-50 rounded-lg overflow-hidden">
                <Image
                  src={getProductImage(currentProduct)}
                  alt={currentProduct.name}
                  fill
                  className="object-contain p-2"
                />
              </div>

              {/* Stock Status Badge */}
              {currentProduct.stockStatus && (() => {
                const badge = getStockBadge(currentProduct.stockStatus);
                return (
                  <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${badge.bgColor} ${badge.textColor} text-xs font-semibold mb-2`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`}></span>
                    {badge.showOfferIcon && <Tag className="w-3 h-3" />}
                    {badge.label}
                  </div>
                );
              })()}

              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {currentProduct.name}
              </h3>

              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-xs text-gray-500">From</span>
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  {formatTZS(currentProduct.price)}
                </span>
              </div>

              <Link
                href={`/products/${currentProduct.id}`}
                className="block w-full text-center py-2 text-sm bg-[#001E3C] hover:bg-[#0A7EA4] text-white font-semibold rounded-lg transition-colors duration-200"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Bottom Right */}
      <div className="absolute bottom-8 right-4 sm:right-8 lg:right-12 flex items-center gap-3 z-20">
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white hover:bg-[#FDB913] text-[#001E3C] border border-gray-200 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white hover:bg-[#FDB913] text-[#001E3C] border border-gray-200 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Pagination Dots */}
      <div className="lg:hidden absolute bottom-8 left-4 sm:left-8 flex items-center gap-2 z-20">
        {heroProducts.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`transition-all duration-300 rounded-full ${index === currentSlide
                ? "w-6 h-2 bg-[#FDB913]"
                : "w-2 h-2 bg-gray-300 hover:bg-[#0A7EA4]"
              }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? "true" : "false"}
          />
        ))}
      </div>
      {/* Slide Counter - Top Right */}
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 lg:top-8 lg:right-12 text-sm font-medium z-20">
        <span className="text-[#001E3C] font-bold">{String(currentSlide + 1).padStart(2, "0")}</span>
        <span className="text-[#0A7EA4] mx-2">/</span>
        <span className="text-gray-500">{String(heroProducts.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
};

export default HeroSection;