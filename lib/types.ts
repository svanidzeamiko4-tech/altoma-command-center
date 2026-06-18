export type NoteType =
  | "idea"
  | "task"
  | "lesson"
  | "decision"
  | "random";
export type NotePriority = "low" | "medium" | "high";
export type NoteStatus =
  | "draft"
  | "saved"
  | "sent_to_desktop"
  | "archived";
export type NoteSource = "mobile" | "desktop" | "voice" | "ai";
export type ProjectType = "product" | "internal" | "vault" | "future";
export type ProjectHealth = "green" | "yellow" | "red" | "unknown";
export type ContextScope = "project" | "founder" | "global";

export interface Project {
  id: string;
  slug: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  project_type: ProjectType;
  status: string;
  sort_order: number;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  project_slug: string;
  project?: Project;
  type: NoteType;
  priority: NotePriority;
  source: NoteSource;
  title?: string;
  content: string;
  tags: string[];
  status: NoteStatus;
  processed: boolean;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  entry_date: string;
  content: string;
  mood?: string;
  tags: string[];
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectSnapshot {
  id: string;
  project_slug: string;
  snapshot_at: string;
  health: ProjectHealth;
  metrics: Record<string, unknown>;
  source: string;
  created_at: string;
}

export interface AiContextBlock {
  id: string;
  project_slug?: string;
  block_type: string;
  content: string;
  confidence: number;
  scope: ContextScope;
  valid_until?: string;
  created_at: string;
}

export interface CreateNoteInput {
  project_slug: string;
  type: NoteType;
  priority?: NotePriority;
  source?: NoteSource;
  title?: string;
  content: string;
  tags?: string[] | string;
  status?: NoteStatus;
}

export interface UpdateNoteInput {
  status?: NoteStatus;
  processed?: boolean;
  title?: string;
  content?: string;
  tags?: string[] | string;
  priority?: NotePriority;
}

export interface CreateJournalInput {
  content: string;
  entry_date?: string;
  mood?: string;
  tags?: string[] | string;
}

export interface UpdateJournalInput {
  content?: string;
  mood?: string;
  tags?: string[] | string;
  entry_date?: string;
}

export interface NoteListFilters {
  project_slug?: string;
  status?: NoteStatus;
  processed?: boolean;
}

export interface Event {
  id: string;
  project_slug?: string;
  event_type: string;
  payload: Record<string, unknown>;
  created_at: string;
}
