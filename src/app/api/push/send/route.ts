import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { reminders, pushSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:app@artefacts.app",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// Called by Vercel Cron every 5 minutes
export async function GET() {
  const now = new Date();
  const nowMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

  const activeReminders = await db
    .select()
    .from(reminders)
    .where(eq(reminders.isActive, true));

  const matched = activeReminders.filter((r) => {
    const [rh, rm] = r.time.split(":").map(Number);
    return Math.abs(rh * 60 + rm - nowMinutes) < 5;
  });

  if (!matched.length) {
    return NextResponse.json({ sent: 0, reason: "no matching reminders" });
  }

  const subs = await db.select().from(pushSubscriptions);
  let sent = 0;

  for (const reminder of matched) {
    const body = reminder.todoTitle
      ? `Время собрать артефакт по "${reminder.todoTitle}"`
      : "Время собрать артефакт 🎯";

    const url = reminder.todoTitle
      ? `/menu?description=${encodeURIComponent(reminder.todoTitle)}`
      : "/menu";

    for (const sub of subs) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.keysP256dh, auth: sub.keysAuth } },
          JSON.stringify({
            title: "Артефакты",
            body,
            icon: "/icons/icon-192.png",
            url,
          })
        );
        sent++;
      } catch {
        await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, sub.id));
      }
    }
  }

  return NextResponse.json({ sent });
}
