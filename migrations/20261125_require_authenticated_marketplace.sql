-- Require Supabase Auth to read marketplace property records.
-- Preserve all property rows and existing insert/update/delete ownership policies.
drop policy if exists "Public can read properties" on public.properties;
drop policy if exists "Authenticated users can read properties" on public.properties;
create policy "Authenticated users can read properties"
  on public.properties for select to authenticated
  using (true);

revoke all privileges on table public.properties from anon;
grant select on public.properties to authenticated;
