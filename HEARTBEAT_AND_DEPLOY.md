# Heartbeat & Deploy — Ship Pack
**Cycle 002. Chilly's persistence decision: weekly heartbeat. Repo: `knowledge-gardens-marketing`. Supabase: existing project.**

This is the runbook + scripts to take MKG from local scaffold to live
heartbeating site. Mirrors the TKG ship pattern. Where Cycle 001's
DEPLOY_RUNBOOK.md assumed a brand-new Supabase project, this supersedes
that for Cycle 002.

---

## 0 · One-shot GitHub init (3 min)

From a terminal in `~/Documents/Claude/Projects/Knowledge Gardens Umbrella/Marketing/`:

```bash
cd "~/Documents/Claude/Projects/Knowledge Gardens Umbrella/Marketing"
git init
git add .
git commit -m "Cycle 002 · masterdoc-aligned scaffold"

# Repo create via gh (install with: brew install gh && gh auth login)
gh repo create knowledge-gardens-marketing \
  --public \
  --source . \
  --remote origin \
  --description "Marketing Knowledge Garden — the canonical, AI-citable atlas of marketing in the agentic era." \
  --push

# Confirm
gh repo view --web
```

If `gh` isn't available: create the repo manually at
<https://github.com/new>, then:
```bash
git remote add origin https://github.com/<user>/knowledge-gardens-marketing.git
git branch -M main
git push -u origin main
```

---

## 1 · Vercel deploy (3 min — see also DEPLOY_RUNBOOK.md)

1. Open <https://vercel.com/new>.
2. Import `knowledge-gardens-marketing`.
3. **Mandatory before clicking Deploy** (per umbrella `L-031`):
   - **Root Directory:** `website` (NOT the repo root)
   - **Environment Variables:** import the values below into the
     project before first deploy
4. Click Deploy. Build takes ~60s.

### Env vars to import in Vercel

```env
# Supabase (existing umbrella project — same anon key used by other gardens)
NEXT_PUBLIC_SUPABASE_URL=https://vlezoyalutexenbnzzui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key-from-supabase-dashboard>

# Schema (server-only — safe to default-set)
MKG_SCHEMA=mkg

# Public origin (for canonical URLs and JSON-LD)
PUBLIC_URL=https://marketing.theknowledgegardens.com

# Service role — server-side only, NEVER prefix with NEXT_PUBLIC_
SUPABASE_SERVICE_ROLE_KEY=<service-role-from-supabase-dashboard>
```

### DNS (in your DNS provider)
- Type: CNAME
- Name: `marketing`
- Value: `cname.vercel-dns.com.`

After CNAME propagates (~1–5 min), `marketing.theknowledgegardens.com`
should resolve and the deploy is live.

---

## 2 · Supabase — apply MKG schema to the existing project (4 min)

The umbrella's Supabase project (`vlezoyalutexenbnzzui` —
knowledge-gardens-prod) already runs OKG / BKG / HKG / TKG. MKG namespaces
into a `mkg.` schema.

Two paths.

### Path A — Studio (browser-only)

1. Open <https://supabase.com/dashboard/project/vlezoyalutexenbnzzui/sql>
2. Paste the contents of `Marketing/SCHEMA.sql` (v0.2) into the SQL editor.
3. Click **Run**. Should return `Success. No rows returned`.
4. In Settings → API → **Exposed schemas**, add `mkg` to the list
   alongside `public`. Save. (PostgREST won't route to `mkg.` tables
   without this.)

### Path B — Supabase MCP (if you have the Supabase MCP server connected)

```text
Supabase:apply_migration(
  project_id="vlezoyalutexenbnzzui",
  name="mkg-cycle-002-schema",
  query=<contents of Marketing/SCHEMA.sql>
)
```

Then verify in Studio that `mkg.*` tables exist and RLS is enabled on
each.

### Smoke tests (run after either path)

```sql
-- 1. Tables exist
select table_name from information_schema.tables
where table_schema = 'mkg' order by table_name;

-- 2. RLS enabled everywhere
select tablename, rowsecurity from pg_tables where schemaname = 'mkg';

-- 3. JSON-LD view returns shape (will be empty until campaigns are seeded)
select jsonld from mkg.campaigns_jsonld limit 5;
```

See `SUPABASE_MIGRATION_PLAN.md` for the full 7-step migration sequence
including the seed campaigns ingest.

---

## 3 · Weekly heartbeat — Vercel Cron + Cowork

Chilly's call: **weekly heartbeat.** The simplest cadence that compounds.

### `vercel.json` (already shipped in `Marketing/website/`)

If not present, create:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [
    { "path": "/api/cron/cycle-close",   "schedule": "0 18 * * 0" },
    { "path": "/api/cron/promote",       "schedule": "0 19 * * 0" },
    { "path": "/api/cron/citation-test", "schedule": "0 17 * * 0" }
  ]
}
```

(Vercel Cron is included on Pro; Hobby allows 2 jobs. If you're on Hobby,
keep `cycle-close` and `citation-test`; move `promote` to a Cowork
scheduled task.)

### The three cron endpoints (Cycle 003 build target)

1. `/api/cron/citation-test` — runs canonical-question test against
   ChatGPT / Claude / Perplexity / Gemini APIs with browsing/tools on.
   Writes results to `mkg.metrics` (kpi_kind = `citation_rate`) and to
   `data/citation-baseline-cycle<NNN>.md`.
2. `/api/cron/cycle-close` — runs Critic Agent's audit, computes the
   compounding score, drafts the dispatch report, posts to
   `ARCHITECT_NOTIFY_WEBHOOK`.
3. `/api/cron/promote` — runs Promote Agent's umbrella-lesson promotion
   per `L-032`. PRs against the umbrella `09_LESSONS.md` for the first
   90 days; direct commit thereafter.

Until those endpoints are built, the cron entries are no-ops.
**Architect runs the equivalent manually every Sunday evening.**

### Cowork scheduled tasks (the human-judgment cadences)

Create these in Cowork:

- **Weekly · Sunday 19:00 ET** — *MKG Cycle Close.* Body:
  > Architect, run a Cycle Close for MKG. Read `MKG_PROJECT_STATE.md`,
  > `MKG_LESSONS.md`, and the last 7 days of `dispatch_log` rows. Score
  > the compounding metric. Draft the dispatch report. Post results.
- **Monthly · First Monday 09:00 ET** — *MKG Schema Evolution Review.*
  Body:
  > Read `mkg.dispatch_log` for the past month. Identify recurring schema
  > needs. Draft a Schema Agent brief.
- **Monthly · First Monday 10:00 ET** — *MKG Wedge Expansion Decision.*
  Body:
  > Pick the next research wedge. Spawn 3–5 parallel Research Agents.
  > See architect prompt §First-Dispatch-Cycle.

### Observer task (the redundancy rail)

- **Weekly · Sunday 19:30 ET** — *Heartbeat Observer.* Body:
  > Check whether the Vercel cron jobs ran today. Query
  > `mkg.dispatch_log` for entries with `cycle_id = current_iso_week`.
  > If empty, escalate.

---

## 4 · Smoke test the live deploy

After deploy + DNS propagation:

| Check | URL | What you should see |
|---|---|---|
| Landing | `https://marketing.theknowledgegardens.com/` | Garden mark, hero, link to /competitive-landscape/ |
| Competitive Landscape | `/competitive-landscape/` | 40-entity atlas with sister-gardens strip |
| Team Atlas | `/team-atlas/` | 8-tab team brief |
| llms.txt | `/llms.txt` | (Cycle 003 build — not yet) |
| sitemap | `/sitemap.xml` | (Cycle 003 build — not yet) |

View source on each: at least one `<script type="application/ld+json">`
block. Validate at <https://validator.schema.org>.

---

## 5 · The 12-line summary

If you remember nothing else:

```bash
# Repo
cd "Marketing"
git init && git add . && git commit -m "init"
gh repo create knowledge-gardens-marketing --public --source . --push

# Vercel: import, Root Directory=website, paste env vars BEFORE Deploy
# DNS: CNAME marketing -> cname.vercel-dns.com.

# Supabase Studio: paste Marketing/SCHEMA.sql, Run
# Supabase Settings → API → Exposed schemas: add `mkg`

# Vercel Pro (if on it): vercel.json crons block already in repo
# Cowork: schedule the three weekly/monthly tasks above
```

That's the heartbeat firing.

---

## Sources & references

- `SUPABASE_MIGRATION_PLAN.md` — full 7-step migration with seed campaigns
- `DEPLOY_RUNBOOK.md` — Cycle 001 runbook (superseded by §2 above for Supabase, otherwise valid)
- `RSI_HEARTBEAT_AGENTS.md` — full architecture of the heartbeat
- Umbrella `09_LESSONS.md` — `L-031` Vercel discipline; `L-032` lesson promotion
