"use client";

import { useEffect } from "react";

interface Reminder {
  id: string;
  time: string;
  isActive: boolean;
  todoTitle: string | null;
}

export function NotificationScheduler() {
  useEffect(() => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    async function schedule() {
      timeouts.forEach(clearTimeout);
      timeouts.length = 0;

      let reminders: Reminder[] = [];
      try {
        reminders = await fetch("/api/reminders").then((r) => r.json());
      } catch {
        return;
      }

      const now = new Date();

      for (const reminder of reminders) {
        if (!reminder.isActive) continue;

        const [h, m] = reminder.time.split(":").map(Number);
        const next = new Date();
        next.setHours(h, m, 0, 0);
        if (next <= now) next.setDate(next.getDate() + 1);

        const delay = next.getTime() - now.getTime();

        const body = reminder.todoTitle
          ? `Время собрать артефакт по "${reminder.todoTitle}"`
          : "Время собрать артефакт";

        const url = reminder.todoTitle
          ? `/menu?description=${encodeURIComponent(reminder.todoTitle)}`
          : "/menu";

        timeouts.push(
          setTimeout(() => {
            const n = new Notification("Артефакты", {
              body,
              icon: "/icons/icon-192.png",
            });
            n.onclick = () => {
              window.focus();
              window.location.href = url;
            };
            schedule(); // перепланировать на следующий день
          }, delay)
        );
      }
    }

    schedule();

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return null;
}
