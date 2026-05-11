---
cycle_id: cycle-001
job_id: cycle-001-job-2
agent_role: research
agent_name: research-1
verified_by: Architect
verified_at: 2026-05-09
state: verified
---

# Handback — GEO/AEO platforms research wedge

## Summary
**40 entities verified** in the Generative Engine Optimization /
Answer Engine Optimization category. Output saved at
`data/entities-geo-aeo-cycle001.json`.

| Confidence | Count |
|------------|-------|
| high       | 31    |
| medium     | 9     |
| low        | 0     |

## Geographic spread
- USA: 22 (NYC, SF, Boston, Cincinnati, Foster City, Salt Lake City, etc.)
- EU: 11 (Berlin, Amsterdam, Helsinki, Vienna x2, Bratislava, Persenbeug,
  Wrocław x2, Ljubljana, Madrid-area, London)
- Singapore: 1 (Ahrefs corporate HQ)
- Tel Aviv adjacency: 1 (Brandlight has presence)
- HQ undisclosed: 5 (Trakkr, RivalSee, Omnia, Airefs, GetMint, LLMrefs)
- LATAM-native pure-play: **0**
- Native APAC pure-play: **0**

## Highlights
- **Profound** ($155M raised, ~$1B valuation Feb 2026) is the category
  capital-leader by a wide margin — Series C from Lightspeed.
- **AirOps** ($60M Series B from Greylock, Nov 2025) is the
  content-engineering specialist.
- **Bluefish** ($68M Series B) is the enterprise / Fortune 500 wedge
  (NEA, Threshold, Salesforce Ventures, Bloomberg Beta).
- **Brandlight** ($35.75M Series A, Pelion) and **Evertune** ($20M
  Series A, AdExchanger coverage) round out the venture-backed enterprise
  layer.
- **Peec AI** (Berlin, $29M raised, 20VC + Singular) is the strongest
  EU pure-play.
- **Adobe LLM Optimizer**, **HubSpot AEO**, **Semrush AI Toolkit**,
  **Ahrefs Brand Radar**, **BrightEdge AI Catalyst**, **Conductor**,
  **Meltwater GenAI Lens** captured as discrete entities (the GEO/AEO
  modules of incumbent platforms, not the parent brands).
- **OtterlyAI** (Austria), **Promptwatch** (Amsterdam), **Superlines**
  (Helsinki), **ZipTie** (Wrocław), **Mangools AI Search Watcher**
  (Slovakia) provide the EU pure-play layer.

## Notable gaps
1. **No LATAM-native pure-play platform** verified despite explicit search.
   The category is not yet localized; LATAM brands use global tools. This
   is a Chilly priority for cycle-002 research-4.
2. **No native Japan/Korea/India platform** verified. Coverage flows
   through global tools (Mangools, LLMrefs international, ZipTie).
3. **Several bootstrapped tools** (Trakkr, RivalSee, Omnia, GetMint,
   LLMrefs, Airefs) do not publicly disclose HQ, founders, or funding —
   hence "medium" confidence. Surfacing these requires direct outreach.

## Verification rerun (Architect)
- Spot-checked 5 funding figures against the cited URLs: all consistent.
- Spot-checked 5 founding-year claims: all consistent.
- One typo flagged: "Brati̇slava" should be "Bratislava" — fix on ingest.
- Otterly's HQ rendered as "Persenbeug" with non-ASCII variants in raw
  output; normalize to UTF-8 on ingest.

## State on handback
- File written, schema-aligned (matches `entities` table columns 1:1).
- Entities not yet ingested into Supabase (Supabase not provisioned).
- Citations not yet split into the `citations` table — each entity
  carries a single `citation_url` for now. **Cycle-002 task:** explode
  into proper `citations` rows, one per claim.

## Lessons added (none new)
All findings consistent with seed lessons L-P005, L-P006. No new lesson.
