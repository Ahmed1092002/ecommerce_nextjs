"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Home,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Store,
} from "lucide-react";
import { Button } from "../shared/Button";
import { useAuth } from "@/hooks/useAuth";

interface SellerSidebarProps {
  navItems?: { label: string; href: string; icon?: React.ReactNode }[];
}

export function SellerSidebar({ navItems }: SellerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, User } = useAuth();

  // Default navigation items
  const defaultItems = [
    {
      label: "Dashboard",
      href: "/seller/dashboard",
      icon: <Home className="h-4 w-4" />,
    },
    {
      label: "Products",
      href: "/seller/products",
      icon: <Package className="h-4 w-4" />,
    },
    {
      label: "Orders",
      href: "/seller/orders",
      icon: <ShoppingCart className="h-4 w-4" />,
    },
    {
      label: "Analytics",
      href: "/seller/analytics",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      label: "Settings",
      href: "/seller/settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  // Use provided navItems or default items
  const items = navItems ?? defaultItems;

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <SidebarProvider>
      <Sidebar className="w-64 border-r bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100 shadow-xl">
        {/* Header */}
        <SidebarHeader className="px-6 py-6 border-b border-slate-700 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex flex-col gap-1">
            <div className="text-xl font-bold text-white flex items-center gap-2">
              🏪 <span>Seller Panel</span>
            </div>
            {User && (
              <div className="text-xs text-blue-100 font-medium">
                {User.username || User.email}
              </div>
            )}
          </div>
        </SidebarHeader>

        {/* Navigation Menu */}
        <SidebarContent className="py-4">
          <SidebarMenu>
            {items.map((item) => {
              // Check if current path matches this item
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-lg"
                          : "text-slate-300 hover:bg-slate-700 hover:text-white hover:translate-x-1"
                      }`}
                    >
                      <span
                        className={isActive ? "text-white" : "text-slate-400"}
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        {/* Footer with Actions */}
        <SidebarFooter className="px-4 py-4 border-t border-slate-700 space-y-2 bg-slate-900/50">
          {/* Back to Store Button */}
          <Link href="/products" className="block">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 bg-slate-800 border-slate-600 text-slate-200 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-500 hover:text-white hover:border-blue-500 transition-all"
            >
              <Store className="h-4 w-4" />
              <span>View Store</span>
            </Button>
          </Link>

          {/* Logout Button */}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-2 text-slate-300 hover:bg-red-600 hover:text-white transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
