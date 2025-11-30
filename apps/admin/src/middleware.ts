import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { CustomJwtSessionClaims } from "@repo/types";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/unauthorized(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect all other routes
  await auth.protect();

  const { userId, sessionClaims } = await auth();

  if (userId && sessionClaims) {
    const userRole = (sessionClaims as CustomJwtSessionClaims).metadata?.role;

    // Check if user has admin role
    if (userRole !== "admin") {
      console.log(`Access denied for user ${userId}. Role: ${userRole || 'none'}`);
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
