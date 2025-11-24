// ...existing code...
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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Home,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "../shared/Button";

interface SellerSidebarProps {
  navItems?: { label: string; href: string; icon?: React.ReactNode }[];
}

export function SellerSidebar({ navItems }: SellerSidebarProps) {
  const pathname = usePathname();

  const items = navItems ?? [
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

  return (
    <SidebarProvider>
      <Sidebar className="w-64 border-r bg-slate-900 text-slate-100">
        <SidebarHeader className="px-6 py-4">
          <div className="text-lg font-semibold">Seller Panel</div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {items.map((it) => {
              const active = pathname?.startsWith(it.href);
              return (
                <SidebarMenuItem key={it.href}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={it.href}
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm hover:bg-slate-800 ${
                        active ? "bg-slate-800 text-white" : "text-slate-200"
                      }`}
                    >
                      {it.icon}
                      <span>{it.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="px-4 py-3 border-t border-slate-800">
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline" className="w-full">
                Back to Store
              </Button>
            </Link>
            <Button variant="ghost" className="ml-2">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
// ...existing code...
