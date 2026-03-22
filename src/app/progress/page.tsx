"use client";

import { useState, useEffect } from "react";
import { StreakCounter } from "@/components/streak-counter";

interface Stats {
  totalArtifacts: number;
  currentStreak: number;
  longestStreak: number;
  chartData: { date: string; count: number }[];
}

const PERIODS = [
  { value: "week", label: "7 дней" },
  { value: "14d", label: "14 дней" },
  { value: "month", label: "Месяц" },
  { value: "", label: "Всё" },
] as const;

export default function ProgressPage() {
  const [period, setPeriod] = useState<string>("week");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = period ? `/api/artifacts/stats?period=${period}` : "/api/artifacts/stats";
    fetch(url)
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false); });
  }, [period]);

  const maxCount = stats ? Math.max(...stats.chartData.map((d) => d.count), 1) : 1;

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-4 pt-8 pb-24">
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Прогресс</h1>

        {stats && (
          <StreakCounter current={stats.currentStreak} longest={stats.longestStreak} />
        )}

        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors
                ${period === p.value
                  ? "bg-[var(--accent)] text-white font-medium"
                  : "bg-[var(--bg-card)] text-[var(--text-secondary)]"}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="bg-[var(--bg-card)] rounded-2xl h-40 animate-pulse" />
            <div className="bg-[var(--bg-card)] rounded-2xl h-20 animate-pulse" />
          </div>
        ) : stats ? (
          <div className="space-y-4">
            {/* Bar chart */}
            <div className="bg-[var(--bg-card)] rounded-2xl p-4">
              <p className="text-xs text-[var(--text-secondary)] mb-3">Артефакты по дням</p>
              {stats.chartData.length === 0 ? (
                <p className="text-sm text-[var(--text-secondary)] text-center py-6">
                  Нет данных за этот период
                </p>
              ) : (
                <div className="flex items-end gap-1 h-32">
                  {stats.chartData.map((d) => (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t bg-[var(--accent)] opacity-80 min-h-[4px]"
                        style={{ height: `${(d.count / maxCount) * 100}%` }}
                      />
                      <span className="text-[8px] text-[var(--text-secondary)] rotate-45 origin-left">
                        {d.date.slice(5)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[var(--bg-card)] rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-[var(--accent)]">
                {stats.totalArtifacts}
              </div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">
                артефактов за период
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
