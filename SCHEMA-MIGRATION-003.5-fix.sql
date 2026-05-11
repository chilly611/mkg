-- ============================================================================
-- SCHEMA-MIGRATION-003.5-fix.sql
-- Fixes a real bug: the OAuth callback was trying to upsert into public.users
-- but the timing/RLS interaction made it silently fail. Result: signed-in
-- users had no row in public.users, so is_workspace_member(auth.uid()) returned
-- false, so every RLS-gated read came back empty (categories list, posts feed)
-- and every write tried to FK against a missing public.users row → 500 errors
-- on /workspace/posts/new.
--
-- This migration:
--   1. Adds a Postgres trigger on auth.users that auto-mirrors to public.users
--      on every insert/update. No more reliance on the client callback for
--      this critical sync. (Future sign-ins work automatically.)
--   2. Backfills public.users from auth.users for any teammate who already
--      signed in. (Fixes Chilly's missing row right now.)
--   3. Idempotently re-adds John + Paulina to the workspace allowlist in case
--      the earlier emails migration wasn't run yet.
--   4. Expands the post-images bucket to accept short mp4/webm videos at
--      100MB ceiling so logo animations + product demos can ride along.
--
-- Idempotent. Safe to re-run.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Auto-mirror trigger: auth.users  →  public.users
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.users (id, email, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(coalesce(new.email,''), '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    email        = excluded.email,
    display_name = coalesce(excluded.display_name, public.users.display_name),
    avatar_url   = coalesce(excluded.avatar_url, public.users.avatar_url),
    updated_at   = now();
  return new;
end;
$$;

drop trigger if exists trg_auth_user_mirror on auth.users;
create trigger trg_auth_user_mirror
  after insert or update of email, raw_user_meta_data
  on auth.users
  for each row execute function public.handle_new_auth_user();

-- ----------------------------------------------------------------------------
-- 2. Backfill existing auth.users into public.users
-- ----------------------------------------------------------------------------
insert into public.users (id, email, display_name, avatar_url)
select
  au.id,
  coalesce(au.email, ''),
  coalesce(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    split_part(coalesce(au.email,''), '@', 1)
  ),
  au.raw_user_meta_data->>'avatar_url'
from auth.users au
where au.email is not null
on conflict (id) do update set
  email        = excluded.email,
  display_name = coalesce(excluded.display_name, public.users.display_name),
  avatar_url   = coalesce(excluded.avatar_url, public.users.avatar_url),
  updated_at   = now();

-- ----------------------------------------------------------------------------
-- 3. Re-confirm allowlist (idempotent)
-- ----------------------------------------------------------------------------
insert into public.workspace_allowed_emails (email, added_note) values
  ('chillyd@gmail.com',            'Founder / CTO'),
  ('michaelbou@gmail.com',         'New hire — Cycle 003.5'),
  ('bou@theknowledgegardens.com',  'John Bou — CEO / BD'),
  ('paulina0101@gmail.com',        'Paulina — trusted advisor, initiated the idea')
on conflict (email) do nothing;

-- ----------------------------------------------------------------------------
-- 4. Expand the post-images bucket to accept video
-- ----------------------------------------------------------------------------
update storage.buckets
   set file_size_limit = 104857600,                  -- 100 MB
       allowed_mime_types = array[
         'image/png','image/jpeg','image/webp','image/gif','image/svg+xml',
         'video/mp4','video/webm','video/quicktime'
       ]
 where id = 'post-images';

-- ----------------------------------------------------------------------------
-- 5. Verification queries — run these after to confirm
-- ----------------------------------------------------------------------------
-- A. Trigger exists
-- select tgname from pg_trigger where tgname = 'trg_auth_user_mirror';

-- B. Users mirrored
-- select u.id, u.email, u.display_name, w.email as on_allowlist
--   from public.users u
--   left join public.workspace_allowed_emails w on lower(w.email) = lower(u.email)
--  order by u.created_at desc;

-- C. is_workspace_member should return true for any signed-in teammate
--    (run while signed in via Studio's SQL editor as your own session)
-- select public.is_workspace_member(auth.uid());

-- D. Categories visible to your session (this is what was failing before)
--    Run this from a signed-in browser request, not Studio. Studio runs as
--    service_role and bypasses RLS — Studio always sees 8 even if RLS was broken.
-- ============================================================================
