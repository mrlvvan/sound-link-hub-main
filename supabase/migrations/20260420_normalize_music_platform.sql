begin;

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  display_name text,
  avatar_url text,
  bio text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.beats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  track_name text not null,
  genre text not null,
  description text,
  audio_url text not null,
  cover_gradient text,
  service_title text,
  service_price integer,
  likes_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists beats_user_id_idx on public.beats (user_id);
create index if not exists beats_created_at_idx on public.beats (created_at desc);
create index if not exists beats_track_name_idx on public.beats using gin (to_tsvector('simple', coalesce(track_name, '')));
create index if not exists beats_description_idx on public.beats using gin (to_tsvector('simple', coalesce(description, '')));
create index if not exists profiles_username_idx on public.profiles (username);
create index if not exists profiles_display_name_idx on public.profiles using gin (to_tsvector('simple', coalesce(display_name, '')));

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists beats_set_updated_at on public.beats;
create trigger beats_set_updated_at
before update on public.beats
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
begin
  base_username :=
    lower(
      regexp_replace(
        coalesce(
          nullif(new.raw_user_meta_data ->> 'username', ''),
          split_part(new.email, '@', 1),
          'user_' || substr(new.id::text, 1, 8)
        ),
        '[^a-zA-Z0-9_]+',
        '_',
        'g'
      )
    );

  insert into public.profiles (
    id,
    username,
    display_name,
    avatar_url,
    bio
  )
  values (
    new.id,
    left(trim(both '_' from base_username), 24),
    coalesce(
      nullif(new.raw_user_meta_data ->> 'display_name', ''),
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(new.raw_user_meta_data ->> 'username', ''),
      split_part(new.email, '@', 1)
    ),
    nullif(new.raw_user_meta_data ->> 'avatar_url', ''),
    null
  )
  on conflict (id) do update
    set username = excluded.username,
        display_name = coalesce(public.profiles.display_name, excluded.display_name),
        avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.beats enable row level security;

drop policy if exists "profiles are public read" on public.profiles;
create policy "profiles are public read"
on public.profiles
for select
using (true);

drop policy if exists "users insert own profile" on public.profiles;
create policy "users insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "beats are public read" on public.beats;
create policy "beats are public read"
on public.beats
for select
using (true);

drop policy if exists "users insert own beats" on public.beats;
create policy "users insert own beats"
on public.beats
for insert
with check (auth.uid() = user_id);

drop policy if exists "users update own beats" on public.beats;
create policy "users update own beats"
on public.beats
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users delete own beats" on public.beats;
create policy "users delete own beats"
on public.beats
for delete
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('beats', 'beats', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('profile-assets', 'profile-assets', true)
on conflict (id) do nothing;

drop policy if exists "public read beats files" on storage.objects;
create policy "public read beats files"
on storage.objects
for select
using (bucket_id = 'beats');

drop policy if exists "authenticated upload beats files" on storage.objects;
create policy "authenticated upload beats files"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'beats' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "owners update beats files" on storage.objects;
create policy "owners update beats files"
on storage.objects
for update
to authenticated
using (bucket_id = 'beats' and auth.uid()::text = (storage.foldername(name))[1])
with check (bucket_id = 'beats' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "owners delete beats files" on storage.objects;
create policy "owners delete beats files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'beats' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "public read profile assets" on storage.objects;
create policy "public read profile assets"
on storage.objects
for select
using (bucket_id = 'profile-assets');

drop policy if exists "authenticated upload profile assets" on storage.objects;
create policy "authenticated upload profile assets"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'profile-assets' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "owners update profile assets" on storage.objects;
create policy "owners update profile assets"
on storage.objects
for update
to authenticated
using (bucket_id = 'profile-assets' and auth.uid()::text = (storage.foldername(name))[1])
with check (bucket_id = 'profile-assets' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "owners delete profile assets" on storage.objects;
create policy "owners delete profile assets"
on storage.objects
for delete
to authenticated
using (bucket_id = 'profile-assets' and auth.uid()::text = (storage.foldername(name))[1]);

commit;
