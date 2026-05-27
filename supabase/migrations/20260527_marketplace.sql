begin;

-- ──────────────────────────────────────────────
-- Подписки между пользователями
-- ──────────────────────────────────────────────
create table if not exists public.follows (
  follower_id  uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at   timestamptz not null default timezone('utc', now()),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);
create index if not exists follows_following_id_idx on public.follows (following_id);

-- ──────────────────────────────────────────────
-- Лайки на биты
-- ──────────────────────────────────────────────
create table if not exists public.beat_likes (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  beat_id    uuid not null references public.beats(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, beat_id)
);
create index if not exists beat_likes_beat_id_idx on public.beat_likes (beat_id);

-- ──────────────────────────────────────────────
-- Комментарии к битам
-- ──────────────────────────────────────────────
create table if not exists public.beat_comments (
  id         uuid primary key default gen_random_uuid(),
  beat_id    uuid not null references public.beats(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  text       text not null check (char_length(trim(text)) > 0),
  created_at timestamptz not null default timezone('utc', now())
);
create index if not exists beat_comments_beat_id_idx on public.beat_comments (beat_id);

-- ──────────────────────────────────────────────
-- Услуги продюсеров (сведение, мастеринг, запись…)
-- ──────────────────────────────────────────────
create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  description text,
  price       integer not null check (price >= 0),
  category    text not null default 'other',
  created_at  timestamptz not null default timezone('utc', now()),
  updated_at  timestamptz not null default timezone('utc', now())
);
create index if not exists services_user_id_idx on public.services (user_id);

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
before update on public.services
for each row execute function public.set_updated_at();

-- ──────────────────────────────────────────────
-- Цифровые товары (биты, сэмпл паки, пресеты…)
-- ──────────────────────────────────────────────
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  title        text not null,
  description  text,
  price        integer not null check (price >= 0),
  file_url     text not null,
  preview_url  text,
  product_type text not null default 'beat',
  created_at   timestamptz not null default timezone('utc', now()),
  updated_at   timestamptz not null default timezone('utc', now())
);
create index if not exists products_user_id_idx on public.products (user_id);

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- ──────────────────────────────────────────────
-- Прямые сообщения между пользователями
-- ──────────────────────────────────────────────
create table if not exists public.direct_messages (
  id          uuid primary key default gen_random_uuid(),
  sender_id   uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  text        text not null check (char_length(trim(text)) > 0),
  read_at     timestamptz,
  created_at  timestamptz not null default timezone('utc', now()),
  check (sender_id <> receiver_id)
);
create index if not exists dm_sender_receiver_idx   on public.direct_messages (sender_id, receiver_id);
create index if not exists dm_receiver_sender_idx   on public.direct_messages (receiver_id, sender_id);
create index if not exists dm_created_at_idx        on public.direct_messages (created_at desc);

-- ──────────────────────────────────────────────
-- Заказы (покупка битов / услуг / продуктов)
-- ──────────────────────────────────────────────
create table if not exists public.orders (
  id         uuid primary key default gen_random_uuid(),
  buyer_id   uuid not null references public.profiles(id) on delete cascade,
  seller_id  uuid not null references public.profiles(id) on delete cascade,
  item_type  text not null check (item_type in ('beat', 'service', 'product')),
  item_id    uuid not null,
  amount     integer not null check (amount >= 0),
  status     text not null default 'pending'
               check (status in ('pending','accepted','paid','completed','cancelled')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (buyer_id <> seller_id)
);
create index if not exists orders_buyer_id_idx  on public.orders (buyer_id);
create index if not exists orders_seller_id_idx on public.orders (seller_id);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

-- ──────────────────────────────────────────────
-- Сообщения внутри заказа
-- ──────────────────────────────────────────────
create table if not exists public.order_messages (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders(id) on delete cascade,
  sender_id  uuid not null references public.profiles(id) on delete cascade,
  text       text not null check (char_length(trim(text)) > 0),
  created_at timestamptz not null default timezone('utc', now())
);
create index if not exists order_messages_order_id_idx on public.order_messages (order_id);

-- ──────────────────────────────────────────────
-- Storage bucket для продуктов
-- ──────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('products', 'products', false)
on conflict (id) do nothing;

-- ──────────────────────────────────────────────
-- RLS
-- ──────────────────────────────────────────────

alter table public.follows        enable row level security;
alter table public.beat_likes     enable row level security;
alter table public.beat_comments  enable row level security;
alter table public.services       enable row level security;
alter table public.products       enable row level security;
alter table public.direct_messages enable row level security;
alter table public.orders         enable row level security;
alter table public.order_messages enable row level security;

-- follows
drop policy if exists "follows public read"   on public.follows;
create policy "follows public read"   on public.follows for select using (true);
drop policy if exists "follows insert own"    on public.follows;
create policy "follows insert own"    on public.follows for insert with check (auth.uid() = follower_id);
drop policy if exists "follows delete own"    on public.follows;
create policy "follows delete own"    on public.follows for delete using (auth.uid() = follower_id);

-- beat_likes
drop policy if exists "beat_likes public read"  on public.beat_likes;
create policy "beat_likes public read"  on public.beat_likes for select using (true);
drop policy if exists "beat_likes insert own"   on public.beat_likes;
create policy "beat_likes insert own"   on public.beat_likes for insert with check (auth.uid() = user_id);
drop policy if exists "beat_likes delete own"   on public.beat_likes;
create policy "beat_likes delete own"   on public.beat_likes for delete using (auth.uid() = user_id);

-- beat_comments
drop policy if exists "beat_comments public read"  on public.beat_comments;
create policy "beat_comments public read"  on public.beat_comments for select using (true);
drop policy if exists "beat_comments insert auth"  on public.beat_comments;
create policy "beat_comments insert auth"  on public.beat_comments for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "beat_comments delete own"   on public.beat_comments;
create policy "beat_comments delete own"   on public.beat_comments for delete using (auth.uid() = user_id);

-- services
drop policy if exists "services public read"   on public.services;
create policy "services public read"   on public.services for select using (true);
drop policy if exists "services insert own"    on public.services;
create policy "services insert own"    on public.services for insert with check (auth.uid() = user_id);
drop policy if exists "services update own"    on public.services;
create policy "services update own"    on public.services for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "services delete own"    on public.services;
create policy "services delete own"    on public.services for delete using (auth.uid() = user_id);

-- products
drop policy if exists "products public read"   on public.products;
create policy "products public read"   on public.products for select using (true);
drop policy if exists "products insert own"    on public.products;
create policy "products insert own"    on public.products for insert with check (auth.uid() = user_id);
drop policy if exists "products update own"    on public.products;
create policy "products update own"    on public.products for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "products delete own"    on public.products;
create policy "products delete own"    on public.products for delete using (auth.uid() = user_id);

-- direct_messages
drop policy if exists "dm own read"   on public.direct_messages;
create policy "dm own read"   on public.direct_messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
drop policy if exists "dm insert own" on public.direct_messages;
create policy "dm insert own" on public.direct_messages for insert to authenticated with check (auth.uid() = sender_id);
drop policy if exists "dm update own" on public.direct_messages;
create policy "dm update own" on public.direct_messages for update using (auth.uid() = receiver_id);

-- orders
drop policy if exists "orders own read"    on public.orders;
create policy "orders own read"    on public.orders for select using (auth.uid() = buyer_id or auth.uid() = seller_id);
drop policy if exists "orders buyer insert" on public.orders;
create policy "orders buyer insert" on public.orders for insert to authenticated with check (auth.uid() = buyer_id);
drop policy if exists "orders seller update" on public.orders;
create policy "orders seller update" on public.orders for update using (auth.uid() = seller_id or auth.uid() = buyer_id);

-- order_messages
drop policy if exists "order_messages own read"    on public.order_messages;
create policy "order_messages own read"    on public.order_messages for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.buyer_id = auth.uid() or o.seller_id = auth.uid())
    )
  );
drop policy if exists "order_messages insert auth" on public.order_messages;
create policy "order_messages insert auth" on public.order_messages for insert to authenticated
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.buyer_id = auth.uid() or o.seller_id = auth.uid())
    )
  );

-- products storage
drop policy if exists "products storage owner read" on storage.objects;
create policy "products storage owner read" on storage.objects
  for select to authenticated
  using (bucket_id = 'products' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "products storage upload" on storage.objects;
create policy "products storage upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'products' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "products storage delete" on storage.objects;
create policy "products storage delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'products' and auth.uid()::text = (storage.foldername(name))[1]);

commit;
