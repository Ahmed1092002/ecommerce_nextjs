import React from "react";
import Link from "next/link";
import { SellerSidebar } from "@/components/seller/SellerSIdeBar";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <SellerSidebar />
      <main className="flex-1 bg-background p-6">{children}</main>
    </div>
  );
}
