# SCHEMA.sql v0.3 — Rationale

**Date:** 2026-05-10
**Project:** Marketing Knowledge Garden (Supabase ref `rojpjtyjiapqpsxdeovk`, dedicated)
**Author:** deploy-mkg-1

## Why a v0.3 at all

Two things changed since v0.2:

1. The MKG got its **own dedicated Supabase project**. v0.2 lived inside the
   umbrella project under a `mkg.` schema; that namespacing is no longer
   needed. We're back to flat `public.*`.
2. The product pivot: we are no longer building "the four-lane Knowledge
   Garden" as the deliverable. We are building **The Marketing Architect**
   — a SaaS where a paying org submits a brief and gets a cited memo.
   The schema must be product-shaped, not garden-template-shaped.

## What was removed and why

### `mkg.dispatch_log` — gone
Dispatch lives in markdown (`dispatch/cycle-NNN-job-N-*.md` plus
`dispatch/handbacks/`). A database table for it was always an
over-engineered mirror — the briefs are the source of truth, the agents
read them as files, and Architect already verifies via the file system.
Putting it in the DB created a sync problem with no payoff. Also: it has
zero tie-in to the product. Keeping infra-internal state out of the
product DB.

### `mkg.lessons` — gone
Same reasoning. Lessons live in `MKG_LESSONS.md`. The CLAUDE.md says so
explicitly. We can semantic-search it through embeddings later if we
want, but the canonical store stays in the markdown file. A DB table
made it ambiguous which copy was authoritative.

### `mkg.relationships` (polymorphic) — collapsed into explicit FKs
v0.2's `relationships` table was a generic graph edge table with
`source_table`/`target_table` text columns and a long `relationship_kind`
enum. That shape is flexible but pays for it in three ways:

- **No referential integrity.** Postgres can't enforce that `source_id`
  actually points at a real row in `source_table`. It was a pile of
  dangling pointers waiting to happen.
- **Worse query plans.** Joins through a polymorphic table need
  per-row CASE branching or UNIONs.
- **Confused the product.** What does `competitor_competes_with` mean
  versus `competitor_integrates_with`? In a Knowledge Garden, edges are
  the product. In The Marketing Architect, edges are implementation
  detail of "session produced an output that cites these competitors."

v0.3 replaces it with explicit FKs where they matter: `citations` points
to either an `output` or a `competitor`; `architect_sessions` points to
a `campaign_brief`; `architect_outputs` points to a `session`. No
generic edges. If we need richer graph queries later, we can add a
dedicated edges table at that point — but only when the product asks
for it.

### `mkg.campaigns` + `mkg.benchmarks` + the supporting taxonomies — gone
These were the soul of the v0.2 garden template (campaigns as primary
entity; channels/audiences/formats/frameworks as facets). They were
beautiful and they were not the product. The Marketing Architect doesn't
ship campaigns; it ships **outputs about marketing situations**. The
benchmark library, frameworks, formats, etc. are knowledge the model
brings to the table — they don't need to be normalized rows in the
product DB. If they earn their way back later (e.g. a "benchmark
library" feature surfaces them as content), we can add them then.

## What was added and why

### `users` / `organizations` / `memberships`
Standard B2B SaaS auth + tenancy. Orgs are who pay. Users belong to
orgs via memberships with a role. The previous schema had no concept of
"who pays for this" because it was a public knowledge garden. Now we
have customers.

### `architect_sessions` — the core product event
One row per run of The Marketing Architect. Tracks: who ran it, what
brief was the input, what model, what tokens, what cost, what status.
This is the **billing-relevant** event and the **product-analytics**
event. Everything else hangs off it.

### `campaign_briefs` (input) and `architect_outputs` (output)
Clean input/output split. A brief can feed multiple sessions
(re-runs, variants). A session typically yields one output but can
yield several. Outputs carry their own structured `anatomy_jsonb` — that
field is the contract the citation-gate trigger enforces.

### `subscriptions` + `invoices` (Stripe-shaped)
Cycle 003 elevates revenue to a primary concern. Stripe is the planned
billing rail, so the tables are shaped to mirror Stripe webhook payloads
1:1: `stripe_subscription_id`, `stripe_price_id`, period boundaries,
cancel-at-period-end flag. Webhook handlers can upsert directly. No
custom abstraction layer.

### Citation-gate trigger (anti-fabrication, enforced)
`enforce_output_citation_gate` blocks any output from reaching
`status = 'published'` unless every `claim_id` declared in
`anatomy_jsonb.claims[]` has at least one row in `citations`. The
constraint is at the database level so a buggy frontend or rogue agent
cannot bypass it. This is the load-bearing piece of "the ground truth
marketing AI cites."

## RLS posture

Default deny everywhere. Public-read on `competitors`, their citations,
`brand_assets`, and `architect_outputs WHERE status='published'` (the
Public Lane / Machine Lane). Org-scoped tables gate on
`public.is_org_member(org_id)`. Embeddings have no SELECT policy →
service-role only.
