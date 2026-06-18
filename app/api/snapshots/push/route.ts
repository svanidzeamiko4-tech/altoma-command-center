import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-altoma-api-key");
  const validApiKey =
    apiKey === process.env.ALTOMA_INTERNAL_API_KEY &&
    !!process.env.ALTOMA_INTERNAL_API_KEY;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const validSession = !!user;

  if (!validApiKey && !validSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    { error: "Snapshot push not implemented — Phase 3" },
    { status: 501 }
  );
}
