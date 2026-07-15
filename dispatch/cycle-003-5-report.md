# DISPATCH REPORT — Cycle 003.5 — 2026-05-10 → 2026-05-11

**Architect.** The Marketing Architect, Cowork session, Chilly hands-on through the build.
**Theme.** Mother's Day weekend — from "we have a strategy doc" to "we have a private team workspace with posts, comments, images, videos, four signed-in accounts, and a working product."

## Shipped (this is a long one)

**Public side**
- `/` — unified Brief homepage, dark aesthetic, replacing Cycle 002's parchment landing. Hero + single-sentence definition + 3 inputs × 3 outputs + dual wedge tracks + 5 refusals + 175-company landscape preview + 3 discipline pieces + **legacy paragraph (Kathleen + Dr. Dahlgren)** + team grid + 30-day commitment + 3-tier buy section. JSON-LD product schema on the page.
- `/the-marketing-architect-landscape/` — 175-company filterable dark atlas (preserved from Cycle 002.5; now the canonical landscape).
- `/archive/competitive-landscape/` and `/archive/team-atlas/` — Cycle 002 artifacts preserved for audit lineage.

**Auth + tenancy**
- Google OAuth provider enabled in Supabase, OAuth consent screen configured in Google Cloud (`The Marketing Architect` project under chillyd-org), Client ID + Secret installed, redirect URLs whitelisted for production + preview + localhost.
- Email allowlist live in two synchronized places: Vercel env var `WORKSPACE_ALLOWED_EMAILS` (middleware gate) and DB table `public.workspace_allowed_emails` (RLS gate via `is_workspace_member()`).
- 4 accounts whitelisted: Chilly, John (bou@theknowledgegardens.com), Michael (michaelbou@gmail.com), Paulina (paulina0101@gmail.com — trusted advisor, initiated the idea).
- Sign-in flow tested green by Chilly.

**Workspace surfaces**
- `/signin` — dark sign-in card with "Continue with Google" button, error states (not_allowed, missing_code, generic).
- `/workspace` — landing page with sidebar (Overview, Posts & ideas, Categories, Research · Claude, Team), user card with avatar, sign-out form, public-brief back link, "What's here so far" status panel.
- `/workspace/posts` — chronological feed, category chip filters (All + 8 categories), empty state, pinned-first ordering.
- `/workspace/posts/new` — client-side direct upload to Supabase Storage with live progress UI, multi-file media (images + MP4/WebM/MOV up to 100MB each), markdown body, links one-per-line, category select.
- `/workspace/posts/[slug]` — detail page with byline, owner-only delete, body paragraphs, image grid + native `<video controls>` for videos, comments thread + comment form.
- `/workspace/categories` — 8 cards (B2B founder · Consumer healthtech · Plant commerce · Toxin-free luxury · Toxicology consumer ed · MA product · Open strategy · Competitive intel), each with live post count.

**Database**
- 6 new tables in `public`: `posts`, `post_images`, `post_links`, `comments`, `post_categories` (8 seeded), `workspace_allowed_emails` (4 seeded).
- `public.is_workspace_member(uid)` security-definer function (RLS gate).
- **`public.handle_new_auth_user()` trigger** on `auth.users` — automatically mirrors new + updated auth users into `public.users` (replaces fragile client-side upsert that had a race condition with RLS policy creation).
- Storage bucket `post-images` expanded to 100 MB + video MIME types.
- RLS policies on every workspace table — read for workspace members, write own only.

**Infrastructure changes**
- `output: "export"` removed from `next.config.ts` (logged as L-MKG-010 with rationale).
- `serverActions.bodySizeLimit` bumped to 5 MB (safety net; real binaries go direct to Storage).
- `next.config.ts` `images.remotePatterns` allowlist includes Clearbit, Google, Supabase, lh3 (Google avatars).
- Repo now on `chilly611/mkg` (note: simpler name than the original `knowledge-gardens-marketing` plan; env var `GITHUB_REPO` still references the old name as historical).

## Bugs caught and fixed live

1. **Categories dropdown empty + post-creation crashing.** Root cause: RLS function `is_workspace_member()` returned false because `public.users` had no row for the signed-in user — the OAuth callback's upsert silently failed due to a timing/RLS interaction. **Fix:** Postgres trigger that runs server-side (no race), backfill SQL for existing users, sync DB allowlist with env-var allowlist. Logged as L-MKG-012 and L-MKG-013.

2. **"Application error: a client-side exception" on Publish.** Root cause: server action receiving multi-megabyte file binaries through Vercel's Hobby body limit (~4.5 MB) → rejected before the action ran. **Fix:** refactored to client-component direct upload to Supabase Storage; server action now handles metadata only. Logged as L-MKG-011.

3. **Whitelist drift (Paulina + John missing from DB seed despite being in env var).** **Fix:** one-off SQL migration `SCHEMA-MIGRATION-003.5-fix.sql` syncs both sides.

## Lessons added (in `MKG_LESSONS.md`)

- `L-MKG-010` — Products with server-side auth/payments override the static-export rule (L-006).
- `L-MKG-011` — Vercel server actions cap at ~4.5 MB on Hobby; media uploads use client-side direct-to-Storage.
- `L-MKG-012` — `auth.users → public.users` sync must be a Postgres trigger, not a client-side callback.
- `L-MKG-013` — Whitelist sync: env-var and DB allowlists must be applied together via the same migration.

## What's NOT shipped (Cycle 004 queue)

1. **Claude API research panel** at `/workspace/research` — pick a category, type a question, get a researched answer with sources, save to a post. Anti-fabrication enforced. ~3 hrs.
2. **Stripe checkout** for the $249 / $1,499 / $8,000 SKUs. ~4 hrs.
3. **Markdown rendering polish** (`react-markdown` + safe sanitize). ~30 min.
4. **First real Campaign Teardown** post — Chilly writes the BKG sliver-launch teardown manually as Post #001 in the workspace; we promote to public `/teardowns/...` once curated.

## Numbers, end of day

- **77 files** in the repo when Cycle 002 closed; **~95 files** at the end of Cycle 003.5.
- **6 new database tables** + 1 storage bucket + 2 trigger functions.
- **4 production env vars** wired (Supabase URL, anon key, public URL, workspace allowlist).
- **~3,500 lines** of new TypeScript / TSX between page.tsx, post-form.tsx, queries.ts, actions, middleware, components.
- **~600 lines** of new SQL across SCHEMA-MIGRATION-003.5.sql + 003.5-emails.sql + 003.5-fix.sql.
- **1 customer signal so far:** Chilly successfully signed in, the team's about to follow.

## Citation health

Not re-run this cycle — focus was infrastructure and workspace, not the public-citation flywheel. Next baseline: post the first public teardown (Cycle 004) and re-run the canonical questions then. Baseline from Cycle 002 still applies: 0/4 canonical questions cite MKG/MA today.

## Open decisions (carried forward, none blocking)

1. **Domain decision** — buy `themarketingarchitect.com`? Currently the product lives at `marketing.theknowledgegardens.com` which still requires explanation of the umbrella relationship. Recommend buying the product domain now ($12/yr) and planning a Cycle 005 cutover.
2. **Promote Agent commit authority** for umbrella lesson propagation — PR vs direct commit (current: PR for first 90 days).
3. **Public-private bridge** — when does `/thinking-aloud/` go live? (Current default: Cycle 005, post-MRR signal.)

## What this dispatch report is

The compressed record of a long, mostly successful day. The workspace went from "doesn't exist" to "the team can sign in and post" in one Cowork session. The bugs we hit were real ones — RLS race conditions, Vercel body limits — and we fixed them properly (database trigger, client-side direct upload) instead of papering over with workarounds. The lessons are in the file.

Kathleen would have approved of the language; Dr. Dahlgren would have approved of the citation discipline. We did real work today.

---

*Pressed at The Knowledge Gardens · Mother's Day weekend 2026 · for Kathleen, for Dr. Dahlgren, and for whatever comes next.*
