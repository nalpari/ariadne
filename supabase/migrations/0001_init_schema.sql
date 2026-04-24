create extension if not exists pgcrypto;

create table public.test_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  name text,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.scenarios (
  id uuid primary key default gen_random_uuid(),
  target_id uuid not null references public.test_targets(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  tags text[] not null default '{}',
  steps jsonb not null,
  source text not null check (source in ('ai', 'user', 'edited')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.test_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_id uuid not null references public.test_targets(id) on delete cascade,
  scenario_ids uuid[] not null,
  status text not null check (status in ('queued','running','passed','failed','cancelled')),
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.test_run_events (
  id bigserial primary key,
  run_id uuid not null references public.test_runs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  scenario_id uuid,
  step_index int,
  kind text not null check (kind in ('step_start','step_pass','step_fail','log','screenshot')),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index test_run_events_run_id_id_idx on public.test_run_events (run_id, id);
create index test_targets_user_id_idx on public.test_targets (user_id);
create index scenarios_user_id_idx on public.scenarios (user_id);
create index test_runs_user_id_idx on public.test_runs (user_id);
