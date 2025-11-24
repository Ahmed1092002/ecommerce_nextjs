import React from "react";
import Link from "next/link";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto p-4 flex justify-between">
          <Link href="/" className="font-bold">
            Store
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/products">Products</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/orders">Orders</Link>
            <Link href="/profile">Profile</Link>
            <Link href="/seller/dashboard">Seller</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 bg-gray-50">{children}</main>
      <footer className="text-center text-xs py-4 text-gray-500 border-t">
        © {new Date().getFullYear()} Store
      </footer>
    </div>
  );
}
