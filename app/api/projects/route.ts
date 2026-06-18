import { NextResponse } from "next/server";
import { requireSession } from "@/lib/api-auth";
import * as projectsService from "@/lib/services/projects.service";

export async function GET() {
  const { supabase, response } = await requireSession();
  if (response) return response;

  try {
    const data = await projectsService.getAll(supabase);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load projects" },
      { status: 500 }
    );
  }
}
