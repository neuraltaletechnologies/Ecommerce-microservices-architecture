"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CategoryCard {
  id: number;
  badge: string;
  descriptor: string;
  name: string;
  bgColor: string;
  textColor: string;
  buttonColor: string;
  image: string;
  link: string;
  size: "small" | "large";
}

const categories: CategoryCard[] = [
  {
    id: 1,
    badge: "Enjoy",
    descriptor: "With",
    name: "HEADPHONE",
    bgColor: "bg-purple-600",
    textColor: "text-white",
    buttonColor: "bg-white text-purple-600 hover:bg-purple-50",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    link: "/products?category=audio",
    size: "small",
  },
  {
    id: 2,
    badge: "New",
    descriptor: "Smart",
    name: "WATCH",
    bgColor: "bg-orange-500",
    textColor: "text-white",
    buttonColor: "bg-white text-orange-500 hover:bg-orange-50",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    link: "/products?category=wearables",
    size: "small",
  },
  {
    id: 3,
    badge: "Latest",
    descriptor: "Smart",
    name: "PHONES",
    bgColor: "bg-green-600",
    textColor: "text-white",
    buttonColor: "bg-white text-green-600 hover:bg-green-50",
    image: "https://plus.unsplash.com/premium_photo-1680985551022-ad298e8a5f82?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "/products?category=phones",
    size: "small",
  },
 
  {
    id: 4,
    badge: "Play",
    descriptor: "Game",
    name: "CONSOLE",
    bgColor: "bg-gray-900",
    textColor: "text-white",
    buttonColor: "bg-white text-gray-900 hover:bg-gray-100",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
    link: "/products?category=gaming",
    size: "large",
  },
  {
    id: 5,
    badge: "New",
    descriptor: "Smart",
    name: "SPEAKER",
    bgColor: "bg-blue-600",
    textColor: "text-white",
    buttonColor: "bg-white text-blue-600 hover:bg-blue-50",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    link: "/products?category=audio",
    size: "small",
  },
   
   {
    id: 6,
    badge: "Productivity",
    descriptor: "Gaming",
    name: "LAPTOP",
    bgColor: "bg-cyan-500",
    textColor: "text-white",
    buttonColor: "bg-white text-cyan-600 hover:bg-cyan-50",
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "/products?category=laptops",
    size: "large",
  },
];

const ShopByCategory = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 tracking-wider uppercase mb-2">
            CATEGORY
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Shop By Category
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our gallery to learn more about our amazing products and their features.
          </p>
        </div>

        {/* Category Grid - 2 Rows x 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Row 1: 3 Cards */}
          {categories.slice(0, 3).map((category) => (
            <Link
              key={category.id}
              href={category.link}
              className={`${category.bgColor} ${category.textColor} rounded-2xl p-6 lg:p-8 relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] min-h-[280px] flex flex-col justify-between`}
            >
              {/* Background Image - Full Cover */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/20"></div>
              </div>

              {/* Badge */}
              <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold mb-4 w-fit z-10 relative">
                {category.badge}
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <p className="text-sm font-medium opacity-90 mb-2">
                    {category.descriptor}
                  </p>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                    {category.name}
                  </h3>
                </div>

                {/* Browse Button */}
                <button className={`${category.buttonColor} px-5 py-2.5 rounded-lg font-semibold text-sm inline-flex items-center gap-2 transition-all duration-300 w-fit group-hover:gap-3`}>
                  Browse
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </Link>
          ))}

          {/* Row 2: 3 Cards */}
          {categories.slice(3, 6).map((category) => (
            <Link
              key={category.id}
              href={category.link}
              className={`${category.bgColor} ${category.textColor} rounded-2xl p-6 lg:p-8 relative overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] min-h-[280px] flex flex-col justify-between`}
            >
              {/* Background Image - Full Cover */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/20"></div>
              </div>

              {/* Badge */}
              <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold mb-4 w-fit z-10 relative">
                {category.badge}
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <p className="text-sm font-medium opacity-90 mb-2">
                    {category.descriptor}
                  </p>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                    {category.name}
                  </h3>
                </div>

                {/* Browse Button */}
                <button className={`${category.buttonColor} px-5 py-2.5 rounded-lg font-semibold text-sm inline-flex items-center gap-2 transition-all duration-300 w-fit group-hover:gap-3`}>
                  Browse
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
