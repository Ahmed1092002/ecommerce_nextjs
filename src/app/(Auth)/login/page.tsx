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
  const { login: loginFunction } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    await loginFunction(data as LoginCredentials);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
