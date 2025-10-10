"use client";

import dynamic from "next/dynamic";

// Create a client-side wrapper for theme-dependent components
const ClientNavbar = dynamic(() => import("./Navbar"), {
  ssr: false,
  loading: () => (
    <nav className="neural-card border-b border-neural-border sticky top-0 z-50 bg-neural-surface/80 backdrop-blur-md">
      <div className="neural-container py-4">
        <div className="flex items-center justify-between">
          <div className="w-32 h-8 bg-neural-surface-elevated rounded animate-pulse"></div>
          <div className="hidden md:flex space-x-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-6 bg-neural-surface-elevated rounded animate-pulse"></div>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-neural-surface-elevated rounded-full animate-pulse"></div>
            <div className="w-8 h-8 bg-neural-surface-elevated rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </nav>
  )
});

const NavbarWrapper = () => {
  return <ClientNavbar />;
};

export default NavbarWrapper;