"use client";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoginCredentials } from "@/types/user";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";

const loginSchema = z.object({
  login: z.string().min(1, "Login is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login: loginFunction, error } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginFunction(data as LoginCredentials);
    } catch (error) {
      // Error is already handled by useAuth hook and set in error state
      // No need to do anything here, the error will be displayed automatically
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Show API error from useAuth hook */}
      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm animate-shake">
          ❌ {error}
        </div>
      )}

      <Input
        label="Login"
        placeholder="Enter your login"
        id="login"
        error={errors.login?.message}
        {...register("login")}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        id="password"
        error={errors.password?.message}
        {...register("password")}
      />

      <Button
        type="submit"
        isLoading={isSubmitting}
        loadingText="Logging in..."
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all"
      >
        🚀 Login
      </Button>

      <p className="text-center text-sm text-slate-600 mt-4">
        Don't have an account?{" "}
        <a
          href="/register"
          className="text-blue-600 hover:text-orange-500 font-semibold transition-colors"
        >
          Register here
        </a>
      </p>
    </form>
  );
}
