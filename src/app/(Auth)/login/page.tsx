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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Show API error from useAuth hook */}
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
          {error}
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
        className="w-full"
      >
        Login
      </Button>
    </form>
  );
}
