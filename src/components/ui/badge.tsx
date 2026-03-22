type Category = "epistemic" | "pragmatic" | "regulation";

const categoryColors: Record<Category, string> = {
  epistemic: "bg-[var(--epistemic)]/20 text-[var(--epistemic)]",
  pragmatic: "bg-[var(--pragmatic)]/20 text-[var(--pragmatic)]",
  regulation: "bg-[var(--regulation)]/20 text-[var(--regulation)]",
};

const categoryLabels: Record<Category, string> = {
  epistemic: "Понял",
  pragmatic: "Сделал",
  regulation: "Сдвинулся",
};

interface BadgeProps {
  category: Category;
}

export function Badge({ category }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium ${categoryColors[category]}`}
    >
      {categoryLabels[category]}
    </span>
  );
}
