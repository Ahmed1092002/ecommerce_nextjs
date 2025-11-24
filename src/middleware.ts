import { NextRequest, NextResponse } from "next/server";
import path from "path";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }
  if (!token && pathname !== "/login" && pathname !== "/register") {
    const loginUrl = new URL("/", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (role === "SELLER" && !pathname.startsWith("/seller")) {
    const sellerUrl = new URL("/seller/dashboard", request.url);
    return NextResponse.redirect(sellerUrl);
  }

  if (role !== "SELLER" && pathname.startsWith("/seller")) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  if (token && ["/login", "/register"].includes(pathname)) {
    if (role === "SELLER") {
      const sellerUrl = new URL("/seller/dashboard", request.url);
      return NextResponse.redirect(sellerUrl);
    }
    if (role === "CUSTOMER") {
      const homeUrl = new URL("/", request.url);
      return NextResponse.redirect(homeUrl);
    }

    return NextResponse.redirect(new URL("/", request.url));
  }

  const customerPages = ["/cart", "/checkout", "/orders"];
  if (customerPages.some((p) => pathname.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
