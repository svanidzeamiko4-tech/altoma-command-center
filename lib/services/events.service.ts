import type { SupabaseClient } from "@supabase/supabase-js";
import type { Event } from "@/lib/types";

export async function create(
  supabase: SupabaseClient,
  project_slug: string | undefined,
  event_type: string,
  payload: Record<string, unknown> = {}
): Promise<Event> {
  const { data, error } = await supabase
    .from("events")
    .insert({
      project_slug: project_slug ?? null,
      event_type,
      payload,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Event;
}

export async function list(
  supabase: SupabaseClient,
  project_slug?: string,
  limit = 50
): Promise<Event[]> {
  let query = supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (project_slug) {
    query = query.eq("project_slug", project_slug);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Event[];
}
