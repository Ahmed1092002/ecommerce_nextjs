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
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto p-4 flex justify-between">
          <Link href="/" className="font-bold">
            Store
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/">Home</Link>
            <Link href="/products">Products</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/orders">Orders History</Link>
            <Link href="/profile">Profile</Link>
          </nav>
          {Loading ? (
            <Button variant="outline" disabled>
              Loading...
            </Button>
          ) : User ? (
            <Button variant="outline" onClick={() => logout()}>
              Logout
            </Button>
          ) : (
            <Button variant="outline" onClick={() => router.push("/login")}>
              Login
            </Button>
          )}
        </div>
      </header>
      <main className="flex-1 bg-gray-50">{children}</main>
      <footer className="text-center text-xs py-4 text-gray-500 border-t">
        © {new Date().getFullYear()} Store
      </footer>
    </div>
  );
}
