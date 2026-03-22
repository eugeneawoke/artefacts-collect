import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`bg-[var(--bg-card)] rounded-2xl p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
