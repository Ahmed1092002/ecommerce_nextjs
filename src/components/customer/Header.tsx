"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  return (
    <header className="border-b bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-white hover:text-orange-200 transition-colors"
        >
          🛒 Store
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/products">
            <Button
              variant="ghost"
              className="text-white hover:bg-blue-700 hover:text-orange-200"
            >
              Products
            </Button>
          </Link>
          <Link href="/cart">
            <Button
              variant="ghost"
              className="text-white hover:bg-blue-700 hover:text-orange-200"
            >
              Cart
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                <Avatar>
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/orders">Orders</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
