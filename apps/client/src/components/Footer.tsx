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
    <footer className="bg-white border-t border-gray-100">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center group mb-3">
              <div className="relative w-8 h-8 mr-2">
                <Image
                  src="/favicon.png"
                  alt="Neuraltale Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Neuraltale
              </span>
            </Link>
            <p className="text-gray-600 mb-3 leading-relaxed text-sm">
              Discover the future of technology and exceptional quality.
            </p>
            <div className="mb-3">
              <a 
                href="https://www.neuraltale.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              >
                Visit our company website →
              </a>
            </div>
            
            {/* Newsletter - Integrated */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h5 className="text-xs font-semibold text-gray-900 mb-1.5">
                Stay Updated
              </h5>
              <p className="text-xs text-gray-600 mb-2">
                Get exclusive deals and tech insights.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 px-2 py-1.5 text-xs rounded border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors duration-200 flex items-center gap-1"
                >
                  Subscribe
                </button>
              </form>
            </div>
            
            <div className="flex space-x-3 mt-4">
              <a href="https://twitter.com/neuraltale" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/neuraltaletechnologiestz" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/neuraltale" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/company/neuraltale" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://github.com/neuraltaletechnologies" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors" aria-label="LinkedIn">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Section */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-2 text-sm">Shop</h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link href="/products" className="text-gray-600 hover:text-gray-900 transition-colors">All Products</Link></li>
              <li><Link href="/products?category=smartphones" className="text-gray-600 hover:text-gray-900 transition-colors">Smartphones</Link></li>
              <li><Link href="/products?category=laptops" className="text-gray-600 hover:text-gray-900 transition-colors">Laptops</Link></li>
              <li><Link href="/products?category=audio" className="text-gray-600 hover:text-gray-900 transition-colors">Audio</Link></li>
              <li><Link href="/products?category=gaming-laptops" className="text-gray-600 hover:text-gray-900 transition-colors">Gaming</Link></li>
              <li><Link href="/products?category=accessories" className="text-gray-600 hover:text-gray-900 transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-2 text-sm">Support</h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link href="/help" className="text-gray-600 hover:text-gray-900 transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-gray-600 hover:text-gray-900 transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-gray-600 hover:text-gray-900 transition-colors">Returns</Link></li>
              <li><Link href="/warranty" className="text-gray-600 hover:text-gray-900 transition-colors">Warranty</Link></li>
              <li><Link href="/track-order" className="text-gray-600 hover:text-gray-900 transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-2 text-sm">Company</h4>
            <ul className="space-y-1.5 mb-4 text-sm">
              <li><a href="https://www.neuraltale.com/about" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">About Us</a></li>
              <li><a href="https://www.neuraltale.com/careers" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">Careers</a></li>
              <li><a href="https://www.neuraltale.com/press" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">Press</a></li>
              <li><a href="https://www.neuraltale.com/blog" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</a></li>
             </ul>
            
            {/* Contact Info */}
            <div className="space-y-1.5">
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm">hello@neuraltale.com</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-sm">+255 653 520 829  </span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
              <div className="mt-2">
                <a 
                  href="https://www.neuraltale.com/support" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Technical Support →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <p className="text-gray-600 text-sm">
                © 2025 Neuraltale. All rights reserved.
              </p>
              <div className="hidden md:flex items-center space-x-4">
                <a href="https://www.neuraltale.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
                  Privacy Policy
                </a>
                <Link href="/terms" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
                  Cookie Policy
                </Link>
                <a href="https://www.neuraltale.com/sitemap-page" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
                  Sitemap
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-500 text-sm">Secure payments powered by</span>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  VISA
                </div>
                <div className="w-8 h-5 bg-gradient-to-r from-red-600 to-orange-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  MC
                </div>
                <div className="w-8 h-5 bg-gradient-to-r from-blue-700 to-blue-800 rounded text-white text-xs flex items-center justify-center font-bold">
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
