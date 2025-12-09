import { Input as ShadcnInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: "default" | "outline" | "filled" | "ghost" | "secondary" | "search";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, variant = "default", className, size, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <Label
            htmlFor={props.id || props.name}
            className={
              error ? "text-destructive" : "text-foreground font-medium"
            }
          >
            {label}
          </Label>
        )}
        <ShadcnInput
          ref={ref}
          variant={variant}
          {...props}
          className={cn(
            "transition-all duration-200",
            error
              ? "border-destructive focus-visible:ring-destructive"
              : "border-input focus-visible:ring-ring",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error ? `${props.id || props.name}-error` : undefined
          }
        />
        {error && (
          <p
            id={`${props.id || props.name}-error`}
            className="text-sm text-destructive mt-1"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
