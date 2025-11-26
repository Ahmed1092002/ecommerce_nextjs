"use client";
import { useAuth } from "@/hooks/useAuth";
import { RegisterData } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        label="Email"
        type="email"
        placeholder="Enter your email"
        id="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Username"
        placeholder="Enter your username"
        id="username"
        error={errors.username?.message}
        {...register("username")}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        id="password"
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="space-y-2">
        <label
          htmlFor="userType"
          className="text-sm font-semibold text-slate-700"
        >
          👤 Account Type
        </label>
        <Select
          value={userType}
          onValueChange={(value) =>
            setValue("userType", value as "CUSTOMER" | "SELLER")
          }
        >
          <SelectTrigger
            id="userType"
            className="border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CUSTOMER" className="hover:bg-blue-50">
              🛍️ Customer
            </SelectItem>
            <SelectItem value="SELLER" className="hover:bg-orange-50">
              🏪 Seller
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.userType && (
          <p className="text-sm text-red-500 font-medium">
            ❌ {errors.userType.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        loadingText="Creating your account..."
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all"
      >
        ✨ Create Account
      </Button>

      <p className="text-center text-sm text-slate-600 mt-4">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-blue-600 hover:text-orange-500 font-semibold transition-colors"
        >
          Login here
        </a>
      </p>
    </form>
  );
}
