# DISPATCH REPORT — Cycle 001 — 2026-05-09

**Architect.** Marketing Garden Architect (Cowork session, single cycle).

## Shipped
- Local repo scaffolded at `~/Documents/Claude/Projects/Knowledge Gardens Umbrella/Marketing/` — 17 files across `dispatch/`, `data/`, `artifacts/`, `.claude/`, plus root docs.
- `SCHEMA.sql` v0.1: 7 tables, pgvector + pg_trgm extensions, RLS on every table, schema.org JSON-LD view, sample queries.
- `MKG_LESSONS.md` seeded with 12 PROVISIONAL lessons (L-P001..L-P012), reconciliation queue documented for masterdoc arrival.
- Research wedge handback: 40 GEO/AEO platforms, 31 high-confidence, 22 US / 11 EU / 1 SG / 5 undisclosed HQ. Profound ($155M Series C), Bluefish ($68M Series B), AirOps ($60M Series B), Brandlight ($35.75M Series A), Peec AI ($29M Series A) lead by capital.
- Citation health baseline (`data/citation-baseline-cycle001.md`): all four canonical questions return zero neutral / taxonomic / AI-citable sources today. Every top-10 result is a vendor blog or affiliate listicle. **The wedge is open.**
- Rebuilt landscape artifact (`artifacts/landscape-v2.html`): parchment background, Cormorant Garamond italic + Space Mono uppercase, four-tab Species Experience (Profile / Architecture / Intelligence / Compare), animated Compass, Conveyor Belt SVG, JSON-LD per entity (40 runtime-emitted blocks), filterable plate grid, side-by-side comparison.

## Blocked
- **Supabase project not provisioned.** Schema written but not applied. Cycle 002 cannot start the API job until `.env` is populated.
- **GitHub repo not created.** Files on local disk only — no version control yet.
- **Vercel + DNS not provisioned.** `marketing.theknowledgegardens.com` not live; Deploy Agent can't ship.
- **Persistent runtime undefined.** Cowork sessions don't run a daemon. The "continuous dispatch loop" needs a decision: scheduled tasks, per-cycle re-spawn, or Claude Code on a cron.
- **Masterdoc not shared.** All 12 lessons remain PROVISIONAL until reconciled against L-001..L-033.

## Lessons added
12 PROVISIONAL lessons committed in `MKG_LESSONS.md`. Scope: brand (parchment, Cormorant, Space Mono, tabs, Compass + Conveyor), data (no invented funding, every claim cited), workflow (one brief one branch, lessons fetch before brief), citation (JSON-LD on every entity), and citation-health (rerun every cycle). No Cycle 001 handback violated a seed lesson.

## Citation health
**Baseline established. MKG citation count = 0 across all four canonical questions.** Every current top-10 result is a vendor blog, affiliate listicle, or agency thought leadership. No academic, government, or trade-organization corpus competes for the AI-citation footprint. This is the wedge the MKG fills.

## Next cycle (002) — recommended sequence
Cannot start until at least one infra unblock lands. When unblocked:
1. Schema Agent applies `SCHEMA.sql` to live Supabase; ingests `data/entities-geo-aeo-cycle001.json` to live `entities` + explodes claims into `citations`.
2. Build Agent (build-api-1) stands up MCP server + REST + JSON-LD feed + sitemap.
3. Research Agent (4 parallel) attacks the remaining wedges: autonomous marketing agents, vertical-specific AI marketing, geographic specialists (LATAM-deep), agentic commerce.
4. Build Agent (build-ui-1) scaffolds Next.js app from `landscape-v2.html` patterns; reads from Supabase, not embedded JSON (L-P008 enforced).
5. Deploy Agent ships to `marketing.theknowledgegardens.com`; runs citation health post-deploy.
6. Critic Agent reads cycle output, files lessons, escalates regressions.

## What I need from Chilly / John before Cycle 002
- Decision on Supabase: do you want me to draft the project provisioning plan + DNS records, or will you provision and paste keys?
- Decision on GitHub: confirm repo name `knowledge-gardens-marketing` (or override) and which org to create it under.
- Decision on persistence: Cowork scheduled tasks vs. Claude Code cron vs. per-cycle re-spawn from a fresh session.
- Masterdoc: drop the file (or confirm I treat the prompt as canonical for Cycle 002 too).
