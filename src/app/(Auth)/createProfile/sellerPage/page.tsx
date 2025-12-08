"use client";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CreateSellerProfile } from "@/types/user";
const loginSchema = z.object({
  businessName: z.string().min(1, "Business Name is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;
export default function CreateSellerPage() {
  const { createSellerProfile } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateSellerProfile>({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = async (data: CreateSellerProfile) => {
    try {
      await createSellerProfile(data);
    } catch {
      // Error is already handled by useAuth hook and set in error state
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <h1>Create Seller Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Business Name"
          type="text"
          placeholder="Enter your business name"
          id="businessName"
          error={errors.businessName?.message}
          {...register("businessName")}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Seller
        </Button>
      </form>
    </div>
  );
}
