"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star, Zap, Headphones, Gamepad2 } from "lucide-react";

interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  specifications: string[];
  keyFeatures: string[];
  availability: "In Stock" | "Limited Stock" | "Pre-Order";
  rating: number;
  category: string;
  description: string;
}

const featuredProducts: FeaturedProduct[] = [
  {
    id: "logitech-mx-master-3",
    name: "Logitech MX Master 3",
    price: 99.99,
    originalPrice: 129.99,
    image: "/products/logitech-mx-master-3.jpg",
    specifications: [
      "4000 DPI Darkfield sensor",
      "70-day battery life",
      "USB-C quick charging",
      "Bluetooth & USB connectivity"
    ],
    keyFeatures: [
      "Ultra-precise scrolling",
      "Cross-computer control",
      "Customizable buttons",
      "Ergonomic design"
    ],
    availability: "In Stock",
    rating: 4.8,
    category: "Accessories",
    description: "The ultimate precision mouse for power users and creative professionals"
  },
  {
    id: "macbook-pro-m4",
    name: "MacBook Pro M4 Chip",
    price: 1999.99,
    originalPrice: 2199.99,
    image: "/products/macbook-pro-m4.jpg",
    specifications: [
      "Apple M4 chip with 10-core CPU",
      "16-core Neural Engine",
      "16GB unified memory",
      "512GB SSD storage"
    ],
    keyFeatures: [
      "20-hour battery life",
      "Liquid Retina XDR display",
      "1080p FaceTime HD camera",
      "Six-speaker sound system"
    ],
    availability: "In Stock",
    rating: 4.9,
    category: "Laptops",
    description: "Supercharged for pros with the revolutionary M4 chip"
  },
  {
    id: "airpods-pro",
    name: "AirPods Pro (3rd Gen)",
    price: 249.99,
    originalPrice: 279.99,
    image: "/products/airpods-pro.jpg",
    specifications: [
      "Active Noise Cancellation",
      "Transparency mode",
      "Spatial Audio support",
      "H2 chip for enhanced audio"
    ],
    keyFeatures: [
      "Up to 6 hours listening time",
      "Personalized Spatial Audio",
      "Touch control",
      "Sweat and water resistant"
    ],
    availability: "In Stock",
    rating: 4.7,
    category: "Audio",
    description: "Premium wireless earbuds with industry-leading noise cancellation"
  },
  {
    id: "logitech-k380-mini",
    name: "Logitech K380 Mini Keyboard",
    price: 39.99,
    originalPrice: 49.99,
    image: "/products/logitech-k380.jpg",
    specifications: [
      "Bluetooth wireless connection",
      "Multi-device pairing (3 devices)",
      "Round concave keys",
      "2-year battery life"
    ],
    keyFeatures: [
      "Easy-Switch technology",
      "Cross-platform compatibility",
      "Compact & portable design",
      "Silent typing experience"
    ],
    availability: "In Stock",
    rating: 4.6,
    category: "Accessories",
    description: "Compact wireless keyboard for seamless multi-device typing"
  },
  {
    id: "gaming-chair-pro",
    name: "ErgoMax Gaming Chair Pro",
    price: 299.99,
    originalPrice: 399.99,
    image: "/products/gaming-chair-pro.jpg",
    specifications: [
      "Premium PU leather upholstery",
      "High-density foam padding",
      "Steel frame construction",
      "360° swivel with smooth casters"
    ],
    keyFeatures: [
      "Adjustable lumbar support",
      "4D armrests",
      "Reclining up to 135°",
      "Weight capacity: 300 lbs"
    ],
    availability: "Limited Stock",
    rating: 4.5,
    category: "Gaming",
    description: "Professional gaming chair designed for extended comfort sessions"
  },
  {
    id: "gaming-laptop-asus",
    name: "ASUS ROG Strix G16",
    price: 1299.99,
    originalPrice: 1499.99,
    image: "/products/asus-rog-strix.jpg",
    specifications: [
      "Intel Core i7-13650HX",
      "NVIDIA GeForce RTX 4060",
      "16GB DDR5 RAM",
      "512GB PCIe 4.0 SSD"
    ],
    keyFeatures: [
      "16\" FHD 165Hz display",
      "RGB backlit keyboard",
      "Advanced cooling system",
      "Wi-Fi 6E connectivity"
    ],
    availability: "Pre-Order",
    rating: 4.8,
    category: "Gaming Laptops",
    description: "High-performance gaming laptop for competitive gaming and content creation"
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const currentProduct = featuredProducts[currentSlide];

  if (!currentProduct) {
    return <div>Loading...</div>;
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Audio":
        return <Headphones className="w-5 h-5" />;
      case "Gaming":
      case "Gaming Laptops":
        return <Gamepad2 className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #60a5fa 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #c084fc 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Product Content */}
          <div className="space-y-8">
            {/* Brand Header */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-blue-300">
                {getCategoryIcon(currentProduct.category)}
                <span className="text-sm font-medium uppercase tracking-wider">
                  {currentProduct.category}
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                {currentProduct.name}
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                {currentProduct.description}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(currentProduct.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{currentProduct.rating}</span>
              <span className="text-blue-200">(2,847 reviews)</span>
            </div>

            {/* Key Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-200">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentProduct.keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                    <span className="text-sm text-blue-100">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <div className="flex items-baseline space-x-4">
                <span className="text-4xl font-bold text-white">
                  ${currentProduct.price}
                </span>
                {currentProduct.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ${currentProduct.originalPrice}
                  </span>
                )}
                {currentProduct.originalPrice && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                    SAVE ${(currentProduct.originalPrice - currentProduct.price).toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    currentProduct.availability === "In Stock"
                      ? "bg-green-400"
                      : currentProduct.availability === "Limited Stock"
                      ? "bg-yellow-400"
                      : "bg-blue-400"
                  }`}
                />
                <span className="text-sm font-medium">{currentProduct.availability}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/products/${currentProduct.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 text-center"
              >
                Shop Now
              </Link>
              <Link
                href={`/products/${currentProduct.id}`}
                className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 text-center"
              >
                View Details
              </Link>
            </div>
          </div>

          {/* Product Image */}
          <div className="relative">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
              <Image
                src={currentProduct.image}
                alt={currentProduct.name}
                fill
                className="object-cover"
                priority
              />
              {/* Floating Spec Card */}
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-4 max-w-xs">
                <h4 className="font-semibold text-sm mb-2">Specifications</h4>
                <ul className="space-y-1">
                  {currentProduct.specifications.slice(0, 3).map((spec, index) => (
                    <li key={index} className="text-xs text-gray-300">
                      • {spec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center items-center mt-12 space-x-4">
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            aria-label="Previous product"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Slide Indicators */}
          <div className="flex space-x-2">
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
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
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            aria-label="Next product"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;