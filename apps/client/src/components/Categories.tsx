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
  Sparkles,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

// Icon mapping for categories
const iconMap: Record<string, React.ReactElement> = {
  all: <Sparkles className="w-6 h-6" />,
  smartphones: <Smartphone className="w-6 h-6" />,
  laptops: <Laptop className="w-6 h-6" />,
  "gaming-laptops": <Gamepad2 className="w-6 h-6" />,
  tablets: <Tablet className="w-6 h-6" />,
  monitors: <Monitor className="w-6 h-6" />,
  audio: <Headphones className="w-6 h-6" />,
  accessories: <Mouse className="w-6 h-6" />,
  wearables: <Watch className="w-6 h-6" />,
  "graphics-cards": <Monitor className="w-6 h-6" />,
  processors: <Cpu className="w-6 h-6" />,
  ram: <HardDrive className="w-6 h-6" />,
  ssds: <HardDrive className="w-6 h-6" />,
  "hard-drives": <HardDrive className="w-6 h-6" />,
  keyboards: <Keyboard className="w-6 h-6" />,
  mice: <Mouse className="w-6 h-6" />,
  webcams: <Camera className="w-6 h-6" />,
  speakers: <Speaker className="w-6 h-6" />,
  networking: <Network className="w-6 h-6" />,
  routers: <Wifi className="w-6 h-6" />,
  "wifi-adapters": <Wifi className="w-6 h-6" />,
  storage: <HardDrive className="w-6 h-6" />,
  "gaming-chairs": <Gamepad2 className="w-6 h-6" />,
  desks: <Grid3X3 className="w-6 h-6" />,
  lighting: <Lightbulb className="w-6 h-6" />,
  cables: <Zap className="w-6 h-6" />,
  "power-supplies": <Zap className="w-6 h-6" />,
  cooling: <Zap className="w-6 h-6" />,
  cases: <Package className="w-6 h-6" />,
  motherboards: <Cpu className="w-6 h-6" />,
  "smart-home": <Home className="w-6 h-6" />,
  drones: <Car className="w-6 h-6" />,
  "vr-headsets": <Gamepad2 className="w-6 h-6" />,
  "action-cameras": <Camera className="w-6 h-6" />,
  "home-security": <Shield className="w-6 h-6" />,
  "fitness-tech": <Watch className="w-6 h-6" />,
  "productivity-software": <Code className="w-6 h-6" />,
  "security-software": <Shield className="w-6 h-6" />,
  "digital-games": <Gamepad2 className="w-6 h-6" />,
};

// Gradient backgrounds for categories (high-end tech feel)
const categoryImages: Record<string, string> = {
  all: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop",
  smartphones: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
  laptops: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
  "gaming-laptops": "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=400&h=300&fit=crop",
  tablets: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=300&fit=crop",
  monitors: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop",
  audio: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
  accessories: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=300&fit=crop",
  wearables: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=300&fit=crop",
  "graphics-cards": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop",
  processors: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=300&fit=crop",
  ram: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=300&fit=crop",
  ssds: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop",
  "hard-drives": "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400&h=300&fit=crop",
  keyboards: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop",
  mice: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop",
  webcams: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=400&h=300&fit=crop",
  speakers: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
  networking: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&h=300&fit=crop",
  routers: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&h=300&fit=crop",
  "wifi-adapters": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop",
  storage: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop",
  "gaming-chairs": "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=300&fit=crop",
  desks: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop",
  lighting: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop",
  cables: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  "power-supplies": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=300&fit=crop",
  cooling: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&h=300&fit=crop",
  cases: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=300&fit=crop",
  motherboards: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop",
  "smart-home": "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop",
  drones: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop",
  "vr-headsets": "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&h=300&fit=crop",
  "action-cameras": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop",
  "home-security": "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop",
  "fitness-tech": "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=400&h=300&fit=crop",
  "productivity-software": "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=400&h=300&fit=crop",
  "security-software": "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
  "digital-games": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
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
  imageUrl: string;
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
              name: "All Products",
              slug: "all",
              count: totalProducts,
              icon: iconMap.all!,
              imageUrl: categoryImages.all || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop",
            },
            ...data.map(category => ({
              ...category,
              icon: iconMap[category.slug] || <Package className="w-6 h-6" />,
              count: category.count || 0,
              imageUrl: categoryImages[category.slug] || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop",
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
              name: "All Products",
              slug: "all",
              count: 150,
              icon: iconMap.all!,
              imageUrl: categoryImages.all || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop",
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
            name: "All Products",
            slug: "all",
            count: 150,
            icon: iconMap.all!,
            imageUrl: categoryImages.all || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop",
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
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Browse Categories</h3>
          <p className="text-sm text-gray-500 hidden sm:block">Loading...</p>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-24">
              <div className="animate-pulse bg-gray-200 rounded-xl h-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Browse Categories
        </h3>
        <div className="text-sm text-gray-500 hidden sm:block">
          {categories.length > 0 ? categories.length - 1 : 0} categories
        </div>
      </div>
      
      {/* Horizontal Scrollable Categories with Images */}
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const isSelected = category.slug === selectedCategory;
            return (
              <button
                key={category.slug}
                onClick={() => handleChange(category.slug)}
                className={`group relative flex-shrink-0 w-24 overflow-hidden transition-all duration-300 ${
                  isSelected
                    ? "ring-2 ring-blue-500 ring-offset-2 shadow-xl"
                    : "hover:shadow-lg"
                }`}
              >
                {/* Background Image - Top Section */}
                <div className="relative h-18 w-18 mx-auto overflow-hidden rounded-full">
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="56px"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40"></div>

                  {/* Selection Checkmark */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5">
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Section - Horizontal Layout */}
                <div className={`py-1.5 flex items-center justify-between gap-1 transition-colors duration-300 ${
                  isSelected 
                    ? "bg-blue-50" 
                    : "bg-white group-hover:bg-gray-50"
                }`}>
                  {/* Name */}
                  <h3 className={`text-[10px] font-semibold text-left line-clamp-1 flex-1 transition-colors duration-300 ${
                    isSelected ? "text-blue-700" : "text-gray-900"
                  }`}>
                    {category.name}
                  </h3>

                  {/* Count Badge */}
                  <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors duration-300 ${
                    isSelected
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {category.count}
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span className="font-semibold text-gray-900">{categories.find(cat => cat.slug === 'all')?.count || 0}</span>
            <span>Products</span>
          </div>
          <div className="w-px h-3 bg-gray-300"></div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-500" />
            <span>Premium Tech</span>
          </div>
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
