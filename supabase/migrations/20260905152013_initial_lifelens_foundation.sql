-- ============================================================
-- LifeLens AI — Phase 1 foundation migration
-- Creates: public.profiles, the auth-user-signup trigger/function,
-- and Row Level Security policies.
-- ============================================================

-- ------------------------------------------------------------
-- 1. profiles table
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text not null,
  role text not null default 'USER',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (
    role in ('USER', 'BYSTANDER', 'HOSPITAL_STAFF', 'ADMIN')
  )
);

comment on table public.profiles is
  'One row per authenticated user. Created automatically by handle_new_user() on signup.';

-- Case-insensitive uniqueness on email avoids duplicate profile rows for
-- the same address (auth.users already enforces uniqueness for login,
-- this keeps profiles consistent with that).
create unique index if not exists profiles_email_key
  on public.profiles (lower(email));

-- Supports future role-based queries (e.g. "all HOSPITAL_STAFF").
create index if not exists profiles_role_idx
  on public.profiles (role);

-- ------------------------------------------------------------
-- 2. updated_at maintenance
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 3. auth.users -> public.profiles provisioning
-- ------------------------------------------------------------
-- security definer is required here: this function runs as part of the
-- Supabase Auth signup flow (triggered on auth.users), and the calling
-- session does not yet have an authenticated JWT that would satisfy the
-- RLS policies below. search_path is pinned to avoid schema hijacking.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    'USER'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ------------------------------------------------------------
-- 4. Row Level Security
-- ------------------------------------------------------------
alter table public.profiles enable row level security;

-- Authenticated users may read only their own profile row.
-- (No policy is defined for anon or for other users' rows, so — with
-- RLS enabled — those reads are denied by default.)
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- Authenticated users may update only their own profile row.
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Deliberately no INSERT policy for client roles: rows are created only
-- by the security-definer handle_new_user() trigger above, and no
-- DELETE policy: profile rows are removed via the auth.users cascade,
-- not directly by users.
