import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { pushSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const { endpoint, keysP256dh, keysAuth } = await req.json();

  // Upsert by endpoint
  const existing = await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, endpoint))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json(existing[0]);
  }

  const [row] = await db
    .insert(pushSubscriptions)
    .values({ id: generateId(), endpoint, keysP256dh, keysAuth })
    .returning();

  return NextResponse.json(row, { status: 201 });
}
