"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Reminder {
  id: string;
  time: string;
  isActive: boolean;
  todoTitle: string | null;
}

interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
  parentId: string | null;
}

export default function SettingsPage() {
  const [notifState, setNotifState] = useState<NotificationPermission | "idle">(
    typeof Notification !== "undefined" ? Notification.permission : "idle"
  );

  async function enableNotifications() {
    const result = await Notification.requestPermission();
    setNotifState(result);
  }
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTime, setNewTime] = useState("10:00");
  const [selectedTodoId, setSelectedTodoId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/reminders").then((r) => r.json()),
      fetch("/api/todos").then((r) => r.json()),
    ]).then(([rem, tod]) => {
      setReminders(rem);
      setTodos(tod);
      setLoading(false);
    });
  }, []);

  const activeTodos = todos.filter((t) => !t.isCompleted && !t.parentId);

  async function handleAdd() {
    const todo = todos.find((t) => t.id === selectedTodoId);
    const res = await fetch("/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        time: newTime,
        todoId: todo?.id ?? null,
        todoTitle: todo?.title ?? null,
      }),
    });
    const row = await res.json();
    setReminders((prev) => [...prev, row].sort((a, b) => a.time.localeCompare(b.time)));
    setSelectedTodoId("");
  }

  async function handleToggle(id: string, isActive: boolean) {
    await fetch("/api/reminders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive }),
    });
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive } : r))
    );
  }

  async function handleDelete(id: string) {
    await fetch("/api/reminders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }

  const pushLabel = {
    idle: "Включить уведомления",
    requesting: "Запрашиваю разрешение...",
    subscribed: "Уведомления включены ✓",
    denied: "Уведомления заблокированы",
    unsupported: "Не поддерживается",
  }[pushState];

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-4 pt-8 pb-24">
      <div className="max-w-lg mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Настройки</h1>

        <section className="bg-[var(--bg-card)] rounded-2xl p-4 space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Уведомления</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Напоминания собрать артефакт в выбранное время
            </p>
          </div>
          <Button
            variant={notifState === "granted" ? "secondary" : "primary"}
            disabled={notifState === "granted" || notifState === "denied"}
            onClick={enableNotifications}
            className="w-full"
          >
            {notifState === "granted"
              ? "Уведомления включены ✓"
              : notifState === "denied"
                ? "Уведомления заблокированы"
                : "Включить уведомления"}
          </Button>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Напоминания</h2>

          <div className="bg-[var(--bg-card)] rounded-2xl p-4 space-y-3">
            <div className="flex gap-2">
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="flex-1 min-h-12 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--bg-elevated)]
                  text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]
                  transition-colors text-sm"
              />
              <Button onClick={handleAdd}>Добавить</Button>
            </div>

            {activeTodos.length > 0 && (
              <select
                value={selectedTodoId}
                onChange={(e) => setSelectedTodoId(e.target.value)}
                className="w-full min-h-12 px-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--bg-elevated)]
                  text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]
                  transition-colors text-sm appearance-none"
              >
                <option value="">Без задачи (общее напоминание)</option>
                {activeTodos.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-14 bg-[var(--bg-card)] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : reminders.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)] text-center py-4">
              Напоминаний пока нет
            </p>
          ) : (
            <div className="space-y-2">
              {reminders.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 bg-[var(--bg-card)] rounded-xl px-4 min-h-14"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-mono text-[var(--text-primary)]">{r.time}</p>
                    {r.todoTitle && (
                      <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
                        {r.todoTitle}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleToggle(r.id, !r.isActive)}
                    className={`w-10 h-6 rounded-full transition-colors relative flex-shrink-0
                      ${r.isActive ? "bg-[var(--accent)]" : "bg-[var(--bg-elevated)]"}`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all
                        ${r.isActive ? "left-5" : "left-1"}`}
                    />
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-[var(--text-secondary)] hover:text-red-400 text-lg w-6 text-center flex-shrink-0"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
