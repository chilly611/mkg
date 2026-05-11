-- ============================================================================
-- One-off email sync — make the DB whitelist match the env-var whitelist.
-- Apply once via Supabase SQL Editor. Idempotent.
-- ============================================================================

insert into public.workspace_allowed_emails (email, added_note) values
  ('bou@theknowledgegardens.com', 'John Bou - CEO/BD'),
  ('paulina0101@gmail.com', 'Paulina - trusted advisor, initiated the idea')
on conflict (email) do nothing;

-- Verify
select email, added_at, added_note from public.workspace_allowed_emails order by added_at;
