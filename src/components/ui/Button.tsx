import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

const variantClasses = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800",
  secondary: "bg-white text-stone-800 border border-surface-border hover:bg-stone-50",
  ghost: "bg-transparent text-stone-600 hover:bg-stone-100",
  danger: "bg-red-50 text-red-600 hover:bg-red-100",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm font-medium",
  lg: "px-5 py-3 text-base font-semibold",
};

export function Button({ variant = "primary", size = "md", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-button transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
