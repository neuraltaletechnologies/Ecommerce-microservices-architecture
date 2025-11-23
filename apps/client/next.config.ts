import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
  // Enable compression for better performance
  compress: true,
  // Generate static pages for better SEO
  output: 'standalone',
  // Enable React strict mode for better development
  reactStrictMode: true,
  // Power page speed insights
  poweredByHeader: false,
  // Generate sitemaps and robots.txt
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;

