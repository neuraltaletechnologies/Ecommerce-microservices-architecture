"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "James Mwangi",
      role: "Software Developer",
      location: "Dar es Salaam",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Best tech store in Tanzania! The MacBook I ordered arrived in perfect condition with all accessories. Fast delivery and excellent user service. Highly recommend Neurashop!",
      product: "MacBook Pro M3"
    },
    {
      id: 2,
      name: "Sarah Kimaro",
      role: "Content Creator",
      location: "Arusha",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "I've been looking for a reliable tech supplier in Tanzania for years. Neurashop exceeded my expectations - genuine products, competitive prices, and the support team is amazing!",
      product: "Sony A7 IV Camera"
    },
    {
      id: 3,
      name: "Michael Ochieng",
      role: "Business Owner",
      location: "Mwanza",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Equipped my entire office with computers from Neurashop. The bulk order process was smooth, delivery was on time, and the prices were unbeatable. Will definitely order again!",
      product: "Dell Business Laptops"
    },
    {
      id: 4,
      name: "Grace Mushi",
      role: "Gaming Enthusiast",
      location: "Dodoma",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Finally found a store that has all the gaming gear I need! The RTX 4070 was delivered faster than expected. Neurashop is now my go-to for all tech purchases.",
      product: "NVIDIA RTX 4070"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 md:py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-10 left-10 text-[#FDB913]/10">
        <Quote className="w-40 h-40" fill="currentColor" />
      </div>
      <div className="absolute bottom-10 right-10 text-[#FDB913]/10 rotate-180">
        <Quote className="w-32 h-32" fill="currentColor" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-[#F5E6D3] text-[#001E3C] text-xs font-bold px-4 py-2 rounded-full mb-4">
            <Star className="w-4 h-4 text-[#FDB913]" fill="currentColor" />
            user REVIEWS
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[#001E3C] mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied users who trust Neurashop for their tech needs
          </p>
        </div>

        {/* Testimonial carousel */}
        <div className="relative">
          {/* Navigation buttons */}
          <button 
            onClick={prevSlide}
            aria-label="Previous testimonial"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-[#001E3C] hover:bg-[#0A7EA4] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide}
            aria-label="Next testimonial"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-[#001E3C] hover:bg-[#0A7EA4] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Testimonial cards */}
          <div className="overflow-hidden mx-8">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-gradient-to-br from-[#F5E6D3]/50 to-white rounded-3xl p-8 md:p-12 shadow-xl border border-[#FDB913]/20 max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Avatar and info */}
                      <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-[#FDB913] mb-4">
                          <Image
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <h4 className="font-bold text-[#001E3C]">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                        <p className="text-sm text-[#0A7EA4]">{testimonial.location}</p>
                        
                        {/* Rating */}
                        <div className="flex gap-1 mt-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-[#FDB913]" fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      
                      {/* Quote */}
                      <div className="flex-1">
                        <Quote className="w-10 h-10 text-[#FDB913] mb-4" fill="currentColor" />
                        <p className="text-lg md:text-xl text-[#001E3C] leading-relaxed mb-4">
                          &ldquo;{testimonial.text}&rdquo;
                        </p>
                        <div className="inline-flex items-center gap-2 bg-[#001E3C] text-white text-sm px-4 py-2 rounded-full">
                          <span>Purchased:</span>
                          <span className="font-bold text-[#FDB913]">{testimonial.product}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-[#FDB913] w-8' 
                    : 'bg-[#001E3C]/20 hover:bg-[#001E3C]/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
