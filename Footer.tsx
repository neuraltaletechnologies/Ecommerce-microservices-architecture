"use client";

import Link from "next/link";
import Image from "next/image";
import { Twitter, Instagram, Youtube, Linkedin, Mail, Phone, MapPin, Github, ShoppingBag, Sparkles } from "lucide-react";
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
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Section - Larger */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center group mb-5">
              <Image 
                src="/logo.svg" 
                alt="Neurashop Logo" 
                width={44} 
                height={44}
                className="object-contain mr-3"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">
                  Neurashop
                </span>
                <span className="text-xs text-gray-400 -mt-1">by Neuraltale</span>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-sm">
              Your trusted destination for premium technology. Discover cutting-edge gadgets 
              and exceptional quality at the best prices in Tanzania.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3 mb-6">
              <a href="https://twitter.com/neuraltale" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-500 flex items-center justify-center transition-colors duration-300" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://instagram.com/neuraltaletechnologiestz" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-pink-500 flex items-center justify-center transition-colors duration-300" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://youtube.com/neuraltale" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-red-500 flex items-center justify-center transition-colors duration-300" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com/company/neuraltale" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors duration-300" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://github.com/neuraltaletechnologies" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-600 flex items-center justify-center transition-colors duration-300" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
            </div>

            {/* Neuraltale Link */}
            <a 
              href="https://www.neuraltale.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-medium transition-colors"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              Visit Neuraltale.com
            </a>
          </div>

          {/* Shop Section */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/products?category=smartphones" className="text-gray-400 hover:text-white transition-colors">Smartphones</Link></li>
              <li><Link href="/products?category=laptops" className="text-gray-400 hover:text-white transition-colors">Laptops</Link></li>
              <li><Link href="/products?category=audio" className="text-gray-400 hover:text-white transition-colors">Audio</Link></li>
              <li><Link href="/products?category=gaming-laptops" className="text-gray-400 hover:text-white transition-colors">Gaming</Link></li>
              <li><Link href="/products?category=accessories" className="text-gray-400 hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-3">
              <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-gray-400 hover:text-white transition-colors">Returns</Link></li>
              <li><Link href="/warranty" className="text-gray-400 hover:text-white transition-colors">Warranty</Link></li>
              <li><Link href="/track-order" className="text-gray-400 hover:text-white transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Contact</h4>
            <div className="space-y-4">
              <a href="mailto:hello@neuraltale.com" className="flex items-center text-gray-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4 mr-3 text-blue-400" />
                <span>hello@neuraltale.com</span>
              </a>
              <a href="tel:+255653520829" className="flex items-center text-gray-400 hover:text-white transition-colors">
                <Phone className="w-4 h-4 mr-3 text-green-400" />
                <span>+255 653 520 829</span>
              </a>
              <div className="flex items-start text-gray-400">
                <MapPin className="w-4 h-4 mr-3 text-red-400 mt-0.5" />
                <span>Dar es Salaam, Tanzania</span>
              </div>
            </div>
            
            {/* Company Links */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <h5 className="text-white font-semibold mb-3 text-sm">Company</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.neuraltale.com/about" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">About Neuraltale</a></li>
                <li><a href="https://www.neuraltale.com/careers" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="https://www.neuraltale.com/blog" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <p className="text-gray-500 text-sm">
                © 2025 <span className="text-white">Neurashop</span> by Neuraltale. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <a href="https://www.neuraltale.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                  Privacy
                </a>
                <span className="text-gray-700">•</span>
                <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">
                  Terms
                </Link>
                <span className="text-gray-700">•</span>
                <Link href="/cookies" className="text-gray-500 hover:text-white transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className="flex items-center space-x-3">
              <span className="text-gray-500 text-sm mr-2">We accept</span>
              <div className="flex items-center space-x-2">
                <div className="px-3 py-1.5 bg-gray-800 rounded text-white text-xs font-bold">
                  VISA
                </div>
                <div className="px-3 py-1.5 bg-gray-800 rounded text-white text-xs font-bold">
                  MC
                </div>
                <div className="px-3 py-1.5 bg-gray-800 rounded text-white text-xs font-bold">
                  AMEX
                </div>
                <div className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded text-white text-xs font-bold">
                  PayPal
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