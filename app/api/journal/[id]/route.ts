import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/api-auth";
import * as journalService from "@/lib/services/journal.service";
import type { UpdateJournalInput } from "@/lib/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, user, response } = await requireSession();
  if (response || !user) return response!;

  const { id } = await params;
  const body = (await request.json()) as UpdateJournalInput;

  try {
    const data = await journalService.update(supabase, user.id, id, body);
    return NextResponse.json(data);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update entry";
    const status = message === "Entry not found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
