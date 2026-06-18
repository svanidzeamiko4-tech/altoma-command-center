"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OsLayout } from "@/components/OsLayout";
import type { NoteType, NotePriority, Project } from "@/lib/types";
import { NOTE_TYPES, NOTE_PRIORITIES, detectSource } from "@/lib/utils";

export default function NewNotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectSlug, setProjectSlug] = useState("");
  const [type, setType] = useState<NoteType>("idea");
  const [priority, setPriority] = useState<NotePriority>("medium");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to load projects");
        const data = await r.json();
        if (!Array.isArray(data)) throw new Error("Invalid projects response");
        setProjects(data);
        const preselect = searchParams.get("project");
        if (preselect && data.some((p) => p.slug === preselect)) {
          setProjectSlug(preselect);
        } else if (data.length > 0) {
          setProjectSlug(data[0].slug);
        }
      })
      .catch(() => setError("Failed to load projects"));
  }, [searchParams]);

  useEffect(() => {
    contentRef.current?.focus();
  }, []);

  async function saveNote(sendToDesktop: boolean) {
    if (!projectSlug) {
      setError("Select a project");
      return;
    }
    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_slug: projectSlug,
        type,
        priority,
        source: detectSource(),
        title: title || undefined,
        content,
        tags,
        status: sendToDesktop ? "sent_to_desktop" : "saved",
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save");
      return;
    }

    router.push(sendToDesktop ? "/os/inbox" : "/os");
    router.refresh();
  }

  const activeProject = projects.find((p) => p.slug === projectSlug);

  return (
    <OsLayout title="New Note">
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm text-muted">Project</label>
          <div className="flex flex-wrap gap-2">
            {projects.map((project) => {
              const active = project.slug === projectSlug;
              const color = project.color ?? "#6366F1";
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setProjectSlug(project.slug)}
                  className={`chip ${active ? "chip-active" : "hover:bg-card"}`}
                  style={
                    active
                      ? { backgroundColor: color, borderColor: color }
                      : undefined
                  }
                >
                  <span>{project.icon}</span>
                  <span>{project.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-muted">Type</label>
          <div className="flex flex-wrap gap-2">
            {NOTE_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`chip capitalize ${
                  type === t.value
                    ? "border-accent bg-accent/20 text-accent"
                    : "hover:bg-card"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-muted">Priority</label>
          <div className="flex flex-wrap gap-2">
            {NOTE_PRIORITIES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`chip ${
                  priority === p.value ? "chip-active" : "hover:bg-card"
                }`}
                style={
                  priority === p.value
                    ? { backgroundColor: p.color, borderColor: p.color }
                    : undefined
                }
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="title" className="mb-2 block text-sm text-muted">
            Title <span className="text-muted/60">(optional)</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            placeholder="Short title…"
          />
        </div>

        <div>
          <label htmlFor="content" className="mb-2 block text-sm text-muted">
            Content
          </label>
          <textarea
            id="content"
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="input min-h-[200px] resize-y"
            placeholder="What's on your mind?"
          />
        </div>

        <div>
          <label htmlFor="tags" className="mb-2 block text-sm text-muted">
            Tags <span className="text-muted/60">(comma-separated)</span>
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="input"
            placeholder="strategy, q2, hiring"
          />
        </div>

        {activeProject && (
          <p className="text-xs text-muted">
            Source: {detectSource()} · Project accent: {activeProject.color}
          </p>
        )}

        {error && (
          <p className="text-sm text-priority-high">{error}</p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => saveNote(false)}
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => saveNote(true)}
            disabled={loading}
            className="btn-secondary flex-1"
          >
            Save + Send to Desktop
          </button>
        </div>
      </div>
    </OsLayout>
  );
}
