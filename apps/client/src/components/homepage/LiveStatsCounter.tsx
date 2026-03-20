"use client";

import { useState, useEffect } from "react";
import { TrendingUp, ShoppingBag, Users, Star, Award } from "lucide-react";

interface StatItem {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const LiveStatsCounter = () => {
  const [stats, setStats] = useState<{
    ordersToday: number;
    usersServed: number;
    productsSold: number;
    averageRating: number;
  }>({
    ordersToday: 0,
    usersServed: 0,
    productsSold: 0,
    averageRating: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  // Animate counters on mount
  useEffect(() => {
    setIsVisible(true);
    
    const finalValues = {
      ordersToday: 247,
      usersServed: 50000,
      productsSold: 15000,
      averageRating: 4.9
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Ease out function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setStats({
        ordersToday: Math.round(finalValues.ordersToday * easeOut),
        usersServed: Math.round(finalValues.usersServed * easeOut),
        productsSold: Math.round(finalValues.productsSold * easeOut),
        averageRating: Math.round(finalValues.averageRating * easeOut * 10) / 10
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setStats(finalValues);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  // Simulate live updates
  useEffect(() => {
    const liveInterval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        ordersToday: prev.ordersToday + Math.floor(Math.random() * 3)
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(liveInterval);
  }, []);

  const statItems: StatItem[] = [
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      value: stats.ordersToday,
      suffix: "",
      label: "Orders Today",
      color: "from-[#FDB913] to-[#e5a811]"
    },
    {
      icon: <Users className="w-6 h-6" />,
      value: stats.usersServed,
      suffix: "+",
      label: "Happy Users",
      color: "from-[#0A7EA4] to-[#001E3C]"
    },
    {
      icon: <Award className="w-6 h-6" />,
      value: stats.productsSold,
      suffix: "+",
      label: "Products Sold",
      color: "from-[#0A7EA4] to-[#001E3C]"
    },
    {
      icon: <Star className="w-6 h-6" />,
      value: stats.averageRating,
      suffix: "/5",
      label: "User Rating",
      color: "from-[#FDB913] to-[#e5a811]"
    }
  ];

  return (
    <section className="py-12 bg-[#001E3C] relative overflow-hidden">
      {/* Live indicator */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        <span className="text-white/80 text-xs font-medium">Live Stats</span>
      </div>

      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)`,
        backgroundSize: '50px 50px'
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <TrendingUp className="w-5 h-5 text-[#FDB913]" />
          <span className="text-white/60 text-sm">Real-time metrics from Neurashop</span>
        </div>

        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {statItems.map((stat, index) => (
            <div 
              key={index}
              className="text-center group"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} text-white mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              
              {/* Value */}
              <div className="text-3xl md:text-4xl font-black text-white mb-1">
                {typeof stat.value === 'number' && stat.value >= 1000 
                  ? `${(stat.value / 1000).toFixed(stat.value >= 10000 ? 0 : 1)}K`
                  : stat.value}
                <span className="text-[#FDB913]">{stat.suffix}</span>
              </div>
              
              {/* Label */}
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveStatsCounter;
