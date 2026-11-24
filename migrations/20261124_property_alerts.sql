begin;

create table if not exists public.property_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 80),
  criteria jsonb not null default '{}'::jsonb check (jsonb_typeof(criteria) = 'object'),
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists property_alerts_user_created_idx
  on public.property_alerts (user_id, created_at desc);

alter table public.property_alerts enable row level security;

revoke all on table public.property_alerts from anon, authenticated;
grant select, insert, update, delete on table public.property_alerts to authenticated;

create policy "Users can read own property alerts"
  on public.property_alerts for select to authenticated
  using (auth.uid() = user_id);
create policy "Users can create own property alerts"
  on public.property_alerts for insert to authenticated
  with check (auth.uid() = user_id);
create policy "Users can update own property alerts"
  on public.property_alerts for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
create policy "Users can delete own property alerts"
  on public.property_alerts for delete to authenticated
  using (auth.uid() = user_id);

commit;
