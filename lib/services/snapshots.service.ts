import type { ProjectHealth, ProjectSnapshot } from "@/lib/types";

/** Phase 3 stub — returns no snapshot yet */
export async function getLatest(
  _slug: string
): Promise<ProjectSnapshot | null> {
  return null;
}

/** Phase 3 stub — no-op until external connectors are wired */
export async function push(
  _slug: string,
  _metrics: Record<string, unknown>,
  _health: ProjectHealth
): Promise<void> {
  return;
}

/** Phase 3 stub — returns empty array for Phase 1 */
export async function list(): Promise<ProjectSnapshot[]> {
  return [];
}
