import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/api-auth";
import * as notesService from "@/lib/services/notes.service";
import type { UpdateNoteInput } from "@/lib/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, user, response } = await requireSession();
  if (response || !user) return response!;

  const { id } = await params;
  const body = (await request.json()) as UpdateNoteInput;

  try {
    const data = await notesService.update(supabase, user.id, id, body);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update note";
    const status = message === "Note not found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
