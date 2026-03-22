"use client";

import { useState, useEffect } from "react";
import { ArtifactCard } from "@/components/artifact-card";
import type { Artifact } from "@/lib/types";

const PERIODS = [
  { value: "day", label: "Сегодня" },
  { value: "week", label: "Неделя" },
  { value: "month", label: "Месяц" },
  { value: "", label: "Всё" },
] as const;

export default function LogPage() {
  const [period, setPeriod] = useState<string>("day");
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = period ? `/api/artifacts?period=${period}` : "/api/artifacts";
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setArtifacts(data);
        setLoading(false);
      });
  }, [period]);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-4 pt-8 pb-24">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          Лог
        </h1>

        <div className="flex gap-2 mb-6">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors
                ${
                  period === p.value
                    ? "bg-[var(--accent)] text-white font-medium"
                    : "bg-[var(--bg-card)] text-[var(--text-secondary)]"
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[var(--bg-card)] rounded-2xl h-32 animate-pulse"
              />
            ))}
          </div>
        ) : artifacts.length === 0 ? (
          <div className="text-center py-16 text-[var(--text-secondary)]">
            <p className="text-4xl mb-3">🌱</p>
            <p>Артефактов пока нет</p>
            <p className="text-sm mt-1">Сделай что-нибудь — и зафиксируй</p>
          </div>
        ) : (
          <div className="space-y-3">
            {artifacts.map((a) => (
              <ArtifactCard key={a.id} artifact={a} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
