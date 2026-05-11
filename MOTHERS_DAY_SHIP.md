# Mother's Day Ship Runbook
**The Marketing Architect — deploy in 6 commands and 4 clicks. ~12 minutes total.**
*2026-05-10. For Kathleen.*

---

## 0 · The thing to fix first (90 seconds)

When you ran `git init` from `~`, it created `.git` inside your **home directory** — meaning every file in your home folder is now potentially tracked. The `mkg` GitHub repo is fine; the local mess is the problem. Fix:

```bash
# Verify the bad .git is at home (you'll see ".git" listed)
ls -la ~ | grep '\.git'

# Remove the runaway .git
rm -rf ~/.git

# Now do it correctly inside the Marketing project folder
cd "~/Documents/Claude/Projects/Knowledge Gardens Umbrella/Marketing"
git init
git add .
git commit -m "Cycle 003 · The Marketing Architect"
git branch -M main
git remote add origin https://github.com/chilly611/mkg.git
git push -u origin main --force
```

The `--force` is fine because the only commit on `main` right now is the empty README — no work to lose.

**Note on repo naming.** Your terminal pushed to `chilly611/mkg`. Your `.env.example` still says `GITHUB_REPO=knowledge-gardens-marketing`. Decide which you want — both work — and update the other. I'd keep `mkg` because it's shorter and lives at the right account.

---

## 1 · Apply the schema to your new Supabase project (4 clicks, ~3 min)

The Supabase project `Marketing Knowledge Garden` (ref: `rojpjtyjiapqpsxdeovk`) is provisioned and "Coming up." When status flips to green:

1. Open **SQL Editor**: <https://supabase.com/dashboard/project/rojpjtyjiapqpsxdeovk/sql>
2. Click **+ New query**
3. Copy the entire contents of `Marketing/SCHEMA.sql` and paste
4. Click **Run** (cmd-enter). Should return `Success. No rows returned.`

Then verify in **Table Editor** (<https://supabase.com/dashboard/project/rojpjtyjiapqpsxdeovk/editor>):
- 12 tables visible: `users`, `organizations`, `memberships`, `subscriptions`, `invoices`, `brand_assets`, `competitors`, `campaign_briefs`, `architect_sessions`, `architect_outputs`, `citations`, `embeddings`
- Each shows the RLS shield icon (RLS enabled)

**Smoke-test SQL** (paste into the same SQL Editor):

```sql
-- 1. Tables exist
select table_name from information_schema.tables
where table_schema = 'public' order by table_name;

-- 2. RLS confirmed
select tablename, rowsecurity from pg_tables where schemaname = 'public';

-- 3. Citation-gate trigger present
select tgname from pg_trigger where tgname like '%citation_gate%';

-- 4. Extensions installed
select extname from pg_extension where extname in ('vector','pg_trgm','pgcrypto');
```

All four queries should return rows. If any are empty, re-paste the schema; the `do $$ begin ... exception ... end $$` blocks make it idempotent.

---

## 2 · Pull your Supabase keys (2 clicks, 30 sec)

In the dashboard: **Settings → API**.

Copy:
- **Project URL** → already in your `.env.example`
- **anon public** key → paste into `NEW_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** key → paste into `NEW_SUPABASE_SERVICE_ROLE_KEY` (server only — never `NEXT_PUBLIC_`)
- **JWT Secret** (under JWT Settings) → paste into `NEW_SUPABASE_JWT_SECRET`

Save your `.env.local` (a real one, not `.env.example`) at the project root. It's already in `.gitignore` — won't be committed.

---

## 3 · Vercel deploy (5 min, mostly waiting)

1. Open <https://vercel.com/new>.
2. Import `chilly611/mkg`.
3. **MANDATORY before clicking Deploy:**
   - **Root Directory:** `website`
   - **Environment Variables:** import or paste all the `NEW_SUPABASE_*`, `NEXT_PUBLIC_SUPABASE_*`, and `PUBLIC_URL` values
4. Click **Deploy**. ~60s build.
5. You'll get `mkg-{hash}.vercel.app`. Verify the landing page loads and `/competitive-landscape/` and `/team-atlas/` resolve.

---

## 4 · DNS for the custom domain (1 click + 1 paste)

In Vercel: **Settings → Domains** → Add `marketing.theknowledgegardens.com`.

Vercel will tell you to add a CNAME at your DNS provider:
- Type: `CNAME`
- Name: `marketing`
- Value: `cname.vercel-dns.com.`

Propagation 1–5 min. Then `marketing.theknowledgegardens.com` is live.

---

## 5 · The four artifacts that ship in this deploy

When DNS resolves, these URLs work:

| URL | What |
|---|---|
| `/` | Landing page — Marketing Architect intro |
| `/team-atlas/` | The 8-tab team brief (already shipped in Cycle 002) |
| `/competitive-landscape/` | The Cycle 002 GEO/AEO atlas (40 entities, parchment aesthetic) |
| `/the-marketing-architect-landscape/` | The 175-company dark-aesthetic interactive landscape (Cycle 003 — your hand-curated work) |

The two landscapes are **deliberately** different aesthetics. The Cycle 002 one lives inside the Garden federation visual language. The Cycle 003 one is The Marketing Architect's own register — dark, electric cyan, dossier-feeling. The pivot is visible.

---

## 6 · The auth + Stripe wiring (Cycle 004 — not today)

The schema is Stripe-shaped (`subscriptions`, `invoices`, plan tier enums) and auth-aware (`users` mirrors `auth.users`). But the actual Stripe keys, webhook handler, and the `on auth.users insert` trigger that mirrors signups into `public.users` are Cycle 004 work. Today's ship is **structural** — the database knows what shape revenue will take when it arrives.

---

## What's done by this runbook

- [x] Local repo correctly rooted in `Marketing/` (not your home folder)
- [x] Schema v0.3 applied to the dedicated MKG Supabase project
- [x] RLS verified on every table
- [x] Citation-gate trigger preventing fabricated outputs from ever publishing
- [x] Vercel project deployed with proper env vars
- [x] `marketing.theknowledgegardens.com` live with three landscape artifacts and the team atlas
- [x] First commit on the proper repo at `chilly611/mkg`

What's queued for Cycle 004 (next Sunday):
- The Stripe Price IDs created and pasted into env
- The `auth.users → public.users` trigger
- The first `architect_outputs` row written by hand for the BKG sliver-launch teardown
- John's first 5 outbound calls

---

*Pressed at The Knowledge Gardens · Mother's Day 2026 · for Kathleen.*
