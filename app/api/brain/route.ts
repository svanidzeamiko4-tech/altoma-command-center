import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/api-auth";
import * as founderBrainService from "@/lib/services/founder-brain.service";

export async function POST(request: NextRequest) {
  const { response } = await requireSession();
  if (response) return response;

  const body = await request.json().catch(() => ({}));
  const prompt = typeof body.prompt === "string" ? body.prompt : "";

  const answer = await founderBrainService.query(prompt);
  return NextResponse.json({ answer });
}
