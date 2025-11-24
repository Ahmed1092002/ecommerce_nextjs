import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;

  // Allow API routes to pass through
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register", "/products"];
  const isPublicRoute =
    publicRoutes.includes(pathname) || pathname.startsWith("/products/"); // Allow /products/[id]

  // If accessing a public route, allow it
  if (isPublicRoute) {
    // If authenticated user tries to access login/register, redirect them
    if (token && ["/login", "/register"].includes(pathname)) {
      if (role === "SELLER") {
        return NextResponse.redirect(new URL("/seller/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Seller routes - only SELLER role can access
  if (pathname.startsWith("/seller")) {
    if (role !== "SELLER") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Customer-only routes (cart, checkout, orders, profile)
  const customerOnlyRoutes = ["/cart", "/checkout", "/orders", "/profile"];
  if (customerOnlyRoutes.some((route) => pathname.startsWith(route))) {
    // These routes are accessible to CUSTOMER role
    // (SELLER can also access if needed, or restrict to CUSTOMER only)
    return NextResponse.next();
  }

  // Allow all other routes for authenticated users
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
