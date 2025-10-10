"use client";

import { Menu, X, Search, ShoppingCart, User, Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useCartStore from "@/stores/cartStore";

const MobileNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { cart } = useCartStore();
  const cartItemCount = cart.reduce((total: number, item: any) => total + item.quantity, 0);

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/products?category=all" },
    { name: "Deals", href: "/products?sort=price-asc" },
    { name: "Services", href: "https://www.neuraltale.com/services", external: true },
    { name: "About", href: "https://www.neuraltale.com/about", external: true },
    { name: "Contact", href: "https://www.neuraltale.com/contact", external: true },
  ];

  const categories = [
    { name: "Smartphones", href: "/products?category=smartphones" },
    { name: "Laptops", href: "/products?category=laptops" },
    { name: "Audio", href: "/products?category=audio" },
    { name: "Gaming", href: "/products?category=gaming-laptops" },
    { name: "Tablets", href: "/products?category=tablets" },
    { name: "Monitors", href: "/products?category=monitors" },
    { name: "Accessories", href: "/products?category=accessories" },
    { name: "Wearables", href: "/products?category=wearables" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-blue-600">Neuraltale</span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar (Mobile) */}
        {isSearchOpen && (
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
          
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                <span className="text-xl font-bold text-blue-600">Neuraltale</span>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* User Section */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Welcome!</p>
                  <p className="text-sm text-gray-600">Sign in for better experience</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  className="text-center py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="w-4 h-4" />
                  Wishlist
                </Link>
              </div>
            </div>

            {/* Navigation */}
            <div className="p-4">
              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  item.external ? (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                ))}
              </nav>
            </div>

            {/* Categories */}
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 px-4">Shop by Category</h3>
              <nav className="space-y-1">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="block py-2 px-4 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Need help?</p>
                <Link
                  href="/support"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="grid grid-cols-4 py-2">
          <Link
            href="/"
            className="flex flex-col items-center justify-center py-2 text-gray-600 hover:text-blue-600"
          >
            <div className="w-6 h-6 mb-1">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <span className="text-xs">Home</span>
          </Link>
          
          <Link
            href="/products"
            className="flex flex-col items-center justify-center py-2 text-gray-600 hover:text-blue-600"
          >
            <div className="w-6 h-6 mb-1">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </div>
            <span className="text-xs">Shop</span>
          </Link>
          
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center justify-center py-2 text-gray-600 hover:text-blue-600"
          >
            <Search className="w-6 h-6 mb-1" />
            <span className="text-xs">Search</span>
          </button>
          
          <Link
            href="/cart"
            className="relative flex flex-col items-center justify-center py-2 text-gray-600 hover:text-blue-600"
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6 mb-1" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="text-xs">Cart</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;