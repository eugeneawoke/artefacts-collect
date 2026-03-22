"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Сегодня", emoji: "🏠" },
  { href: "/log", label: "Лог", emoji: "📋" },
  { href: "/progress", label: "Прогресс", emoji: "📈" },
  { href: "/todos", label: "Задачи", emoji: "✅" },
  { href: "/settings", label: "Настройки", emoji: "⚙️" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--bg-card)] border-t border-[var(--bg-elevated)] pb-safe z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-14 h-16 rounded-xl transition-colors
                ${isActive ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"}`}
            >
              <span className="text-xl">{tab.emoji}</span>
              <span className="text-[9px] mt-0.5">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
