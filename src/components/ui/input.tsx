"use client";

import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-[var(--text-secondary)] mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full min-h-12 px-4 bg-[var(--bg-card)] border border-[var(--bg-elevated)]
          rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50
          focus:outline-none focus:border-[var(--accent)] transition-colors
          ${className}`}
        {...props}
      />
    </div>
  );
}
