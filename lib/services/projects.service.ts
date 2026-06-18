import type { SupabaseClient } from "@supabase/supabase-js";
import type { Project, ProjectType } from "@/lib/types";

export async function getAll(supabase: SupabaseClient): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Project[];
}

export async function getBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Project | null;
}

export async function getByType(
  supabase: SupabaseClient,
  projectType: ProjectType
): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "active")
    .eq("project_type", projectType)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Project[];
}
