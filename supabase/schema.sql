-- Tracked accounts
create table if not exists tracked_accounts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  platform    text not null,
  username    text not null,
  sort_order  int  not null default 0,
  added_at    timestamptz not null default now(),
  unique (user_id, platform, username)
);

-- Metric snapshots
create table if not exists metric_snapshots (
  id           uuid primary key default gen_random_uuid(),
  account_id   uuid references tracked_accounts on delete cascade not null,
  followers    int not null,
  following    int,
  captured_at  timestamptz not null default now()
);

-- RLS: each user sees only their own data
alter table tracked_accounts  enable row level security;
alter table metric_snapshots  enable row level security;

create policy "own accounts"  on tracked_accounts  for all using (auth.uid() = user_id);
create policy "own snapshots" on metric_snapshots  for all using (
  auth.uid() = (select user_id from tracked_accounts where id = account_id)
);

-- Index for fast snapshot lookups
create index if not exists idx_snapshots_account_time on metric_snapshots (account_id, captured_at desc);
