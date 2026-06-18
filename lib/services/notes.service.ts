import type { SupabaseClient } from "@supabase/supabase-js";
import { parseTags } from "@/lib/api-auth";
import type {
  CreateNoteInput,
  Note,
  NoteListFilters,
  UpdateNoteInput,
} from "@/lib/types";

export async function create(
  supabase: SupabaseClient,
  userId: string,
  input: CreateNoteInput
): Promise<Note> {
  const { data, error } = await supabase
    .from("notes")
    .insert({
      user_id: userId,
      project_slug: input.project_slug,
      type: input.type,
      priority: input.priority ?? "medium",
      source: input.source ?? "mobile",
      title: input.title?.trim() || null,
      content: input.content.trim(),
      tags: parseTags(input.tags),
      status: input.status ?? "saved",
      processed: false,
      is_private: input.project_slug === "vault",
    })
    .select("*, project:projects(*)")
    .single();

  if (error) throw new Error(error.message);
  return data as Note;
}

export async function list(
  supabase: SupabaseClient,
  filters: NoteListFilters = {}
): Promise<Note[]> {
  let query = supabase
    .from("notes")
    .select("*, project:projects(*)")
    .order("created_at", { ascending: false });

  if (filters.project_slug) {
    query = query.eq("project_slug", filters.project_slug);
  }
  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  if (filters.processed !== undefined) {
    query = query.eq("processed", filters.processed);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Note[];
}

export async function update(
  supabase: SupabaseClient,
  userId: string,
  id: string,
  input: UpdateNoteInput
): Promise<Note> {
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.status !== undefined) updates.status = input.status;
  if (input.processed !== undefined) updates.processed = input.processed;
  if (input.title !== undefined) updates.title = input.title?.trim() || null;
  if (input.content !== undefined) updates.content = input.content.trim();
  if (input.priority !== undefined) updates.priority = input.priority;
  if (input.tags !== undefined) updates.tags = parseTags(input.tags);

  const { data, error } = await supabase
    .from("notes")
    .update(updates)
    .eq("id", id)
    .eq("user_id", userId)
    .select("*, project:projects(*)")
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Note not found");
  return data as Note;
}

export async function sendToInbox(
  supabase: SupabaseClient,
  userId: string,
  id: string
): Promise<Note> {
  return update(supabase, userId, id, {
    status: "sent_to_desktop",
    processed: false,
  });
}

export async function archive(
  supabase: SupabaseClient,
  userId: string,
  id: string
): Promise<Note> {
  return update(supabase, userId, id, { status: "archived" });
}
