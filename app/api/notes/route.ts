import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/api-auth";
import * as notesService from "@/lib/services/notes.service";
import type { CreateNoteInput, NoteStatus } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { supabase, response } = await requireSession();
  if (response) return response;

  const { searchParams } = request.nextUrl;
  const project_slug = searchParams.get("project_slug") ?? undefined;
  const status = searchParams.get("status") as NoteStatus | null;
  const processed = searchParams.get("processed");

  try {
    const data = await notesService.list(supabase, {
      project_slug,
      status: status ?? undefined,
      processed:
        processed !== null && processed !== ""
          ? processed === "true"
          : undefined,
    });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { supabase, user, response } = await requireSession();
  if (response || !user) return response!;

  const body = (await request.json()) as CreateNoteInput;

  if (!body.project_slug || !body.type || !body.content?.trim()) {
    return NextResponse.json(
      { error: "project_slug, type, and content are required" },
      { status: 400 }
    );
  }

  try {
    const data = await notesService.create(supabase, user.id, body);
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create note" },
      { status: 500 }
    );
  }
}
