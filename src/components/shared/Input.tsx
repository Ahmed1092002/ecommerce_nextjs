import { Input as ShadcnInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <ShadcnInput {...props} className={error ? "border-red-500" : ""} />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
