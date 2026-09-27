-- ============================================================
-- LifeLens AI — Phase 2 foundation migration
-- Creates: public.incidents (the real incident data model that
-- GPS capture, and later capture/AI/hospital-matching, attach to).
-- ============================================================

-- ------------------------------------------------------------
-- 1. incidents table
-- ------------------------------------------------------------
create table if not exists public.incidents (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'REPORTED',
  latitude double precision,
  longitude double precision,
  accuracy_meters double precision,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint incidents_status_check check (
    status in (
      'REPORTED',    -- created, not yet located
      'LOCATED',     -- GPS coordinates attached
      'ANALYZING',   -- future: AI image assessment in progress
      'MATCHED',     -- future: hospital matched
      'RESPONDING',  -- future: hospital en route
      'RESOLVED',    -- closed
      'CANCELLED'    -- reporter cancelled
    )
  ),
  constraint incidents_lat_check check (
    latitude is null or (latitude >= -90 and latitude <= 90)
  ),
  constraint incidents_lng_check check (
    longitude is null or (longitude >= -180 and longitude <= 180)
  )
);

comment on table public.incidents is
  'One row per reported incident. Phase 2 scope: reporter-owned rows with
   optional GPS coordinates. Image capture, AI assessment, and hospital
   matching are later phases and are NOT modeled here yet.';

-- A reporter's own incidents, most recent first — the query the dashboard
-- actually runs.
create index if not exists incidents_reporter_created_idx
  on public.incidents (reporter_id, created_at desc);

create index if not exists incidents_status_idx
  on public.incidents (status);

-- Reuses the set_updated_at() function created in the Phase 1 migration
-- (20260905152013_initial_lifelens_foundation.sql).
drop trigger if exists incidents_set_updated_at on public.incidents;
create trigger incidents_set_updated_at
  before update on public.incidents
  for each row
  execute function public.set_updated_at();

-- ------------------------------------------------------------
-- 2. Row Level Security
-- ------------------------------------------------------------
alter table public.incidents enable row level security;

-- A reporter may create incidents only for themselves.
drop policy if exists "incidents_insert_own" on public.incidents;
create policy "incidents_insert_own"
  on public.incidents
  for insert
  to authenticated
  with check (auth.uid() = reporter_id);

-- A reporter may read only their own incidents.
-- (No hospital/staff read policy yet — that is Phase 3, once a hospital
-- role and a matching mechanism exist. Until then, RLS denies everyone
-- else by default, including other authenticated users and HOSPITAL_STAFF.)
drop policy if exists "incidents_select_own" on public.incidents;
create policy "incidents_select_own"
  on public.incidents
  for select
  to authenticated
  using (auth.uid() = reporter_id);

-- A reporter may update only their own incidents (e.g. cancel, or attach
-- coordinates after creation).
drop policy if exists "incidents_update_own" on public.incidents;
create policy "incidents_update_own"
  on public.incidents
  for update
  to authenticated
  using (auth.uid() = reporter_id)
  with check (auth.uid() = reporter_id);

-- Deliberately no DELETE policy: incidents are cancelled via status update,
-- not removed, to preserve the eventual emergency timeline / audit trail.
