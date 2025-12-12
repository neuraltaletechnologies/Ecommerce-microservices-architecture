import { clerkMiddleware } from '@clerk/nextjs/server';
import { performanceMiddleware } from './middleware/performance';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  // Apply performance headers first
  const performanceResponse = performanceMiddleware(request);
  
  // Then apply Clerk authentication
  return clerkMiddleware({
    // Enable debug mode only in development
    debug: process.env.NODE_ENV === 'development',
    // Preload user data for better performance
    signInUrl: '/sign-in',
    signUpUrl: '/sign-up',
  })(request, performanceResponse);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};