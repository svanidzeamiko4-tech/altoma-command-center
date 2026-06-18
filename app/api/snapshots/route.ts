import { NextResponse } from "next/server";
import { requireSession } from "@/lib/api-auth";
import * as snapshotsService from "@/lib/services/snapshots.service";

export async function GET() {
  const { response } = await requireSession();
  if (response) return response;

  const data = await snapshotsService.list();
  return NextResponse.json(data);
}
