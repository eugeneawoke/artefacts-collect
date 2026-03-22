"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ARTIFACT_MENU } from "@/lib/constants";
import type { CreateArtifactPayload } from "@/lib/types";

function CaptureContent() {
  const params = useSearchParams();
  const router = useRouter();

  const category = params.get("category") ?? "epistemic";
  const type = params.get("type") ?? "";
  const prefill = params.get("description") ?? "";

  const menuItem = ARTIFACT_MENU.find((m) => m.id === type);

  const [description, setDescription] = useState(prefill);
  const [feeling, setFeeling] = useState("");
  const [lesson, setLesson] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!description.trim()) return;
    setSaving(true);

    const payload: CreateArtifactPayload = {
      category: category as CreateArtifactPayload["category"],
      type,
      description: description.trim(),
      feeling: feeling.trim() || "нейтрально",
      lesson: lesson.trim() || "—",
    };

    await fetch("/api/artifacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    router.push("/");
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-4 pt-8 pb-24">
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <div className="text-3xl mb-1">{menuItem?.emoji ?? "📦"}</div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            {menuItem?.label ?? "Артефакт"}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Опиши что произошло — это твой артефакт
          </p>
        </div>

        <Textarea
          label="Что конкретно случилось?"
          placeholder="Что существует теперь, чего не было раньше. Даже тупик — это артефакт."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Input
          label="Одно слово — что чувствуешь?"
          placeholder="облегчение, любопытство, усталость, гордость..."
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
        />

        <Textarea
          label="Что стало яснее — или что точно не работает?"
          placeholder="Даже 'этот путь тупиковый' — ценный вывод. Мозг обновил модель."
          value={lesson}
          onChange={(e) => setLesson(e.target.value)}
        />

        <Button
          className="w-full"
          onClick={handleSave}
          disabled={!description.trim() || saving}
        >
          {saving ? "Сохраняю..." : "Получить артефакт"}
        </Button>
      </div>
    </main>
  );
}

export default function CapturePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)]" />}>
      <CaptureContent />
    </Suspense>
  );
}
