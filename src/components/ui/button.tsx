"use client";

import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white active:scale-[0.98]",
  secondary:
    "bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--bg-elevated)]",
  ghost:
    "bg-transparent hover:bg-[var(--bg-card)] text-[var(--text-secondary)]",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`min-h-12 px-6 rounded-xl font-medium transition-all duration-150
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        disabled:opacity-40 disabled:pointer-events-none
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
