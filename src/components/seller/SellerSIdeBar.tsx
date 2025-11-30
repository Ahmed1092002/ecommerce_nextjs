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
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface SellerSidebarProps {
  navItems?: { label: string; href: string; icon?: React.ReactNode }[];
}

export function SellerSidebar({ navItems }: SellerSidebarProps) {
  const pathname = usePathname();
  // const router = useRouter();
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
      <Sidebar className="w-64 border-r bg-sidebar text-sidebar-foreground">
        {/* Header */}
        <SidebarHeader className="px-6 py-6 border-b border-sidebar-border">
          <div className="flex flex-col gap-1">
            <div className="text-xl font-bold flex items-center gap-2">
              <Store className="h-6 w-6" />
              <span>Seller Panel</span>
            </div>
            {User && (
              <div className="text-xs text-muted-foreground font-medium">
                {User.username || User.email}
              </div>
            )}
          </div>
        </SidebarHeader>

        {/* Navigation Menu */}
        <SidebarContent className="py-4 px-2">
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
                          ? "bg-primary/10 text-primary border-l-4 border-primary pl-2"
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
        <SidebarFooter className="px-4 py-4 border-t border-sidebar-border space-y-2">
          {/* Back to Store Button */}
          <Link href="/products" className="block">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Store className="h-4 w-4" />
              <span>View Store</span>
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
