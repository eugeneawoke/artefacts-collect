import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { artifacts } from "@/db/schema";
import { desc } from "drizzle-orm";

function getPeriodStart(period: string | null): Date | null {
  if (!period) return null;
  const now = new Date();
  if (period === "week") { const d = new Date(now); d.setDate(d.getDate() - 7); return d; }
  if (period === "14d") { const d = new Date(now); d.setDate(d.getDate() - 14); return d; }
  if (period === "month") { const d = new Date(now); d.setDate(d.getDate() - 30); return d; }
  return null;
}

function computeStreak(rows: { createdAt: Date }[]) {
  if (!rows.length) return { current: 0, longest: 0 };

  const toKey = (d: Date) =>
    `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

  const days = Array.from(new Set(rows.map((r) => toKey(new Date(r.createdAt)))))
    .sort()
    .reverse();

  const today = new Date();
  const todayKey = toKey(today);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = toKey(yesterday);

  let current = 0;
  if (days[0] === todayKey || days[0] === yesterdayKey) {
    current = 1;
    for (let i = 1; i < days.length; i++) {
      const expected = new Date(today);
      expected.setDate(today.getDate() - i);
      if (days[i] === toKey(expected)) current++;
      else break;
    }
  }

  let longest = 0;
  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const [y1, m1, d1] = days[i - 1].split("-").map(Number);
    const [y2, m2, d2] = days[i].split("-").map(Number);
    const diff = Math.round(
      (new Date(y1, m1, d1).getTime() - new Date(y2, m2, d2).getTime()) / 86400000
    );
    if (diff === 1) streak++;
    else { longest = Math.max(longest, streak); streak = 1; }
  }
  longest = Math.max(longest, streak);

  return { current, longest };
}

export async function GET(req: NextRequest) {
  const period = req.nextUrl.searchParams.get("period");
  const periodStart = getPeriodStart(period);

  const allRows = await db.select().from(artifacts).orderBy(desc(artifacts.createdAt));
  const filtered = periodStart
    ? allRows.filter((r) => new Date(r.createdAt) >= periodStart)
    : allRows;

  const { current: currentStreak, longest: longestStreak } = computeStreak(allRows);

  // Count per day for chart
  const dayMap = new Map<string, number>();
  filtered.forEach((r) => {
    const d = new Date(r.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    dayMap.set(key, (dayMap.get(key) ?? 0) + 1);
  });

  const chartData = Array.from(dayMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  return NextResponse.json({
    totalArtifacts: filtered.length,
    currentStreak,
    longestStreak,
    chartData,
  });
}
