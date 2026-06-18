"use client";

import { useCallback, useEffect, useState } from "react";
import { OsLayout } from "@/components/OsLayout";
import { NoteCard } from "@/components/NoteCard";
import type { Note } from "@/lib/types";

export default function InboxPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showProcessed, setShowProcessed] = useState(false);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    const res = await fetch(
      `/api/notes/inbox?processed=${showProcessed ? "true" : "false"}`
    );
    const data = await res.json();
    setNotes(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [showProcessed]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  async function updateNote(id: string, updates: Record<string, unknown>) {
    setActionLoading(true);
    await fetch(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    await loadNotes();
    setActionLoading(false);
  }

  return (
    <OsLayout title="Desktop Inbox">
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted">
          Notes sent from mobile — process on desktop.
        </p>
        <button
          type="button"
          onClick={() => setShowProcessed((v) => !v)}
          className="btn-ghost text-xs"
        >
          {showProcessed ? "Hide processed" : "Show processed"}
        </button>
      </div>

      {loading ? (
        <p className="text-center text-muted">Loading…</p>
      ) : notes.length === 0 ? (
        <p className="text-center text-muted">
          {showProcessed ? "No processed notes." : "Inbox zero — nice work."}
        </p>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              loading={actionLoading}
              onMarkProcessed={(id) => updateNote(id, { processed: true })}
              onArchive={(id) => updateNote(id, { status: "archived" })}
            />
          ))}
        </div>
      )}
    </OsLayout>
  );
}
