create table if not exists public.app_trips (
  id uuid primary key default gen_random_uuid(),
  install_id text not null,
  local_id text not null,
  title text not null,
  destination text not null,
  request jsonb not null,
  plan jsonb not null,
  agents jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (install_id, local_id)
);

create table if not exists public.app_partners (
  id uuid primary key default gen_random_uuid(),
  install_id text not null,
  local_id text not null,
  name text not null,
  destination text not null,
  category text not null,
  description text,
  photo_url text,
  thumb_url text,
  photo_alt text,
  photo_credit text,
  source text,
  confidence numeric,
  score numeric,
  status text not null default 'prospectado',
  contact_hint text,
  partnership_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (install_id, local_id)
);

create table if not exists public.app_expenses (
  id uuid primary key default gen_random_uuid(),
  install_id text not null,
  local_id text not null,
  trip_key text not null,
  destination text not null,
  category text not null,
  description text not null,
  amount numeric not null,
  paid_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (install_id, local_id)
);

create table if not exists public.app_visited_places (
  id uuid primary key default gen_random_uuid(),
  install_id text not null,
  local_id text not null,
  trip_key text not null,
  destination text not null,
  name text not null,
  notes text,
  rating numeric,
  visited_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (install_id, local_id)
);

alter table public.app_trips enable row level security;
alter table public.app_partners enable row level security;
alter table public.app_expenses enable row level security;
alter table public.app_visited_places enable row level security;

create policy "anon can insert trips"
  on public.app_trips for insert
  to anon
  with check (install_id is not null);

create policy "anon can upsert own trips by install id"
  on public.app_trips for update
  to anon
  using (install_id is not null)
  with check (install_id is not null);

create policy "anon can insert partners"
  on public.app_partners for insert
  to anon
  with check (install_id is not null);

create policy "anon can upsert own partners by install id"
  on public.app_partners for update
  to anon
  using (install_id is not null)
  with check (install_id is not null);

create policy "anon can insert expenses"
  on public.app_expenses for insert
  to anon
  with check (install_id is not null);

create policy "anon can upsert own expenses by install id"
  on public.app_expenses for update
  to anon
  using (install_id is not null)
  with check (install_id is not null);

create policy "anon can insert visited places"
  on public.app_visited_places for insert
  to anon
  with check (install_id is not null);

create policy "anon can upsert own visited places by install id"
  on public.app_visited_places for update
  to anon
  using (install_id is not null)
  with check (install_id is not null);
