"use client";
import { Button as ShadcnButton } from "@/components/ui/button";
import { type ComponentProps } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ComponentProps<typeof ShadcnButton> {
  isLoading?: boolean;
  loadingText?: string;
}

export function Button({
  children,
  isLoading,
  loadingText,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <ShadcnButton
      disabled={disabled || isLoading}
      className={cn(className)}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading ? loadingText || "Loading..." : children}
    </ShadcnButton>
  );
}
