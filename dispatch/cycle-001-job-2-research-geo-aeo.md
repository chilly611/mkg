---
cycle_id: cycle-001
job_id: cycle-001-job-2
agent_role: research
agent_name: research-1
state: handed_back
spawned_at: 2026-05-09
brief_owner: Architect
---

# Research wedge — Generative Engine Optimization (GEO) / Answer Engine Optimization (AEO) platforms

## Goal
A first verified slice of the GEO/AEO category: at least 30 entities with
positioning, HQ, funding, pricing, key features, integrations, primary
buyer, and a primary citation URL. Geographic spread beyond US/UK where
possible.

## Why
This is the most defensible wedge of the MKG. GEO/AEO is the youngest, most
fragmented category in martech and the one where "best [tool]" answers
from LLMs are currently dominated by vendor blogs. Owning the canonical
list here is the Public Lane gravity well.

## Inputs
- The architect prompt, wedge spec for research-1.
- The `entities` table shape (see `SCHEMA.sql`).
- Existing public lists (Bluefish blog, Evertune blog, Trysight, Brandi
  list, EU-Startups). Use as starting points; verify on primary sources.

## Expected outputs
- A JSON array of entity objects ready to ingest into `entities` plus
  `citations`. Stored at `data/entities-geo-aeo-cycle001.json`.
- Each object: `name`, `url`, `positioning`, `hq` (city, country),
  `founded`, `funding_stage`, `funding_total_usd`, `pricing_model`,
  `pricing_notes`, `key_features[]`, `integrations[]`, `primary_buyer`,
  `geographic_focus`, `citation_url`, `confidence`, `notes`.
- A summary at the end of the JSON file: count by confidence tier,
  geographic spread, gaps.

## Verification criteria
- [x] ≥30 entities total.
- [x] ≥20 with confidence `high`.
- [x] At least 3 entities outside US/UK.
- [x] No funding figure without a primary citation URL.
- [x] No invented data — `null` where unknown.
- [x] Every entity has a `citation_url` resolving to a real, public source.
- [x] Summary block names notable gaps.

## Anti-criteria
- Including agencies (we want platforms/tools).
- Including generic SEO suites without a dedicated AI-search module.
- Including autonomous marketing agents (different wedge, research-2).

## Lessons that apply
L-P005 (no invented funding), L-P006 (every claim cited), L-P010
(lessons-fetch before brief).

## Dependencies
- Blocked by: cycle-001-job-1 (need schema for ingest target — schema
  shipped same cycle).
- Blocks: cycle-001-job-3 (Build Agent needs entities to render).

## Notes for the agent
- Capture the GEO/AEO **modules** of incumbents (Semrush AI Toolkit,
  Ahrefs Brand Radar, BrightEdge AI Catalyst, Adobe LLM Optimizer, HubSpot
  AEO, Conductor AgentStack) as their own entities, not as the parent
  brand.
- Be especially careful on funding rounds — TC, AdExchanger, BusinessWire,
  EU-Startups, PR Newswire, Crunchbase are acceptable; vendor blogs are
  not.
- LATAM is a Chilly priority — try harder there. If you find nothing
  native, say so explicitly (it's a gap signal, not a failure).

## Handback summary
**40 entities delivered** — 31 high-confidence, 9 medium. Geographic
spread: 22 US, 11 EU (Berlin, Amsterdam, Helsinki, Vienna x2, Bratislava,
Persenbeug, Wrocław x2, Ljubljana, Madrid-area, London), 1 SG (Ahrefs), 1
TLV-adjacent (Brandlight), 5 undisclosed HQ, 0 LATAM-native pure-play.
LATAM and native APAC are explicit gaps logged for cycle-002 research-4.

JSON file: `data/entities-geo-aeo-cycle001.json`.
Full handback: `dispatch/handbacks/cycle-001-job-2-handback.md`.
