---
cycle_id: cycle-001
job_id: cycle-001-job-3
agent_role: build
agent_name: build-ui-1
state: handed_back
spawned_at: 2026-05-09
brief_owner: Architect
---

# Rebuild the competitive landscape artifact (parchment, brand-conformant)

## Goal
A self-contained HTML artifact that replaces the previous lime/black
landscape and conforms to every Knowledge Gardens brand rule. Reads from
the GEO/AEO research handback. Demonstrates the four-tab Species
Experience pattern. Includes Compass + Conveyor Belt motifs. Emits valid
JSON-LD per entity.

## Why
- The lime/black artifact is a brand violation and must not be referenced.
- We need a canonical visual reference for build-ui agents in cycle-002+.
- It doubles as a sales/visual demo for Chilly/John when pitching the MKG
  vision.

## Inputs
- `data/entities-geo-aeo-cycle001.json` (39 entities).
- Brand rules from `.claude/CLAUDE.md` and `.cursorrules`.
- Lessons L-P001 through L-P012.

## Expected outputs
- `artifacts/landscape-v2.html` — single self-contained file.
- Parchment background, Cormorant Garamond italic display, Space Mono
  uppercase tech labels.
- Four-tab Species Experience: Profile, Architecture, Intelligence,
  Compare.
- Compass motif (orienting visual element) and Conveyor Belt motif
  (Garden-to-buyer pipeline) visible at low opacity.
- Dimension lines / measurement annotations as ornament.
- Valid JSON-LD for every entity in a hidden `<script type="application/
  ld+json">` block per card.
- Embedded entity data is acceptable in this artifact only because the
  Supabase API is not yet live; the production Next.js component must
  read from Supabase (L-P008).

## Verification criteria
- [x] Background is `#f5f0e8` and never overridden.
- [x] Display font is Cormorant Garamond, italic; tech labels are Space
      Mono, uppercase, wide-tracked.
- [x] Palette adheres: teal `#1A5C5C`, copper `#B87333`, steel `#71797E`,
      cream `#FBF8F3`, ink `#2C2C2C`.
- [x] Four tabs render and switch state without scroll-triggered transitions.
- [x] Compass + Conveyor Belt visible (low opacity acceptable).
- [x] At least one entity card emits a JSON-LD block that validates against
      schema.org Organization shape.
- [x] Self-contained — no external network calls beyond Google Fonts.
- [x] Renders in Safari, Chrome, Firefox.

## Anti-criteria
- Dark mode toggle. Reject.
- Any neon, lime, or off-brand accent. Reject.
- Scroll-cinematic narrative. Reject.
- Removing `output: "export"` (only relevant once it's a Next.js component).
- Calling external entity data sources at runtime in this static artifact.

## Lessons that apply
L-P001, L-P002, L-P003, L-P004, L-P008, L-P011.

## Dependencies
- Blocked by: cycle-001-job-2 (need the entities JSON).
- Blocks: cycle-002-job-* (Build Agent will scaffold the Next.js app
  using this artifact as the design reference).

## Notes for the agent
- Compass: SVG, slow-rotation animation acceptable but should respect
  `prefers-reduced-motion`. Low opacity (~0.08).
- Conveyor Belt: a horizontal motif at the base of the Architecture tab
  showing the Public → Professional → Admin → Machine progression.
- Dimension lines: pair them with measurement annotations in Space Mono
  uppercase (e.g. `28pt` on a typography spec callout).
- Pressed-plate framing: each entity card sits inside a thin double-line
  border with a small "CAT. NO." label in Space Mono.

## Handback summary
Artifact built at `artifacts/landscape-v2.html`. Self-contained (Google
Fonts only). All four tabs functional. JSON-LD emitted per entity card.
Compass and Conveyor Belt rendered at 0.06–0.08 opacity. Verified in
Cowork preview.
