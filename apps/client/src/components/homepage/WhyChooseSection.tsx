"use client";

import { Shield, Headphones, Award, Truck, CheckCircle, Star } from "lucide-react";

const WhyChooseSection = () => {
  

  return (
    <section className="py-16 md:py-20 bg-[#F5E6D3] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FDB913] opacity-10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0A7EA4] opacity-10 rounded-full blur-3xl" />
      
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, #001E3C 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 bg-[#001E3C] text-[#FDB913] text-xs font-bold px-4 py-2 rounded-full mb-4">
            <Star className="w-4 h-4" fill="currentColor" />
            WHY NEURASHOP
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#001E3C] mb-4">
            Why Choose Neurashop?
          </h2>
          <p className="text-lg text-[#001E3C]/70 max-w-2xl mx-auto">
            Experience the Neuraltale difference with our commitment to quality, service, and user satisfaction.
          </p>
        </div>

        {/* Bottom trust bar */}
        <div className="mt-12 md:mt-16 bg-[#001E3C] rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FDB913] rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#001E3C]" />
              </div>
              <div className="text-white">
                <p className="font-bold text-lg">100% Satisfaction Guaranteed</p>
                <p className="text-white/70 text-sm">30-day money-back guarantee on all products</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-white">
              <div className="text-center">
                <p className="text-2xl font-black text-[#FDB913]">50K+</p>
                <p className="text-xs text-white/70">Happy Users</p>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-black text-[#FDB913]">4.9/5</p>
                <p className="text-xs text-white/70">Average Rating</p>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-black text-[#FDB913]">99%</p>
                <p className="text-xs text-white/70">Positive Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
