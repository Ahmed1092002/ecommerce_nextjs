"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  User2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface SellerSidebarProps {
  navItems?: { label: string; href: string; icon?: React.ReactNode }[];
}

export function SellerSidebar({ navItems }: SellerSidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  // Default navigation items
  const defaultItems = [
    {
      label: "Dashboard",
      href: "/seller/dashboard",
      icon: <Home className="h-4 w-4" />,
    },
    {
      label: "Products",
      href: "/seller/product",
      icon: <Package className="h-4 w-4" />,
    },
    {
      label: "Orders",
      href: "/seller/orders",
      icon: <ShoppingCart className="h-4 w-4" />,
    },
    {
      label: "Analytics",
      href: "/seller/analysis",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      label: "Addresses",
      href: "/seller/addresses",
      icon: <MapPin className="h-4 w-4" />,
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
    <SidebarProvider className="border-r border-(--sidebar-border)">
      <Sidebar className="w-64  border-none bg-sidebar text-sidebar-foreground">
        {/* Header */}
        <SidebarHeader className="px-6 py-6  border-none border-sidebar-border bg-[var(--primary)] ">
          <div className="flex flex-col gap-1 text-white">
            <div className="text-xl font-bold flex items-center gap-2">
              <Store className="h-6 w-6" />
              <span>Seller Panel</span>
            </div>
            {user && (
              <div className="text-xs text-muted-foreground font-medium">
                {"username" in user
                  ? user.username
                  : "businessName" in user
                  ? user.businessName
                  : user.email}
              </div>
            )}
          </div>
        </SidebarHeader>

        {/* Navigation Menu */}
        <SidebarContent className="py-4 px-2 ">
          <SidebarMenu>
            {items.map((item) => {
              // Check if current path matches this item
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className="w-full"
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        isActive
                          ? "bg-[var(--primary)]/10 text-[var(--primary)] border-l-4 border-[var(--primary)] pl-2"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:pl-4"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        {/* Footer with Actions */}
        <SidebarFooter className="px-4 py-4 border-t border-[var(--sidebar-border)] space-y-2">
          {/* Back to Store Button */}
          <Link href="/seller/profile" className="block">
            <Button variant="outline" className="w-full justify-start gap-2">
              <User2 className="h-4 w-4" />
              <span>Profile</span>
            </Button>
          </Link>

          {/* Logout Button */}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-2 hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
