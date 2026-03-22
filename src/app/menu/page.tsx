import { ArtifactMenuGrid } from "@/components/artifact-menu-grid";

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-4 pt-8 pb-24">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Какой артефакт собрал?
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Артефакт — внешнее доказательство того, что произошло. Мозгу нужен сигнал.
          </p>
        </div>
        <ArtifactMenuGrid />
      </div>
    </main>
  );
}
