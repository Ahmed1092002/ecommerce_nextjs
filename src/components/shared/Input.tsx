import { Input as ShadcnInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <Label
            htmlFor={props.id || props.name}
            className={error ? "text-red-500" : "text-slate-700 font-medium"}
          >
            {label}
          </Label>
        )}
        <ShadcnInput
          ref={ref}
          {...props}
          className={cn(
            "transition-all duration-200 focus:ring-2",
            error
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-slate-300 focus:border-blue-500 focus-visible:ring-blue-500",
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
            className="text-sm text-red-500 mt-1"
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
