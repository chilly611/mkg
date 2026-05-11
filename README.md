# Marketing Knowledge Garden (MKG)

Canonical, AI-citable, commerce-integrated knowledge graph of how marketing
actually works in the agentic era. Newest vertical in The Knowledge Gardens
ecosystem (alongside Healthcare, Builder's, Botanical).

**Tagline (locked):** *The ground truth marketing AI cites.*

---

## Repository layout

```
Marketing/
├── README.md                       — this file
├── MKG_PROJECT_STATE.md            — living state doc, updated every dispatch cycle
├── MKG_LESSONS.md                  — recursive self-improvement log (PROVISIONAL seed)
├── SCHEMA.sql                      — Supabase schema as SQL, agent-readable
├── .env.example                    — env template (real keys never committed)
├── .cursorrules                    — Cursor agent operating rules
├── .claude/
│   └── CLAUDE.md                   — Claude agent operating rules
├── dispatch/                       — per-job briefs and handbacks
│   ├── _template.md
│   ├── cycle-001-job-1-schema.md
│   ├── cycle-001-job-2-research-geo-aeo.md
│   ├── cycle-001-job-3-build-ui.md
│   ├── cycle-001-job-4-build-api.md
│   ├── cycle-001-job-5-critic.md
│   └── handbacks/
│       └── cycle-001-job-2-handback.md
├── artifacts/                      — built deliverables (HTML, JSX, PDFs)
│   └── landscape-v2.html           — rebuilt landscape, brand-conformant
├── data/                           — exported snapshots of Supabase
│   ├── entities-geo-aeo-cycle001.json   — 39 entities, ready to ingest
│   └── citation-baseline-cycle001.md    — pre-MKG citation health baseline
└── src/                            — Next.js app (to be scaffolded next cycle)
```

---

## The four lanes

| Lane | Audience | Product | Revenue Engine |
|------|----------|---------|----------------|
| **Public** (Gravity Well) | Marketers, founders, students | Free AI tool finder, GEO scorecard, prompt-citation checker | Zero-CAC funnel, AI citation moat, affiliate fees |
| **Professional** (Engagement) | In-house marketers, agencies | Subscription intelligence dashboard, weekly Garden Briefing | $49–$499/mo subscriptions |
| **Admin** (Cash) | Enterprises, PE, agency holdcos | Vendor intelligence, M&A target maps, custom landscape reports | $5K–$50K/mo enterprise SaaS |
| **Machine** (Defensibility) | AI agents, LLMs, other martech | API + MCP server + JSON-LD feeds + data licensing | $20K–$100K/yr API |

---

## Sacred brand rules (non-negotiable)

These are inherited from the Knowledge Gardens masterdoc Section 4. Violate
any and the work is rejected.

- **Background:** Light parchment `#f5f0e8`. **Never dark.**
- **Typography:** Cormorant Garamond italic for display. Space Mono uppercase
  wide-tracked for technical labels.
- **Palette:** Teal `#1A5C5C`, Copper `#B87333`, Steel `#71797E`, Cream
  `#FBF8F3`, Ink `#2C2C2C`. Per-entity accent colors switch the UI.
- **Aesthetic:** Victorian botanical herbarium meets engineering schematic.
  Dimension lines. Measurement annotations. Spinning gear ornaments at low
  opacity. Specimens framed like pressed plates.
- **Interaction:** Tabs, never scroll-cinematic. Four tabs:
  *Profile / Architecture / Intelligence / Compare*.
- **Architecture:** Next.js with `output: "export"`. Self-contained HTML for
  demo exhibits. Never remove the export flag.
- **JSON-LD on every entity page.** This is what makes us citable.

See `.claude/CLAUDE.md` and `.cursorrules` for the full agent operating ruleset.

---

## Operating model

**Architect.** Master orchestrator (this session is one). Spawns sub-agents,
verifies handbacks, merges, reports.

**Sub-agents.**

| Agent | Owns |
|-------|------|
| Research Agent | Discovering, verifying, writing competitive intel |
| Schema Agent | Shape of the knowledge graph |
| Build Agent | Next.js site, Species Experience tabs, API/MCP server |
| Deploy Agent | Vercel deploys, Supabase migrations, citation health tests |
| Critic Agent | Recursive self-improvement loop |

**Dispatch loop.** Brief → spawn → handback → verify → merge → critic → state
update → report. See `dispatch/_template.md`.

---

## Status

See `MKG_PROJECT_STATE.md` for the latest cycle and `dispatch/` for active
jobs.

Cycle 001 shipped:
- Local repo scaffold
- Schema v0.1
- Provisional lessons file
- Research handback for the GEO/AEO wedge (40 entities, 31 high-confidence)
- Pre-MKG citation health baseline
- Rebuilt landscape artifact (parchment, brand-conformant)

Cycle 002 unblocked once Supabase + GitHub credentials are wired into `.env`.
