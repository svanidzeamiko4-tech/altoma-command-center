export interface ProjectBrainRequest {
  prompt: string;
  project_slug: string;
}

export async function queryProjectBrain(
  req: ProjectBrainRequest
): Promise<string> {
  // Phase 4: inject project-specific context (notes, snapshots, docs)
  // Phase 1: stub
  return `${req.project_slug} Brain not yet active.`;
}
