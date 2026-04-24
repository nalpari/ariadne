alter table public.test_targets enable row level security;
alter table public.scenarios enable row level security;
alter table public.test_runs enable row level security;
alter table public.test_run_events enable row level security;

create policy "owner_all" on public.test_targets
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "owner_all" on public.scenarios
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "owner_all" on public.test_runs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "owner_all" on public.test_run_events
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('run-artifacts', 'run-artifacts', false)
on conflict (id) do nothing;

create policy "run_artifacts_owner_read" on storage.objects
  for select using (
    bucket_id = 'run-artifacts'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "run_artifacts_owner_insert" on storage.objects
  for insert with check (
    bucket_id = 'run-artifacts'
    and split_part(name, '/', 1) = auth.uid()::text
  );
