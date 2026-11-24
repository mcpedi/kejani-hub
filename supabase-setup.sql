-- NyumbaHub / Kejani Hub Supabase setup (compatible with the existing project schema)
-- Safe to run more than once. Existing rows and table data are preserved.
-- The existing properties table uses UUID ids and user_id ownership.

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  purpose text not null default 'rent' check (purpose in ('rent', 'sale')),
  type text not null default 'Apartment',
  status text not null default 'available' check (status in ('available', 'occupied')),
  city text not null,
  neighborhood text not null,
  lat double precision,
  lng double precision,
  price bigint not null check (price >= 0),
  beds integer not null default 1,
  baths integer not null default 1,
  size text not null default 'Standard',
  image text,
  amenities text[] not null default '{}',
  agent text not null,
  phone text not null,
  featured boolean not null default false,
  description text not null,
  created_at timestamptz not null default now()
);

alter table public.properties add column if not exists updated_at timestamptz not null default now();
alter table public.properties alter column user_id set not null;
create index if not exists properties_city_status_idx on public.properties (city, status);
create index if not exists properties_user_id_idx on public.properties (user_id);

alter table public.properties enable row level security;

drop policy if exists "Public can read properties" on public.properties;
drop policy if exists "Authenticated users can insert properties" on public.properties;
drop policy if exists "Owners can update their properties" on public.properties;
drop policy if exists "Owners can delete their properties" on public.properties;

create policy "Public can read properties"
  on public.properties for select to anon, authenticated
  using (true);
create policy "Authenticated users can insert properties"
  on public.properties for insert to authenticated
  with check (auth.uid() = user_id);
create policy "Owners can update their properties"
  on public.properties for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
create policy "Owners can delete their properties"
  on public.properties for delete to authenticated
  using (auth.uid() = user_id);

grant select on public.properties to anon, authenticated;
grant insert, update, delete on public.properties to authenticated;

-- Supabase Storage for public listing photos (up to 5 MB each).
alter table public.properties add column if not exists images text[] not null default '{}';
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('property-images', 'property-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif']::text[])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
drop policy if exists "Public can view property listing photos" on storage.objects;
drop policy if exists "Owners can upload property listing photos" on storage.objects;
drop policy if exists "Owners can update property listing photos" on storage.objects;
drop policy if exists "Owners can delete property listing photos" on storage.objects;
create policy "Public can view property listing photos" on storage.objects for select to anon, authenticated using (bucket_id = 'property-images');
create policy "Owners can upload property listing photos" on storage.objects for insert to authenticated with check (bucket_id = 'property-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Owners can update property listing photos" on storage.objects for update to authenticated using (bucket_id = 'property-images' and (storage.foldername(name))[1] = auth.uid()::text) with check (bucket_id = 'property-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Owners can delete property listing photos" on storage.objects for delete to authenticated using (bucket_id = 'property-images' and (storage.foldername(name))[1] = auth.uid()::text);


-- Private user profiles and private avatars (owner-only access).
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  agency text not null default '',
  location text not null default '',
  bio text not null default '',
  website text not null default '',
  avatar_path text,
  default_city text not null default 'Nairobi',
  default_purpose text not null default 'rent' check (default_purpose in ('rent', 'sale')),
  preferences jsonb not null default '{"accent":"emerald","compactCards":false,"reduceMotion":false,"autoFillListingContact":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can create own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select to authenticated using (auth.uid() = id);
create policy "Users can create own profile"
  on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
grant select, insert, update on public.profiles to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('user-avatars', 'user-avatars', false, 2097152, array['image/jpeg','image/png','image/webp','image/avif']::text[])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
drop policy if exists "Users can view own profile avatars" on storage.objects;
drop policy if exists "Users can upload own profile avatars" on storage.objects;
drop policy if exists "Users can update own profile avatars" on storage.objects;
drop policy if exists "Users can delete own profile avatars" on storage.objects;
create policy "Users can view own profile avatars"
  on storage.objects for select to authenticated
  using (bucket_id = 'user-avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users can upload own profile avatars"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'user-avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users can update own profile avatars"
  on storage.objects for update to authenticated
  using (bucket_id = 'user-avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'user-avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Users can delete own profile avatars"
  on storage.objects for delete to authenticated
  using (bucket_id = 'user-avatars' and (storage.foldername(name))[1] = auth.uid()::text);
