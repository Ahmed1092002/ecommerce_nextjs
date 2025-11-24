import React from "react";
import Link from "next/link";
import { SellerSidebar } from "@/components/seller/SellerSIdeBar";
import { BarChart3, Home, Package, Settings, ShoppingCart } from "lucide-react";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { label: "Dashboard", href: "/seller/dashboard", icon: <Home /> },
    { label: "Products", href: "/seller/products", icon: <Package /> },
    { label: "Orders", href: "/seller/orders", icon: <ShoppingCart /> },
    { label: "Analytics", href: "/seller/analytics", icon: <BarChart3 /> },
    { label: "Settings", href: "/seller/settings", icon: <Settings /> },
  ];
  return (
    <div className="min-h-screen flex">
      <SellerSidebar navItems={navItems} />
      <main className="flex-1 bg-gray-50 p-6">{children}</main>
    </div>
  );
}
