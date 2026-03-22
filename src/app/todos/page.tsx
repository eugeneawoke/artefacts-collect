"use client";

import { useState, useEffect, useCallback } from "react";
import { TodoTree, buildTree } from "@/components/todo-tree";
import type { TodoItem } from "@/components/todo-tree";

export default function TodosPage() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await fetch("/api/todos").then((r) => r.json());
    setTodos(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAddRoot() {
    if (!newTitle.trim()) return;
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle.trim() }),
    });
    setNewTitle("");
    load();
  }

  async function handleToggle(id: string, completed: boolean) {
    await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted: completed }),
    });
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: completed } : t))
    );
  }

  async function handleAddChild(parentId: string, title: string) {
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, parentId }),
    });
    load();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    load();
  }

  const tree = buildTree(todos);
  const done = todos.filter((t) => t.isCompleted).length;

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-4 pt-8 pb-24">
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Задачи
          </h1>
          {todos.length > 0 && (
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {done} из {todos.length} выполнено
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddRoot()}
            placeholder="Большая задача или шаг..."
            className="flex-1 min-h-12 px-4 rounded-xl bg-[var(--bg-card)] border border-[var(--bg-elevated)]
              text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50
              focus:outline-none focus:border-[var(--accent)] transition-colors text-sm"
          />
          <button
            onClick={handleAddRoot}
            className="min-h-12 px-4 rounded-xl bg-[var(--accent)] text-white font-bold text-lg"
          >
            +
          </button>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-[var(--bg-card)] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : tree.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-secondary)]">
            <p className="text-4xl mb-3">📋</p>
            <p>Добавь большую задачу</p>
            <p className="text-sm mt-1">
              Разбей на шаги — каждый шаг можно превратить в артефакт
            </p>
          </div>
        ) : (
          <div className="bg-[var(--bg-card)] rounded-2xl overflow-hidden">
            <TodoTree
              items={tree}
              onToggle={handleToggle}
              onAddChild={handleAddChild}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>
    </main>
  );
}
