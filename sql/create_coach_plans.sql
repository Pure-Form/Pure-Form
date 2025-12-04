-- Run inside Supabase SQL editor to store AI generated plans
-- Requires: enable extension if not already
--   create extension if not exists "uuid-ossp";

create table if not exists public.coach_plans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users (id) on delete cascade,
  profile jsonb not null,
  plan jsonb not null,
  model text not null,
  locale text not null default 'tr',
  created_at timestamp with time zone not null default now()
);

create index if not exists coach_plans_user_id_idx on public.coach_plans (user_id, created_at desc);
*** End of File ***
