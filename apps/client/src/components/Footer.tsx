"use client";

import Link from "next/link";
import Image from "next/image";
import { Twitter, Instagram, Youtube, Linkedin, Mail, Phone, MapPin,Github } from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <footer className="bg-[#001E3C]">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center group mb-4">
              <Image
                src="/logo.png"
                alt="Neurashop Logo"
                width={40}
                height={40}
                className="object-contain mr-2"
              />
              <span className="text-xl font-bold text-white">
                Neurashop
              </span>
            </Link>
            <p className="text-gray-300 mb-4 leading-relaxed text-sm">
              Discover the future of technology and exceptional quality.
            </p>
            <div className="mb-4">
              <a 
                href="https://www.neuraltale.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#FDB913] hover:text-[#e5a811] font-medium text-sm transition-colors"
              >
                Visit our company website →
              </a>
            </div>
            
            {/* Newsletter - Integrated */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <h5 className="text-xs font-semibold text-white mb-1.5">
                Stay Updated
              </h5>
              <p className="text-xs text-gray-400 mb-2">
                Get exclusive deals and tech insights.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 px-2 py-1.5 text-xs rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-1 focus:ring-[#FDB913] focus:border-[#FDB913] focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#FDB913] hover:bg-[#e5a811] text-[#001E3C] text-xs font-bold rounded transition-colors duration-200 flex items-center gap-1"
                >
                  Subscribe
                </button>
              </form>
            </div>
            
            <div className="flex space-x-3 mt-4">
              <a href="https://twitter.com/neuraltale" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 hover:bg-[#FDB913] rounded-full flex items-center justify-center text-white hover:text-[#001E3C] transition-all duration-300" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://instagram.com/neuraltaletechnologiestz" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 hover:bg-[#FDB913] rounded-full flex items-center justify-center text-white hover:text-[#001E3C] transition-all duration-300" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://youtube.com/neuraltale" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 hover:bg-[#FDB913] rounded-full flex items-center justify-center text-white hover:text-[#001E3C] transition-all duration-300" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com/company/neuraltale" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 hover:bg-[#FDB913] rounded-full flex items-center justify-center text-white hover:text-[#001E3C] transition-all duration-300" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://github.com/neuraltaletechnologies" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 hover:bg-[#FDB913] rounded-full flex items-center justify-center text-white hover:text-[#001E3C] transition-all duration-300" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Section */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-[#FDB913] rounded-full"></span>
              Shop
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="text-gray-300 hover:text-[#FDB913] transition-colors">All Products</Link></li>
              <li><Link href="/products?category=smartphones" className="text-gray-300 hover:text-[#FDB913] transition-colors">Smartphones</Link></li>
              <li><Link href="/products?category=laptops" className="text-gray-300 hover:text-[#FDB913] transition-colors">Laptops</Link></li>
              <li><Link href="/products?category=audio" className="text-gray-300 hover:text-[#FDB913] transition-colors">Audio</Link></li>
              <li><Link href="/products?category=gaming-laptops" className="text-gray-300 hover:text-[#FDB913] transition-colors">Gaming</Link></li>
              <li><Link href="/products?category=accessories" className="text-gray-300 hover:text-[#FDB913] transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-[#0A7EA4] rounded-full"></span>
              Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="text-gray-300 hover:text-[#FDB913] transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-[#FDB913] transition-colors">Contact Us</Link></li>
              <li><Link href="/delivery" className="text-gray-300 hover:text-[#FDB913] transition-colors">Delivery Info</Link></li>
              <li><Link href="/returns" className="text-gray-300 hover:text-[#FDB913] transition-colors">Returns</Link></li>
              <li><Link href="/warranty" className="text-gray-300 hover:text-[#FDB913] transition-colors">Warranty</Link></li>
              <li><Link href="/track-order" className="text-gray-300 hover:text-[#FDB913] transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-[#FDB913] rounded-full"></span>
              Company
            </h4>
            <ul className="space-y-2 mb-4 text-sm">
              <li><a href="https://www.neuraltale.com/about" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#FDB913] transition-colors">About Us</a></li>
              <li><a href="https://www.neuraltale.com/careers" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#FDB913] transition-colors">Careers</a></li>
              <li><a href="https://www.neuraltale.com/press" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#FDB913] transition-colors">Press</a></li>
              <li><a href="https://www.neuraltale.com/blog" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#FDB913] transition-colors">Blog</a></li>
             </ul>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <Mail className="w-4 h-4 mr-2 text-[#0A7EA4]" />
                <span className="text-sm">helpdesk@neuraltale.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="w-4 h-4 mr-2 text-[#0A7EA4]" />
                <span className="text-sm">+255 653 520 829  </span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-2 text-[#0A7EA4]" />
                <span className="text-sm">Dar-Es-Salaam, TZ</span>
              </div>
              <div className="mt-3">
                <a 
                  href="https://www.neuraltale.com/support" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#FDB913] hover:text-[#e5a811] text-sm font-medium"
                >
                  Technical Support →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <p className="text-gray-400 text-sm">
                © 2025 <span className="text-[#FDB913]">Neuraltale</span>. All rights reserved.
              </p>
              <div className="hidden md:flex items-center space-x-4">
                <a href="https://www.neuraltale.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </a>
                <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Cookie Policy
                </Link>
                <a href="https://www.neuraltale.com/sitemap-page" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Sitemap
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Secure payments powered by</span>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-5 bg-gradient-to-r from-[#0A7EA4] to-[#001E3C] rounded text-white text-xs flex items-center justify-center font-bold">
                  VISA
                </div>
                <div className="w-8 h-5 bg-gradient-to-r from-[#FDB913] to-[#e5a811] rounded text-[#001E3C] text-xs flex items-center justify-center font-bold">
                  MC
                </div>
                <div className="w-8 h-5 bg-gradient-to-r from-[#0A7EA4] to-[#001E3C] rounded text-white text-xs flex items-center justify-center font-bold">
                  PP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
