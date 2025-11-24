"use client";
import RegisterPage from "./register/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginPage from "./login/page";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/login";
  const isRegister = pathname === "/register";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              ← Back to Home
            </Button>
          </div>

          {/* Toggle Buttons */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={isLogin ? "default" : "outline"}
              className="flex-1"
              onClick={() => router.push("/login")}
              asChild
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button
              variant={isRegister ? "default" : "outline"}
              className="flex-1"
              onClick={() => router.push("/register")}
              asChild
            >
              <Link href="/register">Register</Link>
            </Button>
          </div>

          <CardTitle className="text-center">
            {isLogin ? "Login to your account" : "Create an account"}
          </CardTitle>
        </CardHeader>
        <CardContent>{isLogin ? <LoginPage /> : <RegisterPage />}</CardContent>
      </Card>
    </div>
  );
}
