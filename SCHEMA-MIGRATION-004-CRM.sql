-- ============================================================================
-- SCHEMA-MIGRATION-004-CRM.sql
-- Cycle 004 — CRM through workflows
--
-- Extends public.organizations with CRM tracking fields (Accounts in the UI),
-- adds contacts/deals/account_activities tables, and prepares the workspace
-- for the Campaign Teardown 4-tab surface that wires CRM data into the
-- killer-app workflow.
--
-- Target: Supabase project `rojpjtyjiapqpsxdeovk`. Apply via SQL Editor.
-- Apply BEFORE running SCHEMA-MIGRATION-004-seed.sql (the seed depends on
-- these columns/tables existing).
--
-- Idempotent. Safe to re-run.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. New enums
-- ----------------------------------------------------------------------------
do $$ begin
  create type public.account_status as enum (
    'prospect','qualified','customer','churned','lost'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.account_source as enum (
    'john_network','inbound','event','cold','referral','partner','unknown'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.deal_kind as enum (
    'memo','teardown','audit','embedded','custom'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.deal_stage as enum (
    'new','briefed','in_progress','review','delivered','won','lost'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.activity_kind as enum (
    'call','email_sent','email_received','meeting','linkedin_dm','note','event','demo','intro','other'
  );
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- 2. Extend public.organizations with CRM tracking fields
-- ----------------------------------------------------------------------------
alter table public.organizations
  add column if not exists industry            text,
  add column if not exists size_employees      text,
  add column if not exists hq_city             text,
  add column if not exists hq_country          text default 'USA',
  add column if not exists account_status      public.account_status not null default 'prospect',
  add column if not exists linkedin_url        text,
  add column if not exists owner_email         text,
  add column if not exists pitch_notes         text,
  add column if not exists source              public.account_source not null default 'unknown';

create index if not exists idx_orgs_account_status on public.organizations(account_status);
create index if not exists idx_orgs_owner          on public.organizations(owner_email);
create index if not exists idx_orgs_industry       on public.organizations(industry);
create index if not exists idx_orgs_name_trgm      on public.organizations using gin (name gin_trgm_ops);

-- ----------------------------------------------------------------------------
-- 3. Contacts — people at accounts
-- ----------------------------------------------------------------------------
create table if not exists public.contacts (
  id                 uuid primary key default gen_random_uuid(),
  organization_id    uuid not null references public.organizations(id) on delete cascade,
  name               text not null,
  email              text,
  role_title         text,
  linkedin_url       text,
  is_primary_contact boolean not null default false,
  notes              text,
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create unique index if not exists uq_contacts_org_email
  on public.contacts (organization_id, lower(email))
  where email is not null;
create index if not exists idx_contacts_org      on public.contacts(organization_id);
create index if not exists idx_contacts_primary  on public.contacts(organization_id) where is_primary_contact;
create index if not exists idx_contacts_name_trgm on public.contacts using gin (name gin_trgm_ops);

do $$ begin
  drop trigger if exists trg_contacts_touch on public.contacts;
  create trigger trg_contacts_touch
    before update on public.contacts
    for each row execute function public.update_updated_at_column();
end $$;

-- ----------------------------------------------------------------------------
-- 4. Deals — pipeline items
-- ----------------------------------------------------------------------------
create table if not exists public.deals (
  id                  uuid primary key default gen_random_uuid(),
  organization_id     uuid not null references public.organizations(id) on delete cascade,
  primary_contact_id  uuid references public.contacts(id) on delete set null,
  title               text not null,
  kind                public.deal_kind not null default 'teardown',
  stage               public.deal_stage not null default 'new',
  value_usd           numeric(12,2),
  owner_email         text,
  expected_close_date date,
  closed_at           timestamptz,
  brief_summary       text,
  metadata            jsonb not null default '{}'::jsonb,
  -- Once an architect_output is delivered for this deal, link it here.
  delivered_output_id uuid references public.architect_outputs(id) on delete set null,
  slug                text unique,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create unique index if not exists uq_deals_org_title
  on public.deals (organization_id, title);
create index if not exists idx_deals_org   on public.deals(organization_id);
create index if not exists idx_deals_stage on public.deals(stage);
create index if not exists idx_deals_kind  on public.deals(kind);
create index if not exists idx_deals_owner on public.deals(owner_email);

do $$ begin
  drop trigger if exists trg_deals_touch on public.deals;
  create trigger trg_deals_touch
    before update on public.deals
    for each row execute function public.update_updated_at_column();
end $$;

-- Auto-generate a slug for deals on insert if not provided
create or replace function public.generate_deal_slug()
returns trigger language plpgsql as $$
declare
  base text;
  candidate text;
  n int := 0;
begin
  if new.slug is null or new.slug = '' then
    base := regexp_replace(lower(coalesce(new.title, 'deal')), '[^a-z0-9]+', '-', 'g');
    base := trim(both '-' from base);
    if base = '' then base := 'deal'; end if;
    base := left(base, 48);
    candidate := base || '-' || substr(md5(gen_random_uuid()::text), 1, 6);
    new.slug := candidate;
  end if;
  return new;
end;
$$;

do $$ begin
  drop trigger if exists trg_deals_slug on public.deals;
  create trigger trg_deals_slug
    before insert on public.deals
    for each row execute function public.generate_deal_slug();
end $$;

-- ----------------------------------------------------------------------------
-- 5. Account activities — touchpoints (calls, emails, meetings)
-- ----------------------------------------------------------------------------
create table if not exists public.account_activities (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  deal_id         uuid references public.deals(id) on delete set null,
  contact_id      uuid references public.contacts(id) on delete set null,
  kind            public.activity_kind not null default 'note',
  title           text not null,
  body_md         text,
  happened_at     timestamptz not null default now(),
  logged_by       uuid references public.users(id) on delete set null,
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);

create index if not exists idx_activities_org   on public.account_activities(organization_id);
create index if not exists idx_activities_deal  on public.account_activities(deal_id);
create index if not exists idx_activities_kind  on public.account_activities(kind);
create index if not exists idx_activities_when  on public.account_activities(happened_at desc);

-- ----------------------------------------------------------------------------
-- 6. Posts → Account linkage (optional account_id on posts)
-- ----------------------------------------------------------------------------
alter table public.posts
  add column if not exists organization_id uuid references public.organizations(id) on delete set null;

create index if not exists idx_posts_org on public.posts(organization_id);

-- ----------------------------------------------------------------------------
-- 7. Organization slug — ensure all rows have a slug for URL routing
-- ----------------------------------------------------------------------------
-- (organizations.slug already exists per Cycle 003 schema.)
create index if not exists idx_orgs_slug on public.organizations(slug);

-- ----------------------------------------------------------------------------
-- 8. RLS — workspace members can read; team members can write own owned
-- ----------------------------------------------------------------------------
alter table public.organizations      enable row level security;
alter table public.contacts           enable row level security;
alter table public.deals              enable row level security;
alter table public.account_activities enable row level security;

-- Organizations
do $$ begin
  create policy orgs_workspace_read on public.organizations
    for select using (public.is_workspace_member(auth.uid()));
  create policy orgs_workspace_insert on public.organizations
    for insert with check (public.is_workspace_member(auth.uid()));
  create policy orgs_workspace_update on public.organizations
    for update using (public.is_workspace_member(auth.uid()));
  create policy orgs_workspace_delete on public.organizations
    for delete using (public.is_workspace_member(auth.uid()));
exception when duplicate_object then null; end $$;

-- Contacts
do $$ begin
  create policy contacts_workspace_read on public.contacts
    for select using (public.is_workspace_member(auth.uid()));
  create policy contacts_workspace_insert on public.contacts
    for insert with check (public.is_workspace_member(auth.uid()));
  create policy contacts_workspace_update on public.contacts
    for update using (public.is_workspace_member(auth.uid()));
  create policy contacts_workspace_delete on public.contacts
    for delete using (public.is_workspace_member(auth.uid()));
exception when duplicate_object then null; end $$;

-- Deals
do $$ begin
  create policy deals_workspace_read on public.deals
    for select using (public.is_workspace_member(auth.uid()));
  create policy deals_workspace_insert on public.deals
    for insert with check (public.is_workspace_member(auth.uid()));
  create policy deals_workspace_update on public.deals
    for update using (public.is_workspace_member(auth.uid()));
  create policy deals_workspace_delete on public.deals
    for delete using (public.is_workspace_member(auth.uid()));
exception when duplicate_object then null; end $$;

-- Account activities
do $$ begin
  create policy activities_workspace_read on public.account_activities
    for select using (public.is_workspace_member(auth.uid()));
  create policy activities_workspace_insert on public.account_activities
    for insert with check (public.is_workspace_member(auth.uid()));
  create policy activities_workspace_update on public.account_activities
    for update using (public.is_workspace_member(auth.uid()));
  create policy activities_workspace_delete on public.account_activities
    for delete using (public.is_workspace_member(auth.uid()));
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- 9. Convenience view: deals with org + contact joined
-- ----------------------------------------------------------------------------
create or replace view public.deals_enriched as
select
  d.*,
  o.slug         as org_slug,
  o.name         as org_name,
  o.industry     as org_industry,
  o.account_status as org_account_status,
  c.name         as primary_contact_name,
  c.email        as primary_contact_email,
  c.role_title   as primary_contact_role
from public.deals d
left join public.organizations o on o.id = d.organization_id
left join public.contacts c on c.id = d.primary_contact_id;

grant select on public.deals_enriched to authenticated, anon;

-- ----------------------------------------------------------------------------
-- 10. Verification queries (run after applying)
-- ----------------------------------------------------------------------------
-- A. New columns landed on organizations
-- select column_name, data_type from information_schema.columns
--  where table_schema='public' and table_name='organizations'
--    and column_name in ('industry','account_status','linkedin_url','owner_email','pitch_notes','source');

-- B. New tables exist
-- select table_name from information_schema.tables
--  where table_schema='public' and table_name in ('contacts','deals','account_activities');

-- C. RLS on
-- select tablename, rowsecurity from pg_tables
--  where schemaname='public' and tablename in ('organizations','contacts','deals','account_activities');

-- D. Trigger for deal slugs
-- select tgname from pg_trigger where tgname = 'trg_deals_slug';
-- ============================================================================
