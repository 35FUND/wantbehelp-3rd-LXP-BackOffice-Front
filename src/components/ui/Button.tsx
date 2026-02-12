import * as React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "accent"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "primary"
    | "success"
    | "warning"
    | "error"
    | "info";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg" | "md";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-primary text-white shadow-sm hover:bg-primary-dark hover:shadow transition-all duration-200 active:scale-[0.98]",
      accent: "bg-accent text-white shadow-sm hover:bg-accent-dark hover:shadow transition-all duration-200 active:scale-[0.98]",
      destructive: "bg-destructive text-white shadow-sm hover:bg-red-700 transition-colors",
      outline: "border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors",
      secondary: "bg-primary-50 text-primary-dark hover:bg-primary-100 transition-colors",
      ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors",
      link: "bg-transparent text-primary underline-offset-4 hover:underline",
      primary: "bg-primary text-white shadow-sm hover:bg-primary-dark hover:shadow transition-all duration-200 active:scale-[0.98]",
      success: "bg-success text-white shadow-sm hover:bg-green-700 transition-colors",
      warning: "bg-warning text-white shadow-sm hover:bg-yellow-600 transition-colors",
      error: "bg-error text-white shadow-sm hover:bg-red-700 transition-colors",
      info: "bg-info text-white shadow-sm hover:bg-blue-700 transition-colors",
    };

    const sizes = {
      default: "h-10 px-4 text-sm",
      sm: "h-8 px-3 text-sm",
      lg: "h-11 px-6 text-base",
      icon: "h-10 w-10",
      "icon-sm": "h-8 w-8",
      "icon-lg": "h-11 w-11",
      md: "h-10 px-4 text-sm",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-gray-900/20 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
