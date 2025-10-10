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
import MobileNavigation from "./MobileNavigation";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navigationItems = [
    { 
      name: "Services", 
      href: "/services",
      dropdown: [
        { name: "All Services", href: "/services" },
        { name: "Solutions", href: "/solutions" },
        { name: "Industries", href: "/industries" },
        { name: "Case Studies", href: "/case-studies" },
      ]
    },
    { name: "Products", href: "/products" },
    { 
      name: "Company", 
      href: "/about",
      dropdown: [
        { name: "About Us", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Press", href: "/press" },
        { name: "Careers", href: "/careers" },
      ]
    },
    { name: "Support", href: "/support" },
  ];



  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-200">
                  Neuraltale
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.dropdown ? (
                    <div>
                      <button
                        className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group"
                        onMouseEnter={() => setActiveDropdown(item.name)}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <span>{item.name}</span>
                        <ChevronDown className="w-4 h-4" />
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
                      </button>
                      
                      {/* Dropdown Menu */}
                      {activeDropdown === item.name && (
                        <div 
                          className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
                          onMouseEnter={() => setActiveDropdown(item.name)}
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group"
                    >
                      {item.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
                    </Link>
                  )}
                </div>
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
                  />
                </SignedIn>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-3">
              <ShoppingCartIcon />
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
            <div className="md:hidden border-t border-gray-100 bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Mobile Search */}
                <div className="px-3 py-2">
                  <SearchBar />
                </div>
                
                {/* Mobile Navigation */}
                {navigationItems.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    {/* Mobile Dropdown Items */}
                    {item.dropdown && (
                      <div className="ml-4 space-y-1">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block px-3 py-1 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Mobile Auth */}
                <div className="px-3 py-2 border-t border-gray-100 mt-2 pt-2">
                  <SignedOut>
                    <SignInButton>
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium">
                        <User className="w-4 h-4" />
                        <span>Sign In</span>
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <div className="flex items-center space-x-2">
                      <UserButton />
                      <span className="text-gray-600">Account</span>
                    </div>
                  </SignedIn>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      
      {/* Include Mobile Navigation Component */}
      <MobileNavigation />
    </>
  );
};

export default Navbar;
