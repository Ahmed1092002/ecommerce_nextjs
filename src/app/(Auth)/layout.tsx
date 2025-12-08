"use client";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Store } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/login";

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-[var(--primary)] p-10 text-white">
        <div className="flex items-center gap-2 text-lg font-bold">
          <Store className="h-6 w-6" />
          <span>Acme Store</span>
        </div>
        <div className="space-y-6 max-w-lg">
          <h1 className="text-4xl font-bold tracking-tight">
            "The best e-commerce platform for all your needs. Quality products,
            fast delivery, and excellent support."
          </h1>
        </div>
        <div className="text-sm text-white/80">
          © 2024 Acme Inc. All rights reserved.
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

          <div className="relative gap-2 flex flex-col">
            <div className="inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" disabled>
              Github
            </Button>
            <Button variant="outline" type="button" disabled>
              Google
            </Button>
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
