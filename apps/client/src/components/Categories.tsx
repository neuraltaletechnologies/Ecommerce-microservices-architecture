"use client";
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
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const categories = [
  {
    name: "All",
    icon: <ShoppingBasket className="w-4 h-4" />,
    slug: "all",
    count: 150,
  },
  {
    name: "Laptops",
    icon: <Laptop className="w-4 h-4" />,
    slug: "laptops",
    count: 35,
    subcategories: ["Gaming Laptops", "Business Laptops", "Ultrabooks", "MacBooks"]
  },
  {
    name: "Desktops",
    icon: <Monitor className="w-4 h-4" />,
    slug: "desktops",
    count: 28,
    subcategories: ["Gaming PCs", "Workstations", "All-in-One PCs", "Mini PCs"]
  },
  {
    name: "Computer Monitors",
    icon: <Monitor className="w-4 h-4" />,
    slug: "monitors",
    count: 22,
    subcategories: ["Gaming Monitors", "4K Monitors", "Ultrawide", "Professional"]
  },
  {
    name: "Storage",
    icon: <HardDrive className="w-4 h-4" />,
    slug: "storage",
    count: 18,
    subcategories: ["SSDs", "Hard Drives", "External Storage", "NAS"]
  },
  {
    name: "Components",
    icon: <Cpu className="w-4 h-4" />,
    slug: "components",
    count: 42,
    subcategories: ["Processors", "Graphics Cards", "Motherboards", "RAM"]
  },
  {
    name: "Peripherals",
    icon: <Keyboard className="w-4 h-4" />,
    slug: "peripherals",
    count: 31,
    subcategories: ["Keyboards", "Mice", "Headsets", "Webcams"]
  },
  {
    name: "Networking",
    icon: <Network className="w-4 h-4" />,
    slug: "networking",
    count: 16,
    subcategories: ["Routers", "WiFi Adapters", "Switches", "Access Points"]
  },
  {
    name: "Gadgets",
    icon: <Smartphone className="w-4 h-4" />,
    slug: "gadgets",
    count: 25,
    subcategories: ["Smartphones", "Tablets", "Smartwatches", "Audio"]
  },
  {
    name: "Gaming",
    icon: <Gamepad2 className="w-4 h-4" />,
    slug: "gaming",
    count: 19,
    subcategories: ["Gaming Chairs", "Controllers", "VR Headsets", "Gaming Accessories"]
  },
  {
    name: "Software & Digital",
    icon: <Code className="w-4 h-4" />,
    slug: "software",
    count: 12,
    subcategories: ["Operating Systems", "Productivity", "Security", "Games"]
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Browse Categories</h3>
        <p className="text-sm text-gray-500 hidden sm:block">Find exactly what you&apos;re looking for</p>
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
                
                {/* Subcategories Tooltip */}
                {category.subcategories && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                      <div className="font-medium mb-1">Popular:</div>
                      <div className="space-y-0.5">
                        {category.subcategories.slice(0, 2).map((sub, index) => (
                          <div key={index} className="text-gray-300">• {sub}</div>
                        ))}
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                )}
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
          <span>{categories.reduce((sum, cat) => sum + (cat.slug === 'all' ? 0 : cat.count), 0)} Products • {categories.length - 1} Categories</span>
        </div>
      </div>
    </div>
  );
};

export default Categories;
