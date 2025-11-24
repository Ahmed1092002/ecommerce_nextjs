"use client";
import { Button as ShadcnButton } from "@/components/ui/button";
import { type ComponentProps } from "react";

interface ButtonProps extends ComponentProps<typeof ShadcnButton> {
  isLoading?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
}

export function Button({
  children,
  isLoading,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <ShadcnButton disabled={disabled || isLoading} {...props}>
      {isLoading ? "Loading..." : children}
    </ShadcnButton>
  );
}
