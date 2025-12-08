"use client";
import { useAuth } from "@/hooks/useAuth";
import { RegisterData } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  userType: z.enum(["CUSTOMER", "SELLER"] as [string, ...string[]]),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerFunction, error } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const userType = watch("userType");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerFunction(data as RegisterData);
    } catch {
      // Error is already handled by useAuth hook and set in error state
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
          {error}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="name@example.com"
        id="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Username"
        placeholder="johndoe"
        id="username"
        error={errors.username?.message}
        {...register("username")}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Create a password"
        id="password"
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="space-y-2">
        <Label htmlFor="userType">Account Type</Label>
        {/* The RadioGroup replaces the Select component */}
        <RadioGroup
          id="userType"
          // Set the current value from React Hook Form's 'userType'
          value={userType}
          // Update the value using React Hook Form's 'setValue' when a radio button is clicked
          onValueChange={(value) =>
            setValue("userType", value as "CUSTOMER" | "SELLER")
          }
          // Optional: Add a class to space the radio buttons out horizontally
          className="flex space-x-4"
        >
          {/* First Radio Button: Customer */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="CUSTOMER" id="customer" />
            <Label htmlFor="customer">Customer</Label>
          </div>

          {/* Second Radio Button: Seller */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="SELLER" id="seller" />
            <Label htmlFor="seller">Seller</Label>
          </div>
        </RadioGroup>

        {/* Keep the error message */}
        {errors.userType && (
          <p className="text-sm text-destructive font-medium">
            {errors.userType.message}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Account
      </Button>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </div>
    </form>
  );
}
