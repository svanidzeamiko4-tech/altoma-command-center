"use client";

import { useCallback, useEffect, useState } from "react";
import { OsLayout } from "@/components/OsLayout";
import type { JournalEntry } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/journal");
    const data = await res.json();
    setEntries(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  async function saveEntry() {
    if (!content.trim()) return;

    setSaving(true);
    const res = await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    setSaving(false);

    if (res.ok) {
      setContent("");
      setComposing(false);
      loadEntries();
    }
  }

  if (composing) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-bg">
        <header className="flex items-center justify-between border-b border-border px-4 py-4">
          <button
            type="button"
            onClick={() => setComposing(false)}
            className="btn-ghost"
          >
            Cancel
          </button>
          <span className="text-sm text-muted">
            {formatDate(new Date().toISOString())}
          </span>
          <button
            type="button"
            onClick={saveEntry}
            disabled={saving || !content.trim()}
            className="btn-primary"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </header>
        <textarea
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 resize-none bg-bg p-4 text-primary focus:outline-none"
          placeholder="Write freely…"
        />
      </div>
    );
  }

  return (
    <OsLayout
      title="Journal"
      headerRight={
        <button
          type="button"
          onClick={() => setComposing(true)}
          className="btn-primary text-sm"
        >
          + New Entry
        </button>
      }
    >
      {loading ? (
        <p className="text-center text-muted">Loading…</p>
      ) : entries.length === 0 ? (
        <p className="text-center text-muted">
          No journal entries yet. Start reflecting.
        </p>
      ) : (
        <div className="space-y-8">
          {entries.map((entry) => (
            <article key={entry.id} className="space-y-3">
              <h2 className="text-lg font-semibold text-accent">
                {formatDate(entry.entry_date)}
              </h2>
              <p className="whitespace-pre-wrap text-primary/90">{entry.content}</p>
              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-surface px-2 py-0.5 text-xs text-muted"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </OsLayout>
  );
}
