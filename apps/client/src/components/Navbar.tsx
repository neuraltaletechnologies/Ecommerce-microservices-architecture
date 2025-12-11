"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";
import { User, Menu, X, ChevronDown } from "lucide-react";
import ShoppingCartIcon from "./ShoppingCartIcon";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { useState } from "react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const categories = [
    {
      name: "Laptops",
      href: "/products?category=laptops",
      subcategories: [
        { name: "Gaming Laptops", href: "/products?category=gaming-laptops" },
        { name: "Business Laptops", href: "/products?category=business-laptops" },
        { name: "Ultrabooks", href: "/products?category=ultrabooks" },
        { name: "MacBooks", href: "/products?category=macbooks" },
      ]
    },
    {
      name: "Desktops",
      href: "/products?category=desktops",
      subcategories: [
        { name: "Gaming PCs", href: "/products?category=gaming-pcs" },
        { name: "Workstations", href: "/products?category=workstations" },
        { name: "All-in-One PCs", href: "/products?category=all-in-one" },
        { name: "Mini PCs", href: "/products?category=mini-pcs" },
      ]
    },
    {
      name: "Computer Monitors",
      href: "/products?category=monitors",
      subcategories: [
        { name: "Gaming Monitors", href: "/products?category=gaming-monitors" },
        { name: "4K Monitors", href: "/products?category=4k-monitors" },
        { name: "Ultrawide", href: "/products?category=ultrawide-monitors" },
        { name: "Professional", href: "/products?category=professional-monitors" },
      ]
    },
    {
      name: "Storage",
      href: "/products?category=storage",
      subcategories: [
        { name: "SSDs", href: "/products?category=ssds" },
        { name: "Hard Drives", href: "/products?category=hard-drives" },
        { name: "External Storage", href: "/products?category=external-storage" },
        { name: "NAS", href: "/products?category=nas" },
      ]
    },
    {
      name: "Components",
      href: "/products?category=components",
      subcategories: [
        { name: "Processors", href: "/products?category=processors" },
        { name: "Graphics Cards", href: "/products?category=graphics-cards" },
        { name: "Motherboards", href: "/products?category=motherboards" },
        { name: "RAM", href: "/products?category=ram" },
      ]
    },
    {
      name: "Peripherals",
      href: "/products?category=peripherals",
      subcategories: [
        { name: "Keyboards", href: "/products?category=keyboards" },
        { name: "Mice", href: "/products?category=mice" },
        { name: "Headsets", href: "/products?category=headsets" },
        { name: "Webcams", href: "/products?category=webcams" },
      ]
    },
    {
      name: "Networking",
      href: "/products?category=networking",
      subcategories: [
        { name: "Routers", href: "/products?category=routers" },
        { name: "WiFi Adapters", href: "/products?category=wifi-adapters" },
        { name: "Switches", href: "/products?category=switches" },
        { name: "Access Points", href: "/products?category=access-points" },
      ]
    },
    {
      name: "Gadgets",
      href: "/products?category=gadgets",
      subcategories: [
        { name: "Smartphones", href: "/products?category=smartphones" },
        { name: "Tablets", href: "/products?category=tablets" },
        { name: "Smartwatches", href: "/products?category=smartwatches" },
        { name: "Audio", href: "/products?category=audio" },
      ]
    },
    {
      name: "Gaming",
      href: "/products?category=gaming",
      subcategories: [
        { name: "Gaming Chairs", href: "/products?category=gaming-chairs" },
        { name: "Controllers", href: "/products?category=controllers" },
        { name: "VR Headsets", href: "/products?category=vr-headsets" },
        { name: "Gaming Accessories", href: "/products?category=gaming-accessories" },
      ]
    },
    {
      name: "Software & Digital",
      href: "/products?category=software",
      subcategories: [
        { name: "Operating Systems", href: "/products?category=operating-systems" },
        { name: "Productivity", href: "/products?category=productivity-software" },
        { name: "Security", href: "/products?category=security-software" },
        { name: "Games", href: "/products?category=digital-games" },
      ]
    },
  ];

  const navigationItems = [
    { name: "All Products", href: "/products" },
    { name: "Deals", href: "/products?sort=price-asc" },
    { name: "Services", href: "https://www.neuraltale.com/services", external: true },
    { name: "About", href: "https://www.neuraltale.com/about", external: true },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="flex items-center space-x-2">
                
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-200">
                  Neurashop
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Categories Dropdown */}
              <div className="relative group">
                <button 
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 group"
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                >
                  <span>Categories</span>
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
                </button>
                
                {/* Mega Menu Dropdown */}
                <div 
                  className="absolute top-full left-0 w-screen max-w-6xl bg-white shadow-xl border border-gray-200 rounded-lg mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                >
                  <div className="grid grid-cols-5 gap-6 p-6">
                    {categories.map((category) => (
                      <div key={category.name} className="space-y-3">
                        <Link
                          href={category.href}
                          className="font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 block"
                        >
                          {category.name}
                        </Link>
                        <ul className="space-y-2">
                          {category.subcategories.map((subcategory) => (
                            <li key={subcategory.name}>
                              <Link
                                href={subcategory.href}
                                className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                              >
                                {subcategory.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  
                  {/* Featured Categories Footer */}
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-6">
                        <Link href="/products?featured=true" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                          Featured Products
                        </Link>
                        <Link href="/products?new=true" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                          New Arrivals
                        </Link>
                        <Link href="/products?sale=true" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                          On Sale
                        </Link>
                      </div>
                      <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                        View All Products →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Navigation Items */}
              {navigationItems.map((item) => (
                item.external ? (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
                  </Link>
                )
              ))}
            </div>

            {/* Desktop Search & Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <SearchBar />
              </div>
              <ShoppingCartIcon />
              <div className="flex items-center">
                <SignedOut>
                  <SignInButton>
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                      <User className="w-4 h-4" />
                      <span>Sign In</span>
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 ring-2 ring-gray-200 hover:ring-blue-500 transition-all duration-200"
                      }
                    }}
                  >
                    <UserButton.MenuItems>
                      <UserButton.Link
                        label="My Orders"
                        labelIcon={<User className="w-4 h-4" />}
                        href="/orders"
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                </SignedIn>
              </div>
            </div>

            {/* Mobile Menu Button & Auth */}
            <div className="md:hidden flex items-center space-x-3">
              <ShoppingCartIcon />
              {/* Mobile Auth - Direct in Navbar */}
              <div className="flex items-center">
                <SignedOut>
                  <SignInButton>
                    <button 
                      className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
                      aria-label="Sign in"
                    >
                      <User className="w-5 h-5" />
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 ring-2 ring-gray-200 hover:ring-blue-500 transition-all duration-200"
                      }
                    }}
                  >
                    <UserButton.MenuItems>
                      <UserButton.Link
                        label="My Orders"
                        labelIcon={<User className="w-4 h-4" />}
                        href="/orders"
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                </SignedIn>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 bg-white max-h-96 overflow-y-auto">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Mobile Search */}
                <div className="px-3 py-2">
                  <SearchBar />
                </div>
                
                {/* Mobile Categories */}
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <h3 className="px-3 py-2 text-sm font-semibold text-gray-900 uppercase tracking-wider">Categories</h3>
                  <div className="grid grid-cols-2 gap-1">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Mobile Navigation */}
                <div className="border-t border-gray-100 mt-2 pt-2">
                  {navigationItems.map((item) => (
                    item.external ? (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )
                  ))}
                </div>
                
                {/* Additional Company Links */}
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <a
                    href="https://www.neuraltale.com/blog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Blog
                  </a>
                  <a
                    href="https://www.neuraltale.com/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
