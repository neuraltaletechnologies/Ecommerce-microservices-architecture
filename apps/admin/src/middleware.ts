import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { CustomJwtSessionClaims } from "@repo/types";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/unauthorized(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  
  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect all other routes - if not authenticated, Clerk will redirect to sign-in
  try {
    await auth.protect(); 
  } catch (error) {
    // User not authenticated, let Clerk handle the redirect
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const { userId, sessionClaims } = await auth();

  if (userId && sessionClaims) {
    const claims = sessionClaims as CustomJwtSessionClaims;
    
    // Debug logging
    console.log('Session Claims:', JSON.stringify({
      userId,
      publicMetadata: claims.publicMetadata,
      metadata: claims.metadata,
      hasPublicMetadata: !!claims.publicMetadata,
      hasMetadata: !!claims.metadata
    }, null, 2));
    
    // Check both publicMetadata and metadata for the role
    const userRole = claims.publicMetadata?.role || claims.metadata?.role;

    // Check if user has admin role
    if (userRole !== "admin") {
      console.log(`Access denied for user ${userId}. Role: ${userRole || 'none'}. Redirecting to /unauthorized`);
      
      // Avoid redirect loop - if already on unauthorized page, allow it
      if (pathname === "/unauthorized") {
        return NextResponse.next();
      }
      
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
