import Link from "next/link";
import { notFound } from "next/navigation";
import { OsLayout } from "@/components/OsLayout";
import { ProjectCard } from "@/components/ProjectCard";
import { createClient } from "@/lib/supabase/server";
import * as notesService from "@/lib/services/notes.service";
import * as projectsService from "@/lib/services/projects.service";
import * as snapshotsService from "@/lib/services/snapshots.service";
import type { ProjectHealth } from "@/lib/types";

async function getDashboardData() {
  const supabase = await createClient();

  const [projects, inboxNotes] = await Promise.all([
    projectsService.getAll(supabase),
    notesService.list(supabase, {
      status: "sent_to_desktop",
      processed: false,
    }),
  ]);

  const inboxCounts: Record<string, number> = {};
  for (const note of inboxNotes) {
    inboxCounts[note.project_slug] = (inboxCounts[note.project_slug] ?? 0) + 1;
  }

  const healthBySlug: Record<string, ProjectHealth> = {};
  await Promise.all(
    projects.map(async (project) => {
      const snapshot = await snapshotsService.getLatest(project.slug);
      healthBySlug[project.slug] = snapshot?.health ?? "unknown";
    })
  );

  const totalInbox = Object.values(inboxCounts).reduce((a, b) => a + b, 0);

  return { projects, inboxCounts, healthBySlug, totalInbox };
}

export default async function DashboardPage() {
  const { projects, inboxCounts, healthBySlug, totalInbox } =
    await getDashboardData();

  return (
    <OsLayout
      title="Command Center"
      showFab
      headerRight={
        <>
          <Link
            href="/os/inbox"
            className="relative flex min-h-tap min-w-tap items-center justify-center rounded-lg border border-border px-3 text-sm text-muted hover:text-primary"
          >
            Inbox
            {totalInbox > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-medium text-bg">
                {totalInbox}
              </span>
            )}
          </Link>
          <Link
            href="/os/journal"
            className="flex min-h-tap min-w-tap items-center justify-center rounded-lg border border-border px-3 text-sm text-muted hover:text-primary"
          >
            Journal
          </Link>
        </>
      }
    >
      <p className="mb-6 text-sm text-muted">
        Your projects — tap to open project shell.
      </p>

      <div className="relative z-10 grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            inboxCount={inboxCounts[project.slug] ?? 0}
            health={healthBySlug[project.slug]}
          />
        ))}
      </div>

      {projects.length === 0 && (
        <p className="text-center text-muted">
          No projects yet. Run the seed SQL in Supabase.
        </p>
      )}
    </OsLayout>
  );
}
