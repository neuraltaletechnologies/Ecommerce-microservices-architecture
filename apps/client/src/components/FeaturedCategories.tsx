"use client";

import Link from "next/link";
import { Cpu, Smartphone, Headphones, Watch, Camera, Monitor, Gamepad2, Tablet } from "lucide-react";

const FeaturedCategories = () => {
  const categories = [
    {
      id: "smartphones",
      name: "Smartphones",
      description: "Latest flagship devices",
      icon: Smartphone,
      count: "50+ Products",
      color: "from-blue-500 to-purple-600"
    },
    {
      id: "audio",
      name: "Audio & Sound",
      description: "Premium headphones & speakers",
      icon: Headphones,
      count: "30+ Products",
      color: "from-green-500 to-teal-600"
    },
    {
      id: "wearables",
      name: "Wearables",
      description: "Smart watches & fitness trackers",
      icon: Watch,
      count: "25+ Products",
      color: "from-orange-500 to-red-600"
    },
    {
      id: "computing",
      name: "Computing",
      description: "Laptops, tablets & accessories",
      icon: Monitor,
      count: "40+ Products",
      color: "from-purple-500 to-pink-600"
    },
    {
      id: "gaming",
      name: "Gaming",
      description: "Consoles, accessories & gear",
      icon: Gamepad2,
      count: "35+ Products",
      color: "from-indigo-500 to-blue-600"
    },
    {
      id: "smart-home",
      name: "Smart Home",
      description: "IoT devices & automation",
      icon: Cpu,
      count: "45+ Products",
      color: "from-teal-500 to-green-600"
    },
    {
      id: "photography",
      name: "Photography",
      description: "Cameras & accessories",
      icon: Camera,
      count: "20+ Products",
      color: "from-yellow-500 to-orange-600"
    },
    {
      id: "tablets",
      name: "Tablets",
      description: "iPads & Android tablets",
      icon: Tablet,
      count: "15+ Products",
      color: "from-pink-500 to-rose-600"
    }
  ];

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="neural-text-3xl neural-font-bold neural-text-primary mb-4">
          Explore Categories
        </h2>
        <p className="neural-text-lg neural-text-secondary max-w-2xl mx-auto">
          Discover our extensive range of technology products across multiple categories
        </p>
      </div>

      <div className="neural-grid neural-grid-4 gap-6">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group"
            >
              <div className="neural-card neural-card-minimal h-full flex flex-col items-center text-center p-6 group-hover:border-neural-accent group-hover:shadow-lg">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="neural-text-lg neural-font-semibold neural-text-primary mb-2 group-hover:text-neural-accent transition-colors">
                  {category.name}
                </h3>
                
                <p className="neural-text-sm neural-text-secondary mb-3 flex-grow">
                  {category.description}
                </p>
                
                <span className="neural-text-xs neural-font-medium neural-text-muted bg-neural-surface-elevated px-3 py-1 rounded-full">
                  {category.count}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <Link href="/categories">
          <button className="neural-btn neural-btn-secondary">
            View All Categories
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FeaturedCategories;