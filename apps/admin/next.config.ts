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
      },
      {
        protocol:"https",
        hostname:"cdn.dummyjson.com",
      },
      {
        protocol:"https",
        hostname:"fakestoreapi.com",
      },
      {
        protocol:"https",
        hostname:"api.escuelajs.co",
      },
      {
        protocol:"https",
        hostname:"i.imgur.com",
      },
      {
        protocol:"https",
        hostname:"imgur.com",
      },
      {
        protocol:"https",
        hostname:"in-files.apjonlinecdn.com",
      },
      {
        protocol:"https",
        hostname:"www.apple.com",
      },
      // Common image CDNs (wildcard patterns)
      {
        protocol:"https",
        hostname:"**.ftcdn.net", // Adobe Stock/Fotolia
      },
      {
        protocol:"https",
        hostname:"**.pexels.com",
      },
      {
        protocol:"https",
        hostname:"pixabay.com",
      },
      {
        protocol:"https",
        hostname:"**.pixabay.com",
      },
      {
        protocol:"https",
        hostname:"**.shutterstock.com",
      },
      {
        protocol:"https",
        hostname:"**.gettyimages.com",
      },
      {
        protocol:"https",
        hostname:"images-na.ssl-images-amazon.com",
      },
      {
        protocol:"https",
        hostname:"m.media-amazon.com",
      },
      {
        protocol:"https",
        hostname:"**.cdninstagram.com",
      },
      {
        protocol:"https",
        hostname:"lh3.googleusercontent.com",
      },
      {
        protocol:"https",
        hostname:"**.googleapis.com",
      },
      {
        protocol:"https",
        hostname:"**.hiclipart.com",
      }
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60,
  },
  // Admin panel optimizations
  compress: true,
  output: 'standalone',
  reactStrictMode: true,
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
