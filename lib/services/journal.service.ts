import type { SupabaseClient } from "@supabase/supabase-js";
import { parseTags } from "@/lib/api-auth";
import type {
  CreateJournalInput,
  JournalEntry,
  UpdateJournalInput,
} from "@/lib/types";

export async function create(
  supabase: SupabaseClient,
  userId: string,
  input: CreateJournalInput
): Promise<JournalEntry> {
  const entryDate =
    input.entry_date ?? new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("journal_entries")
    .insert({
      user_id: userId,
      entry_date: entryDate,
      content: input.content.trim(),
      mood: input.mood?.trim() || null,
      tags: parseTags(input.tags),
      is_private: true,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as JournalEntry;
}

export async function list(
  supabase: SupabaseClient,
  userId: string
): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as JournalEntry[];
}

export async function update(
  supabase: SupabaseClient,
  userId: string,
  id: string,
  input: UpdateJournalInput
): Promise<JournalEntry> {
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (input.content !== undefined) updates.content = input.content.trim();
  if (input.mood !== undefined) updates.mood = input.mood?.trim() || null;
  if (input.entry_date !== undefined) updates.entry_date = input.entry_date;
  if (input.tags !== undefined) updates.tags = parseTags(input.tags);

  const { data, error } = await supabase
    .from("journal_entries")
    .update(updates)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Entry not found");
  return data as JournalEntry;
}
