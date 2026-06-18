import { Suspense } from "react";
import NewNotePage from "./NewNoteClient";

export default function NewNotePageWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted">Loading…</div>}>
      <NewNotePage />
    </Suspense>
  );
}
