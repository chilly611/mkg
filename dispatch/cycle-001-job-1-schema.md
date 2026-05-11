---
cycle_id: cycle-001
job_id: cycle-001-job-1
agent_role: schema
agent_name: schema-1
state: handed_back
spawned_at: 2026-05-09
brief_owner: Architect
---

# Design and ship the MKG schema v0.1

## Goal
A Postgres/Supabase schema that supports (a) AI-agent retrieval via MCP,
(b) the Marketing Species Experience UI, (c) all four lanes (Public,
Professional, Admin, Machine), and (d) the recursive self-improvement loop.

## Why
Every other agent depends on this shape. Research Agent has nowhere to write
without it. Build Agent has nothing to read without it. Critic Agent has
nowhere to log lessons without it.

## Inputs
- `MKG_PROJECT_STATE.md` (cycle 001)
- `MKG_LESSONS.md` (provisional)
- The architect prompt's "Storage spine — Supabase" section.

## Expected outputs
- `SCHEMA.sql` at repo root with: extensions, enums, core tables (entities,
  relationships, citations, embeddings, agent_memory, lessons,
  dispatch_log), indexes, RLS, JSON-LD view, sample queries.
- A `entities_jsonld` view that emits a valid schema.org JSON-LD object per
  entity row.
- Sample queries proving the four-lane shape works.

## Verification criteria
- [x] `SCHEMA.sql` parses cleanly (no syntax errors).
- [x] `pgvector` extension included (the moat depends on semantic retrieval).
- [x] `pg_trgm` included for fuzzy entity search.
- [x] Every fact-table has a foreign-key path back to either `entities` or
      `relationships`.
- [x] `citations` enforces "exactly one of entity_id or relationship_id".
- [x] `entities_jsonld` view emits `@context`, `@type`, `name`, `url`,
      `description`, `address`, `sameAs`, `additionalProperty`.
- [x] RLS enabled on every table; default deny-all; explicit public-read on
      the citable surface (entities, relationships, citations).
- [x] Sample queries cover: top-funded entities, competitor edges, JSON-LD
      feed, semantic search.

## Anti-criteria
- Schema that requires a Supabase paid tier for basic features (avoid
  pg_partman, pg_cron unless escalated).
- Tables without RLS.
- Embeddings stored inline in `entities` (must live in their own table for
  re-embedding).

## Lessons that apply
L-P004 (JSON-LD), L-P005 (no invented funding), L-P006 (every claim cited),
L-P010 (lessons-fetch before brief).

## Dependencies
- Blocked by: none.
- Blocks: cycle-001-job-2 (Research Agent needs target tables), cycle-001-
  job-4 (Build Agent api needs the JSON-LD view).

## Notes for the agent
- `entity_kind` enum should cover company, method, capability, vertical,
  geography, channel, agent, role. Adding kinds later is cheap; collapsing
  them is not.
- `relationship_kind` should be coarse-grained at first; specialize as
  Research Agent needs surface.
- Default `confidence_tier` to 'medium' to force conscious upgrades to
  'high'.
- IVF index `lists = 100` is a guess for early corpus; tune when we exceed
  ~10K embeddings.

## Handback summary
Schema written and committed locally as `SCHEMA.sql` v0.1. **NOT applied to
live Supabase** — Supabase project not yet provisioned. Next cycle: create
project, run `SCHEMA.sql`, verify sample queries return shape, re-embed
seeded lessons.
