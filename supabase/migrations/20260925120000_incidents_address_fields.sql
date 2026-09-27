-- ============================================================
-- LifeLens AI — add human-readable address fields to incidents
-- Coordinates remain the source of truth; these are an additional
-- presentation field populated by real reverse-geocoding at report
-- time (see src/lib/reverseGeocode.ts). Both are nullable: geocoding
-- can fail or be unavailable, and older rows predate this migration.
-- ============================================================

alter table public.incidents
  add column if not exists address_line text,
  add column if not exists address_area text;

comment on column public.incidents.address_line is
  'Most specific reverse-geocoded label (landmark, building, or road). Null if geocoding failed or was unavailable.';
comment on column public.incidents.address_area is
  'Reverse-geocoded area/city/state, paired with address_line. Null if unavailable or if there was nothing more specific than address_line itself.';
