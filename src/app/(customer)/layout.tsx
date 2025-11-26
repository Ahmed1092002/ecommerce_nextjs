"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout, User, Loading } = useAuth();
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto p-5 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-white hover:text-orange-200 transition-colors"
          >
            🛍️ Store
          </Link>
          <nav className="flex gap-6 text-sm font-medium">
            <Link
              href="/"
              className="text-white hover:text-orange-200 transition-colors hover:scale-110 transform"
            >
              🏠 Home
            </Link>
            <Link
              href="/products"
              className="text-white hover:text-orange-200 transition-colors hover:scale-110 transform"
            >
              📦 Products
            </Link>
            <Link
              href="/cart"
              className="text-white hover:text-orange-200 transition-colors hover:scale-110 transform"
            >
              🛒 Cart
            </Link>
            <Link
              href="/orders"
              className="text-white hover:text-orange-200 transition-colors hover:scale-110 transform"
            >
              📋 Orders
            </Link>
            <Link
              href="/profile"
              className="text-white hover:text-orange-200 transition-colors hover:scale-110 transform"
            >
              👤 Profile
            </Link>
          </nav>
          {Loading ? (
            <Button
              variant="outline"
              disabled
              className="bg-white/10 text-white border-white/30"
            >
              Loading...
            </Button>
          ) : User ? (
            <Button
              variant="outline"
              onClick={() => logout()}
              className="bg-white/10 text-white border-white/30 hover:bg-red-600 hover:border-red-600 hover:text-white font-semibold transition-all"
            >
              🚪 Logout
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => router.push("/login")}
              className="bg-white text-blue-600 border-white hover:bg-orange-500 hover:text-white hover:border-orange-500 font-semibold transition-all"
            >
              🔐 Login
            </Button>
          )}
        </div>
      </header>
      <main className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50/30 to-orange-50/20">
        {children}
      </main>
      <footer className="text-center py-6 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 border-t border-slate-700">
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} Store - Your Trusted E-Commerce Platform
        </p>
        <p className="text-xs text-slate-500 mt-1">Made with ❤️ and ☕</p>
      </footer>
    </div>
  );
}
