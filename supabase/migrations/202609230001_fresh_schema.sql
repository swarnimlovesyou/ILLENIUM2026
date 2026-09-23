-- ILLENIUM 2026: Master Fresh Schema Reset Migration (Draft 1 Specification)

-- 1. Reset Schema & Permissions
drop schema if exists public cascade;
create schema public;
grant all on schema public to postgres, anon, authenticated, service_role;

-- 2. Custom Enum Types
create type public.user_role as enum (
  'cp', 'vcp', 'hod', 'ahod', 'oc', 'cl', 'acl', 'participant', 'npa', 'prnc', 'otse', 'audience', 'judge', 'scoring_admin'
);

create type public.accred_category as enum ('cc', 'prnc', 'otse', 'audience');
create type public.event_type as enum ('individual', 'team', 'contingent', 'mixed');
create type public.event_status as enum ('draft', 'open', 'in_progress', 'completed', 'locked');
create type public.verification_status as enum ('pending', 'verified', 'rejected', 'requires_review');
create type public.wristband_status as enum ('active', 'replaced', 'revoked');
create type public.check_in_type as enum ('campus_entry', 'event_entry', 'goodie_distribution', 'prize_distribution');
create type public.score_status as enum ('draft', 'submitted', 'locked', 'corrected');
create type public.bid_outcome as enum ('pending', 'correct', 'no_bid', 'incorrect');
create type public.adjustment_type as enum ('penalty', 'bonus', 'correction');

-- 3. Profiles Table (Master Person UID)
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  illenium_id text unique not null,
  full_name text not null,
  email text unique not null,
  phone text,
  role public.user_role not null default 'participant',
  category public.accred_category not null default 'cc',
  department text,
  college_name text,
  college_roll_number text,
  photo_url text,
  verification_status public.verification_status default 'pending',
  verified_by uuid,
  created_at timestamptz default now()
);

-- 4. Contingents Table (Contingent Code Master)
create table public.contingents (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  college_name text not null,
  cl_profile_id uuid references public.profiles(id),
  acl_profile_id uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- 5. Contingent Members Linkage
create table public.contingent_members (
  id uuid primary key default gen_random_uuid(),
  contingent_id uuid not null references public.contingents(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role_in_contingent public.user_role default 'participant',
  joined_at timestamptz default now(),
  unique (contingent_id, profile_id)
);

-- 6. Events Master Table
create table public.events (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  category text not null,
  venue text not null,
  event_type public.event_type not null default 'individual',
  min_team_size int default 1,
  max_team_size int default 1,
  start_time timestamptz,
  reporting_time timestamptz,
  status public.event_status default 'open',
  bidding_enabled boolean default true,
  bid_positive_pts int default 10,
  bid_negative_pts int default -5,
  bid_deadline timestamptz,
  created_at timestamptz default now()
);

-- 7. Scoring Criteria / Verticals
create table public.scoring_criteria (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  max_score numeric not null default 100,
  weight numeric not null default 1.0,
  description text,
  created_at timestamptz default now()
);

-- 8. Teams Table
create table public.teams (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  contingent_id uuid references public.contingents(id),
  team_name text not null,
  leader_profile_id uuid not null references public.profiles(id),
  created_at timestamptz default now()
);

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  unique (team_id, profile_id)
);

-- 9. Event Registrations
create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  participant_id uuid references public.profiles(id),
  team_id uuid references public.teams(id),
  contingent_id uuid references public.contingents(id),
  registered_at timestamptz default now()
);

-- 10. Physical Wristbands (Day 1 / Day 2 Mapped Tokens)
create table public.wristbands (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  day int not null check (day in (1, 2)),
  token_hash text not null unique,
  status public.wristband_status default 'active',
  issued_at timestamptz default now(),
  issued_by uuid references public.profiles(id)
);

-- 11. Pre-event Digital QR Tokens
create table public.qr_tokens (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  token_hash text not null unique,
  token_ciphertext text not null,
  created_at timestamptz default now(),
  revoked_at timestamptz
);

-- 12. Scans & Check-ins
create table public.check_ins (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid references public.events(id),
  check_in_type public.check_in_type not null default 'campus_entry',
  scanned_by uuid references public.profiles(id),
  attendance_status text default 'accepted',
  scanned_at timestamptz default now()
);

-- 13. Judge Assignments & Judge Scores
create table public.judge_assignments (
  id uuid primary key default gen_random_uuid(),
  judge_profile_id uuid not null references public.profiles(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  assigned_at timestamptz default now(),
  unique (judge_profile_id, event_id)
);

create table public.judge_scores (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  judge_profile_id uuid not null references public.profiles(id),
  participant_id uuid references public.profiles(id),
  team_id uuid references public.teams(id),
  criterion_id uuid not null references public.scoring_criteria(id),
  raw_score numeric not null,
  max_score numeric not null default 100,
  weight numeric not null default 1.0,
  calculated_score numeric not null,
  status public.score_status default 'draft',
  version int default 1,
  submitted_at timestamptz default now()
);

-- 14. Score Corrections Workflow
create table public.score_corrections (
  id uuid primary key default gen_random_uuid(),
  judge_score_id uuid not null references public.judge_scores(id) on delete cascade,
  requested_by uuid not null references public.profiles(id),
  old_raw_score numeric not null,
  new_raw_score numeric not null,
  reason text not null,
  status text default 'pending',
  approved_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- 15. Bidding Engine
create table public.bids (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  contingent_id uuid references public.contingents(id),
  profile_id uuid references public.profiles(id),
  predicted_rank int not null,
  submitted_at timestamptz default now(),
  outcome public.bid_outcome default 'pending',
  points_awarded int default 0
);

-- 16. OC Administrative Adjustments
create table public.oc_adjustments (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id),
  contingent_id uuid references public.contingents(id),
  profile_id uuid references public.profiles(id),
  type public.adjustment_type not null default 'penalty',
  points_delta int not null,
  reason text not null,
  authorized_by uuid not null references public.profiles(id),
  created_at timestamptz default now()
);

-- 17. Event Results & Leaderboard
create table public.event_results (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  participant_id uuid references public.profiles(id),
  team_id uuid references public.teams(id),
  contingent_id uuid references public.contingents(id),
  total_raw_score numeric default 0,
  calculated_event_score numeric default 0,
  rank int,
  event_points int default 0,
  bid_points int default 0,
  oc_adjustment_points int default 0,
  final_points int default 0,
  is_locked boolean default false,
  calculated_at timestamptz default now()
);

create table public.leaderboard (
  id uuid primary key default gen_random_uuid(),
  contingent_id uuid not null references public.contingents(id) on delete cascade unique,
  total_event_points int default 0,
  total_bidding_points int default 0,
  total_adjustments int default 0,
  cumulative_points int default 0,
  rank int,
  updated_at timestamptz default now()
);

-- 18. Audit Logs
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  old_value jsonb,
  new_value jsonb,
  reason text,
  created_at timestamptz default now()
);

-- Grant privileges
grant all privileges on all tables in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all sequences in schema public to postgres, anon, authenticated, service_role;
