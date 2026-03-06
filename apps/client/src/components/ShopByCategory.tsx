"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

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
  productCount?: number;
}

const categories: CategoryCard[] = [
  {
    id: 1,
    badge: "Premium",
    descriptor: "Crystal Clear",
    name: "AUDIO",
    bgColor: "bg-purple-600",
    textColor: "text-white",
    buttonColor: "bg-white text-purple-600 hover:bg-purple-50",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    link: "/products?category=audio",
    size: "small",
    productCount: 48,
  },
  {
    id: 2,
    badge: "Style",
    descriptor: "Modern",
    name: "WEARABLES",
    bgColor: "bg-orange-500",
    textColor: "text-white",
    buttonColor: "bg-white text-orange-500 hover:bg-orange-50",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    link: "/products?category=wearables",
    size: "small",
    productCount: 32,
  },
  {
    id: 3,
    badge: "Latest",
    descriptor: "Powerful",
    name: "PHONES",
    bgColor: "bg-green-600",
    textColor: "text-white",
    buttonColor: "bg-white text-green-600 hover:bg-green-50",
    image: "https://plus.unsplash.com/premium_photo-1680985551022-ad298e8a5f82?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "/products?category=smartphones",
    size: "small",
    productCount: 65,
  },
  {
    id: 4,
    badge: "Play",
    descriptor: "Immersive",
    name: "GAMING",
    bgColor: "bg-gray-900",
    textColor: "text-white",
    buttonColor: "bg-white text-gray-900 hover:bg-gray-100",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop",
    link: "/products?category=gaming",
    size: "large",
    productCount: 24,
  },
  {
    id: 5,
    badge: "Essential",
    descriptor: "Must-Have",
    name: "ACCESSORIES",
    bgColor: "bg-blue-600",
    textColor: "text-white",
    buttonColor: "bg-white text-blue-600 hover:bg-blue-50",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    link: "/products?category=accessories",
    size: "small",
    productCount: 36,
  },
  {
    id: 6,
    badge: "Performance",
    descriptor: "Portable",
    name: "LAPTOPS",
    bgColor: "bg-cyan-500",
    textColor: "text-white",
    buttonColor: "bg-white text-cyan-600 hover:bg-cyan-50",
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    link: "/products?category=laptops",
    size: "large",
    productCount: 87,
  },
];

const ShopByCategory = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#FDB913] rounded-full blur-3xl opacity-15"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#0A7EA4] rounded-full blur-3xl opacity-15"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FDB913]/20 to-[#0A7EA4]/20 rounded-full text-[#001E3C] text-sm font-semibold mb-4 border border-[#FDB913]/30">
            <Sparkles className="w-4 h-4 text-[#FDB913]" />
            EXPLORE CATEGORIES
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Shop By <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDB913] to-[#0A7EA4]">Category</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover your perfect tech companion. From premium audio to cutting-edge laptops,
            Neurashop has everything you need.
          </p>
        </div>

        {/* Category Grid - 2 Rows x 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={category.link}
              className={`${category.bgColor} ${category.textColor} rounded-3xl p-6 lg:p-8 relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] min-h-[300px] flex flex-col justify-between`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Background Image - Full Cover */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  unoptimized
                />
                {/* Enhanced Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 border border-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 border border-white/10 rounded-full"></div>

              {/* Badge */}
              <div className="flex items-center justify-between z-10 relative">
                <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold border border-white/20">
                  {category.badge}
                </div>
                {category.productCount && (
                  <div className="text-xs text-white/70 font-medium">
                    {category.productCount}+ Products
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="relative z-10 mt-auto">
                <p className="text-sm font-medium text-white/80 mb-1 tracking-wide">
                  {category.descriptor}
                </p>
                <h3 className="text-3xl lg:text-4xl font-bold mb-5 leading-tight tracking-tight">
                  {category.name}
                </h3>

                {/* Browse Button */}
                <button className={`${category.buttonColor} px-6 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2 transition-all duration-300 w-fit group-hover:gap-4 shadow-lg hover:shadow-xl`}>
                  Browse Collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Categories Link */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors group"
          >
            View All Categories
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;