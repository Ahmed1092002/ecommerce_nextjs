"use client";
import React from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" min-h-screen flex flex-col bg-background font-sans antialiased justify-center items-center ">
      <Navbar />
      <main className="container  w-full mx-auto flex-1 py-2">{children}</main>
      <Footer />
    </div>
  );
}
