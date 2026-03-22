"use client";

import { useState } from "react";
import Link from "next/link";

export interface TodoItem {
  id: string;
  title: string;
  parentId: string | null;
  isCompleted: boolean;
  artifactId: string | null;
  sortOrder: number;
  children?: TodoItem[];
}

interface TodoNodeProps {
  item: TodoItem;
  depth: number;
  onToggle: (id: string, completed: boolean) => void;
  onAddChild: (parentId: string, title: string) => void;
  onDelete: (id: string) => void;
}

function TodoNode({ item, depth, onToggle, onAddChild, onDelete }: TodoNodeProps) {
  const [addingChild, setAddingChild] = useState(false);
  const [childTitle, setChildTitle] = useState("");
  const isBig = item.title.length > 50;

  function handleAddChild() {
    if (!childTitle.trim()) return;
    onAddChild(item.id, childTitle.trim());
    setChildTitle("");
    setAddingChild(false);
  }

  return (
    <div style={{ paddingLeft: depth * 20 }} className="group">
      <div className="flex items-start gap-2 py-2">
        <button
          onClick={() => onToggle(item.id, !item.isCompleted)}
          className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded border-2 transition-colors
            ${item.isCompleted
              ? "bg-[var(--accent)] border-[var(--accent)]"
              : "border-[var(--bg-elevated)] hover:border-[var(--accent)]"
            }`}
        >
          {item.isCompleted && (
            <svg viewBox="0 0 12 12" className="w-full h-full p-0.5 text-white">
              <polyline
                points="1,6 4,9 11,2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={`text-sm leading-snug transition-colors ${
              item.isCompleted
                ? "line-through text-[var(--text-secondary)]"
                : "text-[var(--text-primary)]"
            }`}
          >
            {item.title}
          </p>
          {isBig && !item.isCompleted && (
            <p className="text-[10px] text-amber-400 mt-0.5">
              ⚠ Этот шаг звучит большим — разбей на подзадачи
            </p>
          )}
          {item.isCompleted && (
            <Link
              href={`/capture?description=${encodeURIComponent(item.title)}`}
              className="inline-block mt-1 text-[11px] font-medium px-2 py-0.5 rounded-md
                bg-[var(--accent)]/15 text-[var(--accent)] hover:bg-[var(--accent)]/25 transition-colors"
            >
              Зафиксировать →
            </Link>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => setAddingChild(!addingChild)}
            className="w-6 h-6 rounded text-[var(--text-secondary)] hover:text-[var(--accent)] text-lg leading-none"
            title="Добавить подзадачу"
          >
            +
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="w-6 h-6 rounded text-[var(--text-secondary)] hover:text-red-400 text-sm"
            title="Удалить"
          >
            ×
          </button>
        </div>
      </div>

      {addingChild && (
        <div style={{ paddingLeft: 20 }} className="pb-2">
          <div className="flex gap-2">
            <input
              autoFocus
              value={childTitle}
              onChange={(e) => setChildTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddChild();
                if (e.key === "Escape") setAddingChild(false);
              }}
              placeholder="Подзадача..."
              className="flex-1 h-9 px-3 rounded-lg bg-[var(--bg-card)] border border-[var(--bg-elevated)]
                text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50
                focus:outline-none focus:border-[var(--accent)]"
            />
            <button
              onClick={handleAddChild}
              className="px-3 h-9 rounded-lg bg-[var(--accent)] text-white text-sm font-medium"
            >
              ОК
            </button>
          </div>
        </div>
      )}

      {item.children?.map((child) => (
        <TodoNode
          key={child.id}
          item={child}
          depth={depth + 1}
          onToggle={onToggle}
          onAddChild={onAddChild}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

interface TodoTreeProps {
  items: TodoItem[];
  onToggle: (id: string, completed: boolean) => void;
  onAddChild: (parentId: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function TodoTree({ items, onToggle, onAddChild, onDelete }: TodoTreeProps) {
  return (
    <div className="divide-y divide-[var(--bg-elevated)]">
      {items.map((item) => (
        <TodoNode
          key={item.id}
          item={item}
          depth={0}
          onToggle={onToggle}
          onAddChild={onAddChild}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export function buildTree(flat: TodoItem[]): TodoItem[] {
  const map = new Map<string, TodoItem>();
  flat.forEach((item) => map.set(item.id, { ...item, children: [] }));
  const roots: TodoItem[] = [];
  map.forEach((item) => {
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId)!.children!.push(item);
    } else {
      roots.push(item);
    }
  });
  return roots;
}
