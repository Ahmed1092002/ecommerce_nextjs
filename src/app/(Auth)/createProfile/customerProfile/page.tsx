"use client";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CreateCustomerProfile } from "@/types/user";
const loginSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;
export default function CreateCustomerPage() {
  const { createCustomerProfile } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCustomerProfile>({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = async (data: CreateCustomerProfile) => {
    try {
      await createCustomerProfile(data);
    } catch {
      // Error is already handled by useAuth hook and set in error state
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <h1>Create Customer Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Name"
          type="text"
          placeholder="Enter your name"
          id="name"
          error={errors.name?.message}
          {...register("name")}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Customer
        </Button>
      </form>
    </div>
  );
}
