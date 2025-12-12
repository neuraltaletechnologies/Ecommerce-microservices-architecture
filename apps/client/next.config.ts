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
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
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

