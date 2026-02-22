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
        protocol: "http",
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
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
      },
      {
        protocol: "https",
        hostname: "dummyjson.com",
      },
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
      },
      {
        protocol: "https",
        hostname: "api.escuelajs.co",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "placehold.jp",
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
  // Reduce symlink issues on Windows
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Better error reporting
  productionBrowserSourceMaps: process.env.VERCEL === '1',
  // Disable logging of unhandled promise rejections in development
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;

