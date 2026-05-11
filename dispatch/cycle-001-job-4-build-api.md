---
cycle_id: cycle-001
job_id: cycle-001-job-4
agent_role: build
agent_name: build-api-1
state: blocked
spawned_at: 2026-05-09
brief_owner: Architect
---

# Stand up the MCP server + JSON-LD feed + REST API (Machine Lane foundation)

## Goal
An external AI agent (or LLM with tools) can hit our MCP endpoint and our
REST endpoint and retrieve the marketing knowledge graph in structured
form, including JSON-LD per entity.

## Why
Machine Lane is the moat. Without it, MKG is a website. With it, every AI
agent in the world that wants martech intelligence has a reason to call
us. This is also what unlocks the data-licensing revenue line.

## Inputs
- Live Supabase project (BLOCKER — not yet provisioned).
- `entities_jsonld` view from `SCHEMA.sql`.
- Architect prompt section "Machine Lane" + "Storage spine".

## Expected outputs
- A Next.js API route (or standalone Cloudflare Worker) at `/api/v1/entities`
  returning paginated JSON of entities with their JSON-LD.
- A `/api/v1/entities/<slug>.jsonld` route returning a single entity's
  JSON-LD as `application/ld+json`.
- An MCP server (TypeScript, using the `@modelcontextprotocol/sdk`)
  exposing tools: `search_entities`, `get_entity`, `list_relationships`,
  `semantic_search`.
- `sitemap.xml` listing every entity page for AI-crawler discoverability.
- A README in `src/api/` describing endpoints, rate limits, auth model.

## Verification criteria
- [ ] An external curl call returns a paginated JSON array of entities.
- [ ] A single-entity JSON-LD URL validates at validator.schema.org.
- [ ] MCP server `list_tools` returns the four named tools.
- [ ] MCP `search_entities` returns the GEO/AEO entities for the query
      "AI brand visibility".
- [ ] sitemap.xml contains every entity slug.
- [ ] No service-role key shipped client-side (anon-key for read-only).

## Anti-criteria
- Endpoints requiring auth for read on Public Lane data. Reject — the
  Machine Lane defensibility comes from being open.
- Embedding the service-role key anywhere reachable from the browser.

## Lessons that apply
L-P004 (JSON-LD), L-P008 (read from Supabase, not embedded JSON).

## Dependencies
- **Blocked by:** Supabase project provisioning. Cannot start until
  `.env` is populated with real keys.
- Blocks: cycle-002-job-1 (Deploy Agent run citation health post-API).

## Notes for the agent
- Pagination: cursor-based, default 50, max 200.
- CORS: open for read endpoints, locked down for any write.
- Cache headers: 300s on entity lists, 86400s on individual JSON-LD pages
  (re-validate via `If-None-Match`).
- Respect the `confidence_tier` — public surface should default to
  showing only `high`-confidence entities, with a query param to opt
  into `medium`/`low`.

## Handback summary
**Not started — blocked.** Supabase project not yet provisioned. Brief
remains open and ready to spawn the moment credentials land in `.env`.
