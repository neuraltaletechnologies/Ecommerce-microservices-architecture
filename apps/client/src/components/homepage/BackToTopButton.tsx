"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      
      setScrollProgress(progress);
      setIsVisible(scrollTop > 400);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 group transition-all duration-300 ${
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      {/* Progress ring */}
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
        {/* Background circle */}
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-[#001E3C]"
          strokeWidth="2"
        />
        {/* Progress circle */}
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-[#FDB913]"
          strokeWidth="2"
          strokeDasharray={`${scrollProgress} 100`}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Button content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 bg-[#FDB913] rounded-full flex items-center justify-center shadow-lg group-hover:bg-[#001E3C] transition-colors duration-300">
          <ArrowUp className="w-5 h-5 text-[#001E3C] group-hover:text-[#FDB913] transition-colors duration-300 group-hover:-translate-y-0.5 transform" />
        </div>
      </div>
    </button>
  );
};

export default BackToTopButton;
