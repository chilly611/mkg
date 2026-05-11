# RSI · Heartbeat · Agents
**Marketing Knowledge Garden — Operating Architecture**
*Cycle 001 specification · 2026-05-09*

---

## I. Why this brief exists

Knowledge Gardens compound. Other martech tools are snapshots of a moment;
the MKG is a living system that gets smarter every day it runs. That
compounding is **not free**. It requires three machines running on a
heartbeat, and a sub-agent roster that owns those machines without daily
human supervision.

This document specifies all three.

> *"Snapshots die; compounding systems don't."* — masterdoc L-020

---

## II. The three RSI loops

The MKG runs three recursive self-improvement loops in parallel. Each has
its own cadence, owner agent, persistence target, and failure escalation.
A garden without all three drifts into snapshot territory and stops
compounding.

### Loop 1 · Data freshness

The marketing landscape changes daily. New funding rounds, new pivots,
new players, dead products. If our entity rows go stale, the AI-citation
moat erodes — LLMs prefer fresher sources, period.

| Element | Specification |
|---|---|
| Owner agent | **Ingest Agent** (new) → **Research Agent** (verification) |
| Inputs | RSS feeds (TC, AdExchanger, BusinessWire, EU-Startups, PR Newswire), Crunchbase API, public X/LinkedIn listening, GitHub releases for OSS players |
| Output | New rows in `entities` (high-confidence) or `entities_pending` (need-verify); citation rows for every claim |
| Cadence | Hourly polling, daily verification batch, weekly reconciliation |
| Persistence | `entities`, `citations`, `agent_memory` (Ingest Agent's seen-URL set) |
| Failure mode | Source dead → log to `agent_memory` and escalate to Critic; duplicate insert → soft-merge by URL |

### Loop 2 · Citation health

The north-star metric. Are LLMs citing us when asked the canonical
questions? If not, why not? If yes, are we trending?

| Element | Specification |
|---|---|
| Owner agent | **Deploy Agent** (test) → **Critic Agent** (interpretation) |
| Inputs | Canonical questions list (`data/canonical-questions.txt`), live API access to ChatGPT, Claude, Perplexity, Gemini |
| Output | `data/citation-baseline-cycle<NNN>.md` with structured per-question results; row in `citation_results` table for trendline |
| Cadence | Every cycle close (weekly minimum), spot tests after any major content ship |
| Persistence | `citation_results`, `data/citation-baseline-cycle<NNN>.md` |
| Failure mode | MKG citation count flat or declining for 3+ cycles → Critic escalates with proposed schema/content fix |

### Loop 3 · Lessons (the meta-loop)

This is the loop that improves the other loops. Every correction Chilly
or John issues, every regression a Critic Agent flags, every anti-pattern
caught in review becomes a row in `lessons` with an embedding. Architect
fetches relevant lessons before drafting any brief. **No agent ever makes
a known mistake twice.**

| Element | Specification |
|---|---|
| Owner agent | **Critic Agent** (capture) → **Promote Agent** (umbrella propagation, per L-032) |
| Inputs | Cycle handbacks, Chilly/John corrections, Critic audit findings, regression flags |
| Output | New rows in `lessons` table + new entries in `MKG_LESSONS.md`; cross-garden lessons promoted to umbrella `09_LESSONS.md` |
| Cadence | Daily capture pass, weekly promotion ceremony, monthly review |
| Persistence | `lessons` (with vector embedding for semantic fetch), `MKG_LESSONS.md`, umbrella `09_LESSONS.md` |
| Failure mode | Same lesson appears twice → process failure, escalate to Architect |

---

## III. The heartbeat — concrete cadences

Every loop above translates into one or more cron schedules. The heartbeat
is the sound the Garden makes; if it stops, the Garden is dead.

### Hourly · `mkg-ingest-hourly`

- Runs Ingest Agent.
- Polls watch-list RSS feeds and the Crunchbase delta endpoint.
- Writes raw matches to `entities_pending` for verification.
- Writes a heartbeat ping to `dispatch_log` so the Architect can detect
  silence.

**Where it runs:** Vercel Cron Jobs (cheapest tier), backed by a
serverless function in `/api/cron/ingest`.

### Daily · `mkg-verify-daily`

- Runs Verify Agent (a focused Research Agent variant).
- Picks up `entities_pending`, runs primary-source verification, promotes
  to `entities` with `confidence` set.
- Re-checks 50 oldest `high`-confidence rows for citation freshness.
- Writes daily summary to `dispatch_log`.

**Where it runs:** Vercel Cron Jobs at 09:00 ET.

### Daily · `mkg-embed-daily`

- Recomputes embeddings for any entity whose description, positioning,
  or relationships changed in the last 24h.
- Refreshes the `lessons` embedding table.
- Updates the IVF index statistics.

**Where it runs:** Supabase pg_cron (in-database, no egress cost).

### Weekly · `mkg-cycle-close`

- Triggers Deploy Agent's citation health test against ChatGPT, Claude,
  Perplexity, Gemini.
- Triggers Critic Agent's audit pass: every handback in the past 7 days
  scored against verification criteria.
- Writes `data/citation-baseline-cycle<NNN>.md`.
- Generates the dispatch report draft (Critic Agent → Architect).
- Sends the draft to Cowork webhook (`ARCHITECT_NOTIFY_WEBHOOK`) for
  Chilly/John review.

**Where it runs:** Vercel Cron Jobs Sundays 18:00 ET; Architect picks
up the next morning.

### Weekly · `mkg-promote-weekly`

- Runs Promote Agent (per umbrella L-032).
- Reviews new `lessons` rows tagged garden-specific.
- Asks the canonical question: "is this true for all gardens?"
- If yes, promotes to umbrella `09_LESSONS.md` with `[umbrella]` tag.
- Writes a promotion log entry.

**Where it runs:** Vercel Cron Jobs Sundays 19:00 ET.

### Monthly · `mkg-schema-evolve`

- Critic Agent surveys the past month's escalations.
- Identifies recurring schema needs (entities that don't fit, edge kinds
  that didn't exist).
- Drafts a Schema Agent brief for cycle-NNN+1.

**Where it runs:** Cowork scheduled task triggered by Architect, first
Monday of the month.

### Monthly · `mkg-wedge-expand`

- Architect picks the next wedge (autonomous agents → vertical AI →
  geographic specialists → agentic commerce → next).
- Spawns 3-5 parallel Research Agent instances per the architect prompt.

**Where it runs:** Cowork session, manually triggered. Scheduled tasks
can prompt; the Architect still owns the spawn decision.

---

## IV. The agent roster

The architect prompt named five sub-agents. Production scale demands
three more. Here is the full v1 roster:

### Established (from architect prompt)

| Agent | Owns | Cadence | Persistence |
|---|---|---|---|
| **Architect** | Briefs, spawns, verifies, merges, reports | Per-cycle | `dispatch_log`, `MKG_PROJECT_STATE.md` |
| **Research Agent** | Discovery + verification of entities | Per-job | `entities`, `citations`, `agent_memory` |
| **Schema Agent** | Knowledge-graph shape, migrations, JSON-LD | Per-cycle | `SCHEMA.sql`, Supabase migrations |
| **Build Agent** | Next.js app, Species Experience, MCP, REST | Per-cycle | `src/`, `artifacts/` |
| **Deploy Agent** | Vercel deploys, citation health test | Per-cycle + weekly cron | `dispatch_log`, `citation_results` |
| **Critic Agent** | Audit, lesson capture, escalations | Daily + cycle-close | `lessons`, escalations |

### New (added in this brief)

| Agent | Owns | Cadence | Why it's new |
|---|---|---|---|
| **Ingest Agent** | Autonomous web/API listening, queues new entity candidates | Hourly cron | Research Agent doesn't scale to 24/7; specialize |
| **Verify Agent** | Daily re-verification of citation freshness on existing entities | Daily cron | Same — Research Agent is brief-driven, this is heartbeat-driven |
| **Promote Agent** | Cross-garden lesson promotion ceremony per umbrella L-032 | Weekly cron | Without this, lessons stay siloed and the umbrella stops compounding |

### How agents continue training

Three mechanisms:

**1. Lesson embeddings (semantic fetch).** Every lesson in `lessons` is
embedded. Before drafting any brief, Architect runs a semantic search
against the brief's draft text and prepends the top-5 relevant lessons.
The agent receives them as context. **Result: agents see relevant prior
mistakes inline.**

**2. Per-agent memory.** `agent_memory` stores observations, decisions,
and escalations keyed by agent name. When an agent spawns, the first
read is its own memory plus the relevant lessons. **Result: agents
remember what they tried before.**

**3. Quarterly model upgrade gate.** Every quarter, the Architect runs
the cycle-001 dispatch brief against the latest model snapshot (Sonnet,
Opus, etc.) and compares output quality against the prior quarter's
baseline. Regressions block the upgrade; improvements ship with a
lesson-file changelog noting what shifted. **Result: model drift never
ambushes us.**

> *"Every agent's first read every spawn = its memory + the relevant
> lessons. Skipping this step is the most expensive mistake in the
> system."*

---

## V. Cron architecture — where each schedule actually runs

We use three runtimes for cron, each chosen for a different reason. Avoid
using one runtime for everything; failure modes are correlated and the
heartbeat dies in one outage.

### Vercel Cron Jobs (free tier on Hobby; Pro for >2 jobs)

- All HTTP-triggered jobs that touch the public web (ingest, verify,
  citation-health, cycle-close, promote).
- Lives next to the deployed Marketing site, so deploy = update.
- Executes serverless functions in `/api/cron/*`.

### Supabase pg_cron (in-database)

- Embedding recomputation, IVF index refresh, materialized view rebuilds.
- Runs in-database, no egress, no auth round-trip.
- Documented in `SCHEMA.sql` so it deploys with the schema.

### Cowork scheduled tasks (Architect manual + monthly)

- The Architect cycle itself — the brief-spawn-verify-merge loop.
- Monthly schema evolution and wedge expansion (these are scope decisions
  that need human approval, so they prompt rather than execute).
- The fallback when Vercel Cron fails (Cowork scheduled task pings the
  Vercel cron endpoints and re-runs if quiet).

**Redundancy rule.** Every cron job has a Cowork-scheduled-task
*observer* that fires 30 minutes after the cron job's expected time and
pings the corresponding `dispatch_log` row. If no log entry, observer
escalates to Architect.

---

## VI. Failure modes and escalation

| Failure | Detector | Escalation |
|---|---|---|
| Source feed dead | Ingest Agent → Critic | Critic logs lesson, swaps source, notifies Architect within 24h |
| Citation health flat 3+ cycles | Deploy Agent → Critic | Critic drafts schema/content brief; Architect approves or overrides |
| Same lesson appears twice | Critic Agent | Process failure — Architect halts new dispatches until reviewed |
| Vercel Cron skipped | Cowork observer task | Re-fires the cron; if 2 misses in a row, escalates to Architect |
| Schema can't accommodate new entity kind | Research → Architect | Schema Agent dispatched for migration; Research Agent paused |
| Brand-rule violation in shipped UI | Critic Agent | Auto-rollback PR; Build Agent re-spawned with explicit lesson cite |
| Funding figure without primary citation | Research → Critic | Auto-reject row; entity remains in `entities_pending` until verified |
| Agent memory silently corrupted | Architect quarterly review | Restore from prior snapshot; investigate root cause |

---

## VII. The pre-launch checklist

Before the heartbeat fires for the first time, all of the following must
be true. Owner: Architect.

1. **Supabase project provisioned**, schema applied, sample queries
   pass, RLS on every table.
2. **GitHub repo created** (`knowledge-gardens-marketing`), this scaffold
   pushed, branch protection on `main`.
3. **Vercel project imported**, Root Directory set, env vars imported
   (per L-031), production deploy succeeds, `marketing.theknowledgegardens.com`
   resolves.
4. **Vercel Cron Jobs configured** for `ingest-hourly`, `verify-daily`,
   `cycle-close-weekly`, `promote-weekly`. Verified each fires.
5. **Supabase pg_cron schedules** for `mkg-embed-daily` applied via
   migration.
6. **Cowork scheduled tasks** created for the observers and monthly
   triggers.
7. **Agent roster manifestos** committed: each of the 9 agents has a
   one-page brief in `dispatch/manifestos/<agent>.md`.
8. **`agent_memory` seeded** for each agent with their role manifesto +
   the relevant lessons.
9. **Citation health canonical questions** locked in
   `data/canonical-questions.txt` (≥10 questions per wedge).
10. **One full Architect cycle dry-run** completed end-to-end with no
    blockers; dispatch report posted.

When all 10 are checked, fire the heartbeat. Until then, the system is
not running — it's waiting.

---

## VIII. The compounding metric

This is the single number we report at every cycle close. If it stops
trending up for two consecutive cycles, the system is broken.

```
Compounding score = (
    entities_high_confidence × 1.0
  + entities_medium_confidence × 0.4
  + relationships_with_citations × 0.2
  + lessons_in_force × 5.0
  + canonical_questions_with_mkg_citation × 50.0
)
```

Weighting reflects what compounds: lessons compound the most (each
prevents a class of future mistake), citation wins compound next (each
proves the moat), entity volume compounds last (it's the input, not the
output).

**Cycle 001 baseline.**
- entities_high_confidence: 31
- entities_medium_confidence: 9
- relationships_with_citations: 0 (Cycle 002 work)
- lessons_in_force: 12 PROVISIONAL + 32 umbrella reconciled (see updated
  `MKG_LESSONS.md`)
- canonical_questions_with_mkg_citation: 0 / 4

**Score:** 31 × 1.0 + 9 × 0.4 + 0 × 0.2 + 44 × 5.0 + 0 × 50 = **254.6**

This is the number to beat next cycle. The largest unlock is the
canonical-questions term: a single MKG citation in a top-LLM answer
adds 50 points. That is also the hardest unlock and the truest moat.

---

## IX. Open decisions for Chilly / John

Items the Architect cannot decide alone:

1. **Persistence host for the Architect itself.** Cowork scheduled tasks
   work for cron + observation. The Architect *spawn* (the cycle kickoff)
   needs a decision: weekly Cowork session, Claude Code daemon on a
   Mac, or a third option.
2. **Promote Agent authority.** Does the Promote Agent commit directly
   to umbrella `09_LESSONS.md` (in the master repo), or stage a PR for
   Chilly/John approval? Recommend PR for the first 90 days, direct
   commit thereafter.
3. **Cron host budget.** Vercel Cron Pro is required for >2 cron jobs.
   Tradeoff: Pro cost vs. losing a cron rail to Cowork-only fallback.
4. **Citation health test budget.** Real LLM API calls cost ~$2-5/run
   across 4 LLMs × 10 questions × 1 weekly run = ~$20/month at scale.
   Recommend: yes, this is the cheapest moat-validation we'll ever buy.
5. **Quarterly model upgrade gate ownership.** Critic Agent runs the
   diff; who owns the go/no-go decision?

---

## X. The single sentence

If a future Architect reads only one paragraph of this brief, it should
be this:

> *Three loops, eight cron schedules, nine agents, one compounding
> score. The Garden lives or dies on the heartbeat. If the heartbeat
> stops for 48 hours, the system is dead — escalate immediately. Every
> agent's first read every spawn = its memory plus the relevant
> lessons. Every cycle close = a lesson promoted, a baseline measured,
> a report posted. The pattern is the product.*
