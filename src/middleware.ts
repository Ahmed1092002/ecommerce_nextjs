import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Get authentication info from cookies
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value; // "CUSTOMER" or "SELLER"
  const { pathname } = request.nextUrl; // Current URL path (e.g., "/login", "/seller/dashboard")

  // ============================================
  // STEP 1: Allow API routes to pass through
  // ============================================
  // API routes don't need authentication checks
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // ============================================
  // STEP 2: Check if route is public
  // ============================================
  // Public routes = anyone can access without login
  const isHomePage = pathname === "/";
  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const isProductsPage = pathname.startsWith("/products");
  const isAboutPage = pathname.startsWith("/about");
  const isContactPage = pathname.startsWith("/contact");

  const isPublicRoute =
    isHomePage ||
    isLoginPage ||
    isRegisterPage ||
    isProductsPage ||
    isContactPage ||
    isAboutPage;

  // ============================================
  // STEP 3: Handle public routes
  // ============================================
  if (isPublicRoute) {
    // If user is already logged in and tries to access login/register pages
    if (token && (isLoginPage || isRegisterPage)) {
      // Sellers go to their dashboard
      if (role === "SELLER") {
        return NextResponse.redirect(new URL("/seller/dashboard", request.url));
      }
      // Customers go to home page
      return NextResponse.redirect(new URL("/", request.url));
    }

    // If seller is logged in and tries to access home page
    if (token && isHomePage && role === "SELLER") {
      // Redirect seller to their dashboard instead
      return NextResponse.redirect(new URL("/seller/dashboard", request.url));
    }

    // Allow access to public routes
    return NextResponse.next();
  }

  // ============================================
  // STEP 4: Check authentication for protected routes
  // ============================================
  // If no token, user is not logged in
  if (!token) {
    // Redirect to login page
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ============================================
  // STEP 5: Handle seller routes
  // ============================================
  // Routes starting with "/seller" are only for sellers
  if (pathname.startsWith("/seller")) {
    // Check if user is a seller
    if (role !== "SELLER") {
      // Not a seller? Redirect to home page
      return NextResponse.redirect(new URL("/", request.url));
    }
    // User is a seller, allow access
    return NextResponse.next();
  }

  // ============================================
  // STEP 6: Handle customer-only routes
  // ============================================
  // These routes are only for customers, not sellers
  const isCartPage = pathname.startsWith("/cart");
  const isCheckoutPage = pathname.startsWith("/checkout");
  const isOrdersPage = pathname.startsWith("/orders");
  const isProfilePage = pathname.startsWith("/profile");

  const isCustomerRoute =
    isCartPage || isCheckoutPage || isOrdersPage || isProfilePage;

  if (isCustomerRoute) {
    // If seller tries to access customer routes
    if (role === "SELLER") {
      // Redirect seller to their dashboard
      return NextResponse.redirect(new URL("/seller/dashboard", request.url));
    }
    // Customer can access, continue
  }

  // ============================================
  // STEP 7: Allow all other authenticated routes
  // ============================================
  // If we get here, user is authenticated and route is allowed
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
