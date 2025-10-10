"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail("");
    }, 1000);
  };

  if (isSubscribed) {
    return (
      <div className="neural-card bg-neural-accent text-white text-center max-w-2xl mx-auto">
        <div className="flex flex-col items-center">
          <CheckCircle className="w-16 h-16 mb-4" />
          <h3 className="neural-text-2xl neural-font-bold mb-2">
            Welcome to Neuraltale!
          </h3>
          <p className="neural-text-lg opacity-90">
            Thank you for subscribing. You&apos;ll receive the latest tech updates and exclusive offers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="neural-card bg-neural-gradient text-white text-center max-w-4xl mx-auto">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8" />
          </div>
        </div>

        <h2 className="neural-text-3xl neural-font-bold mb-4">
          Stay Ahead of Tech Trends
        </h2>
        
        <p className="neural-text-lg opacity-90 mb-8 leading-relaxed">
          Get exclusive access to the latest product launches, tech insights, and special offers. 
          Join our community of tech enthusiasts and never miss an innovation.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <div className="flex-grow relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="
                w-full px-4 py-3 
                bg-white/10 
                border border-white/20 
                rounded-lg 
                text-white 
                placeholder:text-white/70
                focus:outline-none 
                focus:border-white/40 
                focus:bg-white/20
                transition-all
              "
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="
              px-6 py-3 
              bg-white 
              text-neural-primary 
              rounded-lg 
              neural-font-semibold 
              hover:bg-white/90 
              focus:outline-none 
              focus:ring-2 
              focus:ring-white/50
              transition-all
              disabled:opacity-50
              disabled:cursor-not-allowed
              flex items-center justify-center gap-2
              whitespace-nowrap
            "
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-neural-primary/30 border-t-neural-primary rounded-full animate-spin" />
            ) : (
              <>
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 neural-text-sm opacity-70">
          <p>
            By subscribing, you agree to our privacy policy and terms of service. 
            Unsubscribe anytime.
          </p>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="neural-font-semibold mb-1">Weekly Updates</div>
            <div className="neural-text-sm opacity-80">Latest tech news & reviews</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="neural-font-semibold mb-1">Exclusive Offers</div>
            <div className="neural-text-sm opacity-80">Subscriber-only discounts</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="neural-font-semibold mb-1">Early Access</div>
            <div className="neural-text-sm opacity-80">Be first to know about launches</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSection;