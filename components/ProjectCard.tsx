"use client";

import type { Project, ProjectHealth } from "@/lib/types";
import Link from "next/link";
import { projectOsHref } from "@/lib/project-slugs";
import { healthColor } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  inboxCount?: number;
  health?: ProjectHealth;
}

export function ProjectCard({
  project,
  inboxCount = 0,
  health = "unknown",
}: ProjectCardProps) {
  const accent = project.color ?? "#6366F1";
  const healthDot = healthColor(health);
  const href = projectOsHref(project.slug);

  return (
    <Link
      href={href}
      className="card group relative z-10 block cursor-pointer touch-manipulation"
      style={{ borderLeftColor: accent, borderLeftWidth: 3 }}
    >
      <div className="transition-transform group-hover:scale-[1.02]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden>
              {project.icon ?? "📁"}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-primary">{project.name}</h2>
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: healthDot }}
                  title={`Health: ${health}`}
                />
              </div>
              {project.description && (
                <p className="mt-1 text-sm text-muted line-clamp-2">
                  {project.description}
                </p>
              )}
            </div>
          </div>
          {inboxCount > 0 && (
            <span
              className="flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-medium text-bg"
              style={{ backgroundColor: accent }}
            >
              {inboxCount}
            </span>
          )}
        </div>
        <span
          className="mt-3 inline-block rounded-full px-2 py-0.5 text-xs capitalize text-muted"
          style={{ backgroundColor: `${accent}20`, color: accent }}
        >
          {project.project_type}
        </span>
      </div>
    </Link>
  );
}
