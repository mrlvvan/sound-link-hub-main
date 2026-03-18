-- SoundLinker: схема БД для дипломного проекта
-- Выполни в Supabase SQL Editor после создания проекта
--
-- После создания таблиц: Database → Replication → включи Realtime
-- для таблиц order_messages и booking_messages (для live-чата)

-- Профили пользователей (расширение auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS для profiles
alter table public.profiles enable row level security;

drop policy if exists "Профили доступны всем на чтение" on public.profiles;
create policy "Профили доступны всем на чтение"
  on public.profiles for select
  using (true);

drop policy if exists "Пользователь может обновлять свой профиль" on public.profiles;
create policy "Пользователь может обновлять свой профиль"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Пользователь может создать свой профиль" on public.profiles;
create policy "Пользователь может создать свой профиль"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Сообщения по заказам
create table if not exists public.order_messages (
  id uuid primary key default gen_random_uuid(),
  order_id text not null,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  text text not null,
  created_at timestamptz default now()
);

alter table public.order_messages enable row level security;

drop policy if exists "Сообщения заказа видны участникам" on public.order_messages;
create policy "Сообщения заказа видны участникам" on public.order_messages for select using (true);
drop policy if exists "Авторизованные могут писать" on public.order_messages;
create policy "Авторизованные могут писать" on public.order_messages for insert with check (auth.uid() = sender_id);

-- Сообщения по бронированиям
create table if not exists public.booking_messages (
  id uuid primary key default gen_random_uuid(),
  booking_id text not null,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  text text not null,
  created_at timestamptz default now()
);

alter table public.booking_messages enable row level security;

drop policy if exists "Сообщения бронирования видны всем" on public.booking_messages;
create policy "Сообщения бронирования видны всем" on public.booking_messages for select using (true);
drop policy if exists "Авторизованные могут писать в бронирования" on public.booking_messages;
create policy "Авторизованные могут писать в бронирования" on public.booking_messages for insert with check (auth.uid() = sender_id);

-- Триггер: создание профиля при регистрации
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'display_name', new.email)
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Биты (треки) пользователей
create table if not exists public.beats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  track_name text not null,
  genre text not null,
  description text,
  audio_url text not null,
  cover_gradient text default 'bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600',
  service_title text default 'Аренда студии',
  service_price integer default 2500,
  likes_count integer default 0,
  created_at timestamptz default now()
);

alter table public.beats enable row level security;

drop policy if exists "Биты видны всем" on public.beats;
create policy "Биты видны всем" on public.beats for select using (true);

drop policy if exists "Авторизованные могут добавлять биты" on public.beats;
create policy "Авторизованные могут добавлять биты" on public.beats for insert with check (auth.uid() = user_id);

drop policy if exists "Авторизованные могут удалять свои биты" on public.beats;
create policy "Авторизованные могут удалять свои биты" on public.beats for delete using (auth.uid() = user_id);

-- Storage bucket "beats" для WAV-файлов
-- 1. Создай bucket вручную: Dashboard → Storage → New bucket
--    Имя: beats, Public: включить
-- 2. Политики ниже разрешают загрузку авторизованным и чтение всем

-- Публичное чтение файлов из beats
create policy "Beats public read"
on storage.objects for select
using (bucket_id = 'beats');

-- Авторизованные могут загружать в beats
create policy "Authenticated upload beats"
on storage.objects for insert
with check (bucket_id = 'beats' and auth.role() = 'authenticated');

-- Пользователь может удалять свои файлы (папка = user_id)
create policy "Users delete own beats"
on storage.objects for delete
using (bucket_id = 'beats' and auth.uid()::text = (storage.foldername(name))[1]);
