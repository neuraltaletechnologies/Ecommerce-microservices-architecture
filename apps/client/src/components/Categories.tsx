"use client";
import React, { Suspense, useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Grid3X3 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Category image mapping - matched to actual database categories
const categoryImages: Record<string, string> = {
  all: "", // Will use icon instead
  Laptops: "https://p7.hiclipart.com/preview/210/256/992/laptop-clip-art-laptop-notebook-png-image-thumbnail.jpg",
  "Computer Monitors": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&h=200&fit=crop&q=80",
  "Smart Phones": "https://p7.hiclipart.com/preview/450/269/77/iphone-4-iphone-8-plus-iphone-5-iphone-x-iphone-apple-thumbnail.jpg?w=200&h=200&fit=crop&q=80",
  Speaker: "https://p7.hiclipart.com/preview/168/674/441/loudspeaker-wireless-speaker-jbl-audio-bluetooth.jpg",
  Desktops: "https://in-files.apjonlinecdn.com/landingpages/content-pages/visid-rich-content/hp-omen-45l/images/w100_desktop_laptop_v1.png",
  Components: "https://p7.hiclipart.com/preview/866/368/879/laptop-dell-motherboard-microatx-asus-motherboard-thumbnail.jpg",
  Peripherals: "https://p7.hiclipart.com/preview/273/555/811/computer-mouse-optical-mouse-sensor-mousepad-microsoft-surface-logitech-gaming-mouse-thumbnail.jpg",
  Networking: "https://p7.hiclipart.com/preview/966/244/938/wireless-router-ieee-802-11ac-tp-link-router-thumbnail.jpg",
  Gadgets: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop&q=80",
  Gaming: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
  Storage: "https://as1.ftcdn.net/v2/jpg/03/15/67/52/1000_F_315675287_mbsCqFFs1MQ807oFkPDZD6D7xKJwj6AL.jpg",
  "Software & Services": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=200&fit=crop&q=80",
};

const normalizeCategoryKey = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const normalizedCategoryImages: Record<string, string> = Object.fromEntries(
  Object.entries(categoryImages).map(([key, image]) => [normalizeCategoryKey(key), image])
);

const getCategoryImage = (slug: string, name?: string): string => {
  const normalizedSlug = normalizeCategoryKey(slug);
  const normalizedName = normalizeCategoryKey(name || "");

  const aliases: Record<string, string> = {
    "smart-phones": "smart-phones",
    "computer-monitor": "computer-monitors",
    "software-services": "software-and-services",
  };

  const candidates = [
    normalizedSlug,
    aliases[normalizedSlug],
    normalizedName,
    aliases[normalizedName],
  ].filter(Boolean) as string[];

  for (const key of candidates) {
    if (normalizedCategoryImages[key]) {
      return normalizedCategoryImages[key];
    }
  }

  return normalizedCategoryImages.gadgets || "";
};

interface Category {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

interface CategoryWithImage extends Category {
  count?: number;
  image: string;
}

const CategoriesContent = () => {
  const [categories, setCategories] = useState<CategoryWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedCategory = searchParams.get("category") || "all";

  // Check scroll position and update indicators
  const updateScrollIndicators = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    
    // Calculate scroll progress (0-100)
    const maxScroll = scrollWidth - clientWidth;
    const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
    setScrollProgress(progress);
  }, []);

  // Scroll handlers
  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    const newScrollLeft = direction === "left" 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({ left: newScrollLeft, behavior: "smooth" });
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Fetch categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = "/api/categories";
        const res = await fetch(apiUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (res.ok) {
          const data: Category[] = await res.json();
          const totalProducts = data.reduce((sum, cat) => sum + (cat.count || 0), 0);

          const categoriesWithImages: CategoryWithImage[] = [
            {
              id: 0,
              name: "All",
              slug: "all",
              count: totalProducts,
              image: "",
            },
            ...data.map((category) => ({
              ...category,
              image: getCategoryImage(category.slug, category.name),
              count: category.count || 0,
            })),
          ];

          setCategories(categoriesWithImages);
        } else {
          setCategories([
            { id: 0, name: "All", slug: "all", count: 150, image: "" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([
          { id: 0, name: "All", slug: "all", count: 150, image: "" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", updateScrollIndicators);
    updateScrollIndicators();

    return () => container.removeEventListener("scroll", updateScrollIndicators);
  }, [categories, updateScrollIndicators]);

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (loading) {
    return (
      <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-4 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-[#1A1A1A]">Browse Categories</h3>
          <p className="text-sm text-[#666666] hidden sm:block">Loading categories...</p>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-[90px]">
              <div className="animate-pulse bg-gray-50 rounded-xl p-3 h-[120px]">
                <div className="bg-gray-200 rounded-full w-14 h-14 mx-auto mb-2" />
                <div className="bg-gray-200 h-4 rounded w-16 mx-auto mb-2" />
                <div className="bg-gray-200 h-3 rounded w-8 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-[#E5E5E5] rounded-2xl p-4 mb-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-[#1A1A1A]">Browse Categories</h3>
        <p className="text-sm text-[#666666] hidden sm:block">
          Find exactly what you&apos;re looking for
        </p>
      </div>

      {/* Scrollable Container with Arrows */}
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-[#E5E5E5] flex items-center justify-center transition-all duration-200 hover:shadow-xl hover:border-[#CCCCCC] ${
            canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-[#1A1A1A]" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-[#E5E5E5] flex items-center justify-center transition-all duration-200 hover:shadow-xl hover:border-[#CCCCCC] ${
            canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-[#1A1A1A]" />
        </button>

        {/* Scrollable Categories */}
        <div
          ref={scrollContainerRef}
          className={`flex gap-4 overflow-x-auto px-1 scroll-smooth no-scrollbar ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category) => {
            const isSelected = category.slug === selectedCategory;
            const isAllCategory = category.slug === "all";

            return (
              <button
                key={category.slug}
                onClick={() => !isDragging && handleChange(category.slug)}
                className={`flex-shrink-0 flex flex-col items-center rounded-xl transition-all duration-200 min-w-[90px] ${
                  isSelected
                    ? "bg-white"
                    : "hover:bg-gray-50"
                }`}
                aria-pressed={isSelected}
                aria-label={`${category.name} category with ${category.count} products`}
              >
                {/* Circular Image Container */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 overflow-hidden border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-[#0066FF] ring-4 ring-blue-100 shadow-lg"
                      : "border-[#E5E5E5] hover:border-[#CCCCCC] hover:shadow-md"
                  } ${isAllCategory ? (isSelected ? "bg-blue-100" : "bg-gray-100") : "bg-white"}`}
                >
                  {isAllCategory ? (
                    <Grid3X3
                      className={`w-6 h-6 ${
                        isSelected ? "text-[#0066FF]" : "text-[#666666]"
                      }`}
                    />
                  ) : (
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={56}
                      height={56}
                      className="object-contain w-full h-full p-1"
                      draggable={false}
                    />
                  )}
                </div>

                {/* Category Name */}
                <span
                  className={`text-xs font-medium mb-0.5 text-center line-clamp-1 ${
                    isSelected ? "text-[#0066FF]" : "text-[#1A1A1A]"
                  }`}
                >
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-1 bg-[#E5E5E5] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1A1A1A] rounded-full transition-all duration-150 ease-out"
            style={{
              width: '25%',
              transform: `translateX(${scrollProgress * 3}%)`,
            }}
          />
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-3 pt-3 border-t border-[#E5E5E5]">
        <p className="text-center text-sm text-[#666666]">
          <span className="font-medium text-[#1A1A1A]">
            {categories.find((cat) => cat.slug === "all")?.count || 0}
          </span>{" "}
          Products •{" "}
          <span className="font-medium text-[#1A1A1A]">
            {categories.length > 0 ? categories.length - 1 : 0}
          </span>{" "}
          Categories
        </p>
      </div>
    </div>
  );
};

const Categories = () => {
  return (
    <Suspense fallback={<div className="w-full h-12" />}>
      <CategoriesContent />
    </Suspense>
  );
};

export default Categories;
