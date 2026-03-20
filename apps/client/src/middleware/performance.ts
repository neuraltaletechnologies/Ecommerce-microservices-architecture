/**
 * Performance Optimization Middleware
 * Adds caching headers and security headers for better performance and SEO
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function performanceMiddleware(request: NextRequest) {
  const response = NextResponse.next();
  
  const { pathname } = request.nextUrl;
  
  // Cache static assets aggressively
  if (
    pathname.startsWith('/_next/static/') ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|avif|ico|woff|woff2|ttf|eot)$/i)
  ) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }
  
  // Cache product images from Cloudinary
  if (pathname.includes('cloudinary.com')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=86400, stale-while-revalidate=43200'
    );
  }
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Add performance headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  
  return response;
}
