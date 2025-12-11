"use client";
import React, { Suspense, useEffect, useState } from "react";
import {
  Smartphone,
  Laptop,
  Monitor,
  Gamepad2,
  ShoppingBasket,
  HardDrive,
  Cpu,
  Keyboard,
  Network,
  Code,
  Tablet,
  Mouse,
  Headphones,
  Watch,
  Car,
  Home,
  Camera,
  Wifi,
  Speaker,
  Lightbulb,
  Shield,
  Zap,
  Package,
  Grid3X3,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Icon mapping for categories
const iconMap: Record<string, React.ReactElement> = {
  all: <ShoppingBasket className="w-4 h-4" />,
  smartphones: <Smartphone className="w-4 h-4" />,
  laptops: <Laptop className="w-4 h-4" />,
  "gaming-laptops": <Gamepad2 className="w-4 h-4" />,
  tablets: <Tablet className="w-4 h-4" />,
  monitors: <Monitor className="w-4 h-4" />,
  audio: <Headphones className="w-4 h-4" />,
  accessories: <Mouse className="w-4 h-4" />,
  wearables: <Watch className="w-4 h-4" />,
  "graphics-cards": <Monitor className="w-4 h-4" />,
  processors: <Cpu className="w-4 h-4" />,
  ram: <HardDrive className="w-4 h-4" />,
  ssds: <HardDrive className="w-4 h-4" />,
  "hard-drives": <HardDrive className="w-4 h-4" />,
  keyboards: <Keyboard className="w-4 h-4" />,
  mice: <Mouse className="w-4 h-4" />,
  webcams: <Camera className="w-4 h-4" />,
  speakers: <Speaker className="w-4 h-4" />,
  networking: <Network className="w-4 h-4" />,
  routers: <Wifi className="w-4 h-4" />,
  "wifi-adapters": <Wifi className="w-4 h-4" />,
  storage: <HardDrive className="w-4 h-4" />,
  "gaming-chairs": <Gamepad2 className="w-4 h-4" />,
  desks: <Grid3X3 className="w-4 h-4" />,
  lighting: <Lightbulb className="w-4 h-4" />,
  cables: <Zap className="w-4 h-4" />,
  "power-supplies": <Zap className="w-4 h-4" />,
  cooling: <Zap className="w-4 h-4" />,
  cases: <Package className="w-4 h-4" />,
  motherboards: <Cpu className="w-4 h-4" />,
  "smart-home": <Home className="w-4 h-4" />,
  drones: <Car className="w-4 h-4" />,
  "vr-headsets": <Gamepad2 className="w-4 h-4" />,
  "action-cameras": <Camera className="w-4 h-4" />,
  "home-security": <Shield className="w-4 h-4" />,
  "fitness-tech": <Watch className="w-4 h-4" />,
  "productivity-software": <Code className="w-4 h-4" />,
  "security-software": <Shield className="w-4 h-4" />,
  "digital-games": <Gamepad2 className="w-4 h-4" />,
};

interface Category {
  id: number;
  name: string;
  slug: string;
  count?: number; // Now coming from the API
}

interface CategoryWithCount extends Category {
  count?: number;
  icon: React.ReactElement;
}

// We'll fetch categories dynamically from the database

const CategoriesContent = () => {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedCategory = searchParams.get("category") || "all";

  // Fetch categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setDebugInfo('FETCH STARTED');
        console.log('FETCH STARTED - Categories component mounting');
        console.log('Fetching categories from:', `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/categories`);
        const apiUrl = '/api/categories'; // Use Next.js API route to avoid CORS
        console.log('API URL:', apiUrl);
        console.log('Environment variable set:', !!process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL);
        
        setDebugInfo('FETCHING...');
        const res = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        });
        console.log('Response received:', res);
        console.log('Response status:', res.status);
        console.log('Response ok:', res.ok);
        
        if (res.ok) {
          setDebugInfo('PARSING DATA...');
          const data: Category[] = await res.json();
          console.log('Categories data received:', data);
          console.log('Categories data length:', data.length);
          console.log('First few categories:', data.slice(0, 3));
          
          // Calculate total products from all categories
          const totalProducts = data.reduce((sum, cat) => sum + (cat.count || 0), 0);
          console.log('Total products from categories:', totalProducts);
          
          setDebugInfo(`SUCCESS: ${data.length} categories loaded`);
          // Add "All" category and map icons
          const categoriesWithIcons: CategoryWithCount[] = [
            {
              id: 0,
              name: "All",
              slug: "all",
              count: totalProducts,
              icon: iconMap.all!,
            },
            ...data.map(category => ({
              ...category,
              icon: iconMap[category.slug] || <Package className="w-4 h-4" />,
              count: category.count || 0, // Use real count from database
            }))
          ];
          
          setCategories(categoriesWithIcons);
          console.log('Categories loaded successfully:', categoriesWithIcons.length, 'total categories');
          console.log('Final categories array:', categoriesWithIcons.map(c => c.name));
        } else {
          setDebugInfo(`FETCH FAILED: ${res.status} ${res.statusText}`);
          console.error('Failed to fetch categories:', res.statusText);
          // Fallback to default categories if fetch fails
          setCategories([
            {
              id: 0,
              name: "All",
              slug: "all",
              count: 150,
              icon: iconMap.all!,
            }
          ]);
        }
      } catch (error) {
        setDebugInfo(`ERROR: ${error instanceof Error ? error.message : String(error)}`);
        console.error("Error fetching categories:", error);
        console.error("Error details:", error instanceof Error ? error.message : String(error));
        // Fallback to default "All" category if API fails
        setCategories([
          {
            id: 0,
            name: "All",
            slug: "all",
            count: 150,
            icon: iconMap.all!,
          }
        ]);
        console.log('Using fallback categories due to error');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Browse Categories</h3>
          <p className="text-sm text-gray-500 hidden sm:block">Loading categories...</p>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 min-w-[100px]">
              <div className="animate-pulse bg-gray-200 rounded-xl h-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Browse Categories 
        </h3>
        <div className="text-sm text-gray-500 hidden sm:block">
          Find exactly what you&apos;re looking for
        </div>
      </div>
      
      {/* Horizontal Scrollable Categories */}
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((category) => {
            const isSelected = category.slug === selectedCategory;
            return (
              <div key={category.name} className="relative group flex-shrink-0">
                <button
                  onClick={() => handleChange(category.slug)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 hover:shadow-lg min-w-[100px] ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                      : "border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className={`p-2 rounded-full transition-all duration-200 ${
                    isSelected 
                      ? "bg-blue-100 text-blue-600" 
                      : "bg-gray-100 group-hover:bg-blue-100 group-hover:text-blue-600"
                  }`}>
                    {category.icon}
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-medium mb-1 ${
                      isSelected ? "text-blue-700" : "text-gray-900"
                    }`}>
                      {category.name}
                    </div>
                    <div className={`text-xs ${
                      isSelected ? "text-blue-600" : "text-gray-500"
                    }`}>
                      {category.count}
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
        
        {/* Scroll indicators */}
        <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
        <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
      </div>
      
      {/* Compact Stats */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-center text-xs text-gray-600">
          <span>
            {categories.find(cat => cat.slug === 'all')?.count || 0} Products • {categories.length > 0 ? categories.length - 1 : 0} Categories
          </span>
        </div>
       
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
