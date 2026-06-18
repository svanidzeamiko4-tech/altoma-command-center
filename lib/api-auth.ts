import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function requireSession() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { supabase, user: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const founderEmail = process.env.FOUNDER_EMAIL;
  if (founderEmail && user.email !== founderEmail) {
    return { supabase, user: null, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { supabase, user, response: null };
}

export function parseTags(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input.map(String).map((t) => t.trim()).filter(Boolean);
  }
  if (typeof input === "string") {
    return input
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}
