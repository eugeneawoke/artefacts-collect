import Link from "next/link";
import { db } from "@/db/client";
import { artifacts } from "@/db/schema";
import { gte } from "drizzle-orm";

async function getTodayCount() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const rows = await db
      .select({ id: artifacts.id })
      .from(artifacts)
      .where(gte(artifacts.createdAt, today));
    return rows.length;
  } catch {
    return null;
  }
}

export default async function Home() {
  const todayCount = await getTodayCount();

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] flex flex-col px-4 pt-16 pb-24">
      <div className="max-w-lg mx-auto w-full flex flex-col flex-1">
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight">
              Артефакты
            </h1>
            <p className="mt-2 text-[var(--text-secondary)]">
              Внешние артефакты действий — доказательства для мозга
            </p>
          </div>

          {todayCount !== null && (
            <div className="bg-[var(--bg-card)] rounded-2xl px-8 py-4 text-center">
              <div className="text-4xl font-bold text-[var(--accent)]">
                {todayCount}
              </div>
              <div className="text-sm text-[var(--text-secondary)] mt-1">
                {todayCount === 0
                  ? "артефактов пока нет"
                  : todayCount === 1
                    ? "артефакт сегодня"
                    : todayCount >= 2 && todayCount <= 4
                      ? "артефакта сегодня"
                      : "артефактов сегодня"}
              </div>
            </div>
          )}

          <Link
            href="/menu"
            className="inline-flex items-center justify-center min-h-14 px-10 rounded-2xl
              bg-[var(--accent)] text-white font-semibold text-lg w-full max-w-xs
              active:scale-95 transition-transform"
          >
            Получить артефакт
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { href: "/log", label: "Лог", emoji: "📋" },
            { href: "/progress", label: "Прогресс", emoji: "📈" },
            { href: "/todos", label: "Задачи", emoji: "✅" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 bg-[var(--bg-card)] rounded-xl py-4
                text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
