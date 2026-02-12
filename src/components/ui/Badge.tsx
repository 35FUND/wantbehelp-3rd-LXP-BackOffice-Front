import * as React from "react";
import { cn } from "../../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "destructive"
    | "info"
    | "outline"
    | "published"
    | "draft"
    | "archived";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-primary text-white shadow-sm",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    success: "border-transparent bg-success text-white shadow-sm",
    warning: "border-transparent bg-warning text-white shadow-sm",
    error: "border-transparent bg-error text-white shadow-sm",
    info: "border-transparent bg-info text-white shadow-sm",
    destructive: "border-transparent bg-destructive text-white shadow-sm",
    outline: "text-gray-700 border-gray-200 bg-white shadow-sm",
    published: "border-transparent bg-success text-white shadow-sm",
    draft: "border-transparent bg-gray-600 text-white shadow-sm",
    archived: "border-transparent bg-gray-300 text-gray-700",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
