-- Altoma Command Center — Phase 1 Schema
-- Run in Supabase SQL Editor

create table projects (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  description  text,
  color        text,
  icon         text,
  project_type text not null default 'product',
  status       text not null default 'active',
  sort_order   integer default 0,
  created_at   timestamptz default now()
);

insert into projects (slug, name, icon, color, project_type, sort_order)
values
  ('athletiq',        'ATHLETIQ',        '🏃', '#6366F1', 'product',  1),
  ('whaleiq',         'WhaleIQ',         '🐋', '#F59E0B', 'product',  2),
  ('at_analytics',    'AT Analytics',    '📊', '#10B981', 'product',  3),
  ('altoma',          'Altoma',          '🔷', '#3B82F6', 'internal', 4),
  ('vault',           'Founder Vault',   '🧠', '#8B5CF6', 'vault',    5),
  ('future_projects', 'Future Projects', '🚀', '#EC4899', 'future',   6);

create table notes (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) not null,
  project_slug text not null references projects(slug),
  type         text not null,
  priority     text not null default 'medium',
  source       text not null default 'mobile',
  title        text,
  content      text not null,
  tags         text[] default '{}',
  status       text not null default 'draft',
  processed    boolean not null default false,
  is_private   boolean not null default false,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index notes_project_idx   on notes (project_slug);
create index notes_status_idx    on notes (status);
create index notes_processed_idx on notes (processed);
create index notes_tags_idx      on notes using gin(tags);

alter table notes enable row level security;
create policy "founder_only" on notes
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table journal_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) not null,
  entry_date  date not null default current_date,
  content     text not null,
  mood        text,
  tags        text[] default '{}',
  is_private  boolean not null default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index journal_date_idx on journal_entries (entry_date desc);

alter table journal_entries enable row level security;
create policy "founder_only_journal" on journal_entries
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table project_snapshots (
  id           uuid primary key default gen_random_uuid(),
  project_slug text not null references projects(slug),
  snapshot_at  timestamptz not null default now(),
  health       text not null default 'unknown',
  metrics      jsonb not null default '{}',
  source       text not null default 'manual',
  created_at   timestamptz default now()
);

create index snapshots_project_idx on project_snapshots (project_slug);
create index snapshots_time_idx    on project_snapshots (snapshot_at desc);

create table ai_context_blocks (
  id           uuid primary key default gen_random_uuid(),
  project_slug text references projects(slug),
  block_type   text not null,
  content      text not null,
  confidence   numeric not null default 0.7,
  valid_until  timestamptz,
  created_at   timestamptz default now()
);
