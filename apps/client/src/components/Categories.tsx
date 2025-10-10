"use client";
import {
  Smartphone,
  Laptop,
  Headphones,
  Monitor,
  Gamepad2,
  Router,
  Watch,
  ShoppingBasket,
  Tablet,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const categories = [
  {
    name: "All",
    icon: <ShoppingBasket className="w-4 h-4" />,
    slug: "all",
    count: 26,
  },
  {
    name: "Smartphones",
    icon: <Smartphone className="w-4 h-4" />,
    slug: "smartphones",
    count: 6,
  },
  {
    name: "Laptops",
    icon: <Laptop className="w-4 h-4" />,
    slug: "laptops",
    count: 4,
  },
  {
    name: "Audio",
    icon: <Headphones className="w-4 h-4" />,
    slug: "audio",
    count: 4,
  },
  {
    name: "Gaming",
    icon: <Gamepad2 className="w-4 h-4" />,
    slug: "gaming-laptops",
    count: 2,
  },
  {
    name: "Tablets",
    icon: <Tablet className="w-4 h-4" />,
    slug: "tablets",
    count: 2,
  },
  {
    name: "Monitors",
    icon: <Monitor className="w-4 h-4" />,
    slug: "monitors",
    count: 2,
  },
  {
    name: "Accessories",
    icon: <Router className="w-4 h-4" />,
    slug: "accessories",
    count: 4,
  },
  {
    name: "Wearables",
    icon: <Watch className="w-4 h-4" />,
    slug: "wearables",
    count: 2,
  },
];

const Categories = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedCategory = searchParams.get("category") || "all";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse Categories</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-3">
        {categories.map((category) => {
          const isSelected = category.slug === selectedCategory;
          return (
            <button
              key={category.name}
              onClick={() => handleChange(category.slug)}
              className={`group flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className={`p-2 rounded-full transition-colors ${
                isSelected 
                  ? "bg-blue-100" 
                  : "bg-gray-100 group-hover:bg-gray-200"
              }`}>
                {category.icon}
              </div>
              <div className="text-center">
                <div className={`text-sm font-medium ${
                  isSelected ? "text-blue-700" : "text-gray-900"
                }`}>
                  {category.name}
                </div>
                <div className={`text-xs ${
                  isSelected ? "text-blue-600" : "text-gray-500"
                }`}>
                  {category.count} items
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
