"use client";

import type { Note, NotePriority } from "@/lib/types";
import { formatDateTime, priorityColor } from "@/lib/utils";

interface NoteCardProps {
  note: Note;
  onMarkProcessed?: (id: string) => void;
  onArchive?: (id: string) => void;
  loading?: boolean;
}

function PriorityDot({ priority }: { priority: NotePriority }) {
  return (
    <span
      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
      style={{ backgroundColor: priorityColor(priority) }}
      title={`${priority} priority`}
    />
  );
}

export function NoteCard({
  note,
  onMarkProcessed,
  onArchive,
  loading,
}: NoteCardProps) {
  const projectColor = note.project?.color ?? "#6366F1";

  return (
    <article className="card space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ backgroundColor: `${projectColor}25`, color: projectColor }}
          >
            <span>{note.project?.icon ?? "📁"}</span>
            <span>{note.project?.name ?? note.project_slug}</span>
          </span>
          <span className="rounded-full border border-border px-2 py-0.5 text-xs capitalize text-muted">
            {note.type}
          </span>
          <PriorityDot priority={note.priority} />
        </div>
        <time className="text-xs text-muted">{formatDateTime(note.created_at)}</time>
      </div>

      {note.title && (
        <h3 className="font-medium text-primary">{note.title}</h3>
      )}

      <p className="whitespace-pre-wrap text-sm text-primary/90">{note.content}</p>

      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-surface px-2 py-0.5 text-xs text-muted"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {(onMarkProcessed || onArchive) && (
        <div className="flex flex-wrap gap-2 pt-1">
          {onMarkProcessed && !note.processed && (
            <button
              type="button"
              onClick={() => onMarkProcessed(note.id)}
              disabled={loading}
              className="btn-secondary text-xs"
            >
              Mark processed
            </button>
          )}
          {onArchive && note.status !== "archived" && (
            <button
              type="button"
              onClick={() => onArchive(note.id)}
              disabled={loading}
              className="btn-ghost text-xs"
            >
              Archive
            </button>
          )}
        </div>
      )}
    </article>
  );
}
