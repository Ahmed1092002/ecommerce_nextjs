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
  const { register: registerFunction } = useAuth();
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
    await registerFunction(data as RegisterData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        <label htmlFor="userType" className="text-sm font-medium">
          Account Type
        </label>
        <Select
          value={userType}
          onValueChange={(value) =>
            setValue("userType", value as "CUSTOMER" | "SELLER")
          }
        >
          <SelectTrigger id="userType">
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CUSTOMER">Customer</SelectItem>
            <SelectItem value="SELLER">Seller</SelectItem>
          </SelectContent>
        </Select>
        {errors.userType && (
          <p className="text-sm text-red-500">{errors.userType.message}</p>
        )}
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        loadingText="Registering..."
        className="w-full"
      >
        Register
      </Button>
    </form>
  );
}
