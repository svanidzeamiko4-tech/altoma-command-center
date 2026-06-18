-- Schema additions — run in Supabase SQL Editor
-- Additive only; does not replace supabase/schema.sql

alter table ai_context_blocks
  add column scope text not null default 'project';
-- 'project' | 'founder' | 'global'

create table events (
  id           uuid primary key default gen_random_uuid(),
  project_slug text references projects(slug),
  event_type   text not null,
  payload      jsonb not null default '{}',
  created_at   timestamptz default now()
);

create index events_project_idx on events (project_slug);
create index events_type_idx    on events (event_type);
create index events_time_idx    on events (created_at desc);

-- RLS policies (additive — do not touch notes or journal_entries policies)

-- projects: any authenticated user can read (founder is only user)
alter table projects enable row level security;
create policy "authenticated_read" on projects
  for select using (auth.role() = 'authenticated');

-- project_snapshots: founder read; writes server-side only (service key)
alter table project_snapshots enable row level security;
create policy "founder_read" on project_snapshots
  for select using (auth.role() = 'authenticated');

-- ai_context_blocks: founder read/write
alter table ai_context_blocks enable row level security;
create policy "founder_all" on ai_context_blocks
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- events: founder read/write
alter table events enable row level security;
create policy "founder_all" on events
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
