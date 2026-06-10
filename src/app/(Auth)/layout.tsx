"use client";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Store } from "lucide-react";
import logo from "../../../public/images/logo-transparent.png";
import Image from "next/image";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-[var(--primary)] p-10 text-white">
        <div className="flex items-center gap-2 text-lg font-bold">
          <Image
            src={logo}
            alt="Aura Shop Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span>Aura Shop</span>
        </div>
        <div className="space-y-6 max-w-lg">
          <h1 className="text-4xl font-bold tracking-tight">
            "The best e-commerce platform for all your needs. Quality products,
            fast delivery, and excellent support."
          </h1>
        </div>
        <div className="text-sm text-white/80">
          © {new Date().getFullYear()} Aura Shop. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col p-6 lg:p-10 justify-center items-center bg-background">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Enter your email below to create your account"}
            </p>
          </div>

          {children}

 
        </div>
      </div>
    </div>
  );
}
