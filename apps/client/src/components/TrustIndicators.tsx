"use client";

import { Star, Shield, Truck, RotateCcw } from "lucide-react";
import Image from "next/image";

const TrustIndicators = () => {
  const trustMetrics = [
    {
      icon: <Star className="w-5 h-5 text-yellow-500 fill-current" />,
      rating: "4.9/5",
      label: "Rating",
      description: "12.8K reviews"
    },
    {
      icon: <Truck className="w-5 h-5 text-green-600" />,
      label: "Free Shipping",
      description: "Orders 115K+"
    },
    {
      icon: <Shield className="w-5 h-5 text-blue-600" />,
      label: "Secure Pay",
      description: "SSL encrypted"
    },
    {
      icon: <RotateCcw className="w-5 h-5 text-purple-600" />,
      label: "Easy Returns",
      description: "30-day policy"
    }
  ];

  const brands = [
    {
      name: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    },
    {
      name: "Samsung",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    },
    {
      name: "Sony",
      logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg",
    },
    {
      name: "Dell",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg",
    },
    {
      name: "HP",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg",
    },
    {
      name: "Lenovo",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/03/Lenovo_Global_Corporate_Logo.svg",
    },
    {
      name: "Asus",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg",
    },
    {
      name: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    },
    {
      name: "LG",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg",
    },
    {
      name: "Canon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Canon_wordmark.svg",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Trust Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {trustMetrics.map((metric, index) => (
            <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex-shrink-0">
                {metric.icon}
              </div>
              <div className="min-w-0">
                {metric.rating && (
                  <div className="text-lg font-bold text-gray-900">
                    {metric.rating}
                  </div>
                )}
                <div className="font-semibold text-gray-900 text-sm truncate">
                  {metric.label}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {metric.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Brand Logo Cloud */}
        <div className="text-center mb-6">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Trusted Brands We Partner With
          </p>
        </div>
        
        <div className="relative overflow-hidden">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>
          
          {/* Scrolling Logo Container */}
          <div className="flex animate-scroll hover:pause-animation">
            {/* First set of logos */}
            <div className="flex gap-12 items-center justify-center min-w-max px-6">
              {brands.map((brand, index) => (
                <div
                  key={`first-${index}`}
                  className="relative w-20 h-14 hover:scale-110 transition-transform duration-300 flex items-center justify-center flex-shrink-0"
                  title={brand.name}
                >
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
              ))}
            </div>
            
            {/* Duplicate set for seamless loop */}
            <div className="flex gap-12 items-center justify-center min-w-max px-6">
              {brands.map((brand, index) => (
                <div
                  key={`second-${index}`}
                  className="relative w-20 h-14 hover:scale-110 transition-transform duration-300 flex items-center justify-center flex-shrink-0"
                  title={brand.name}
                >
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add custom CSS for animation */}
        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .animate-scroll {
            animation: scroll 30s linear infinite;
          }

          .hover\:pause-animation:hover {
            animation-play-state: paused;
          }
        `}</style>

        {/* Bottom Trust Line */}
        <div className="flex flex-wrap justify-center items-center gap-6 mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>256-bit SSL</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span>50K+ Happy Customers</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Shield className="w-4 h-4 text-green-600" />
            <span>PCI DSS Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Truck className="w-4 h-4 text-blue-600" />
            <span>Trusted Delivery Partners</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;