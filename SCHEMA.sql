-- ============================================================================
-- Marketing Knowledge Garden — SCHEMA.sql
-- Version: 0.3  (Cycle 003 — The Marketing Architect product, dedicated project)
-- Target: Supabase project `rojpjtyjiapqpsxdeovk` (Marketing Knowledge Garden)
-- Region: us-east-2 (Ohio) | Compute: MICRO
-- Postgres: 15 + pgvector + pg_trgm
-- Schema:   public.*  (dedicated project — no namespace collision)
--
-- v0.2 → v0.3 diff (see SCHEMA_RATIONALE_v0.3.md for full reasoning):
--   * Pivot from "garden template" to product-shape: The Marketing Architect.
--   * Drop: dispatch_log (lives in markdown), lessons (lives in markdown),
--     polymorphic relationships (replaced with explicit FK columns).
--   * Drop: campaigns + benchmarks + assets-as-primary (these were template
--     debt; the product is sessions in / outputs out).
--   * Add: users / organizations / memberships (auth + tenancy).
--   * Add: architect_sessions (the core product event), campaign_briefs
--     (input), architect_outputs (output, citation-gated to publish).
--   * Add: subscriptions + invoices (Stripe-shaped — revenue is now P1).
--   * Keep: competitors (curated 150, JSX is source of truth, DB references),
--     citations (anti-fabrication), embeddings (semantic retrieval).
--   * Add: brand_assets locally — can't FK across projects.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. Extensions
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "vector";     -- pgvector
create extension if not exists "pg_trgm";    -- fuzzy search

-- ----------------------------------------------------------------------------
-- 1. Enums
-- ----------------------------------------------------------------------------
do $$ begin
  create type public.membership_role as enum ('owner','admin','member','viewer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.org_plan_tier as enum ('free','starter','pro','enterprise');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.subscription_status as enum (
    'trialing','active','past_due','canceled','incomplete','incomplete_expired','unpaid','paused'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.invoice_status as enum (
    'draft','open','paid','uncollectible','void'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.brief_kind as enum (
    'url','document','pasted_text','site_crawl','linkedin_company','manual'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.session_status as enum (
    'queued','running','succeeded','failed','canceled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.output_kind as enum (
    'recommendation_memo','teardown','market_map','positioning_brief',
    'channel_plan','competitive_brief','custom'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.output_status as enum (
    'draft','review','published','archived'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.confidence_tier as enum ('high','medium','low');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.competitor_kind as enum (
    'company','method','capability','vertical','geography','channel','agent','role'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.funding_stage as enum (
    'bootstrapped','pre_seed','seed','series_a','series_b','series_c',
    'series_d_plus','public','acquired','unknown'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.pricing_model as enum (
    'free','freemium','subscription','usage_based','enterprise','bootstrapped','unknown'
  );
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- 2. Users — mirrors auth.users with profile fields
-- ----------------------------------------------------------------------------
create table if not exists public.users (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text unique not null,
  display_name    text,
  avatar_url      text,
  job_title       text,
  company_name    text,
  marketing_opt_in boolean not null default false,
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists idx_users_email on public.users(email);

-- ----------------------------------------------------------------------------
-- 3. Organizations — the entity that pays
-- ----------------------------------------------------------------------------
create table if not exists public.organizations (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  name                text not null,
  website_url         text,
  logo_url            text,
  plan_tier           public.org_plan_tier not null default 'free',
  stripe_customer_id  text unique,
  billing_email       text,
  metadata            jsonb not null default '{}'::jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists idx_orgs_plan_tier on public.organizations(plan_tier);
create index if not exists idx_orgs_stripe_customer on public.organizations(stripe_customer_id);

-- ----------------------------------------------------------------------------
-- 4. Memberships — user x org with role
-- ----------------------------------------------------------------------------
create table if not exists public.memberships (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  role            public.membership_role not null default 'member',
  invited_by      uuid references public.users(id),
  invited_at      timestamptz,
  joined_at       timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  unique (user_id, organization_id)
);
create index if not exists idx_memberships_user on public.memberships(user_id);
create index if not exists idx_memberships_org  on public.memberships(organization_id);
create index if not exists idx_memberships_role on public.memberships(role);

-- ----------------------------------------------------------------------------
-- 5. Subscriptions — Stripe-shaped, one active per org
-- ----------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id                       uuid primary key default gen_random_uuid(),
  organization_id          uuid not null references public.organizations(id) on delete cascade,
  stripe_subscription_id   text unique,
  stripe_price_id          text,
  stripe_product_id        text,
  status                   public.subscription_status not null default 'trialing',
  plan_tier                public.org_plan_tier not null,
  quantity                 integer not null default 1,
  current_period_start     timestamptz,
  current_period_end       timestamptz,
  trial_end                timestamptz,
  cancel_at                timestamptz,
  canceled_at              timestamptz,
  cancel_at_period_end     boolean not null default false,
  metadata                 jsonb not null default '{}'::jsonb,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);
create index if not exists idx_subs_org    on public.subscriptions(organization_id);
create index if not exists idx_subs_status on public.subscriptions(status);
create index if not exists idx_subs_period_end on public.subscriptions(current_period_end);

-- ----------------------------------------------------------------------------
-- 6. Invoices — Stripe-shaped
-- ----------------------------------------------------------------------------
create table if not exists public.invoices (
  id                  uuid primary key default gen_random_uuid(),
  organization_id     uuid not null references public.organizations(id) on delete cascade,
  subscription_id     uuid references public.subscriptions(id) on delete set null,
  stripe_invoice_id   text unique,
  number              text,
  status              public.invoice_status not null default 'draft',
  amount_due_cents    integer not null default 0,
  amount_paid_cents   integer not null default 0,
  currency            text not null default 'usd',
  hosted_invoice_url  text,
  invoice_pdf_url     text,
  due_date            timestamptz,
  paid_at             timestamptz,
  period_start        timestamptz,
  period_end          timestamptz,
  metadata            jsonb not null default '{}'::jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists idx_invoices_org    on public.invoices(organization_id);
create index if not exists idx_invoices_sub    on public.invoices(subscription_id);
create index if not exists idx_invoices_status on public.invoices(status);

-- ----------------------------------------------------------------------------
-- 7. Brand assets — local copy (cannot FK across Supabase projects)
-- ----------------------------------------------------------------------------
create table if not exists public.brand_assets (
  id              uuid primary key default gen_random_uuid(),
  bucket          text not null default 'brand-assets',
  storage_path    text not null unique,
  filename        text not null,
  mime_type       text not null,
  file_size_bytes bigint,
  slug            text unique not null,
  title           text not null,
  description     text,
  asset_type      text not null,                -- 'plate'|'motion'|'mark'|'icon'
  garden_scope    text not null default 'mkg',  -- typically 'mkg'|'umbrella'|'cross-cutting'
  intended_use    text[],
  status          text not null default 'working',
  source_url      text,                         -- canonical URL on the umbrella project (if mirrored)
  parent_asset_id uuid references public.brand_assets(id),
  version         integer not null default 1,
  approved_for_production boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  notes           text
);
create index if not exists idx_brand_assets_garden_scope on public.brand_assets(garden_scope);
create index if not exists idx_brand_assets_asset_type   on public.brand_assets(asset_type);
create index if not exists idx_brand_assets_status       on public.brand_assets(status);
create index if not exists idx_brand_assets_intended_use on public.brand_assets using gin (intended_use);

-- ----------------------------------------------------------------------------
-- 8. Competitors — curated 150 (JSX is source of truth; DB is for joins)
-- ----------------------------------------------------------------------------
create table if not exists public.competitors (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,        -- canonical slug, must match JSX
  kind              public.competitor_kind not null default 'company',
  name              text not null,
  url               text,
  positioning       text,
  description       text,
  hq_city           text,
  hq_country        text,
  founded_year      smallint,
  funding_stage     public.funding_stage not null default 'unknown',
  funding_total_usd bigint,                      -- nullable; never invent
  pricing_model     public.pricing_model not null default 'unknown',
  pricing_notes     text,
  primary_buyer     text,
  geographic_focus  text,
  logo_asset_id     uuid references public.brand_assets(id),
  metadata          jsonb not null default '{}'::jsonb,
  confidence        public.confidence_tier not null default 'medium',
  is_published      boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists idx_competitors_kind          on public.competitors(kind);
create index if not exists idx_competitors_country       on public.competitors(hq_country);
create index if not exists idx_competitors_funding_stage on public.competitors(funding_stage);
create index if not exists idx_competitors_published     on public.competitors(is_published);
create index if not exists idx_competitors_name_trgm     on public.competitors using gin (name gin_trgm_ops);

-- ----------------------------------------------------------------------------
-- 9. Campaign briefs — the INPUT to a session
-- ----------------------------------------------------------------------------
create table if not exists public.campaign_briefs (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_by      uuid not null references public.users(id),
  kind            public.brief_kind not null,
  title           text not null,
  source_url      text,                         -- if kind in ('url','site_crawl','linkedin_company')
  storage_path    text,                         -- if kind = 'document'
  pasted_text     text,                         -- if kind = 'pasted_text'
  goals_md        text,
  audience_md     text,
  constraints_md  text,
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint chk_briefs_has_input check (
    source_url is not null or storage_path is not null or pasted_text is not null
    or kind = 'manual'
  )
);
create index if not exists idx_briefs_org      on public.campaign_briefs(organization_id);
create index if not exists idx_briefs_creator  on public.campaign_briefs(created_by);
create index if not exists idx_briefs_kind     on public.campaign_briefs(kind);

-- ----------------------------------------------------------------------------
-- 10. Architect sessions — the core product event
-- ----------------------------------------------------------------------------
create table if not exists public.architect_sessions (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references public.organizations(id) on delete cascade,
  user_id           uuid not null references public.users(id),
  campaign_brief_id uuid references public.campaign_briefs(id) on delete set null,
  title             text not null,
  status            public.session_status not null default 'queued',
  model             text,                       -- e.g. 'claude-opus-4-7'
  prompt_tokens     integer,
  completion_tokens integer,
  cost_cents        integer,
  started_at        timestamptz,
  completed_at      timestamptz,
  error_message     text,
  metadata          jsonb not null default '{}'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists idx_sessions_org      on public.architect_sessions(organization_id);
create index if not exists idx_sessions_user     on public.architect_sessions(user_id);
create index if not exists idx_sessions_brief    on public.architect_sessions(campaign_brief_id);
create index if not exists idx_sessions_status   on public.architect_sessions(status);
create index if not exists idx_sessions_created  on public.architect_sessions(created_at);

-- ----------------------------------------------------------------------------
-- 11. Architect outputs — recommendation memo / teardown / market map / etc.
--     Citation-gated: only reaches 'published' when every claim_id in
--     anatomy_jsonb.claims[].id has at least one row in citations.
-- ----------------------------------------------------------------------------
create table if not exists public.architect_outputs (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid not null references public.architect_sessions(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  kind            public.output_kind not null,
  status          public.output_status not null default 'draft',
  title           text not null,
  summary_md      text,
  body_md         text,                         -- the rendered memo / teardown
  anatomy_jsonb   jsonb not null default '{}'::jsonb,  -- structured: claims[], sections[], etc.
  embedding       vector(1536),
  published_at    timestamptz,
  archived_at     timestamptz,
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists idx_outputs_session  on public.architect_outputs(session_id);
create index if not exists idx_outputs_org      on public.architect_outputs(organization_id);
create index if not exists idx_outputs_kind     on public.architect_outputs(kind);
create index if not exists idx_outputs_status   on public.architect_outputs(status);
create index if not exists idx_outputs_anatomy  on public.architect_outputs using gin (anatomy_jsonb);
create index if not exists idx_outputs_embedding
  on public.architect_outputs using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- ----------------------------------------------------------------------------
-- 12. Citations — every claim ships with at least one. Anti-fabrication.
--     Explicit FKs (no polymorphic relationships table). At most one parent.
-- ----------------------------------------------------------------------------
create table if not exists public.citations (
  id               uuid primary key default gen_random_uuid(),
  output_id        uuid references public.architect_outputs(id) on delete cascade,
  competitor_id    uuid references public.competitors(id)        on delete cascade,
  claim_id         text,                        -- matches anatomy_jsonb.claims[].id when output_id set
  claim            text not null,
  source_url       text not null,
  source_publisher text,
  source_author    text,
  source_title     text,
  excerpt          text,
  retrieved_at     timestamptz not null default now(),
  confidence       public.confidence_tier not null default 'medium',
  metadata         jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  constraint chk_citations_exactly_one_parent check (
    (case when output_id     is not null then 1 else 0 end) +
    (case when competitor_id is not null then 1 else 0 end) = 1
  ),
  constraint chk_citations_claim_id_when_output check (
    output_id is null or claim_id is not null
  )
);
create index if not exists idx_citations_output     on public.citations(output_id);
create index if not exists idx_citations_competitor on public.citations(competitor_id);
create index if not exists idx_citations_claim_id   on public.citations(claim_id);
create index if not exists idx_citations_url        on public.citations(source_url);

-- ----------------------------------------------------------------------------
-- 13. Embeddings — polymorphic, separate from business rows
-- ----------------------------------------------------------------------------
create table if not exists public.embeddings (
  id           uuid primary key default gen_random_uuid(),
  target_table text not null,
  target_id    uuid not null,
  model        text not null,
  text_kind    text not null,                   -- 'title'|'summary'|'body'|'positioning'|...
  embedding    vector(1536) not null,
  created_at   timestamptz not null default now(),
  unique (target_table, target_id, model, text_kind),
  constraint chk_embeddings_target check (target_table in (
    'competitors','campaign_briefs','architect_outputs','organizations'
  ))
);
create index if not exists idx_embeddings_target on public.embeddings(target_table, target_id);
create index if not exists idx_embeddings_ivf
  on public.embeddings using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- ----------------------------------------------------------------------------
-- 14. Triggers — touch updated_at
-- ----------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_users_touch          on public.users;
create trigger trg_users_touch          before update on public.users          for each row execute function public.touch_updated_at();
drop trigger if exists trg_orgs_touch           on public.organizations;
create trigger trg_orgs_touch           before update on public.organizations  for each row execute function public.touch_updated_at();
drop trigger if exists trg_subs_touch           on public.subscriptions;
create trigger trg_subs_touch           before update on public.subscriptions  for each row execute function public.touch_updated_at();
drop trigger if exists trg_invoices_touch       on public.invoices;
create trigger trg_invoices_touch       before update on public.invoices       for each row execute function public.touch_updated_at();
drop trigger if exists trg_brand_assets_touch   on public.brand_assets;
create trigger trg_brand_assets_touch   before update on public.brand_assets   for each row execute function public.touch_updated_at();
drop trigger if exists trg_competitors_touch    on public.competitors;
create trigger trg_competitors_touch    before update on public.competitors    for each row execute function public.touch_updated_at();
drop trigger if exists trg_briefs_touch         on public.campaign_briefs;
create trigger trg_briefs_touch         before update on public.campaign_briefs for each row execute function public.touch_updated_at();
drop trigger if exists trg_sessions_touch       on public.architect_sessions;
create trigger trg_sessions_touch       before update on public.architect_sessions for each row execute function public.touch_updated_at();
drop trigger if exists trg_outputs_touch        on public.architect_outputs;
create trigger trg_outputs_touch        before update on public.architect_outputs for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- 15. Citation-gate trigger — outputs cannot reach 'published' unless every
--     claim_id declared in anatomy_jsonb.claims[] has at least one citation.
-- ----------------------------------------------------------------------------
create or replace function public.enforce_output_citation_gate()
returns trigger language plpgsql as $$
declare
  declared_claims  text[];
  cited_claims     text[];
  missing_claims   text[];
begin
  if new.status <> 'published' then
    return new;
  end if;

  -- Pull declared claim ids out of anatomy_jsonb.claims[].id
  select coalesce(array_agg(distinct (c->>'id')), '{}')
    into declared_claims
  from jsonb_array_elements(coalesce(new.anatomy_jsonb->'claims', '[]'::jsonb)) c
  where c ? 'id';

  if cardinality(declared_claims) = 0 then
    raise exception 'Output % cannot publish: anatomy_jsonb.claims[] is empty (anti-fabrication).', new.id;
  end if;

  select coalesce(array_agg(distinct claim_id), '{}')
    into cited_claims
  from public.citations
  where output_id = new.id and claim_id is not null;

  select array_agg(c) into missing_claims
  from unnest(declared_claims) c
  where c <> all (cited_claims);

  if missing_claims is not null and cardinality(missing_claims) > 0 then
    raise exception 'Output % cannot publish: claims missing citations: %', new.id, missing_claims;
  end if;

  if new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end $$;

drop trigger if exists trg_outputs_citation_gate on public.architect_outputs;
create trigger trg_outputs_citation_gate
  before insert or update of status on public.architect_outputs
  for each row execute function public.enforce_output_citation_gate();

-- ----------------------------------------------------------------------------
-- 16. Helper view — competitors_jsonld (schema.org JSON-LD per competitor)
-- ----------------------------------------------------------------------------
create or replace view public.competitors_jsonld as
select
  c.slug,
  jsonb_build_object(
    '@context', 'https://schema.org',
    '@type', case when c.kind = 'company' then 'Organization' else 'Thing' end,
    'identifier', c.slug,
    'name', c.name,
    'url', c.url,
    'description', c.description,
    'foundingDate', case when c.founded_year is not null then c.founded_year::text else null end,
    'address', case
      when c.hq_city is not null or c.hq_country is not null
        then jsonb_build_object('@type','PostalAddress','addressLocality', c.hq_city, 'addressCountry', c.hq_country)
      else null
    end,
    'sameAs', (select jsonb_agg(distinct ct.source_url) from public.citations ct where ct.competitor_id = c.id),
    'additionalProperty', jsonb_build_array(
      jsonb_build_object('@type','PropertyValue','name','funding_stage', 'value', c.funding_stage),
      jsonb_build_object('@type','PropertyValue','name','pricing_model', 'value', c.pricing_model),
      jsonb_build_object('@type','PropertyValue','name','primary_buyer', 'value', c.primary_buyer),
      jsonb_build_object('@type','PropertyValue','name','confidence',    'value', c.confidence)
    )
  ) as jsonld
from public.competitors c
where c.is_published = true;

-- ----------------------------------------------------------------------------
-- 17. Search functions
-- ----------------------------------------------------------------------------
create or replace function public.search_competitors(q text)
returns setof public.competitors
language sql stable as $$
  select * from public.competitors
  where is_published = true
    and (name % q or description ilike '%' || q || '%' or positioning ilike '%' || q || '%')
  order by similarity(name, q) desc, updated_at desc
  limit 50;
$$;

-- ----------------------------------------------------------------------------
-- 18. Row-level security — default deny + Public-Lane allow
-- ----------------------------------------------------------------------------
alter table public.users               enable row level security;
alter table public.organizations       enable row level security;
alter table public.memberships         enable row level security;
alter table public.subscriptions       enable row level security;
alter table public.invoices            enable row level security;
alter table public.brand_assets        enable row level security;
alter table public.competitors         enable row level security;
alter table public.campaign_briefs     enable row level security;
alter table public.architect_sessions  enable row level security;
alter table public.architect_outputs   enable row level security;
alter table public.citations           enable row level security;
alter table public.embeddings          enable row level security;

-- Helper: is the calling user a member of this org?
create or replace function public.is_org_member(org_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.memberships m
    where m.organization_id = org_id and m.user_id = auth.uid()
  );
$$;

-- Public Lane: competitors + their citations + brand_assets are public-read.
do $$ begin
  create policy competitors_public_read on public.competitors
    for select using (is_published = true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy citations_public_read_competitors on public.citations
    for select using (competitor_id is not null);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy brand_assets_public_read on public.brand_assets
    for select using (true);
exception when duplicate_object then null; end $$;

-- Published outputs are public-read (Machine Lane / citation-gated).
do $$ begin
  create policy outputs_public_read_published on public.architect_outputs
    for select using (status = 'published');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy citations_public_read_published_outputs on public.citations
    for select using (
      output_id is not null and exists (
        select 1 from public.architect_outputs o
        where o.id = citations.output_id and o.status = 'published'
      )
    );
exception when duplicate_object then null; end $$;

-- Users can read/update their own row.
do $$ begin
  create policy users_self_select on public.users
    for select using (id = auth.uid());
  create policy users_self_update on public.users
    for update using (id = auth.uid());
exception when duplicate_object then null; end $$;

-- Org-scoped tables: members can read; admins/owners can write.
do $$ begin
  create policy orgs_member_select on public.organizations
    for select using (public.is_org_member(id));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy memberships_self_or_org_select on public.memberships
    for select using (user_id = auth.uid() or public.is_org_member(organization_id));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy subs_org_select on public.subscriptions
    for select using (public.is_org_member(organization_id));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy invoices_org_select on public.invoices
    for select using (public.is_org_member(organization_id));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy briefs_org_select on public.campaign_briefs
    for select using (public.is_org_member(organization_id));
  create policy briefs_org_insert on public.campaign_briefs
    for insert with check (public.is_org_member(organization_id) and created_by = auth.uid());
  create policy briefs_org_update on public.campaign_briefs
    for update using (public.is_org_member(organization_id));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy sessions_org_select on public.architect_sessions
    for select using (public.is_org_member(organization_id));
  create policy sessions_org_insert on public.architect_sessions
    for insert with check (public.is_org_member(organization_id) and user_id = auth.uid());
  create policy sessions_org_update on public.architect_sessions
    for update using (public.is_org_member(organization_id));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy outputs_org_select on public.architect_outputs
    for select using (public.is_org_member(organization_id));
  create policy outputs_org_insert on public.architect_outputs
    for insert with check (public.is_org_member(organization_id));
  create policy outputs_org_update on public.architect_outputs
    for update using (public.is_org_member(organization_id));
exception when duplicate_object then null; end $$;

-- Citations attached to org-private outputs follow org membership.
do $$ begin
  create policy citations_org_select_via_output on public.citations
    for select using (
      output_id is not null and exists (
        select 1 from public.architect_outputs o
        where o.id = citations.output_id and public.is_org_member(o.organization_id)
      )
    );
  create policy citations_org_insert on public.citations
    for insert with check (
      (output_id is not null and exists (
        select 1 from public.architect_outputs o
        where o.id = output_id and public.is_org_member(o.organization_id)
      ))
      or competitor_id is not null  -- citation-on-competitor write goes through service role
    );
exception when duplicate_object then null; end $$;

-- Embeddings are internal-only by default (service role).
-- No SELECT policy on public.embeddings -> default deny.

-- ----------------------------------------------------------------------------
-- 19. Seed a sane default org for the dev/admin user (optional, idempotent)
-- ----------------------------------------------------------------------------
-- (Run manually after the first auth user exists.)
-- insert into public.organizations (slug, name, plan_tier)
-- values ('marketing-knowledge-garden','Marketing Knowledge Garden','enterprise')
-- on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- 20. Sample queries (verification)
-- ----------------------------------------------------------------------------
-- 1. Recent architect sessions for an org:
--    select * from architect_sessions where organization_id = $1 order by created_at desc limit 20;
-- 2. Published outputs feed (Public/Machine Lane):
--    select id, kind, title, summary_md, published_at from architect_outputs where status='published';
-- 3. JSON-LD feed for the competitor sub-graph:
--    select jsonb_agg(jsonld) from competitors_jsonld;
-- 4. Citation-health audit (claims declared but not cited):
--    select o.id, o.title from architect_outputs o
--    where o.status = 'review'
--      and exists (
--        select 1 from jsonb_array_elements(o.anatomy_jsonb->'claims') c
--        where (c->>'id') not in (select claim_id from citations where output_id = o.id)
--      );
-- 5. Active subscription per org:
--    select * from subscriptions where status in ('trialing','active','past_due');
