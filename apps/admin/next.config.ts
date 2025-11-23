import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"images.pexels.com",
      },
      {
        protocol:"https",
        hostname:"img.clerk.com",
      },
      {
        protocol:"https",
        hostname:"res.cloudinary.com",
      }
    ]
  },
  // Admin panel optimizations
  compress: true,
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
