-- ============================================================================
-- SCHEMA-MIGRATION-003.5.sql
-- Workspace tables: posts, comments, post_images, post_links.
--
-- Target: Supabase project `rojpjtyjiapqpsxdeovk` (Marketing Knowledge Garden)
-- Apply via SQL Editor in Supabase Studio after Cycle 003 schema is live.
-- Idempotent — safe to re-run.
--
-- Adds the team workspace data model:
--   * post_categories: 8 predefined editable topics
--   * posts: title + markdown body + author + category
--   * post_images / post_links: attached media
--   * comments: threaded discussion under each post
--   * Plus an RLS policy: only whitelisted users can read/write,
--     enforced via mkg.workspace_allowed_emails (a small table fed by
--     the same env-var allowlist that the Next.js middleware uses).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Workspace allowed-email table (Postgres mirror of the app whitelist)
-- ----------------------------------------------------------------------------
create table if not exists public.workspace_allowed_emails (
  email      text primary key,
  added_at   timestamptz not null default now(),
  added_note text
);

-- Seed Chilly + Michael now; John gets added when his email is on hand.
insert into public.workspace_allowed_emails (email, added_note) values
  ('chillyd@gmail.com',     'Founder / CTO — added Cycle 003.5'),
  ('michaelbou@gmail.com',  'New hire — added Cycle 003.5')
on conflict (email) do nothing;

-- ----------------------------------------------------------------------------
-- 2. Categories
-- ----------------------------------------------------------------------------
create table if not exists public.post_categories (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  name       text not null,
  emoji      text,
  description text,
  sort_order integer not null default 100,
  created_at timestamptz not null default now()
);

insert into public.post_categories (slug, name, emoji, description, sort_order) values
  ('b2b-founder',       'B2B founder marketing',           '🏢', 'Series A/B vertical SaaS, $3M–$15M ARR, the wedge customer track.', 10),
  ('consumer-health',   'Consumer healthtech / biomarkers', '🧬', 'HKG × MA: biomarker tracking, longevity, conscious-consumer healthtech.', 20),
  ('plant-commerce',    'Plant commerce',                   '🌿', 'OKG × MA: rare orchids, vanilla, conscious horticulture, botanical brands.', 30),
  ('toxin-free-luxury', 'Toxin-free luxury / fashion',      '💎', 'TKG × MA: toxicology applied to apparel, home goods, supplements.', 40),
  ('tox-consumer-ed',   'Toxicology consumer education',    '⚗️', 'Microplastics, glyphosate, PCBs — informing the public. Dr. Dahlgren legacy thread.', 50),
  ('ma-product',        'The Marketing Architect product',  '🏛️', 'Product spec, roadmap, pricing, feature ideas for MA itself.', 60),
  ('open-strategy',     'Open strategy / thinking out loud','💭', 'Things we are thinking about. No conclusion required.', 70),
  ('competitive-intel', 'Competitive intel',                '🛰️', 'Updates to the 175-company landscape, new entrants, M&A signals.', 80)
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- 3. Posts
-- ----------------------------------------------------------------------------
create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references public.users(id) on delete cascade,
  category_id uuid references public.post_categories(id) on delete set null,
  slug        text unique not null,
  title       text not null,
  body_md     text not null default '',
  is_pinned   boolean not null default false,
  is_archived boolean not null default false,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_posts_author    on public.posts(author_id);
create index if not exists idx_posts_category  on public.posts(category_id);
create index if not exists idx_posts_created   on public.posts(created_at desc);
create index if not exists idx_posts_pinned    on public.posts(is_pinned) where is_pinned = true;
create index if not exists idx_posts_title_trgm on public.posts using gin (title gin_trgm_ops);

-- updated_at trigger
do $$ begin
  drop trigger if exists trg_posts_touch on public.posts;
  create trigger trg_posts_touch
    before update on public.posts
    for each row execute function public.update_updated_at_column();
exception when undefined_function then
  -- update_updated_at_column() comes from brand_assets setup; if it
  -- isn't here yet, define a local one.
  create or replace function public.update_updated_at_column()
  returns trigger language plpgsql as $fn$
  begin new.updated_at = now(); return new; end $fn$;
  drop trigger if exists trg_posts_touch on public.posts;
  create trigger trg_posts_touch
    before update on public.posts
    for each row execute function public.update_updated_at_column();
end $$;

-- ----------------------------------------------------------------------------
-- 4. Post images (attached via Supabase Storage)
-- ----------------------------------------------------------------------------
create table if not exists public.post_images (
  id           uuid primary key default gen_random_uuid(),
  post_id      uuid not null references public.posts(id) on delete cascade,
  storage_path text not null,                  -- e.g. 'post-images/<post_id>/<filename>'
  filename     text,
  mime_type    text,
  file_size_bytes bigint,
  caption      text,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);
create index if not exists idx_post_images_post on public.post_images(post_id);

-- ----------------------------------------------------------------------------
-- 5. Post links (referenced URLs, with optional Claude-research provenance)
-- ----------------------------------------------------------------------------
create table if not exists public.post_links (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.posts(id) on delete cascade,
  url         text not null,
  title       text,
  description text,
  source_kind text,                            -- 'manual' | 'claude_research' | 'imported'
  created_at  timestamptz not null default now()
);
create index if not exists idx_post_links_post on public.post_links(post_id);

-- ----------------------------------------------------------------------------
-- 6. Comments
-- ----------------------------------------------------------------------------
create table if not exists public.comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.posts(id) on delete cascade,
  author_id   uuid not null references public.users(id) on delete cascade,
  parent_id   uuid references public.comments(id) on delete cascade,
  body_md     text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_comments_post   on public.comments(post_id);
create index if not exists idx_comments_author on public.comments(author_id);
create index if not exists idx_comments_parent on public.comments(parent_id);

do $$ begin
  drop trigger if exists trg_comments_touch on public.comments;
  create trigger trg_comments_touch
    before update on public.comments
    for each row execute function public.update_updated_at_column();
end $$;

-- ----------------------------------------------------------------------------
-- 7. Storage bucket for post images
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-images',
  'post-images',
  true,                                        -- public read (workspace is small + private already)
  20971520,                                    -- 20 MB ceiling per image
  array['image/png','image/jpeg','image/webp','image/gif','image/svg+xml']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ----------------------------------------------------------------------------
-- 8. Helper — is_workspace_member(uid)
--    Used by RLS policies. Returns true if the user's email is in
--    public.workspace_allowed_emails.
-- ----------------------------------------------------------------------------
create or replace function public.is_workspace_member(uid uuid)
returns boolean
language sql stable security definer as $$
  select exists (
    select 1
      from public.users u
      join public.workspace_allowed_emails w
        on lower(w.email) = lower(u.email)
     where u.id = uid
  );
$$;

-- ----------------------------------------------------------------------------
-- 9. RLS — workspace is private; only allowlisted users can read/write
-- ----------------------------------------------------------------------------
alter table public.workspace_allowed_emails enable row level security;
alter table public.post_categories enable row level security;
alter table public.posts            enable row level security;
alter table public.post_images      enable row level security;
alter table public.post_links       enable row level security;
alter table public.comments         enable row level security;

-- workspace_allowed_emails: read = own row only; writes via service role
do $$ begin
  create policy wae_self_read on public.workspace_allowed_emails
    for select using (
      lower(email) = lower((select email from public.users where id = auth.uid()))
    );
exception when duplicate_object then null; end $$;

-- Categories: any workspace member can read; writes via service role
do $$ begin
  create policy cat_read on public.post_categories
    for select using (public.is_workspace_member(auth.uid()));
exception when duplicate_object then null; end $$;

-- Posts: workspace members read all; insert own; update/delete own
do $$ begin
  create policy posts_read   on public.posts for select using (public.is_workspace_member(auth.uid()));
  create policy posts_insert on public.posts for insert with check (
    public.is_workspace_member(auth.uid()) and author_id = auth.uid()
  );
  create policy posts_update on public.posts for update using (
    public.is_workspace_member(auth.uid()) and author_id = auth.uid()
  );
  create policy posts_delete on public.posts for delete using (
    public.is_workspace_member(auth.uid()) and author_id = auth.uid()
  );
exception when duplicate_object then null; end $$;

-- post_images / post_links: same shape — readable to workspace, writable by post author
do $$ begin
  create policy post_images_read on public.post_images for select using (public.is_workspace_member(auth.uid()));
  create policy post_images_write on public.post_images for all using (
    public.is_workspace_member(auth.uid())
    and exists (select 1 from public.posts p where p.id = post_id and p.author_id = auth.uid())
  ) with check (
    public.is_workspace_member(auth.uid())
    and exists (select 1 from public.posts p where p.id = post_id and p.author_id = auth.uid())
  );

  create policy post_links_read on public.post_links for select using (public.is_workspace_member(auth.uid()));
  create policy post_links_write on public.post_links for all using (
    public.is_workspace_member(auth.uid())
    and exists (select 1 from public.posts p where p.id = post_id and p.author_id = auth.uid())
  ) with check (
    public.is_workspace_member(auth.uid())
    and exists (select 1 from public.posts p where p.id = post_id and p.author_id = auth.uid())
  );
exception when duplicate_object then null; end $$;

-- Comments: read all (workspace), insert as self, edit/delete own
do $$ begin
  create policy comments_read   on public.comments for select using (public.is_workspace_member(auth.uid()));
  create policy comments_insert on public.comments for insert with check (
    public.is_workspace_member(auth.uid()) and author_id = auth.uid()
  );
  create policy comments_update on public.comments for update using (
    public.is_workspace_member(auth.uid()) and author_id = auth.uid()
  );
  create policy comments_delete on public.comments for delete using (
    public.is_workspace_member(auth.uid()) and author_id = auth.uid()
  );
exception when duplicate_object then null; end $$;

-- Storage policies for post-images bucket
do $$ begin
  drop policy if exists post_images_storage_read on storage.objects;
  drop policy if exists post_images_storage_write on storage.objects;

  create policy post_images_storage_read on storage.objects
    for select using (bucket_id = 'post-images');

  create policy post_images_storage_write on storage.objects
    for insert with check (
      bucket_id = 'post-images'
      and public.is_workspace_member(auth.uid())
    );
end $$;

-- Also let public.users be readable + self-writable so the OAuth
-- callback's upsert into public.users succeeds (callback runs as the
-- newly-authenticated user).
do $$ begin
  alter table public.users enable row level security;
exception when others then null; end $$;
do $$ begin
  create policy users_self_read   on public.users for select using (auth.uid() = id);
  create policy users_self_upsert on public.users for insert with check (auth.uid() = id);
  create policy users_self_update on public.users for update using (auth.uid() = id);
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- 10. Smoke tests (run after this script)
-- ----------------------------------------------------------------------------
-- select slug, name from public.post_categories order by sort_order;
-- select email from public.workspace_allowed_emails;
-- select public.is_workspace_member(auth.uid());  -- run while signed in via Studio
-- ============================================================================
