import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ARTIFACT_MENU } from "@/lib/constants";
import type { Artifact } from "@/lib/types";

export function ArtifactCard({ artifact }: { artifact: Artifact }) {
  const menuItem = ARTIFACT_MENU.find((m) => m.id === artifact.type);

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg flex-shrink-0">{menuItem?.emoji ?? "📦"}</span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">
              {menuItem?.label ?? artifact.type}
            </p>
            <p className="text-[11px] text-[var(--text-secondary)]">
              {formatDate(artifact.createdAt)}
            </p>
          </div>
        </div>
        <Badge category={artifact.category} />
      </div>

      <p className="text-sm text-[var(--text-primary)] leading-relaxed">
        {artifact.description}
      </p>

      <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
        {artifact.feeling && artifact.feeling !== "нейтрально" && (
          <span className="italic">{artifact.feeling}</span>
        )}
      </div>

      {artifact.lesson && artifact.lesson !== "—" && (
        <p className="text-xs text-[var(--text-secondary)] border-l-2 border-[var(--bg-elevated)] pl-3">
          {artifact.lesson}
        </p>
      )}
    </div>
  );
}
