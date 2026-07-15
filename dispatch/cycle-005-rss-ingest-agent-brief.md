---
cycle_id: cycle-005
job_id: cycle-005-rss-ingest-agent
agent_role: build
agent_name: rss-ingest-1
state: briefed
spawned_at: 2026-05-12
brief_owner: Architect
---

# Stand up the RSS Ingest Agent — continuous competitive-intel pipeline

## Goal
A Vercel Cron job that, every hour, pulls items from a curated set of
martech/adtech RSS feeds, dedupes them, classifies each item via Claude
into `relevant | irrelevant | needs-review`, and stages the survivors in
`intel_signals` for human review inside The Marketing Architect.

## Why
The Marketing Architect's defensibility scales with the freshness of its
graph. A weekly Research Agent pass surfaces enduring entities; the RSS
Ingest Agent surfaces the **deltas** — funding rounds, exec moves,
acquisitions, product launches, regulatory changes — within an hour of
publication. Without it, the graph drifts stale between cycles and we
forfeit the "first to cite the news" moment that drives AI-agent traffic.
With it, every canonical question the LLMs ask has a chance of pulling a
freshly-cited MKG entity into the answer.

## Inputs

### Files / context to read
- `MKG_PROJECT_STATE.md` (cycle-005 section)
- `MKG_LESSONS.md` — especially anything tagged `provenance`, `triage`,
  `anti-fabrication`
- `SCHEMA.sql` — to confirm `entities` / `relationships` foreign keys
  before adding `intel_signals` / `intel_sources`
- This brief

### Environment variables (already specced in `.env.example`; values
will be populated by Chilly before first run)
- `NEW_SUPABASE_URL`
- `NEW_SUPABASE_SERVICE_ROLE_KEY` (server-side only; never reaches the
  browser)
- `ANTHROPIC_API_KEY` (for triage classification)
- `CRON_SECRET` (Vercel Cron shared secret; reject requests without it)

### Priority feeds (seed `intel_sources` with exactly these rows on
migration; do not invent feeds, do not substitute)
| Source | Feed URL |
|---|---|
| TechCrunch | https://techcrunch.com/feed/ |
| AdExchanger | https://www.adexchanger.com/feed/ |
| BusinessWire (martech tag) | https://www.businesswire.com/portal/site/home/news/industries/?xpa=N&category=ind_marketing-advertising |
| EU-Startups | https://www.eu-startups.com/feed/ |
| PR Newswire (marketing) | https://www.prnewswire.com/rss/news-releases-list.rss |

The BusinessWire URL is the public industry portal; if it does not parse
as RSS via `rss-parser`, fall back to its `&format=rss` variant and log
the discovery in your handback rather than silently dropping the source.

## Expected outputs

### Database rows
1. `intel_sources` — five seed rows, one per feed above. Schema below.
2. `intel_signals` — every triaged item, one row per unique
   `url_hash`. Schema below.

### Code artifacts
- `migrations/005_intel_signals.sql` — schema additions (DDL only; no
  data manipulation beyond the five seed inserts).
- `src/app/api/cron/rss-ingest/route.ts` — Vercel Cron handler.
- `src/lib/intel/fetchFeed.ts` — pure function: `(source) => Item[]`.
- `src/lib/intel/triage.ts` — pure function:
  `(item) => { verdict, confidence, rationale }` via Claude.
- `src/lib/intel/dedupe.ts` — `urlHash(url)` via SHA-256 of the
  canonicalized URL (lowercased, tracking params stripped, trailing
  slash normalized).
- `vercel.json` — cron config: `0 * * * *` pointing at the route.

### Operational artifacts
- A handback in `dispatch/handbacks/cycle-005-rss-ingest-handback.md`
  noting any feeds that 4xx/5xx'd on the first manual run, any items
  Claude refused to classify, and the actual run latency from a local
  invocation against staging.

## Cadence
- **Vercel Cron** at `0 * * * *` (top of every hour, UTC).
- Each run targets a soft wall-clock budget of 60 seconds and a hard cap
  of 290 seconds (Vercel function timeout on Pro is 300s; leave 10s for
  cleanup). If the budget is exceeded, finish the in-flight item, then
  return early and log `partial_run=true`. The next hour picks up where
  this one stopped because `intel_sources.last_polled_at` advances only
  on success.
- No backfill on first deploy beyond what the feeds themselves return
  (TechCrunch typically yields ~10 items; PR Newswire's marketing
  release feed can yield 100+, so respect the per-source cap below).

## Pipeline

For each source in `intel_sources` where `active = true`, ordered by
`last_polled_at NULLS FIRST`:

1. **Fetch** — `rss-parser` with a 10s timeout, `User-Agent:
   MarketingArchitectBot/1.0 (+https://marketing.theknowledgegardens.com/bot)`.
   Cap at 50 items per source per run. If the fetch fails, increment
   `intel_sources.consecutive_failures` and continue; do not throw.
2. **Dedupe** — compute `url_hash = sha256(canonicalize(item.link))`.
   Query `intel_signals` for that hash; skip if present. Canonicalization
   strips `utm_*`, `mc_*`, `ref`, `fbclid`, `gclid`, lowercases host,
   drops trailing slash. Hash is the **unique key**, not the URL itself —
   different mirrors of the same release should collapse.
3. **Classify** — single Claude call per surviving item using the
   triage prompt below. Model: `claude-sonnet-4-5-20251022`. Max tokens:
   400. Temperature: 0. Tool use: none — pure text out, parsed as JSON.
4. **Insert** into `intel_signals` with:
   - `status = 'triaged'`
   - `triage_verdict ∈ ('relevant', 'irrelevant', 'needs-review')`
   - `triage_confidence ∈ ('high', 'medium', 'low')`
   - `triage_rationale` (Claude's one-sentence justification)
   - `retrieved_at = now()`
   - `source_id` FK to `intel_sources`
   - **Never** any field Claude did not see — no inferred entities, no
     guessed companies, no fabricated funding numbers. If Claude
     mentions a company in its rationale, that lives in
     `triage_rationale` text only and waits for the Research Agent's
     verification pass before it earns an `entities` row.
5. **Advance** — on full success for a source, update
   `intel_sources.last_polled_at = now()` and
   `consecutive_failures = 0`.

### Triage prompt (lock this; do not improvise per-call)
```
You are the triage layer for a martech competitive-intel feed. You will
receive one RSS item: title, summary, source, published_at. Classify it
against ONE question:

Is this signal materially useful to a senior marketing leader making
vendor, hiring, budget, or strategy decisions in martech / adtech / AI
marketing in the next 90 days?

Return strict JSON, no prose, no markdown:
{
  "verdict": "relevant" | "irrelevant" | "needs-review",
  "confidence": "high" | "medium" | "low",
  "rationale": "<= 25 words, one sentence"
}

Use "needs-review" only when the item plausibly matters but the title +
summary alone don't tell you enough. Never invent facts; rationale must
reference only what's in the item you were given.
```

If Claude returns malformed JSON, retry once with `temperature=0` and
the same prompt prefixed by `Your previous response was not valid JSON.
Return only JSON.`. If the retry also fails, insert the row with
`triage_verdict = 'needs-review'`, `triage_confidence = 'low'`,
`triage_rationale = 'classifier_parse_failure'`. Never drop the row.

## Anti-fabrication discipline (sacred)

Every `intel_signals` row carries `source_url` and `retrieved_at`. These
are the provenance proof. The following are auto-reject:

- An `intel_signals` row where `source_url` is null, synthesized, or
  rewritten beyond canonicalization.
- An `intel_signals` row where `retrieved_at` is not the wall-clock time
  of the fetch (no backdating to match `published_at`).
- Any insertion into `entities` or `relationships` from this agent. The
  RSS Ingest Agent **never** writes to the citable graph. It only
  stages signals. Promotion to `entities` is the Research Agent's job
  on the next cycle pass, and it carries its own citation discipline.
- Any field on `intel_signals` that was not in the RSS item, the
  canonicalization, or Claude's bounded triage output. No "I think this
  is about Adobe" — if Claude's rationale says Adobe, it lives in
  `triage_rationale` and nowhere else.
- Embedding the service-role key in any client-reachable bundle.
- Triage prompts that ask Claude to enrich, infer funding amounts, or
  resolve company names to ticker symbols. Triage is verdict + one
  sentence. Nothing more.

This is the same rule that governs the Research Agent (L-P005, L-P006):
every fact has a citation; no inferred fields without provenance.

## Failure modes + escalation

| Mode | Detection | Action |
|---|---|---|
| Feed 4xx/5xx | non-2xx response | increment `consecutive_failures`; continue |
| Feed parses but empty | `items.length === 0` | log; do not increment failures |
| 3 consecutive failures on a source | `consecutive_failures >= 3` | set `active = false`; escalate to Architect in handback |
| Claude rate limit (429) | HTTP 429 | exponential backoff 1s/2s/4s, then defer remaining items to next run |
| Claude JSON parse failure | `JSON.parse` throws after retry | insert as `needs-review` / `low` / `classifier_parse_failure`; do **not** drop |
| Run exceeds wall-clock budget | elapsed > 60s soft | finish in-flight item, return early, log `partial_run=true` |
| Supabase insert conflict on `url_hash` | unique violation | swallow — this is the dedupe working; not an error |
| `CRON_SECRET` mismatch | header check fails | return 401; do not run pipeline |
| Funding number appears in rationale | regex match `\$\d` in rationale | downgrade to `needs-review`; flag in handback. Triage is not allowed to assert dollar amounts. |

Escalate to Chilly (via Architect) if: a feed needs to be added or
removed, the Anthropic spend in a 24h window exceeds $5, or Supabase
write latency exceeds 2s p95 for two consecutive runs.

## Verification criteria
The Architect runs each of these before marking the brief verified.
- [ ] `migrations/005_intel_signals.sql` applies cleanly to a fresh
      database (no errors, no warnings).
- [ ] The five seed `intel_sources` rows exist after migration, with
      exactly the URLs in the table above.
- [ ] A local invocation of `/api/cron/rss-ingest` with a valid
      `CRON_SECRET` returns 200 within 60s and inserts at least one
      row per healthy feed.
- [ ] Every inserted `intel_signals` row has a non-null `source_url`,
      `url_hash`, `retrieved_at`, `triage_verdict`, and `source_id`.
- [ ] No row has `triage_verdict` outside the allowed enum.
- [ ] Running the endpoint twice within an hour produces zero
      duplicate `url_hash` rows (dedupe works).
- [ ] A request without `CRON_SECRET` returns 401.
- [ ] No `entities` or `relationships` rows were written by this agent.
- [ ] The service-role key does not appear in any file under
      `src/app/` that ships to the client (grep check).
- [ ] `vercel.json` cron entry matches `0 * * * *`.

## Anti-criteria (auto-reject)
- Writes to `entities` or `relationships` from the cron handler.
- Triage prompt that allows Claude to enrich beyond verdict + rationale.
- A row without `source_url` or without `retrieved_at`.
- Service-role key reachable from the browser bundle.
- Removing or relaxing `output: "export"` to make the cron route work
  (cron routes are server-only and must coexist with the static export
  for marketing pages; if there is a conflict, escalate, do not
  unblock by deleting the export).
- Funding amounts, headcount, or valuation figures asserted in
  `triage_rationale`.

## Schema additions needed

```sql
-- migrations/005_intel_signals.sql

create type triage_verdict as enum ('relevant', 'irrelevant', 'needs-review');
create type triage_confidence as enum ('high', 'medium', 'low');
create type signal_status as enum ('triaged', 'reviewed', 'promoted', 'discarded');

create table intel_sources (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  feed_url        text not null unique,
  kind            text not null default 'rss',           -- room for 'atom', 'json-feed' later
  active          boolean not null default true,
  last_polled_at  timestamptz,
  consecutive_failures int not null default 0,
  created_at      timestamptz not null default now()
);

create table intel_signals (
  id                  uuid primary key default gen_random_uuid(),
  source_id           uuid not null references intel_sources(id) on delete restrict,
  url_hash            text not null unique,              -- sha256(canonicalize(source_url))
  source_url          text not null,
  title               text not null,
  summary             text,
  published_at        timestamptz,
  retrieved_at        timestamptz not null default now(),
  triage_verdict      triage_verdict not null,
  triage_confidence   triage_confidence not null,
  triage_rationale    text not null,
  status              signal_status not null default 'triaged',
  promoted_entity_id  uuid references entities(id),     -- set by Research Agent when it earns a graph row
  reviewed_at         timestamptz,
  reviewed_by         text,                              -- email or 'auto'
  created_at          timestamptz not null default now()
);

create index intel_signals_status_idx       on intel_signals (status);
create index intel_signals_verdict_idx      on intel_signals (triage_verdict);
create index intel_signals_retrieved_idx    on intel_signals (retrieved_at desc);
create index intel_signals_source_idx       on intel_signals (source_id);

alter table intel_sources enable row level security;
alter table intel_signals enable row level security;

-- Default deny. Service role (cron handler) bypasses RLS.
-- Public read on triaged 'relevant' signals only, once we want them surfaced.
create policy "no public read by default" on intel_signals for select using (false);
create policy "no public read by default" on intel_sources for select using (false);

-- Seed sources
insert into intel_sources (name, feed_url) values
  ('TechCrunch',                  'https://techcrunch.com/feed/'),
  ('AdExchanger',                 'https://www.adexchanger.com/feed/'),
  ('BusinessWire Martech',        'https://www.businesswire.com/portal/site/home/news/industries/?xpa=N&category=ind_marketing-advertising'),
  ('EU-Startups',                 'https://www.eu-startups.com/feed/'),
  ('PR Newswire Marketing',       'https://www.prnewswire.com/rss/news-releases-list.rss');
```

## Code skeleton

```ts
// src/app/api/cron/rss-ingest/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { urlHash, canonicalize } from '@/lib/intel/dedupe';
import { triage } from '@/lib/intel/triage';

export const runtime = 'nodejs';
export const maxDuration = 300;

const SOFT_BUDGET_MS = 60_000;
const PER_SOURCE_CAP = 50;

export async function GET(req: NextRequest) {
  // 1. Auth
  const secret = req.headers.get('authorization')?.replace('Bearer ', '');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEW_SUPABASE_URL!,
    process.env.NEW_SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const parser = new Parser({ timeout: 10_000, headers: { 'User-Agent': 'MarketingArchitectBot/1.0 (+https://marketing.theknowledgegardens.com/bot)' } });

  const started = Date.now();
  const summary = { sources: 0, fetched: 0, inserted: 0, skipped_dupes: 0, errors: [] as string[], partial_run: false };

  // 2. Sources ordered by oldest poll
  const { data: sources, error: srcErr } = await supabase
    .from('intel_sources')
    .select('*')
    .eq('active', true)
    .order('last_polled_at', { ascending: true, nullsFirst: true });
  if (srcErr) return NextResponse.json({ error: srcErr.message }, { status: 500 });

  for (const source of sources ?? []) {
    if (Date.now() - started > SOFT_BUDGET_MS) { summary.partial_run = true; break; }
    summary.sources++;

    let items: Parser.Item[] = [];
    try {
      const feed = await parser.parseURL(source.feed_url);
      items = (feed.items ?? []).slice(0, PER_SOURCE_CAP);
    } catch (e: any) {
      await supabase
        .from('intel_sources')
        .update({ consecutive_failures: (source.consecutive_failures ?? 0) + 1 })
        .eq('id', source.id);
      summary.errors.push(`${source.name}: ${e.message}`);
      continue;
    }

    for (const item of items) {
      if (Date.now() - started > SOFT_BUDGET_MS) { summary.partial_run = true; break; }
      if (!item.link) continue;
      summary.fetched++;

      const canon = canonicalize(item.link);
      const hash = urlHash(canon);

      const { data: existing } = await supabase
        .from('intel_signals').select('id').eq('url_hash', hash).maybeSingle();
      if (existing) { summary.skipped_dupes++; continue; }

      const verdict = await triage(anthropic, {
        title: item.title ?? '',
        summary: item.contentSnippet ?? item.content ?? '',
        source: source.name,
        published_at: item.isoDate ?? null,
      });

      const { error: insErr } = await supabase.from('intel_signals').insert({
        source_id: source.id,
        url_hash: hash,
        source_url: canon,
        title: item.title ?? '(untitled)',
        summary: item.contentSnippet ?? null,
        published_at: item.isoDate ?? null,
        retrieved_at: new Date().toISOString(),
        triage_verdict: verdict.verdict,
        triage_confidence: verdict.confidence,
        triage_rationale: verdict.rationale,
        status: 'triaged',
      });
      if (insErr && !insErr.message.includes('duplicate key')) {
        summary.errors.push(`insert ${hash}: ${insErr.message}`);
      } else if (!insErr) {
        summary.inserted++;
      }
    }

    await supabase
      .from('intel_sources')
      .update({ last_polled_at: new Date().toISOString(), consecutive_failures: 0 })
      .eq('id', source.id);
  }

  return NextResponse.json(summary);
}
```

```ts
// src/lib/intel/dedupe.ts
import { createHash } from 'crypto';

const TRACKING = /^(utm_|mc_|ref$|fbclid$|gclid$)/i;

export function canonicalize(raw: string): string {
  const u = new URL(raw);
  u.hostname = u.hostname.toLowerCase();
  [...u.searchParams.keys()].forEach(k => { if (TRACKING.test(k)) u.searchParams.delete(k); });
  if (u.pathname.endsWith('/') && u.pathname !== '/') u.pathname = u.pathname.slice(0, -1);
  u.hash = '';
  return u.toString();
}

export function urlHash(canonical: string): string {
  return createHash('sha256').update(canonical).digest('hex');
}
```

```ts
// src/lib/intel/triage.ts
import type Anthropic from '@anthropic-ai/sdk';

const PROMPT = `You are the triage layer for a martech competitive-intel feed. ...`; // lock the full prompt from the brief

export async function triage(client: Anthropic, item: { title: string; summary: string; source: string; published_at: string | null }) {
  const call = (extraPrefix = '') => client.messages.create({
    model: 'claude-sonnet-4-5-20251022',
    max_tokens: 400,
    temperature: 0,
    messages: [{ role: 'user', content: `${extraPrefix}${PROMPT}\n\nITEM:\n${JSON.stringify(item)}` }],
  });

  for (const prefix of ['', 'Your previous response was not valid JSON. Return only JSON.\n\n']) {
    const res = await call(prefix);
    const text = res.content.find(b => b.type === 'text')?.text ?? '';
    try {
      const parsed = JSON.parse(text);
      if (['relevant','irrelevant','needs-review'].includes(parsed.verdict) &&
          ['high','medium','low'].includes(parsed.confidence) &&
          typeof parsed.rationale === 'string') {
        // Anti-fabrication: strip dollar figures from rationale
        if (/\$\d/.test(parsed.rationale)) parsed.verdict = 'needs-review';
        return parsed;
      }
    } catch { /* fall through to retry */ }
  }
  return { verdict: 'needs-review' as const, confidence: 'low' as const, rationale: 'classifier_parse_failure' };
}
```

```json
// vercel.json (merge with existing)
{
  "crons": [
    { "path": "/api/cron/rss-ingest", "schedule": "0 * * * *" }
  ]
}
```

## Lessons that apply
L-P004 (JSON-LD discipline — even though this agent doesn't emit
JSON-LD, the citation-provenance ethic carries), L-P005 (no invented
funding numbers — enforced via rationale regex), L-P006 (every fact
cited — every signal has `source_url` + `retrieved_at`), L-P008 (read
from Supabase, not embedded JSON — the review UI in a later cycle must
query `intel_signals`, never a static dump), L-P010 (lessons-fetch
before brief).

## Dependencies
- **Blocked by:** Supabase project live with `entities` table (for the
  `promoted_entity_id` FK). Confirm before running migration.
- **Blocks:** cycle-005-job-N-intel-review-ui (the review surface that
  walks `status='triaged'` rows and promotes the relevant ones).
- **Blocks:** Research Agent's freshness pass — once signals land, the
  Research Agent's next cycle should pull `triage_verdict='relevant'`
  rows as input candidates.

## Notes for the agent
- BusinessWire's portal URL is not a clean RSS endpoint in all paths.
  If `rss-parser` rejects it, try the `&format=rss` variant. If both
  fail, mark the source `active=false` in your handback and escalate —
  do not silently substitute a different feed.
- PR Newswire's marketing feed can be very high-volume. The
  `PER_SOURCE_CAP = 50` is deliberate; if review backlog grows, lower
  the cap rather than raising the budget.
- The triage prompt is **locked**. Do not "improve" it without filing
  a lesson and getting Architect signoff. Drift in triage criteria
  silently corrupts the signal store.
- `gen_random_uuid()` requires `pgcrypto`. Schema-1 enabled it in
  cycle-001; if a fresh DB is used, verify.
- Do **not** add a `webhook` field, an `enrichment` field, or any
  column that invites Claude to invent. The schema's narrowness is a
  feature.
- Run the migration in a Supabase branch first if available; merge
  only after a dry-run of the cron route shows zero errors against
  staging data.
- The handback must include: total inserted, breakdown by verdict,
  any source with `consecutive_failures >= 1`, and the wall-clock
  duration of the first manual run.
