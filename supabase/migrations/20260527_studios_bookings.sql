-- Studios and bookings tables for music studio rental system

-- Studios
create table if not exists public.studios (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references public.profiles(id) on delete cascade,
  name          text not null,
  description   text,
  address       text not null,
  city          text not null default 'Москва',
  price_per_hour numeric(10,2) not null,
  price_per_day  numeric(10,2),
  equipment     text,
  photos        text[] not null default '{}',
  created_at    timestamptz not null default now()
);

-- Bookings
create table if not exists public.bookings (
  id            uuid primary key default gen_random_uuid(),
  studio_id     uuid not null references public.studios(id) on delete cascade,
  renter_id     uuid not null references public.profiles(id) on delete cascade,
  owner_id      uuid not null references public.profiles(id) on delete cascade,
  start_time    timestamptz not null,
  end_time      timestamptz not null,
  total_price   numeric(10,2) not null,
  status        text not null default 'pending'
                  check (status in ('pending','confirmed','active','completed','cancelled')),
  note          text,
  created_at    timestamptz not null default now()
);

-- Booking messages (chat inside a booking)
create table if not exists public.booking_messages (
  id            uuid primary key default gen_random_uuid(),
  booking_id    uuid not null references public.bookings(id) on delete cascade,
  sender_id     uuid not null references public.profiles(id) on delete cascade,
  text          text not null,
  created_at    timestamptz not null default now()
);

-- Indexes
create index if not exists studios_owner_id_idx       on public.studios(owner_id);
create index if not exists studios_city_idx           on public.studios(city);
create index if not exists bookings_renter_id_idx     on public.bookings(renter_id);
create index if not exists bookings_owner_id_idx      on public.bookings(owner_id);
create index if not exists bookings_studio_id_idx     on public.bookings(studio_id);
create index if not exists booking_messages_booking_idx on public.booking_messages(booking_id);

-- RLS
alter table public.studios enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_messages enable row level security;

-- Studios: public read, owner write
create policy "Studios public read"       on public.studios for select using (true);
create policy "Studios owner insert"      on public.studios for insert with check (auth.uid() = owner_id);
create policy "Studios owner update"      on public.studios for update using (auth.uid() = owner_id);
create policy "Studios owner delete"      on public.studios for delete using (auth.uid() = owner_id);

-- Bookings: parties can read, renter creates, parties can update status
create policy "Bookings party read"       on public.bookings for select using (auth.uid() in (renter_id, owner_id));
create policy "Bookings renter insert"    on public.bookings for insert with check (auth.uid() = renter_id);
create policy "Bookings party update"     on public.bookings for update using (auth.uid() in (renter_id, owner_id));

-- Booking messages: parties can read/write
create policy "BookingMsg party read"     on public.booking_messages for select
  using (exists (select 1 from public.bookings b where b.id = booking_id and auth.uid() in (b.renter_id, b.owner_id)));
create policy "BookingMsg sender insert"  on public.booking_messages for insert
  with check (
    auth.uid() = sender_id and
    exists (select 1 from public.bookings b where b.id = booking_id and auth.uid() in (b.renter_id, b.owner_id))
  );
