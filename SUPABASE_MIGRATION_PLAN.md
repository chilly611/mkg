# SUPABASE_MIGRATION_PLAN.md
**Marketing Knowledge Garden — Cycle 002 migration into the shared umbrella project**
*Drafted by deploy-agent-2 · 2026-05-10*

---

## 0 · What changed from Cycle 001 (read this first)

| | Cycle 001 plan | Cycle 002 reality (per masterdoc v2 §9.3) |
|---|---|---|
| Supabase project | Provision a NEW project for MKG | **Reuse `vlezoyalutexenbnzzui` (knowledge-gardens-prod)** — the umbrella's shared project |
| Postgres namespace | `public.entities`, `public.citations`, etc. | **`mkg.` schema** — every MKG table namespaced; `public.brand_assets` stays shared |
| Storage buckets | `mkg-photos` (new) | **`brand-assets`** (already live, 17 rows registered) + future `mkg-photos` if needed |
| Env-var ownership | Per-garden keys | **Shared anon key + URL** across all gardens; RLS does the gating |
| pg_cron | Provision new | **Already enabled** on shared project (TKG / OKG already use it) |

**Why this exists.** The Cycle 001 `DEPLOY_RUNBOOK.md` was written before the masterdoc was shared. It assumed MKG was a greenfield project. The masterdoc makes clear that all gardens federate into one Supabase project; gardens namespace via Postgres schemas, not separate projects. This document supersedes section 6 of the runbook ("Provision the Supabase project") and replaces it with a schema-scoped migration. **A future Architect reading this should know: there is exactly one Supabase project for the entire umbrella, and MKG is a schema inside it.**

The 40 GEO/AEO entities, the seed Campaign rows, the dispatch log, and the lessons table all land inside `mkg.*`. The umbrella `public.brand_assets` and the `brand-assets` Storage bucket are read by MKG but owned by the umbrella.

---

## 1 · Migration sequence (in order)

### 1.1 — Pre-flight: verify the schema doesn't already exist

Run in Supabase Studio SQL Editor (or via `Supabase:execute_sql` MCP):

```sql
SELECT schema_name
FROM information_schema.schemata
WHERE schema_name IN ('mkg', 'okg', 'bkg', 'hkg', 'tkg');
```

Expected: HKG and TKG schemas exist (or are about to). MKG must NOT appear. If `mkg` already exists, STOP — escalate to Architect; we may be re-running an aborted migration.

### 1.2 — Apply SCHEMA.sql v0.2 (campaign-centric, mkg-namespaced)

Schema Agent must produce `SCHEMA.sql` v0.2 before this step. The v0.1 file in repo is `public.`-scoped and entity-centric — it must be rewritten to:

1. `CREATE SCHEMA IF NOT EXISTS mkg;`
2. `SET search_path TO mkg, public;` at the top of the migration
3. Every `CREATE TABLE` becomes `CREATE TABLE mkg.<table>` (entities, relationships, citations, embeddings, agent_memory, lessons, dispatch_log)
4. Add `mkg.brands` (the campaigns' parent record), `mkg.campaigns` (the new primary entity per masterdoc §11.3), `mkg.competitor_entities` (the renamed v0.1 `entities` table — these are competitive landscape rows, NOT our own brands), `mkg.citation_results` (citation health trendline)
5. View `mkg.entities_jsonld` stays in the `mkg` schema; expose to PostgREST via `GRANT USAGE ON SCHEMA mkg TO anon, authenticated;` and Supabase API settings → "Exposed schemas" must include `mkg`.

Apply via either:

- **Studio SQL Editor:** open <https://supabase.com/dashboard/project/vlezoyalutexenbnzzui/sql/new>, paste the file, click Run.
- **MCP (preferred for atomicity):** `Supabase:apply_migration` with `name="cycle_002_mkg_schema_v0_2"` and the file body as `query`.

DDL must NOT be run via the JS client (per masterdoc §9.3 TKG-learned lesson and L-MKG-001).

### 1.3 — Verify all tables created and RLS enabled

```sql
-- All MKG tables present
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'mkg'
ORDER BY table_name;

-- RLS enabled on every one
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'mkg';
-- Expect: rowsecurity = true on ALL rows.

-- Public-read policies present where required
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'mkg'
ORDER BY tablename;
-- Expect public_read policies on: entities, campaigns, brands, relationships, citations, competitor_entities.
-- NO public policies on: agent_memory, lessons, dispatch_log, embeddings (internal-only).
```

### 1.4 — Seed the umbrella as the first brand

```sql
INSERT INTO mkg.brands (slug, name, description, brand_scope, created_by)
VALUES (
  'knowledge-gardens-umbrella',
  'The Knowledge Gardens',
  'The umbrella platform. MKG''s first customer per masterdoc §11.2.',
  'umbrella',
  'architect'
);
```

### 1.5 — Ingest the 40 GEO/AEO entities into `mkg.competitor_entities`

The handback at `data/entities-geo-aeo-cycle001.json` contains 40 verified entities (31 high, 9 medium confidence). These are competitors we map, NOT our own brands. Use Supabase's bulk-insert pattern from `L-MKG-001`:

```bash
# From a script with SUPABASE_SERVICE_ROLE_KEY in env
node scripts/ingest-competitors.mjs data/entities-geo-aeo-cycle001.json
```

The script uses PostgREST against `mkg.competitor_entities` and `mkg.citations` (one citation row per entity claim). Throughput target ~1,200 rec/sec per masterdoc §9.3.

### 1.6 — Ingest seed Campaign records

Per masterdoc §11.2, the four Day-1 campaigns (the BKG sliver launch, the HKG GLP-1 patient-lane push, the OKG Bloom Ledger documentary, the seed-fundraising narrative):

```sql
INSERT INTO mkg.campaigns (slug, name, brand_id, objective, channel, audience, status, created_by)
SELECT
  campaign_data.slug, campaign_data.name,
  (SELECT id FROM mkg.brands WHERE slug = 'knowledge-gardens-umbrella'),
  campaign_data.objective, campaign_data.channel, campaign_data.audience,
  'live', 'architect'
FROM (VALUES
  ('bkg-sliver-launch',       'BKG Sliver Launch',         'awareness',     'content',  'gc-builders'),
  ('hkg-glp1-patient-lane',   'HKG GLP-1 Patient Lane',    'acquisition',  'organic',   'glp1-prescribed'),
  ('okg-bloom-ledger-doc',    'OKG Bloom Ledger Documentary','engagement', 'video',    'orchid-collectors'),
  ('seed-fundraising-narrative','Seed Pitch Narrative',    'fundraising', 'direct',    'pre-seed-investors')
) AS campaign_data(slug, name, objective, channel, audience);
```

### 1.7 — Smoke tests

```sql
-- 1. Each table is queryable and has the expected row counts
SELECT 'brands' AS t, count(*) FROM mkg.brands UNION ALL
SELECT 'campaigns', count(*) FROM mkg.campaigns UNION ALL
SELECT 'competitor_entities', count(*) FROM mkg.competitor_entities UNION ALL
SELECT 'citations', count(*) FROM mkg.citations;

-- 2. JSON-LD view emits valid schema.org
SELECT jsonld FROM mkg.entities_jsonld LIMIT 3;
-- Pipe one row through https://validator.schema.org/ manually for sanity.

-- 3. pgvector works end-to-end
INSERT INTO mkg.embeddings (entity_id, model, text_kind, embedding)
SELECT id, 'text-embedding-3-small', 'name', array_fill(0.01, ARRAY[1536])::vector
FROM mkg.competitor_entities LIMIT 1;

SELECT name, 1 - (em.embedding <=> array_fill(0.01, ARRAY[1536])::vector) AS sim
FROM mkg.embeddings em JOIN mkg.competitor_entities e ON e.id = em.entity_id
ORDER BY em.embedding <=> array_fill(0.01, ARRAY[1536])::vector
LIMIT 5;
-- Expect 1 row with sim = 1.0; verifies the IVF index is callable.
```

---

## 2 · Env-var reconciliation (security-critical)

Vercel's MKG project needs **shared** values:

| Var | Value | Where it lives | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://vlezoyalutexenbnzzui.supabase.co` | Vercel + browser bundle | Public, fine. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (anon JWT) | Vercel + browser bundle | Public-safe IFF RLS is correct on every table. |
| `SUPABASE_SERVICE_ROLE_KEY` | (service-role JWT) | **Vercel server-side only** | NEVER `NEXT_PUBLIC_*`. NEVER ship to browser. Used by `/api/cron/*` server functions and ingest scripts. |
| `MKG_SCHEMA` | `mkg` | Vercel | Lets the JS client hit `from('campaigns')` against the right schema (`createClient(url, key, { db: { schema: 'mkg' } })`). |

**Security implications.**
1. The anon key is identical for HKG, TKG, OKG, BKG, and MKG. A compromise of one garden's frontend doesn't escalate, *because* RLS is what gates rows. **Auditing RLS is the actual security posture.** Any new table with `ALTER TABLE … ENABLE ROW LEVEL SECURITY` but no policies is effectively read-locked — that's the safe default; explicit `public_read` policies must be added for the citable surface only.
2. The service-role key bypasses RLS. Treat it like an SSH key. It belongs in Vercel's encrypted env-var store with the "Sensitive" toggle on, and in `.env.local` (gitignored) for local scripts. Never in `.env.example`, never in `next.config.js`, never in a client component.
3. The exposed-schemas list in Supabase Settings → API must include `mkg` for PostgREST to route requests. Adding it does NOT bypass RLS — every row is still gated.

---

## 3 · Brand-assets integration (read-only, cross-garden)

The 17 brand assets are already registered in `public.brand_assets` and the `brand-assets` bucket is public-read. MKG queries them without writing.

**MKG-relevant slice — query template:**

```sql
SELECT slug, title, public_url, intended_use, asset_type
FROM public.brand_assets_with_url
WHERE garden_scope IN ('umbrella', 'mkg', 'cross-cutting')
  AND status IN ('working', 'approved')
ORDER BY asset_type, slug;
```

Expected today: the 6 umbrella tree marks (incl. `tree-symmetric-redroot` — primary mark candidate) and `observation-anatomical-eye`. As Schema Agent generates MKG-specific plates (campaign-anatomy schematic, attribution-path diagram, etc.) into the `mkg/` folder of the bucket, those rows arrive automatically with `garden_scope = 'mkg'`.

**Frontend usage in `website/src/lib/brandAssets.ts`:**

```ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getMkgBrandAssets() {
  const { data } = await supabase
    .from('brand_assets_with_url')
    .select('slug, title, public_url, intended_use, asset_type')
    .in('garden_scope', ['umbrella', 'mkg', 'cross-cutting'])
    .in('status', ['working', 'approved'])
    .order('asset_type')
  return data ?? []
}

export async function getUmbrellaPrimaryMark() {
  const { data } = await supabase
    .from('brand_assets_with_url')
    .select('public_url, title, description')
    .contains('intended_use', ['umbrella-mark-primary-candidate'])
    .single()
  return data
}
```

The header / footer pull `getUmbrellaPrimaryMark()` at build time (static export). The observation eye is referenced on the Intelligence tab as the "we see what others can't" plate.

---

## 4 · Heartbeat plumbing on the existing project

Per `RSI_HEARTBEAT_AGENTS.md`, three runtimes carry the heartbeat: Vercel Cron, Supabase pg_cron, Cowork scheduled tasks.

### 4.1 — pg_cron extension

Per masterdoc §9.3 and TKG/OKG precedent, **pg_cron is already enabled** on `vlezoyalutexenbnzzui`. Verify:

```sql
SELECT * FROM pg_extension WHERE extname IN ('pg_cron', 'pg_net', 'vector', 'pgcrypto', 'pg_trgm');
```

If `pg_cron` is missing (it shouldn't be):

```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
GRANT USAGE ON SCHEMA cron TO postgres;
```

Note: pg_cron is gated to the `postgres` superuser role on Supabase. Schedule jobs from the SQL Editor or via `Supabase:execute_sql` MCP.

### 4.2 — Schedule the daily embedding refresh

The `mkg-embed-daily` heartbeat runs in pg_cron (no egress cost):

```sql
SELECT cron.schedule(
  'mkg-embed-daily',
  '0 4 * * *',                              -- 04:00 UTC daily
  $$ SELECT net.http_post(
       url := 'https://marketing.theknowledgegardens.com/api/cron/embed',
       headers := jsonb_build_object(
         'Authorization', 'Bearer ' || current_setting('app.cron_secret', true),
         'Content-Type', 'application/json'
       )
     ); $$
);
```

Requires `pg_net` (already enabled) and a `CRON_SECRET` env var on Vercel that the API route validates.

### 4.3 — Vercel Cron entries (`vercel.json`)

```json
{
  "crons": [
    { "path": "/api/cron/ingest",  "schedule": "0 * * * *"   },
    { "path": "/api/cron/verify",  "schedule": "0 13 * * *"  },
    { "path": "/api/cron/cycle-close", "schedule": "0 22 * * 0" },
    { "path": "/api/cron/promote", "schedule": "0 23 * * 0" }
  ]
}
```

### 4.4 — Cowork scheduled tasks

`mkg-schema-evolve` (monthly) and `mkg-wedge-expand` (monthly) run via Cowork's `mcp__scheduled-tasks__create_scheduled_task` — outside Supabase, owned by the Architect's session.

---

## 5 · Chilly's commit (one-click sequence)

Architect drafts; Chilly applies. Here is exactly what Chilly does, in order:

**Step 1 — Apply the migration (1 click).**
Open <https://supabase.com/dashboard/project/vlezoyalutexenbnzzui/sql/new>. Paste the contents of `SCHEMA.sql` v0.2 (Schema Agent will hand it back at `dispatch/handbacks/cycle-002-job-1-schema-v0_2.md`). Click **Run**. Expect "Success. No rows returned" and 11 new tables under the `mkg` schema in the Table Editor.

**Step 2 — Expose the `mkg` schema to the API (1 click).**
Settings → API → "Exposed schemas". Add `mkg` to the comma-separated list. Save.

**Step 3 — Run the seed inserts (1 paste).**
Same SQL Editor, paste the §1.4 + §1.6 INSERT blocks. Run.

**Step 4 — Paste env vars into Vercel (3 paste).**
Vercel → Project: knowledge-gardens-marketing → Settings → Environment Variables. Add the four vars from §2 (URL, anon key, service-role key marked Sensitive, MKG_SCHEMA=mkg). Apply to Production + Preview + Development.

**Step 5 — Trigger a redeploy (1 click).**
Vercel → Deployments → latest → "Redeploy" (so the new env vars apply per L-031).

**Step 6 — Run the smoke tests (1 paste).**
Paste §1.7 block into SQL Editor. Confirm row counts match expectation, JSON-LD parses, pgvector returns a hit.

**Step 7 — Hand back to Architect.**
Reply in the Cowork session: *"Migration applied, smoke tests green."* Architect picks up Cycle 002 Job 2 (Research Agent ingestion of remaining four wedges) and Job 3 (Build Agent on the Campaign Teardown).

Total Chilly time: ~5 minutes. Zero terminal commands. Architect owns everything else.

---

*This document supersedes `DEPLOY_RUNBOOK.md` §6 ("Provision the Supabase project"). Architects reading this in a future cycle: do not re-create a new project. The umbrella has one Supabase, and MKG lives inside it.*
