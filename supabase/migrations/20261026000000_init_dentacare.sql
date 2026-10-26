-- =====================================================================
-- DentaCare — Database Architecture & Security Blueprint Migration
-- Designed for Supabase / PostgreSQL with Row-Level Security (RLS)
-- Owner Account: osmanratib14@gmail.com
-- =====================================================================

-- 1. Enable Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 2. Staff & Admins Table
create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('owner', 'staff')) default 'staff',
  created_at timestamptz default now()
);

-- Security definer check to determine if the active session is an authorized staff member
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.admins
    where id = auth.uid()
  );
$$;

-- 3. Content Tables (Marketing Site)
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text,
  body jsonb,
  price_from numeric,
  duration_min int,
  image_path text,
  sort_order int default 0,
  published boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text,
  bio text,
  photo_path text,
  sort_order int default 0,
  published boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.gallery_cases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  treatment text,
  before_path text not null,
  after_path text not null,
  published boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  rating int check (rating between 1 and 5) default 5,
  body text not null,
  published boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  body text,
  cover_path text,
  published_at timestamptz default now()
);

-- 4. Operations & Clinical Appointment Data
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null unique,
  email text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete set null,
  service_id uuid references public.services(id) on delete set null,
  requested_at timestamptz not null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  message text,
  source text default 'website',
  created_at timestamptz default now()
);

create table if not exists public.availability_rules (
  id uuid primary key default gen_random_uuid(),
  weekday int check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  slot_min int default 30
);

create table if not exists public.blocked_dates (
  date date primary key,
  reason text
);

create table if not exists public.audit_log (
  id bigserial primary key,
  admin_id uuid references public.admins(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id uuid,
  meta jsonb,
  created_at timestamptz default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null
);

-- 5. Indexes for High Performance Queries
create index if not exists idx_appointments_requested_at on public.appointments(requested_at);
create index if not exists idx_appointments_status on public.appointments(status);
create index if not exists idx_services_slug on public.services(slug);
create index if not exists idx_posts_slug on public.posts(slug);
create index if not exists idx_patients_phone on public.patients(phone);

-- 6. Enable Row Level Security (RLS) on All Tables
alter table public.admins enable row level security;
alter table public.services enable row level security;
alter table public.team_members enable row level security;
alter table public.gallery_cases enable row level security;
alter table public.reviews enable row level security;
alter table public.posts enable row level security;
alter table public.patients enable row level security;
alter table public.appointments enable row level security;
alter table public.availability_rules enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.audit_log enable row level security;
alter table public.site_settings enable row level security;

-- 7. RLS Policies: Content Tables (Public read published, Admin full write)
create policy "public read published services" on public.services
  for select using (published = true);
create policy "admin all services" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read published team" on public.team_members
  for select using (published = true);
create policy "admin all team" on public.team_members
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read published gallery" on public.gallery_cases
  for select using (published = true);
create policy "admin all gallery" on public.gallery_cases
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read published reviews" on public.reviews
  for select using (published = true);
create policy "admin all reviews" on public.reviews
  for all using (public.is_admin()) with check (public.is_admin());

create policy "public read published posts" on public.posts
  for select using (published_at is not null and published_at <= now());
create policy "admin all posts" on public.posts
  for all using (public.is_admin()) with check (public.is_admin());

-- 8. Sensitive Clinical Tables: Admin-Only (No public policy exists)
create policy "admin only admins" on public.admins
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admin only patients" on public.patients
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admin only appointments" on public.appointments
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admin only availability" on public.availability_rules
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admin only blocked_dates" on public.blocked_dates
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admin only audit_log" on public.audit_log
  for all using (public.is_admin()) with check (public.is_admin());

create policy "admin only site_settings" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- 9. Setup Owner Admin: osmanratib14@gmail.com
-- Note: User is registered via Supabase Auth. Run this hook after user creation:
-- insert into public.admins (id, full_name, role)
-- select id, 'Osman Ratib', 'owner'
-- from auth.users
-- where email = 'osmanratib14@gmail.com'
-- on conflict (id) do update set role = 'owner';
