import { NextResponse } from "next/server";

// Notifications are now scheduled client-side via NotificationScheduler component
export async function GET() {
  return NextResponse.json({ message: "client-side scheduling active" });
}
