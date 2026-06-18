"use client";

import { useCallback, useEffect, useState } from "react";
import { OsLayout } from "@/components/OsLayout";
import { NoteCard } from "@/components/NoteCard";
import type { Note } from "@/lib/types";

export default function VaultPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/notes?project_slug=vault");
    const data = await res.json();
    setNotes(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return (
    <OsLayout
      title="Founder Vault"
      icon={<span className="text-xl">🔒</span>}
    >
      <p className="mb-6 text-sm text-muted">
        Private founder notes — locked to the vault project.
      </p>

      {loading ? (
        <p className="text-center text-muted">Loading…</p>
      ) : notes.length === 0 ? (
        <p className="text-center text-muted">
          Vault is empty. Capture private thoughts via the vault project.
        </p>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </OsLayout>
  );
}
