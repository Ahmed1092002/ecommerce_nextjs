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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <Card className="w-full max-w-md shadow-2xl border-2 border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="text-white hover:bg-white/20 hover:text-white"
            >
              ← Back to Home
            </Button>
          </div>

          {/* Toggle Buttons */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={isLogin ? "default" : "outline"}
              className={`flex-1 transition-all ${
                isLogin
                  ? "bg-white text-blue-600 hover:bg-blue-50"
                  : "bg-transparent border-white/50 text-white hover:bg-white/20"
              }`}
              onClick={() => router.push("/login")}
              asChild
            >
              <Link href="/login">🔐 Login</Link>
            </Button>
            <Button
              variant={isRegister ? "default" : "outline"}
              className={`flex-1 transition-all ${
                isRegister
                  ? "bg-white text-blue-600 hover:bg-blue-50"
                  : "bg-transparent border-white/50 text-white hover:bg-white/20"
              }`}
              onClick={() => router.push("/register")}
              asChild
            >
              <Link href="/register">✨ Register</Link>
            </Button>
          </div>

          <CardTitle className="text-center text-2xl font-bold">
            {isLogin ? "Welcome Back! 👋" : "Join Us Today! 🚀"}
          </CardTitle>
          <p className="text-center text-blue-100 text-sm mt-2">
            {isLogin
              ? "Login to access your account"
              : "Create your account in seconds"}
          </p>
        </CardHeader>
        <CardContent className="pt-6 pb-8">
          {isLogin ? <LoginPage /> : <RegisterPage />}
        </CardContent>
      </Card>
    </div>
  );
}
