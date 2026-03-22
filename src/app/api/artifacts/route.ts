import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { artifacts } from "@/db/schema";
import { desc, gte, and } from "drizzle-orm";
import { generateId } from "@/lib/utils";
import type { CreateArtifactPayload } from "@/lib/types";

function getPeriodStart(period: string | null): Date | null {
  if (!period) return null;
  const now = new Date();
  if (period === "day") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (period === "week") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return d;
  }
  if (period === "month") {
    const d = new Date(now);
    d.setDate(d.getDate() - 30);
    return d;
  }
  return null;
}

export async function GET(req: NextRequest) {
  const period = req.nextUrl.searchParams.get("period");
  const periodStart = getPeriodStart(period);

  const conditions = periodStart
    ? [gte(artifacts.createdAt, periodStart)]
    : [];

  const rows = await db
    .select()
    .from(artifacts)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(artifacts.createdAt));

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateArtifactPayload;

  const [row] = await db
    .insert(artifacts)
    .values({
      id: generateId(),
      category: body.category,
      type: body.type,
      description: body.description,
      feeling: body.feeling,
      lesson: body.lesson,
    })
    .returning();

  return NextResponse.json(row, { status: 201 });
}
