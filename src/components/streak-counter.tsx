interface StreakCounterProps {
  current: number;
  longest: number;
}

export function StreakCounter({ current, longest }: StreakCounterProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-1 bg-[var(--bg-card)] rounded-2xl p-4 text-center">
        <div className="text-3xl font-bold text-[var(--accent)]">
          {current > 0 ? "🔥" : "💤"} {current}
        </div>
        <div className="text-xs text-[var(--text-secondary)] mt-1">
          дней подряд
        </div>
      </div>
      <div className="flex-1 bg-[var(--bg-card)] rounded-2xl p-4 text-center">
        <div className="text-3xl font-bold text-[var(--text-primary)]">
          {longest}
        </div>
        <div className="text-xs text-[var(--text-secondary)] mt-1">
          рекорд серии
        </div>
      </div>
    </div>
  );
}
