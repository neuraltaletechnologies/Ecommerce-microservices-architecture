"use client";

import { Battery, Zap, Shield, Wifi, Globe, Smartphone } from "lucide-react";

const TechHighlights = () => {
  const highlights = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Experience blazing-fast performance with our cutting-edge processors and optimized software",
      stats: "99.9% Uptime"
    },
    {
      icon: Battery,
      title: "All-Day Battery",
      description: "Extended battery life that keeps you connected and productive throughout the day",
      stats: "48h+ Battery"
    },
    {
      icon: Shield,
      title: "Advanced Security",
      description: "Military-grade encryption and biometric authentication for ultimate protection",
      stats: "256-bit Encryption"
    },
    {
      icon: Wifi,
      title: "Seamless Connectivity",
      description: "5G, Wi-Fi 6E, and Bluetooth 5.3 for instant connections anywhere",
      stats: "5G Ready"
    },
    {
      icon: Globe,
      title: "Global Compatibility",
      description: "Works seamlessly across different regions and network standards worldwide",
      stats: "200+ Countries"
    },
    {
      icon: Smartphone,
      title: "Smart Integration",
      description: "AI-powered features that adapt to your usage patterns and preferences",
      stats: "AI Enhanced"
    }
  ];

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="neural-text-3xl neural-font-bold neural-text-primary mb-4">
          Tech Highlights
        </h2>
        <p className="neural-text-lg neural-text-secondary max-w-3xl mx-auto">
          Discover the cutting-edge features and innovations in our premium technology products.
        </p>
      </div>

      <div className="neural-grid neural-grid-3 gap-8">
        {highlights.map((highlight, index) => {
          const IconComponent = highlight.icon;
          return (
            <div 
              key={index}
              className={`neural-card bg-neural-surface border-0 text-center neural-animate-fade-in`}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-neural-accent/10 rounded-full flex items-center justify-center mb-4">
                  <IconComponent className="w-8 h-8 text-neural-accent" />
                </div>
                
                <h3 className="neural-text-xl neural-font-semibold neural-text-primary mb-3">
                  {highlight.title}
                </h3>
                
                <p className="neural-text-secondary mb-4 leading-relaxed">
                  {highlight.description}
                </p>
                
                <div className="bg-neural-accent/5 text-neural-accent neural-text-sm neural-font-medium px-4 py-2 rounded-full">
                  {highlight.stats}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Stats Section */}
      <div className="mt-16 bg-neural-gradient rounded-2xl p-8 text-white text-center">
        <h3 className="neural-text-2xl neural-font-bold mb-8">
          Trusted by Tech Enthusiasts Worldwide
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="neural-text-3xl neural-font-bold mb-2">50K+</div>
            <div className="neural-text-sm opacity-90">Happy Customers</div>
          </div>
          <div>
            <div className="neural-text-3xl neural-font-bold mb-2">500+</div>
            <div className="neural-text-sm opacity-90">Products</div>
          </div>
          <div>
            <div className="neural-text-3xl neural-font-bold mb-2">100+</div>
            <div className="neural-text-sm opacity-90">Brands</div>
          </div>
          <div>
            <div className="neural-text-3xl neural-font-bold mb-2">98%</div>
            <div className="neural-text-sm opacity-90">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechHighlights;