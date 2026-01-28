import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_PAGES = ["/signin", "/signup"];
const PROTECTED_ROUTES: { [key: string]: string[] } = {
  // "/": ["admin"], // Only accessible to users with the 'admin' role
  "/products": ["admin"], // Only accessible to users with the 'admin' role
  "/warehouse": ["admin"], // Only accessible to users with the 'admin' role
  "/inventory": ["admin", "manager"], // Accessible to admins and managers
  "/reports": ["admin", "manager", "sales"], // Accessible to admins, managers, and analysts
  "/inventory/warehouse": ["manager", "analyst"], // Accessible to admins, managers, and analysts
};

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Skip middleware for static files or API routes
  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Retrieve the token (includes user info from the JWT callback)
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const userRole = token?.roleId;

  // Redirect unauthenticated users
  if (!token && !AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  // Redirect authenticated users away from auth pages
  if (token && AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Role-based protection for protected routes
  const matchedRoute = Object.keys(PROTECTED_ROUTES).find((route) =>
    pathname.startsWith(route)
  );

  if (matchedRoute) {
    const allowedRoles = PROTECTED_ROUTES[matchedRoute];

    // Ensure the token includes the role and the role is allowed
    if (!userRole || !allowedRoles.includes(userRole?.toLowerCase())) {
      console.log(token);
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // Allow request to continue
  return NextResponse.next();
}

// Middleware configuration
export const config = {
  matcher: ["/", "/reports", "/signup"], // Define the routes to apply middleware
};
