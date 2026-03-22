import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { todos } from "@/db/schema";
import { eq, isNull, asc } from "drizzle-orm";
import { generateId } from "@/lib/utils";

export async function GET() {
  const rows = await db
    .select()
    .from(todos)
    .orderBy(asc(todos.sortOrder), asc(todos.createdAt));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, parentId } = body as { title: string; parentId?: string };

  // sortOrder = count of siblings + 1
  const siblings = parentId
    ? await db.select().from(todos).where(eq(todos.parentId, parentId))
    : await db.select().from(todos).where(isNull(todos.parentId));

  const [row] = await db
    .insert(todos)
    .values({
      id: generateId(),
      title,
      parentId: parentId ?? null,
      sortOrder: siblings.length,
    })
    .returning();

  return NextResponse.json(row, { status: 201 });
}
