export type ArtifactCategory = "epistemic" | "pragmatic" | "regulation";

export interface ArtifactMenuItem {
  id: string;
  category: ArtifactCategory;
  label: string;
  emoji: string;
  hint: string;
}

export interface Artifact {
  id: string;
  category: ArtifactCategory;
  type: string;
  description: string;
  feeling: string;
  lesson: string;
  createdAt: string;
}

export interface CreateArtifactPayload {
  category: ArtifactCategory;
  type: string;
  description: string;
  feeling: string;
  lesson: string;
}
