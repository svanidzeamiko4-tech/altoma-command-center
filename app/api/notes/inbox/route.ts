import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/api-auth";
import * as notesService from "@/lib/services/notes.service";

export async function GET(request: NextRequest) {
  const { supabase, response } = await requireSession();
  if (response) return response;

  const processed = request.nextUrl.searchParams.get("processed");

  try {
    const data = await notesService.list(supabase, {
      status: "sent_to_desktop",
      processed:
        processed !== null && processed !== ""
          ? processed === "true"
          : false,
    });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load inbox" },
      { status: 500 }
    );
  }
}
