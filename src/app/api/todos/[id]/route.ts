import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { todos } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const [row] = await db
    .update(todos)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(todos.id, id))
    .returning();

  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(todos).where(eq(todos.id, id));
  return new NextResponse(null, { status: 204 });
}
