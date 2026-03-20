"use client";

import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { User, Menu, X, ChevronDown } from "lucide-react";
import ShoppingCartIcon from "./ShoppingCartIcon";
import WishlistIcon from "./WishlistIcon";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { useState } from "react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    {
      name: "Laptops",
      href: "/products?category=Laptops",
      subcategories: [
        { name: "Gaming Laptops", href: "/products?category=Gaming-Laptops" },
        { name: "Business Laptops", href: "/products?category=Business-Laptops" },
        { name: "Ultrabooks", href: "/products?category=Ultrabooks" },
        { name: "MacBooks", href: "/products?category=MacBooks" },
      ]
    },
    {
      name: "Desktops",
      href: "/products?category=Desktops",
      subcategories: [
        { name: "Gaming PCs", href: "/products?category=Gaming-PCs" },
        { name: "Workstations", href: "/products?category=Workstations" },
        { name: "All-in-One PCs", href: "/products?category=All-in-One-PCs" },
        { name: "Mini PCs", href: "/products?category=Mini-PCs" },
      ]
    },
    {
      name: "Computer Monitors",
      href: "/products?category=monitors",
      subcategories: [
        { name: "Gaming Monitors", href: "/products?category=Gaming-Monitors" },
        { name: "4K Monitors", href: "/products?category=4K-Monitors" },
        { name: "Ultrawide", href: "/products?category=Ultrawide-Monitors" },
        { name: "Professional", href: "/products?category=Professional-Monitors" },
      ]
    },
    {
      name: "Storage",
      href: "/products?category=Storage",
      subcategories: [
        { name: "SSDs", href: "/products?category=SSDs" },
        { name: "Hard Drives", href: "/products?category=Hard-Drives" },
        { name: "External Storage", href: "/products?category=External-Storage" },
        { name: "NAS", href: "/products?category=NAS" },
      ]
    },
    {
      name: "Components",
      href: "/products?category=Components",
      subcategories: [
        { name: "Processors", href: "/products?category=Processors" },
        { name: "Graphics Cards", href: "/products?category=Graphics-Cards" },
        { name: "Motherboards", href: "/products?category=Motherboards" },
        { name: "RAM", href: "/products?category=RAM" },
      ]
    },
    {
      name: "Peripherals",
      href: "/products?category=Peripherals",
      subcategories: [
        { name: "Keyboards", href: "/products?category=Keyboards" },
        { name: "Mice", href: "/products?category=Mice" },
        { name: "Headsets", href: "/products?category=Headsets" },
        { name: "Webcams", href: "/products?category=Webcams" },
      ]
    },
    {
      name: "Networking",
      href: "/products?category=Networking",
      subcategories: [
        { name: "Routers", href: "/products?category=Routers" },
        { name: "WiFi Adapters", href: "/products?category=WiFi-Adapters" },
        { name: "Switches", href: "/products?category=Switches" },
        { name: "Access Points", href: "/products?category=Access-Points" },
      ]
    },
    {
      name: "Gadgets",
      href: "/products?category=Gadgets",
      subcategories: [
        { name: "Smartphones", href: "/products?category=Smartphones" },
        { name: "Tablets", href: "/products?category=Tablets" },
        { name: "Smartwatches", href: "/products?category=Smartwatches" },
        { name: "Audio", href: "/products?category=Audio" },
      ]
    },
    {
      name: "Gaming",
      href: "/products?category=Gaming",
      subcategories: [
        { name: "Gaming Chairs", href: "/products?category=Gaming-Chairs" },
        { name: "Controllers", href: "/products?category=Controllers" },
        { name: "VR Headsets", href: "/products?category=VR-Headsets" },
        { name: "Gaming Accessories", href: "/products?category=Gaming-Accessories" },
      ]
    },
    {
      name: "Software & Digital",
      href: "/products?category=Software-&-Digital",
      subcategories: [
        { name: "Operating Systems", href: "/products?category=Operating-systems" },
        { name: "Productivity", href: "/products?category=Productivity" },
        { name: "Security", href: "/products?category=Security" },
        { name: "Games", href: "/products?category=Games" },
      ]
    },
  ];

  const navigationItems = [
    { name: "All Products", href: "/products" },
    { name: "Deals", href: "/products?sort=price-asc" },
    { name: "Services", href: "https://www.neuraltale.com/services", external: true },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center group flex-shrink-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <Image 
                  src="/logo.png" 
                  alt="Neurashop Logo" 
                  width={32} 
                  height={32}
                  className="object-contain sm:w-9 sm:h-9"
                />
                <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-[#001E3C] to-[#0A7EA4] bg-clip-text text-transparent group-hover:from-[#FDB913] group-hover:to-[#0A7EA4] transition-all duration-200">
                  Neurashop
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {/* Categories Dropdown */}
              <div className="relative group">
                <button 
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 group text-sm xl:text-base"
                >
                  <span>Categories</span>
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FDB913] group-hover:w-full transition-all duration-200"></span>
                </button>
                
                {/* Mega Menu Dropdown */}
                <div 
                  className="absolute top-full left-0 w-screen max-w-5xl xl:max-w-6xl bg-white shadow-xl border border-gray-200 rounded-lg mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                >
                  <div className="grid grid-cols-4 xl:grid-cols-5 gap-4 xl:gap-6 p-4 xl:p-6">
                    {categories.map((category) => (
                      <div key={category.name} className="space-y-2 xl:space-y-3">
                        <Link
                          href={category.href}
                          className="font-semibold text-sm xl:text-base text-gray-900 hover:text-[#0A7EA4] transition-colors duration-200 block"
                        >
                          {category.name}
                        </Link>
                        <ul className="space-y-1.5 xl:space-y-2">
                          {category.subcategories.map((subcategory) => (
                            <li key={subcategory.name}>
                              <Link
                                href={subcategory.href}
                                className="text-xs xl:text-sm text-gray-600 hover:text-[#0A7EA4] transition-colors duration-200"
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
                  <div className="bg-gray-50 px-4 xl:px-6 py-3 xl:py-4 border-t border-gray-200 rounded-b-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4 xl:space-x-6">
                        <Link href="/products?featured=true" className="text-xs xl:text-sm font-medium text-[#0A7EA4] hover:text-[#001E3C]">
                          Featured Products
                        </Link>
                        <Link href="/products?new=true" className="text-xs xl:text-sm font-medium text-[#0A7EA4] hover:text-[#001E3C]">
                          New Arrivals
                        </Link>
                        <Link href="/products?sale=true" className="text-xs xl:text-sm font-medium text-[#0A7EA4] hover:text-[#001E3C]">
                          On Sale
                        </Link>
                      </div>
                      <Link href="/products" className="text-xs xl:text-sm font-medium text-gray-600 hover:text-gray-900">
                        View All →
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
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group text-sm xl:text-base"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FDB913] group-hover:w-full transition-all duration-200"></span>
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group text-sm xl:text-base"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FDB913] group-hover:w-full transition-all duration-200"></span>
                  </Link>
                )
              ))}
            </div>

            {/* Desktop Search & Actions */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4">
              <div className="relative w-40 xl:w-52 flex-shrink-0">
                <SearchBar />
              </div>
              <div className="flex-shrink-0">
                <WishlistIcon />
              </div>
              <div className="flex-shrink-0">
                <ShoppingCartIcon />
              </div>
              <div className="flex items-center">
                <SignedOut>
                  <SignInButton>
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 text-sm xl:text-base">
                      <User className="w-4 h-4" />
                      <span>Sign In</span>
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 ring-2 ring-gray-200 hover:ring-[#FDB913] transition-all duration-200"
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
            <div className="lg:hidden flex items-center space-x-2 sm:space-x-3">
              <WishlistIcon />
              <ShoppingCartIcon />
              {/* Mobile Auth - Direct in Navbar */}
              <div className="flex items-center">
                <SignedOut>
                  <SignInButton>
                    <button 
                      className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 p-1"
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
                        avatarBox: "w-7 h-7 sm:w-8 sm:h-8 ring-2 ring-gray-200 hover:ring-[#FDB913] transition-all duration-200"
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
                className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-100 bg-white max-h-[calc(100vh-3.5rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Mobile Search */}
                <div className="px-2 sm:px-3 py-2">
                  <SearchBar />
                </div>
                
                {/* Mobile Categories */}
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <h3 className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider">Categories</h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <div key={category.name} className="space-y-1">
                        <Link
                          href={category.href}
                          className="block px-2 sm:px-3 py-2 text-sm font-semibold text-gray-900 hover:text-[#0A7EA4] hover:bg-gray-50 rounded-md transition-colors duration-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                        <div className="pl-4 space-y-1">
                          {category.subcategories.map((subcategory) => (
                            <Link
                              key={subcategory.name}
                              href={subcategory.href}
                              className="block px-2 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {subcategory.name}
                            </Link>
                          ))}
                        </div>
                      </div>
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
                        className="block px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )
                  ))}
                </div>
                
                {/* Additional Company Links */}
                <div className="border-t border-gray-100 mt-2 pt-2 pb-2">
                  <a
                    href="https://www.neuraltale.com/blog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Blog
                  </a>
                  <a
                    href="https://www.neuraltale.com/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
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
