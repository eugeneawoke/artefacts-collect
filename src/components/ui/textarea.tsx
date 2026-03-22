"use client";

import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className = "", ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-[var(--text-secondary)] mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={`w-full min-h-24 px-4 py-3 bg-[var(--bg-card)] border border-[var(--bg-elevated)]
          rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50
          focus:outline-none focus:border-[var(--accent)] transition-colors resize-none
          ${className}`}
        {...props}
      />
    </div>
  );
}
