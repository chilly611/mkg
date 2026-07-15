# MKG_PROJECT_STATE.md

Living state of **The Marketing Architect** (the product formerly scoped as the Marketing Knowledge Garden). Updated at the close of every dispatch cycle by the Architect. Most recent cycle on top.

---

## Cycle 003.5 — 2026-05-11 — Workspace + posts shipped (Mother's Day weekend)

**Architect.** Cowork session with Chilly hands-on. Closing in the morning of 2026-05-11 after the long Mother's Day arc.

**Three big paradigm shifts this cycle.**
1. **Site is a team workspace + public artifacts, not a marketing brochure.** Auth-gated `/workspace` with posts, comments, categories, image+video upload. Public side stays clean.
2. **Product brand = "The Marketing Architect"**, not MKG. The umbrella's "Knowledge Garden" framing stays at the umbrella level; the product carries its own register (dark, electric cyan, Space Grotesk, JetBrains Mono).
3. **Static-export rule (umbrella L-006) overridden for this product** specifically. Auth, Stripe, server actions, and client-side direct uploads require server-side capability. Lesson logged as L-MKG-010. Other gardens stay static.

**Shipped (all live in production).**
- Public homepage `/` — single-page Brief (dark aesthetic, 11 sections, legacy paragraph naming Kathleen + Dr. Dahlgren, dual wedge B2B + consumer + freemium, JSON-LD)
- Competitive landscape `/the-marketing-architect-landscape/` — 175 companies, dark register, filterable
- Archived `/archive/competitive-landscape/` + `/archive/team-atlas/` (Cycle 002 artifacts preserved)
- Auth: Google OAuth via Supabase + 4-account email whitelist
- Postgres trigger: `auth.users → public.users` auto-mirror on every sign-in (replaces fragile client-side callback upsert)
- Workspace `/workspace` — landing, sidebar with sign-out + public-brief link
- Posts feed `/workspace/posts` — category chips, pinned/recent ordering, empty state
- Post creation `/workspace/posts/new` — **client-side direct upload to Supabase Storage**, bypassing Vercel's 4.5 MB body limit. Supports images + MP4/WebM/MOV up to 100 MB. Live progress UI.
- Post detail `/workspace/posts/[slug]` — body + image grid + video `<video>` tags + comments + owner delete
- Categories `/workspace/categories` — 8 pre-seeded topics with live post counts
- Comments per post + delete-own — RLS enforced
- Storage bucket `post-images` (public read, authenticated workspace-member write)

**Schema additions.**
- `public.posts` · `public.post_images` · `public.post_links` · `public.comments` · `public.post_categories` (8 seeded) · `public.workspace_allowed_emails` (4 seeded)
- `public.is_workspace_member(uid)` function (security definer)
- `public.handle_new_auth_user()` trigger function on `auth.users` (auto-mirrors to `public.users`)
- Storage bucket policy expanded to 100 MB + video MIME types

**Stack.**
- Repo: `github.com/chilly611/mkg` (private to Chilly's GitHub)
- Vercel project: `chillyd-2693s-projects/mkg`, Hobby plan, auto-deploy from `main`
- Domain: `marketing.theknowledgegardens.com` (CNAME via GoDaddy → `cname.vercel-dns.com`)
- Supabase project: `rojpjtyjiapqpsxdeovk` (dedicated MKG, us-east-2, MICRO tier)
- Env vars in Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `WORKSPACE_ALLOWED_EMAILS`, `PUBLIC_URL`

**Team (4 whitelisted accounts).**
| Email | Role |
|---|---|
| `chillyd@gmail.com` | Chilly — founder / CTO / design authority |
| `bou@theknowledgegardens.com` | John Bou — CEO / BD |
| `michaelbou@gmail.com` | Michael Bou — new hire |
| `paulina0101@gmail.com` | Paulina — trusted advisor, initiated the idea |

**Blocked / waiting.**
- `ANTHROPIC_API_KEY` not in Vercel env yet (blocks Claude research panel build)
- Stripe products + price IDs not created (blocks checkout)
- John, Michael, Paulina have not yet signed in for the first time (no immediate impact — the trigger handles them whenever they do)

**Lessons added (live in `MKG_LESSONS.md`).**
- `L-MKG-010` — Products with server-side auth/payments override the static-export rule (L-006 stays for citation gardens)
- `L-MKG-011` — Vercel server actions cap at ~4.5 MB body on Hobby; large media must use client-side direct upload to Storage
- `L-MKG-012` — `auth.users → public.users` sync must be a Postgres trigger, not a client-side OAuth callback (race condition with RLS policies)
- `L-MKG-013` — Whitelist drift: env-var allowlist and DB allowlist must be synced via the same migration to avoid 403/empty-result bugs

**Next cycle (004).** Claude research panel · Stripe checkout · markdown rendering polish · first real Campaign Teardown post. See `TOMORROW_PROMPT.md` for the resume prompt.

---

## Cycle 003 — 2026-05-10 — Unified Brief homepage + dual wedge

(Mother's Day morning through afternoon.)

Shipped: dark-aesthetic single-page Brief replacing the parchment landing; legacy paragraph honoring Kathleen Dahlgren and Dr. James Dahlgren; dual wedge (B2B founder track + consumer brand track) + freemium consumer tool framing; archived Cycle 002 parchment artifacts to `/archive/*`. Push to `chilly611/mkg`, Vercel rebuilt green.

---

## Cycle 002.5 — 2026-05-10 (overnight) — Mother's Day strategic pivot

12 parallel agents on competitive landscape + strategy + critic + build. Reframed MKG → The Marketing Architect product, not a fifth garden template. Dropped "campaigns as primary entity" + "internal-first 12-week sourcing" — replaced with product-shape schema (architect_sessions, campaign_briefs, architect_outputs) and dual revenue + distribution lanes per the brainstorm substrate (`MARKETING_IN_AGE_OF_AI.md`).

Documents shipped: `THE_MARKETING_ARCHITECT.md`, `MEMO_TO_JOHN.md`, `THE_NOT_DOING_LIST.md`, `HUMOR_AND_WOM_EVIDENCE.md`, `MARKETING_IN_AGE_OF_AI.md`.

---

## Cycle 002 — 2026-05-09 — Schema v0.2 + Campaign Teardown PRD (superseded)

Campaign-centric `mkg.`-namespaced schema, Campaign Teardown spec, Internal-First Roadmap, Pricing Hypothesis, Supabase Migration Plan, Heartbeat & Deploy runbook, Exec One-Pager, 5-Min Team Readout, **Team Atlas** interactive HTML, GEO/AEO research wedge handback (40 entities, 31 high-confidence). All superseded by Cycle 003 pivot but preserved for audit lineage.

---

## Cycle 001 — 2026-05-09 — Bootstrap

Local repo scaffold, schema v0.1, lessons file, dispatch templates, landscape artifact v2 (parchment), 40-entity GEO/AEO research handback, citation baseline. See `dispatch/cycle-001-report.md`.

---

## Standing facts (as of 2026-05-11)

- **Working dir:** `~/Documents/Claude/Projects/Knowledge Gardens Umbrella/Marketing/`
- **Domain:** `marketing.theknowledgegardens.com` (live)
- **Supabase project:** `rojpjtyjiapqpsxdeovk` (dedicated MKG)
- **GitHub repo:** `chilly611/mkg` (live)
- **Vercel project:** `chillyd-2693s-projects/mkg` (Hobby, auto-deploy from `main`)
- **Heartbeat cadence:** weekly Sunday evening (declared in Cycle 002; cron endpoints not yet built — Cycle 004+)
- **Architect spawn entry point:** Cowork session with `TOMORROW_PROMPT.md` pasted as context

---

## Anti-patterns in force

1. **Dark backgrounds outside the MA product surface.** Other gardens stay parchment. The Marketing Architect specifically uses dark.
2. Scroll-cinematic for entity views. Reject.
3. Flat card grids without engineering-signature ornaments. Reject.
4. AI-generated lorem ipsum / fabricated data. Reject — federation-wide cost.
5. Reimagining the kernel from scratch each session. Reject — enhance, don't replace.
6. Removing `output: "export"` from sister gardens that need static citation surface (L-006 still applies to OKG/BKG/TKG/HKG). MA is the exception, not the rule.
7. **Server actions handling file binaries on Vercel Hobby.** Use client-side direct upload to Storage (L-MKG-011).
8. **Relying on the OAuth callback to upsert into `public.users`.** Use the Postgres trigger (L-MKG-012). Auth.users → public.users is database-level, not application-level.
