"use client";

import { useRouter } from "next/navigation";
import { ARTIFACT_MENU, CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from "@/lib/constants";
import type { ArtifactCategory } from "@/lib/types";

const CATEGORY_ORDER: ArtifactCategory[] = [
  "epistemic",
  "pragmatic",
  "regulation",
];

const CATEGORY_COLORS: Record<ArtifactCategory, string> = {
  epistemic: "border-[var(--epistemic)]/30 hover:border-[var(--epistemic)]/70",
  pragmatic: "border-[var(--pragmatic)]/30 hover:border-[var(--pragmatic)]/70",
  regulation:
    "border-[var(--regulation)]/30 hover:border-[var(--regulation)]/70",
};

const CATEGORY_HEADING: Record<ArtifactCategory, string> = {
  epistemic: "text-[var(--epistemic)]",
  pragmatic: "text-[var(--pragmatic)]",
  regulation: "text-[var(--regulation)]",
};

export function ArtifactMenuGrid() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {CATEGORY_ORDER.map((category) => {
        const items = ARTIFACT_MENU.filter((m) => m.category === category);
        return (
          <div key={category}>
            <div className="mb-3">
              <h2
                className={`text-sm font-bold ${CATEGORY_HEADING[category]}`}
              >
                {CATEGORY_LABELS[category]}
              </h2>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                {CATEGORY_DESCRIPTIONS[category]}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    router.push(
                      `/capture?category=${item.category}&type=${item.id}`
                    )
                  }
                  className={`flex flex-col items-start p-3 rounded-xl border bg-[var(--bg-card)]
                    transition-all text-left min-h-[80px] ${CATEGORY_COLORS[category]}`}
                >
                  <span className="text-xl mb-1">{item.emoji}</span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)] mt-0.5 leading-tight">
                    {item.hint}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
