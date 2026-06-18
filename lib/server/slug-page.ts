import "server-only";

import { createClient } from "@/lib/supabase/server";
import { resolveProjectSlug } from "@/lib/project-slugs";
import * as notesService from "@/lib/services/notes.service";
import * as projectsService from "@/lib/services/projects.service";
import * as snapshotsService from "@/lib/services/snapshots.service";
import type { Note, Project, ProjectHealth } from "@/lib/types";

function healthColor(health: string): string {
  const map: Record<string, string> = {
    green: "#10B981",
    yellow: "#F59E0B",
    red: "#EF4444",
    unknown: "#6B6A65",
  };
  return map[health] ?? map.unknown;
}

export interface SlugPageData {
  slug: string;
  project: Project;
  notes: Note[];
  health: ProjectHealth;
  healthDotColor: string;
  accent: string;
}

export async function getSlugPageData(
  urlSlug: string
): Promise<SlugPageData | null> {
  const slug = resolveProjectSlug(urlSlug);
  const supabase = await createClient();

  const project = await projectsService.getBySlug(supabase, slug);
  if (!project) return null;

  const [notes, snapshot] = await Promise.all([
    notesService.list(supabase, { project_slug: slug }),
    snapshotsService.getLatest(slug),
  ]);

  const health: ProjectHealth = snapshot?.health ?? "unknown";

  return {
    slug,
    project,
    notes,
    health,
    healthDotColor: healthColor(health),
    accent: project.color ?? "#6366F1",
  };
}
