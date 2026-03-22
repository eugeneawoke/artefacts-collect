import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { reminders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/utils";

export async function GET() {
  const rows = await db.select().from(reminders).orderBy(reminders.time);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { time, todoId, todoTitle } = await req.json() as {
    time: string;
    todoId?: string;
    todoTitle?: string;
  };

  const [row] = await db
    .insert(reminders)
    .values({
      id: generateId(),
      time,
      isActive: true,
      todoId: todoId ?? null,
      todoTitle: todoTitle ?? null,
    })
    .returning();

  return NextResponse.json(row, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, isActive } = await req.json() as { id: string; isActive: boolean };

  const [row] = await db
    .update(reminders)
    .set({ isActive })
    .where(eq(reminders.id, id))
    .returning();

  return NextResponse.json(row);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json() as { id: string };
  await db.delete(reminders).where(eq(reminders.id, id));
  return new NextResponse(null, { status: 204 });
}
