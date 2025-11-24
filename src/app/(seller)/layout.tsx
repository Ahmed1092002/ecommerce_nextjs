import React from "react";
import Link from "next/link";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-gray-900 text-gray-100 flex flex-col">
        <div className="p-4 font-semibold border-b border-gray-700">
          Seller Panel
        </div>
        <nav className="flex-1 p-4 space-y-2 text-sm">
          <Link href="/seller/dashboard" className="block hover:text-white">
            Dashboard
          </Link>
          <Link href="/seller/products" className="block hover:text-white">
            Products
          </Link>
          <Link href="/seller/orders" className="block hover:text-white">
            Orders
          </Link>
          <Link href="/seller/analytics" className="block hover:text-white">
            Analytics
          </Link>
          <Link href="/" className="block text-gray-400 hover:text-white">
            Back to Store
          </Link>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-6">{children}</main>
    </div>
  );
}
