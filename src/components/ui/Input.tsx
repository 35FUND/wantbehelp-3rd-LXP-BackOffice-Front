import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "search";
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", label, error, ...props }, ref) => {
    const variants = {
      default: "h-10 bg-white",
      search: "h-10 bg-gray-50",
    };

    return (
      <div className="w-full space-y-1.5">
        {label ? <label className="text-sm font-medium text-gray-700">{label}</label> : null}
        <input
          type={type}
          className={cn(
            "w-full rounded-lg border border-gray-200 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 disabled:cursor-not-allowed disabled:opacity-50",
            variants[variant],
            error ? "border-red-500" : "border-gray-200",
            className
          )}
          ref={ref}
          {...props}
        />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
