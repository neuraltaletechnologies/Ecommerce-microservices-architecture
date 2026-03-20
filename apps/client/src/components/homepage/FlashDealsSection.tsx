"use client";

import { useEffect, useState } from "react";
import { Zap, Clock, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

const FlashDealsSection = () => {
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        // Reset timer
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#FDB913] via-[#FDB913] to-[#e5a811] py-8 md:py-10">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23001E3C' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Lightning bolt decorations */}
      <div className="absolute top-2 left-10 text-[#001E3C] opacity-20 animate-pulse">
        <Zap className="w-16 h-16" fill="currentColor" />
      </div>
      <div className="absolute bottom-2 right-10 text-[#001E3C] opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}>
        <Zap className="w-12 h-12" fill="currentColor" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left side - Title and badge */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="bg-[#001E3C] rounded-full p-3 animate-bounce" style={{ animationDuration: '2s' }}>
                <Zap className="w-6 h-6 text-[#FDB913]" fill="currentColor" />
              </div>
              <div>
                <span className="inline-block bg-[#001E3C] text-[#FDB913] text-xs font-bold px-3 py-1 rounded-full mb-1">
                  LIMITED TIME
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-[#001E3C] tracking-tight">
                  Today&apos;s Hot Deals
                </h2>
              </div>
            </div>
          </div>

          {/* Center - Countdown timer */}
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#001E3C]" />
            <span className="text-[#001E3C] font-semibold mr-2">Ends in:</span>
            <div className="flex gap-2">
              {[
                { value: timeLeft.hours, label: 'HRS' },
                { value: timeLeft.minutes, label: 'MIN' },
                { value: timeLeft.seconds, label: 'SEC' }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="bg-[#001E3C] text-white font-mono font-bold text-xl md:text-2xl px-3 py-2 rounded-lg min-w-[50px] text-center shadow-lg">
                    {formatTime(item.value)}
                  </div>
                  <span className="text-[#001E3C] text-xs font-semibold mt-1">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - CTA */}
          <Link 
            href="/products?sale=true"
            className="group flex items-center gap-2 bg-[#001E3C] hover:bg-[#0A7EA4] text-white font-bold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Shop All Deals</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Stats bar */}
        <div className="mt-6 flex flex-wrap justify-center gap-6 md:gap-12 text-[#001E3C]">
          <div className="flex items-center gap-2">
            <span className="font-black text-2xl">50+</span>
            <span className="text-sm font-medium">Products on Sale</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-black text-2xl">Up to 40%</span>
            <span className="text-sm font-medium">Off Selected Items</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-black text-2xl">Free</span>
            <span className="text-sm font-medium">Delivery Over 100K TZS</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlashDealsSection;
