import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/api-auth";
import * as journalService from "@/lib/services/journal.service";
import type { CreateJournalInput } from "@/lib/types";

export async function GET() {
  const { supabase, user, response } = await requireSession();
  if (response || !user) return response!;

  try {
    const data = await journalService.list(supabase, user.id);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load journal" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { supabase, user, response } = await requireSession();
  if (response || !user) return response!;

  const body = (await request.json()) as CreateJournalInput;

  if (!body.content?.trim()) {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  try {
    const data = await journalService.create(supabase, user.id, body);
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create entry" },
      { status: 500 }
    );
  }
}
